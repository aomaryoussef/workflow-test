export enum InstallmentStatuses {
  LATE = "LATE",
  LATE_FEES_APPLIED = "LATE_FEES_APPLIED",
  DUE = "DUE",
  PAID_WITH_LATE_FEES_APPLIED = "PAID_WITH_LATE_FEES_APPLIED",
  PAID = "PAID",
  UPCOMING = "UPCOMING",
  EARLY_SETTLED = "EARLY_SETTLED",
  CANCELLED = "CANCELLED",
}

export class Installment {
  static DUE_DAYS = 14;
  partnerName: string;
  amount: number;
  dueDate: Date;
  paidDate: Date;
  principalDue: number;
  interestDue: number;
  dueInDays: number;
  lateInDays: number;
  lateFeeDue: number;
  paidPrincipal: number;
  paidInterest: number;
  paidLateFee: number;
  paidAmount: number;
  status: InstallmentStatuses;
  installmentId: number;
  originalAmount: number;
  loanId: string;
  paymentId: string;
  isCancelled: boolean;
  isLoanEarlySettled: boolean;
  constructor(
    partnerName: string,
    dueDate: Date,
    paidDate: Date | null,
    principalDue: number,
    interestDue: number,
    lateFeeDue: number,
    paidPrincipal: number,
    paidInterest: number,
    paidLateFee: number,
    installmentId: number,
    loanId: string,
    isCancelled: boolean,
    isLoanEarlySettled: boolean,
    paymentId: string = null,
  ) {
    this.partnerName = partnerName;
    this.dueDate = dueDate;
    this.paidDate = paidDate;
    this.principalDue = principalDue;
    this.interestDue = interestDue;
    this.lateFeeDue = lateFeeDue;
    this.paidPrincipal = paidPrincipal;
    this.paidLateFee = paidLateFee;
    this.paidInterest = paidInterest;
    this.loanId = loanId;
    this.paymentId = paymentId;
    const differenceInDays = Math.ceil(Math.abs((this.dueDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)));
    if (this.dueDate.getTime() - Date.now() < 0) {
      this.lateInDays = differenceInDays;
    } else {
      this.dueInDays = differenceInDays - 1;
    }
    this.calculateAmount();
    this.calculatePaidAmount();
    this.installmentId = installmentId;
    this.isCancelled = isCancelled;
    this.isLoanEarlySettled = isLoanEarlySettled;
    this.status = this.getInstallmentStatus();
  }
  private calculateAmount() {
    if (this.isLate()) {
      this.amount = this.principalDue + this.interestDue + this.lateFeeDue;
      this.originalAmount = this.principalDue + this.interestDue;
    } else {
      this.amount = this.principalDue + this.interestDue;
      this.originalAmount = this.amount;
    }
  }
  private calculatePaidAmount() {
    if (this.isLate()) {
      this.paidAmount = this.paidPrincipal + this.paidInterest + this.paidLateFee;
    } else {
      this.paidAmount = this.paidPrincipal + this.paidInterest;
    }
  }
  private isLate(): boolean {
    if (this.dueDate.getTime() < Date.now() && this.lateInDays > 0) return true;
    return false;
  }
  private isDue(): boolean {
    if (Math.abs(this.dueInDays) <= Installment.DUE_DAYS) return true;
    return false;
  }
  private isPaid(): boolean {
    if (this.amount == this.paidAmount) return true;
    return false;
  }
  private isLateFeesApplied(): boolean {
    if (this.lateFeeDue > 0 && this.isLate()) return true;
    return false;
  }
  private isPaidWithLateFees(): boolean {
    if (this.isPaid() && this.isLateFeesApplied()) return true;
    return false;
  }

  private getInstallmentStatus(): InstallmentStatuses {
    if (this.isLoanEarlySettled && !this.isCancelled && !this.isPaid() && !this.isPaidWithLateFees()) {
      return InstallmentStatuses.EARLY_SETTLED;
    }
    if (this.isCancelled) {
      return InstallmentStatuses.CANCELLED;
    }
    if (this.isPaid()) {
      if (this.isPaidWithLateFees()) {
        return InstallmentStatuses.PAID_WITH_LATE_FEES_APPLIED;
      }
      return InstallmentStatuses.PAID;
    } else if (this.isLate()) {
      if (this.isLateFeesApplied()) {
        return InstallmentStatuses.LATE_FEES_APPLIED;
      }
      return InstallmentStatuses.LATE;
    } else if (this.isDue()) {
      return InstallmentStatuses.DUE;
    }
    return InstallmentStatuses.UPCOMING;
  }
}
