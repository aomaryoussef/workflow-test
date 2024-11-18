export class LoanScheduleDto {
  id: number;
  loan_id: string;
  paid_at: string;
  created_at: string;
  due_date: string;
  due_principal: number;
  due_interest: number;
  due_late_fee: number;
}

export class UpcomingPaymentDto {
  amount: number;
  dueDate: string;
  issueDate: string;
  extraInfo: string;
  unpaidSchedules: LoanScheduleDto[];
  consumerId: string;
  consumerFullName: string;
}
