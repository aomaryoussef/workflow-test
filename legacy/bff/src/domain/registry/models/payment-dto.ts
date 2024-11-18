export type PaymentDto = {
  branch_id: string;
  payee_id: string;
  payee_type: string;
  loan_id: string;
  loan_scheduel_id: string;
  amount_units: number;
  collection_agent_email: string;
  credit_card: string;
  reference_number: string;
  payment_method: string;
};

export type Payment = {
  id: string;
  branch_id: string;
  payee_id: string;
  payee_type: string;
  loan_id: string;
  loan_scheduel_id: string;
  billing_account: string;
  billing_account_schedule_id: number;
  amount_units: number;
  booking_time: string;
  collection_agent_email: string;
  channel: string;
  raw_request: any;
};

export type GetPaymentInputDto = {
  id: string;
};

export type GetPaymentOutputDto = Payment;
