import { readFile } from "fs";
import { Request, Response } from "express";
import { GetLoansUseCases } from "../../../../domain/back-office/use-cases/get-loans-use-cases";
import { CustomLogger } from "../../../../services/logger";
import { UUID } from "crypto";
import { v4 as uuidv4 } from "uuid";
import { getConsumerBasicInfoByPhoneNumber } from "../../../../services/consumer";
import { PaymentDto } from "../../../../domain/registry/models/payment-dto";
import { createAccount, createPayment, isServiceAvailable, updatePaymentMetadata } from "../../../../services/formance";
import { config } from "../../../../../config";
import { startWorkflow } from "../../../../services/workflow";
import { executeQuery } from "../../../../services/hasura";

const logger = new CustomLogger("repayment-controller");
const formanceWorldAccountId = config.formanceWorldPaymentAccountId;

interface PaymentMethod {
  branch_id: string;
  payment_method_code: string;
}

const loadCSV = (filePath: string): Promise<PaymentMethod[]> => {
  return new Promise((resolve, reject) => {
    readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return reject(err);
      }

      const results: PaymentMethod[] = [];
      const lines = data.split("\n");

      for (const line of lines) {
        if (line.trim() === "") continue; // Skip empty lines
        const [branch_id, payment_method_code] = line.split(",");
        results.push({ branch_id, payment_method_code: payment_method_code.trim() });
      }

      resolve(results);
    });
  });
};

const repay = async (_req: Request, res: Response) => {
  const userInfo = { userInitials: "C.A", userTag: "B.Tech Staff", userSubTag: "Collection Agent" };

  res.render("./screens/repayment/index", {
    layout: "layout/empty-screens",
    title: "Search",
    logoutUrl: "/private/back-office/logout",
    userInfo: userInfo,
  });
};

const repaySearch = async (req: Request, res: Response) => {
  const consumerPhoneNumber = req.query.phoneNumber as string;
  let consumerInfo = null;
  try {
    consumerInfo = await getConsumerBasicInfoByPhoneNumber(consumerPhoneNumber);
    res.json(consumerInfo);
  } catch (error) {
    logger.error(error);
    return res.status(404).send();
  }
};

const repayGetLoans = async (req: Request, res: Response) => {
  try {
    logger.debug("get-loans");
    const consumer_id = req.query.consumerId as UUID;
    const consumerLoans = await new GetLoansUseCases().getLoans(consumer_id);
    res.json(consumerLoans);
  } catch (err) {
    logger.error(err);
    return res.status(404).send();
  }
};

const payInstallment = async (req: Request, res: Response) => {
  try {
    logger.debug("pay installment");
    const paymentData = req.body as PaymentDto;
    paymentData.branch_id = req.headers["x-user-iam-branch-id"].toString();
    paymentData.collection_agent_email = req.headers["x-user-iam-email"].toString();
    // 1- check if the payment registry service is up and running to accept the payment
    const paymentRegistryServiceHealth = await isServiceAvailable();
    if (!paymentRegistryServiceHealth) {
      return res.status(500).send("خدمة التحصيل غير متاحة");
    }
    // 2- check if the payment is already paid
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
    const variables = { consumerId: paymentData.payee_id };
    const result = await executeQuery(operation, variables);
    interface ExistingPayment {
      loan_id: string;
      loan_schedule_id: number;
      collected_as_early_settlement: boolean;
      reference: string;
    }

    const consumerExistingPayments: ExistingPayment[] = [];
    result.consumers[0]?.formanceAccount?.payments.forEach(
      (payment: { metadata: { value: string }[]; reference: string }) => {
        if (payment.metadata.length > 0) {
          const reference = payment.reference;
          const value = JSON.parse(payment.metadata[0].value);
          value.forEach(
            (value: { loan_id: string; loan_schedule_id: number; collected_as_early_settlement: boolean }) => {
              const existingPayment = {
                loan_id: value.loan_id,
                loan_schedule_id: value.loan_schedule_id,
                collected_as_early_settlement: value.collected_as_early_settlement,
                reference: reference,
              };
              consumerExistingPayments.push(existingPayment);
            },
          );
        }
      },
    );
    const existingPayment = consumerExistingPayments.find(
      (p) => p.loan_id === paymentData.loan_id && p.loan_schedule_id === Number(paymentData.loan_scheduel_id),
    );
    if (existingPayment) {
      return res.status(500).send("تم تحصيل القسط من قبل");
    }
    // 3- create the payment
    // generate a uuid for the payment
    const paymentId = uuidv4();
    const formanceAccountId = await createAccount(paymentData.payee_id);
    const formancePayment = await createPayment({
      amount: paymentData.amount_units,
      createdAt: new Date(),
      reference: paymentId,
      sourceAccountID: formanceWorldAccountId,
      destinationAccountID: formanceAccountId,
    });
    if (!formancePayment) {
      return res.status(500).send("خطأ في التحصيل");
    }
    // 4- initiate workflow
    const bookingTime = new Date();
    const myloRepayments = [
      {
        loan_id: paymentData.loan_id,
        loan_schedule_id: parseInt(paymentData.loan_scheduel_id, 10),
        amount: paymentData.amount_units,
        collected_as_early_settlement: paymentData.loan_scheduel_id === "-1",
        // due_principal: 0, TODO
        // due_interest: 0, TODO
        // due_late_fee: 0, TODO
        // due_date: "2021-09-01T00:00:00Z", TODO
      },
    ];
    let paymentMethod;
    if (paymentData.payment_method === "BTECH_STORE_CASH") {
      const paymentMethods = await loadCSV(__dirname + "/../../static/data/btech-store-cash-codes.csv");
      paymentMethod = paymentMethods.find((pm) => pm.branch_id === paymentData.branch_id);
    } else if (paymentData.payment_method === "BTECH_STORE_POS_BANK_MISR") {
      const paymentMethods = await loadCSV(__dirname + "/../../static/data/visa-card-codes.csv");
      paymentMethod = paymentMethods.find((pm) => pm.branch_id === paymentData.branch_id);
    } else if (paymentData.payment_method === "BTECH_STORE_POS_CIB") {
      const paymentMethods = await loadCSV(__dirname + "/../../static/data/cib-card-codes.csv");
      paymentMethod = paymentMethods.find((pm) => pm.branch_id === paymentData.branch_id);
    } else if (paymentData.payment_method === "BTECH_STORE_POS_NBE") {
      const paymentMethods = await loadCSV(__dirname + "/../../static/data/ahly-card-codes.csv");
      paymentMethod = paymentMethods.find((pm) => pm.branch_id === paymentData.branch_id);
    }
    const executionId = await startWorkflow({
      name: "consumer_collection_process",
      correlationId: paymentId,
      input: {
        consumer_id: paymentData.payee_id,
        booking_time: bookingTime,
        payment_channel: paymentData.payment_method === "BTECH_STORE_CASH" ? "BTECH_STORE_CASH" : "BTECH_STORE_POS",
        payment_details: {
          id: paymentId,
          booking_time: bookingTime.toString(),
          raw_request: {
            ...paymentData,
            loan_scheduel_id: parseInt(paymentData.loan_scheduel_id, 10),
            collection_store_id: paymentData.branch_id,
            collected_by: paymentData.collection_agent_email.split("@")[0],
            payment_method_code: paymentMethod.payment_method_code,
            card_number: paymentData.credit_card,
            reference_number: paymentData.reference_number,
          },
          amount_currency: "EGP",
          amount_units: paymentData.amount_units,
          channel: paymentData.payment_method === "BTECH_STORE_CASH" ? "BTECH_STORE_CASH" : "BTECH_STORE_POS",
          collected_as_early_settlement: paymentData.loan_scheduel_id === "-1",
        },
        mylo_repayments: myloRepayments,
      },
    });
    // 5- update payment metdata
    updatePaymentMetadata(formancePayment, {
      paymentChannel: "BTECH_STORE_CASH",
      amount: paymentData.amount_units.toString(),
      myloRepayments: JSON.stringify(myloRepayments),
      consumerId: paymentData.payee_id,
      workflowId: executionId,
      collectionBranchCode: paymentData.branch_id,
      collectionAgentEmail: paymentData.collection_agent_email,
    });
    res.json({ id: paymentId });
  } catch (err) {
    logger.error(err);
    if (err?.response?.data?.code === "103") {
      return res.status(500).send("تم تحصيل القسط من قبل");
    }
    return res.status(400).send(err.message);
  }
};

export default { repayGetLoans, repay, repaySearch, payInstallment };
