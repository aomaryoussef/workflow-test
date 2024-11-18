import { UUID } from "crypto";
import { getConsumerLoans, getConsumerLoanDetails } from "../../../services/consumer";
import { Installment, InstallmentStatuses } from "../models/installment";
import { CustomLogger } from "../../../services/logger";
const logger = new CustomLogger("consumer-loan-use-case");

export type GetConsumerInstallmentsResponse = {
  amount: number;
  late_by_days: number;
  status: InstallmentStatuses;
  due_date: number;
  late_fees_amount: number;
  paid_date: Date;
  due_by_days: number;
  installment_id: number;
  due_amount: number;
  is_loan_early_settled: boolean;
  is_cancelled: boolean;
};
export class GetConsumerLoansUseCases {
  static compare(a: GetConsumerInstallmentsResponse, b: GetConsumerInstallmentsResponse) {
    if (a.due_date < b.due_date) {
      return -1;
    }
    if (a.due_date > b.due_date) {
      return 1;
    }
    return 0;
  }
  private static installment_entity_to_dto(
    installments: Installment[],
    statuses: string[] = [],
    isLoanEarlySettled: boolean,
    isLoanCancelled: boolean,
  ): GetConsumerInstallmentsResponse[] {
    const consumerScheduleDto = [];
    for (const installment of installments) {
      if (statuses.length > 0 && !statuses.includes(installment.status)) {
        continue;
      }
      const object = {
        amount: installment.paidAmount > 0 ? installment.paidAmount : installment.amount,
        late_by_days: installment.lateInDays,
        status: isLoanCancelled ? InstallmentStatuses.CANCELLED : installment.status,
        due_date: installment.dueDate.getTime(),
        late_fees_amount: installment.lateFeeDue,
        paid_date: installment.paidDate || null,
        partner_name: installment.partnerName,
        due_date_human: installment.dueDate,
        installment_id: installment.installmentId,
        due_by_days: installment.dueInDays,
        due_amount: installment.originalAmount,
        loan_id: installment.loanId,
        is_loan_early_settled: isLoanEarlySettled,
        is_cancelled: isLoanCancelled,
      };
      consumerScheduleDto.push(object);
    }

    return consumerScheduleDto.sort(this.compare);
  }
  static async getConsumerLoans(consumerId: UUID, statuses: string[]) {
    const loans = await getConsumerLoans(consumerId);
    const updatedLoans = loans.map((loan: any) => {
      const isLoanEarlySettled = loan.current_status.status_type === "EARLY_SETTLED";
      const isLoanCancelled = loan.current_status.status_type === "CANCELLED";
      return {
        ...loan,
        payment_schedule: this.installment_entity_to_dto(
          loan.payment_schedule,
          statuses,
          isLoanEarlySettled,
          isLoanCancelled,
        ),
      };
    });
    return updatedLoans;
  }

  static async getConsumerLoanDetails(consumerId: UUID, loanId: string, installmentId: string) {
    logger.info("getConsumerLoanDetails use case");
    const loans = await getConsumerLoanDetails(consumerId, loanId, installmentId);
    const updatedLoans = loans.map((loan: any) => {
      const isLoanEarlySettled = loan.current_status.status_type === "EARLY_SETTLED";
      const isLoanCancelled = loan.current_status.status_type === "CANCELLED";
      return {
        ...loan,
        payment_schedule: this.installment_entity_to_dto(
          loan.payment_schedule,
          [],
          isLoanEarlySettled,
          isLoanCancelled,
        ),
      };
    });
    return updatedLoans;
  }
}
