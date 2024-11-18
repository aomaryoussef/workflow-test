export interface User {
  id: string;
  iamId: string;
  fullName: string;
  nationalId: string;
  loans: Loan[];
}

interface Loan {
  loanSchedules: LoanSchedule[];
  loanSchedulesAggregate: LoanSchedulesAggregate;
}

interface LoanSchedule {
  dueDate: string; // ISO date string
  dueInterest: number;
  dueLateFee: number;
  duePrincipal: number;
  isCancelled: boolean;
  id: number;
  loanId: string;
  paidDate: string | null; // ISO date string or null
}

interface LoanSchedulesAggregate {
  aggregate: {
    count: number;
  };
}

////

interface LoanStatus {
  status: string;
}

interface LoanState {
  loanStatuses: LoanStatus[];
  partner: LoanPartner;
}

interface LoanPartner {
  id: string;
  name: string;
}

export interface LoanDetails {
  id: number;
  loanId: string;
  paidDate: string | null;
  duePrincipal: number;
  dueInterest: number;
  dueLateFee: number;
  dueDate: string;
  loan: LoanState;
}
