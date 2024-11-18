import { UUID } from "crypto";
import { getLoans } from "../../../services/lms";
import { getLoansFromMiniCash } from "../../../services/minicash";
import { getConsumerCheckoutBaskets } from "../../../services/checkout";
import { CustomLogger } from "../../../services/logger";
import { ConsumerLoans } from "../models/consumer-loans";
import { Installment, InstallmentStatuses } from "../../../domain/consumer/models/installment";
import { BadRequestError } from "../../errors/bad-request-error";
import { executeQuery } from "../../../services/hasura";
const logger = new CustomLogger("get-loans-use-case");

export class GetLoansUseCases {
  loansToInstallmentEntity(loan: any, formancePayments: any) {
    const installments = [];
    for (const paymentSchedule of loan.payment_schedule) {
      const isLoanCancelled = loan.current_status.status_type === "CANCELLED";
      const paymentId = formancePayments.find(
        (payment: any) => payment.loan_id === loan.loan_id && payment.loan_schedule_id === paymentSchedule.id,
      )?.reference;
      const installment = new Installment(
        loan.partner_name,
        new Date(paymentSchedule.due_date),
        paymentSchedule.paid_date ? new Date(paymentSchedule.paid_date) : null,
        paymentSchedule.principal_due.amount,
        paymentSchedule.interest_due.amount,
        paymentSchedule.late_fee_due.amount,
        paymentSchedule.paid_principal.amount,
        paymentSchedule.paid_interest.amount,
        paymentSchedule.paid_late_fee.amount,
        paymentSchedule.id,
        loan.loan_id,
        paymentSchedule.is_cancelled || isLoanCancelled,
        loan.current_status.status_type === "EARLY_SETTLED",
        paymentId,
      );
      if (
        loan.current_status.status_type === "EARLY_SETTLED" &&
        !installment.paymentId &&
        installment.status === InstallmentStatuses.PAID
      ) {
        installment.status = InstallmentStatuses.EARLY_SETTLED;
      }
      installments.push(installment);
    }
    // sort by dueDate installments list of Installment objects in ascending order
    installments.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
    return installments;
  }

  setEarlySettlementDetails(loan: any, payments: any) {
    return payments.find((payment: any) => payment.billing_account_schedule_id === -1)?.id;
  }

  async getLoans(consumerId: UUID) {
    logger.info("get back-office loans use case");
    const lmsLoans = await getLoans(consumerId);
    const checkoutBaskets = await getConsumerCheckoutBaskets(consumerId, ["LOAN_ACTIVATED"]);
    let mappedMiniCashLoans: any[] = [];
    const formancePayments: {
      loan_id: string;
      loan_schedule_id: number;
      collected_as_early_settlement: boolean;
      reference: string;
    }[] = [];
    try {
      const operation = `
        query GetConsumerPayments($consumerId: uuid!) {
          consumers(where: {id: {_eq: $consumerId}}) {
            formanceAccount {
              payments {
                metadata(where: {key: {_eq: "myloRepayments"}}) {
                  value
                }
                reference
              }
            }
          }
        }
    `;
      const variables = { consumerId };
      const result = await executeQuery(operation, variables);
      result.consumers[0]?.formanceAccount?.payments.forEach(
        (payment: { metadata: { value: string }[]; reference: string }) => {
          if (payment.metadata.length > 0) {
            const reference = payment.reference;
            const value = JSON.parse(payment.metadata[0].value);
            value.forEach(
              (value: { loan_id: string; loan_schedule_id: number; collected_as_early_settlement: boolean }) => {
                const newPayment = {
                  loan_id: value.loan_id,
                  loan_schedule_id: value.loan_schedule_id,
                  collected_as_early_settlement: value.collected_as_early_settlement,
                  reference: reference,
                };
                formancePayments.push(newPayment);
              },
            );
          }
        },
      );
    } catch (error) {
      throw new BadRequestError("Unable to get payments");
    }
    try {
      const miniCashLoans = await getLoansFromMiniCash(consumerId);
      mappedMiniCashLoans =
        miniCashLoans?.Orders.map((loan: any) => {
          return {
            loan_id: loan.OrderID,
            creation_date: new Date(loan.OrderDate),
            amount: loan.TotalPaidAmount * 100,
            product_name: loan.OrderCode,
            partner_name: "بى تك",
            partner_id: "_",
            payment_schedule:
              loan?.Installments.map((installment: any) => {
                return {
                  amount: (installment.TotalAmount + installment.Totalfine) * 100,
                  dueDate: new Date(installment.PaymentDate),
                  isLoanEarlySettled: false,
                  isCancelled: false,
                  installmentId: installment.InstallmentID,
                  loan_id: loan.OrderID,
                  is_cancelled: false,
                  status: installment.isPaid ? "PAID" : "UNPAID",
                };
              }) || [],
            basket_id: "_",
            branch_id: "_",
            status: "UPCOMING",
            early_settlement: null as any,
            early_settlement_payment_id: null as any,
            source: "minicash",
            totalPaidInstallments: loan.TotalPaidIns ? loan.TotalPaidIns : 2,
          };
        }) || [];
    } catch (error) {
      throw new BadRequestError("No minicash loans");
    } finally {
      const loans: ConsumerLoans[] = [];
      // hide cancelled loans
      const filteredLoans = lmsLoans.loans
        ? lmsLoans.loans.filter((l: any) => l.current_status.status_type !== "CANCELLED")
        : [];
      // sort the filtered loans by creation date , the field is created_at
      filteredLoans.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      for await (const loan of filteredLoans) {
        let earlySettlementPaymentId = null;
        const formancePayment = formancePayments.find(
          (p: any) => p.loan_id === loan.loan_id && p.collected_as_early_settlement,
        );
        if (formancePayment && formancePayment.collected_as_early_settlement) {
          earlySettlementPaymentId = formancePayment.reference;
        }
        const checkoutBasket = checkoutBaskets.find((c: any) => c.loan_id === loan.loan_id);
        if (checkoutBasket) {
          loans.push({
            loan_id: loan.loan_id,
            creation_date: new Date(loan.created_at),
            amount: checkoutBasket.gross_basket_value,
            product_name: checkoutBasket.products[0].name,
            partner_name: checkoutBasket.partner_name,
            partner_id: checkoutBasket.partner_id,
            payment_schedule: this.loansToInstallmentEntity(loan, formancePayments),
            basket_id: checkoutBasket.basket_id,
            branch_id: checkoutBasket.branch_id,
            status: checkoutBasket.status,
            early_settlement: loan.early_settlement_details,
            early_settlement_payment_id: earlySettlementPaymentId,
          });
        }
      }
      loans.push(...mappedMiniCashLoans);
      return loans;
    }
  }
}
