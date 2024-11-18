export interface UserDto {
  id: string;
  iam_id: string;
  full_name: string;
  national_id: string;
  loans: Loan[];
}

interface Loan {
  loan_schedules: LoanSchedule[];
  loan_schedules_aggregate: LoanSchedulesAggregate;
}

interface LoanSchedule {
  due_date: string; // ISO date string
  due_interest: number;
  due_late_fee: number;
  due_principal: number;
  is_cancelled: boolean;
  id: number;
  loan_id: string;
  paid_date: string | null; // ISO date string or null
}

interface LoanSchedulesAggregate {
  aggregate: {
    count: number;
  };
}

//
interface LoanStatus {
  status: string;
}

interface LoanState {
  loan_statuses: LoanStatus[];
}

interface LoanPartner {
  id: string;
  name: string;
}

export interface LoanDetails {
  id: number;
  loan_id: string;
  paid_date: string | null;
  due_principal: number;
  due_interest: number;
  due_late_fee: number;
  due_date: string;
  loan: LoanState;
  partner: LoanPartner;
}
