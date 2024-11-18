import { Installment } from "../../consumer/models/installment";

export class ConsumerLoans {
  basket_id: string;
  creation_date: Date;
  amount: number;
  product_name: string;
  partner_name: string;
  loan_id: string;
  partner_id: string;
  branch_id: string;
  status: string;
  payment_schedule: Installment[];
  early_settlement: any;
  early_settlement_payment_id: any;
}
