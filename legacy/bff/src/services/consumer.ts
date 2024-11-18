import axios from "axios";
import { config } from "../../config";
import { ConflictError } from "../domain/errors/conflict-error";
import { NotFoundError } from "../domain/errors/not-found-error";
import { UUID } from "crypto";
import { ConsumerDto, GetConsumerCreditLimitsResponse } from "../domain/dtos/consumer-dto";
import { Installment } from "../domain/consumer/models/installment";
import { BadRequestError } from "../domain/errors/bad-request-error";
import { CustomLogger } from "../services/logger";
const logger = new CustomLogger("consumer", "service");

// eslint-disable-next-line
const client = axios.create({
  baseURL: `${config.consumerBaseURL}`,
  //timeout: 400_000,
  headers: { "Content-Type": "application/json" },
});

const PHONE_NOT_REGISTERED_ERROR = `لا يوجد حساب مسجل. يرجى مراجعة الرقم المدخل و المحاولة مرة أخرى`;
const CONSUMER_NOT_FOUND_ERROR = `لا يوجد حساب مسجل. يرجى المحاولة مرة أخرى`;

export type IdentityResponse = {
  identity: string;
  flow_id: string;
  recovery_code: string;
};

export type ConsumerResponse = {
  id: string;
  phone_number: string;
  iam_id: string;
  national_id: string;
  status: string;
  first_name: string;
  last_name: string;
  address: string;
  credit_limit: number;
  created_at: string;
  updated_at: string;
  activated_at: string;
  activated_by_iam_id: string;
  activation_branch: string;
  full_name: string;
  job_name: string;
  work_type: string;
  club: string;
  house_type: string;
  city: string;
  district: string;
  governorate: string;
  salary: number;
  additional_salary: number;
  address_description: string;
  guarantor_job: string;
  guarantor_relationship: string;
  car_year: number;
  marital_status: string;
  company: string;
  single_payment_day: number;
};

/**
 * Type representing the response of the basic information of a consumer.
 * @typedef {Object} ConsumerBasicInfoResponse
 * @property {string} id - The ID of the consumer.
 * @property {string} full_name - The full name of the consumer.
 * @property {string} national_id - The national ID of the consumer.
 * @property {string} status - The status of the consumer.
 */
export type ConsumerBasicInfoResponse = {
  id: string;
  fullName: string;
  nationalId: string;
  status: string;
};

type findConsumerBasicInfo = {
  id: string;
  full_name: string;
  national_id: string;
  status: string;
  single_payment_day: number;
};

export const createConsumerIdentity = async (phone_number: string, ssn?: string): Promise<IdentityResponse> => {
  try {
    const requestBody: { phone_number: string; ssn?: string } = { phone_number: phone_number };
    if (ssn) {
      requestBody.ssn = ssn;
    }
    const res = await client.post<IdentityResponse>("", requestBody);
    return res.data;
  } catch (e) {
    logger.error("Failed to create consumer identity");
    logger.error(e);
    if (e.response?.status === 409) {
      throw new ConflictError({
        message: "Conflict",
        phone_number: e.response?.data?.phone_number,
        identity_conflict: e.response?.data?.identity_conflict,
        mc_conflict: e.response?.data?.mc_conflict,
        password_created: e.response?.data?.password_created,
      });
    } else if (e.response?.status === 409) {
      throw new Error(e.response.data.message);
    }
    logger.error(e);
    throw e;
  }
};

export const generateRecoveryCodeForConsumer = async (phone: string): Promise<IdentityResponse> => {
  try {
    const res = await client.post<IdentityResponse>("/identity/resend-recovery", {
      phone_number: phone,
    });
    return res.data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

export const generateRecoveryCodeForConsumerViaPhoneCall = async (phone: string): Promise<IdentityResponse> => {
  try {
    const res = await client.post<{ data: IdentityResponse }>("/identity/callme", {
      phone_number: phone,
    });
    return res.data.data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

export const findConsumerByPhoneNumber = async (phoneNumber: string): Promise<ConsumerResponse> => {
  try {
    logger.debug("find consumer by phone number");
    let phoneValue = phoneNumber;
    if (phoneValue.startsWith("+")) {
      phoneValue = phoneValue.slice(2);
    }
    const res = await client.get<ConsumerResponse>(`?phone_number=` + encodeURIComponent(phoneValue));
    logger.debug("consumer found");
    return res.data;
  } catch (e) {
    logger.error(`find consumer by phone number failed with error ${e}`);
    if (e.response?.status === 404) {
      throw new NotFoundError(PHONE_NOT_REGISTERED_ERROR);
    }
    logger.error(e);
    throw e;
  }
};
export const findConsumerById = async (consumer_id: UUID): Promise<ConsumerResponse> => {
  try {
    logger.debug("find consumer by id");
    const res = await client.get<ConsumerResponse>(consumer_id.toString());
    logger.debug("consumer found");
    return res.data;
  } catch (e) {
    logger.error(`find consumer by phone id failed with error ${e}`);
    if (e.response?.status === 404) {
      throw new NotFoundError(CONSUMER_NOT_FOUND_ERROR);
    }
    logger.error(e);
    throw e;
  }
};

/**
 * Gets the basic information of a consumer by phone number.
 * @async
 * @param {string} phoneNumber - The phone number of the consumer.
 * @returns {Promise<ConsumerBasicInfoResponse>} The basic information of the consumer.
 * @throws {NotFoundError} Will throw an error if the phone number is not registered.
 */
export const getConsumerBasicInfoByPhoneNumber = async (phoneNumber: string): Promise<ConsumerBasicInfoResponse> => {
  try {
    let phoneValue = phoneNumber;
    if (phoneValue.startsWith("+")) {
      phoneValue = phoneValue.slice(2);
    }
    const res = await client.get<findConsumerBasicInfo>(`?phone_number=` + encodeURIComponent(phoneValue));
    const consumerBasicInfoResponse = {
      id: res.data.id,
      fullName: res.data.full_name,
      nationalId: res.data.national_id,
      status: res.data.status,
      paymentDay: res.data.single_payment_day,
    };
    return consumerBasicInfoResponse;
  } catch (e) {
    if (e.response?.status === 404) {
      throw new NotFoundError(PHONE_NOT_REGISTERED_ERROR);
    }
    logger.error(`failed to get consumer ${e}`);
    throw e;
  }
};

export const findConsumerByIamId = async (iamId: string): Promise<string> => {
  try {
    const res = await client.get<ConsumerResponse>(`?iam_id=` + iamId);
    return res.data.id;
  } catch (e) {
    if (e.response?.status === 404) {
      throw new NotFoundError(`identity doesn't exist for "${iamId}`);
    }
    logger.error(e);
    throw e;
  }
};

export const getConsumerCreditLimits = async (consumerId: UUID): Promise<GetConsumerCreditLimitsResponse> => {
  try {
    logger.debug("getting consumer credit limits for consumer id: " + consumerId.toString());
    const res = await client.get<GetConsumerCreditLimitsResponse>(`/credit-limits/` + consumerId.toString());
    logger.debug("response data: " + JSON.stringify(res.data));
    return res.data;
  } catch (e) {
    if (e.response?.status === 404) {
      throw new NotFoundError(`identity doesn't exist for "${consumerId.toString()}`);
    }
    logger.error(e);
    throw e;
  }
};

export const activateConsumer = async (
  consumerId: string,
  {
    creditLimit,
    creditOfficerIamIad,
    branchName,
  }: { creditLimit: number; creditOfficerIamIad: string; branchName: string },
): Promise<ConsumerResponse> => {
  try {
    logger.debug("activating consumer with id: " + consumerId);
    const res = await client.post<ConsumerResponse>(`/` + consumerId.toString() + `/activate`, {
      credit_limit: creditLimit,
      credit_officer_iam_id: creditOfficerIamIad,
      branch_name: branchName,
    });
    return res.data;
  } catch (e) {
    logger.error(`Failed to activate consumer ${e}`);
    if (e.response?.status === 404) {
      throw new NotFoundError(`identity doesn't exist for "${consumerId.toString()}`);
    }
    throw e;
  }
};

export const updateConsumer = async (consumer: ConsumerDto): Promise<ConsumerResponse> => {
  try {
    logger.debug("updating consumer with id: " + consumer.id.toString());
    const res = await client.put<ConsumerResponse>(`/`, consumer);
    return res.data;
  } catch (e) {
    if (e.response?.status === 404) {
      throw new NotFoundError(`identity doesn't exist for "${consumer.id.toString()}`);
    }
    logger.error(`failed to update consumer ${e}`);
    throw e;
  }
};
type Money = { currency: string; amount: number };
type PaymentSchedule = {
  instalment_due_date: string;
  paid_date: string;
  principal_due: Money;
  interest_due: Money;
  late_fee_due: Money;
  paid_principal: Money;
  paid_interest: Money;
  paid_late_fee: Money;
  installment_id: number;
  is_cancelled: boolean;
};
type LoanStatus = { status_type: string; created_at: string };
type Loan = {
  loan_id: UUID;
  partner_id: UUID;
  partner_name: string;
  transaction_id: number;
  admin_fees: Money;
  current_status: LoanStatus;
  booked_at: string;
  payment_schedule: [PaymentSchedule];
};
type ConsumerLoans = {
  loans: Loan[];
  consumer_id: UUID;
};

const loansToInstallmentEntity = (consumerLoans: ConsumerLoans): any => {
  const loans: any = [];
  consumerLoans.loans.forEach((loan) => {
    loans.push({
      ...loan,
      payment_schedule: loan.payment_schedule.map((paymentSchedule) => {
        return new Installment(
          loan.partner_name,
          new Date(paymentSchedule.instalment_due_date),
          paymentSchedule.paid_date ? new Date(paymentSchedule.paid_date) : null,
          paymentSchedule.principal_due.amount,
          paymentSchedule.interest_due.amount,
          paymentSchedule.late_fee_due.amount,
          paymentSchedule.paid_principal.amount,
          paymentSchedule.paid_interest.amount,
          paymentSchedule.paid_late_fee.amount,
          paymentSchedule.installment_id,
          loan.loan_id,
          paymentSchedule.is_cancelled,
          loan.current_status.status_type === "EARLY_SETTLED",
        );
      }),
    });
  });
  return loans;
};
export const getConsumerLoans = async (consumerId: UUID): Promise<any> => {
  try {
    logger.debug("getting consumer loans for consumer id: " + consumerId.toString());
    const res = await client.get<ConsumerLoans>(`/loans/` + consumerId.toString());
    return loansToInstallmentEntity(res.data);
  } catch (e) {
    if (e.response?.status === 404) {
      throw new NotFoundError(`consumer doesn't exist for id "${consumerId.toString()}`);
    } else if (e.response?.status === 400) {
      throw new BadRequestError(e.response?.data?.errors || "Bad request");
    }
    logger.error(e);
    throw e;
  }
};
export const getConsumerLoanDetails = async (
  consumerId: UUID,
  loanId: string,
  installmentId: string,
): Promise<Installment[]> => {
  try {
    logger.debug("getting consumer loan details for consumer id: " + consumerId.toString());
    const res = await client.get<ConsumerLoans>(`/loan-details/` + consumerId.toString(), {
      params: {
        loan_id: loanId,
        installment_id: installmentId,
      },
    });
    return loansToInstallmentEntity(res.data);
  } catch (e) {
    logger.error(`failed to get loan details api ${e}`);
    if (e.response?.status === 404) {
      throw new NotFoundError(`consumer doesn't exist for id "${consumerId.toString()}`);
    } else if (e.response?.status === 400) {
      throw new BadRequestError(e.response?.data?.errors || "Bad request");
    }
    logger.error(e);
    throw e;
  }
};
