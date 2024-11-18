"use server";

import { generateCustomerActivationDocs } from "@common/helpers/pdf.helpers";
import { removeCountryCode } from "@common/helpers/phone.helps";
import { getTypedTranslation } from "@common/helpers/translation.helpers";
import decamelizeKeys from "decamelize-keys";
import { headers } from "next/headers";

import { IConsumerDto } from "@/app/[locale]/back-office/private/consumers/activate/dto/consumer.dto";
import { ConnectionError, InvalidResponseError } from "@/app/common/exceptions";
import { CustomLogger } from "@/logger";

import { ConsumerStatus } from "./enums";
import { authenticateMiniCash, getConsumerScoringData, getMiniCashData } from "./repositories/miniCash.repository";
import {
  activateConsumer,
  getBTechBranches,
  getConsumerByPhone,
  updateConsumer,
} from "./repositories/service-department.repository";
import { checkSanctionsList } from "./repositories/vas.repository";
import { IConsumerForm, IConsumerMiniCash, IScoringInput, IScoringResponse } from "./types";

const logger = new CustomLogger({ service: "backoffice", context: "consumer-activation_server-actions" });

// TODO: check if env vars are not present and return appropriate error message

export const consumerSearch = async (
  nationalId: string,
  phoneNumber: string
): Promise<
  Partial<{
    consumer: IConsumerDto;
    creditLimit: { value: number; canShow: boolean };
    formFields: IConsumerForm;
    shouldDisableForm: boolean;
    canDownload: boolean;

    info: string;
    error: string;
  }>
> => {
  const t = await getTypedTranslation("consumer");

  // 1. Get consumer from Mylo service department
  let consumer: IConsumerDto;
  try {
    const res = await getConsumerByPhone(phoneNumber);
    if ("error" in res)
      switch (res.error) {
        case "consumer_not_found":
          return { error: t("errors.search.consumerNotFoundInMylo", { number: phoneNumber }) };

        case "connection_error":
          return { error: `${t("errors.search.failedToGetDataFromMylo")}: ${t("errors.connectionError")}` };

        case "unknown_error":
        default:
          return {
            error: `${t("errors.search.failedToGetDataFromMylo")}: ${t(
              "errors.search.unknownErrorWhileSearchingForConsumer"
            )}`,
          };
      }

    consumer = res;
  } catch (e) {
    logger.error("Failed to get consumer data from Mylo:", e);
    return {
      error: `${t("errors.search.failedToGetDataFromMylo")}: ${t(
        "errors.search.unknownErrorWhileSearchingForConsumer"
      )}`,
    };
  }

  // 2. Authenticate with MiniCash API to get access token
  let miniCashAccessToken: string;
  try {
    const res = await authenticateMiniCash();
    if (typeof res !== "string" && "error" in res)
      switch (res.error) {
        case "unsupported_grant_type":
          return {
            error: `${t("errors.miniCash.couldNotAuthenticate")}: ${t("errors.miniCash.unsupported_grant_type")}`,
          };

        case "invalid_grant":
          return { error: `${t("errors.miniCash.couldNotAuthenticate")}: ${t("errors.miniCash.invalid_grant")}` };

        case "connection_error":
          return { error: `${t("errors.miniCash.couldNotAuthenticate")}: ${t("errors.connectionError")}` };

        case "failed":
        case "unknown_error":
        default:
          return { error: `${t("errors.miniCash.couldNotAuthenticate")}: ${t("errors.unknownError")}` };
      }

    miniCashAccessToken = res;
  } catch (error) {
    logger.error("Failed to authenticate with MiniCash:", error);
    return { error: `${t("errors.miniCash.couldNotAuthenticate")}: ${t("errors.unknownError")}` };
  }

  // 3. Get consumer data from MiniCash
  let miniCashData: IConsumerMiniCash;
  try {
    const res = await getMiniCashData(miniCashAccessToken, nationalId);
    if ("error" in res)
      switch (res.error) {
        case "invalid_auth_token":
          return {
            error: `${t("errors.miniCash.failedToGetDataFromMiniCash")}: ${t("errors.miniCash.invalidAuthToken")}`,
          };

        case "consumer_not_found":
          return {
            error: `${t("errors.miniCash.failedToGetDataFromMiniCash")}: ${t(
              "errors.miniCash.consumerNotFoundInMiniCash",
              { id: nationalId }
            )}`,
          };

        case "connection_error":
          return { error: `${t("errors.miniCash.failedToGetDataFromMiniCash")}: ${t("errors.connectionError")}` };

        case "failed":
        case "unknown_error":
        default:
          return { error: `${t("errors.miniCash.failedToGetDataFromMiniCash")}: ${t("errors.unknownError")}` };
      }

    miniCashData = res;
  } catch (error) {
    logger.error("Failed to get consumer data from MiniCash:", error);
    return { error: `${t("errors.miniCash.failedToGetDataFromMiniCash")}: ${t("errors.unknownError")}` };
  }

  // 4. Check phone numbers are the same in Mylo and MiniCash
  if (removeCountryCode(miniCashData.MobileNo) !== removeCountryCode(consumer.phone_number))
    return {
      error: t("errors.search.phoneNumbersMismatch", {
        miniCashPhone: miniCashData.MobileNo,
        myloPhone: consumer.phone_number,
      }),
    };

  // 5. Check if the consumer is in sanctions list
  try {
    logger.debug("Checking sanctions list for consumer:", {
      nationalId: miniCashData.Ssn,
      name: miniCashData.FullName,
    });
    const { exists } = await checkSanctionsList(miniCashData.Ssn, miniCashData.FullName);
    if (exists) return { error: t("errors.search.consumerSanctioned") };
  } catch (error) {
    logger.error("Failed to check sanctions list:", error);

    switch (true) {
      case error instanceof ConnectionError:
        return { error: `${t("errors.search.failedToGetSanctionsListStatus")}: ${t("errors.connectionError")}` };

      case error instanceof InvalidResponseError:
        return { error: `${t("errors.search.failedToGetSanctionsListStatus")}: ${t("errors.invalidResponse")}` };

      default:
        return { error: `${t("errors.search.failedToGetSanctionsListStatus")}: ${t("errors.unknownError")}` };
    }
  }

  // 6. Get consumer scoring from MiniCash Scoring API
  let scoringData: IScoringResponse;
  try {
    const scoringInput: IScoringInput = {
      ssn: miniCashData.Ssn,
      mobileNumber: miniCashData.MobileNo,
      name: miniCashData.FullName,
      workType: miniCashData.WorkType,
      city: miniCashData.City,
      district: miniCashData.District,
      governorate: miniCashData.Governorate,
      salary: Math.floor(miniCashData.Salary),
      additionalSalary: miniCashData.AdditionalSalary,
      address: miniCashData.Address,
      addressDescription: miniCashData.AddressDescription,
      jobName: miniCashData.JobName,
      houseType: miniCashData.HouseType,
      guarantorJob: miniCashData.GuarantorJob,
      guarantorRelationship: miniCashData.GuarantorRelationship,
      company: miniCashData.Company,
      car: miniCashData.Car,
      club: miniCashData.Club,
      maritalStatus: miniCashData.MaritalStatus,
      // TODO: check the stateName field
      stateName: miniCashData.Governorate, // Assuming stateName is the same as governorate
    };
    const res = await getConsumerScoringData(scoringInput);
    if ("error" in res)
      switch (res.error) {
        case "failed":
          return { error: t("errors.miniCash.failedToGetScoring") };

        case "connection_error":
          return { error: `${t("errors.miniCash.failedToGetScoring")}: ${t("errors.connectionError")}` };

        case "unknown_error":
        default:
          return { error: `${t("errors.miniCash.failedToGetScoring")}: ${t("errors.unknownError")}` };
      }

    scoringData = res;
  } catch (error) {
    logger.error("Failed to get consumer scoring:", error);
    return { error: `${t("errors.miniCash.failedToGetScoring")}: ${t("errors.unknownError")}` };
  }
  if (!scoringData.creditLimit) {
    logger.error(`Invalid consumer credit limit. Scoring data: ${JSON.stringify(scoringData)}`);
    return { error: t("errors.miniCash.invalidCreditLimit", { creditLimit: scoringData.creditLimit }) };
  }

  // 7. Prepare form fields
  const formFields: IConsumerForm = {
    nationalId,
    phoneNumber,
    fullName: consumer.full_name || miniCashData.FullName,
    status: consumer.status,
    address: consumer.address || miniCashData.Address,
    nationalIdAddress: consumer.national_id_address,
    homePhoneNumber: consumer.home_phone_number || miniCashData.HomePhone,
    jobName: consumer.job_name || miniCashData.JobName,
    company: consumer.company || miniCashData.Company,
    workPhoneNumber: consumer.work_phone_number || miniCashData.WorkPhone,
    salary: consumer.salary || miniCashData.Salary,
    additionalSalary: consumer.additional_salary || miniCashData.AdditionalSalary,
    additionalSalarySource: consumer.additional_salary_source,
    companyAddress: consumer.company_address || miniCashData.WorkAddress,
    branchName: consumer.branch_name,
    // Don't show the activation date if the consumer is not activated
    activatedAt: consumer.status === ConsumerStatus.ACTIVE ? consumer.activated_at : "",
    // Use `SinglePaymentDay` value from MiniCash during Activation. Only when it's not available that we fallback to the value from Mylo
    singlePaymentDay: miniCashData.SinglePaymentDay || consumer.single_payment_day,
  };

  // 8. Check consumer status
  if (consumer.status !== ConsumerStatus.AWAITING_ACTIVATION) {
    switch (consumer.status) {
      case ConsumerStatus.ACTIVE:
        return {
          info: t("info.consumerAlreadyActivated"),
          consumer,
          formFields,
          creditLimit: { value: scoringData.creditLimit, canShow: true },
          shouldDisableForm: true,
        };

      case ConsumerStatus.BLOCKED:
        return { error: t("errors.search.consumerBlocked"), formFields, shouldDisableForm: true };

      case ConsumerStatus.WAITING_LIST:
        return { error: t("errors.search.consumerWaitingList"), formFields, shouldDisableForm: true };

      default:
        return {
          error: t("errors.search.consumerUnknownStatus", { status: formFields.status || "" }),
          formFields,
          shouldDisableForm: true,
        };
    }
  }

  // 9. All data is present and valid
  return {
    consumer,
    formFields,
    canDownload: scoringData.canDownload,
    creditLimit: { value: scoringData.creditLimit, canShow: true },
  };
};

export const fetchBTechBranches = async () => {
  const t = await getTypedTranslation("consumer.errors");

  try {
    const branchesRes = await getBTechBranches();
    if ("error" in branchesRes)
      switch (branchesRes.error) {
        case "connection_error":
          return { error: `${t("search.failedToGetBTechBranches")}: ${t("connectionError")}` };

        case "unknown_error":
        default:
          return { error: `${t("search.failedToGetBTechBranches")}: ${t("unknownError")}` };
      }

    return branchesRes;
  } catch (error) {
    logger.error("Failed to fetch BTech branches:", error);
    return { error: `${t("search.failedToGetBTechBranches")}: ${t("unknownError")}` };
  }
};

export const generatePdf = async ({
  formValues,
  consumerData,
  creditLimit,
}: {
  formValues: IConsumerForm;
  consumerData: IConsumerDto;
  creditLimit: number;
}) => {
  const mergedConsumerData: Partial<IConsumerDto> = {
    ...decamelizeKeys(formValues),
    credit_limit: creditLimit,
    id: consumerData.id,
    updated_at: consumerData.updated_at,
  };

  try {
    const pdfBytes = await generateCustomerActivationDocs(mergedConsumerData as IConsumerDto);
    return pdfBytes;
  } catch (error) {
    logger.error("Failed to generate PDF:", error);
    const t = await getTypedTranslation("consumer.errors.prefilledContract");
    return { error: t("errorWhileGeneratingPrefilledContractOnServer") };
  }
};

// Name prefixed with underscore to avoid conflict with the imported function from the repository
const _activateConsumer = async ({
  formFields,
  consumerData,
  creditLimit,
}: {
  formFields: IConsumerForm;
  consumerData: IConsumerDto;
  creditLimit: number;
}): Promise<
  Partial<{
    updatedConsumer: IConsumerDto;
    updatedFormFields: IConsumerForm;
    error: string;
  }>
> => {
  const t = await getTypedTranslation("consumer.errors");

  let updatedConsumer: IConsumerDto;
  try {
    const updatedConsumerRes = await updateConsumer({ ...consumerData, ...decamelizeKeys(formFields) });
    if ("error" in updatedConsumerRes)
      switch (updatedConsumerRes.error) {
        case "failed":
          return { error: `${t("activate.failedToUpdateConsumerData")}: ${updatedConsumerRes.message}` };

        case "connection_error":
          return { error: `${t("activate.failedToUpdateConsumerData")}: ${t("connectionError")}` };

        case "unknown_error":
        default:
          return { error: `${t("activate.failedToUpdateConsumerData")}: ${t("unknownError")}` };
      }

    updatedConsumer = updatedConsumerRes;
  } catch (error) {
    logger.error(`Failed to update consumer info: ${error}`);
    return { error: `${t("activate.failedToUpdateConsumerData")}: ${t("unknownError")}` };
  }

  let activatedConsumer: IConsumerDto;
  try {
    const creditOfficerIamIad = headers().get("x-user-iam-id")!;

    const activateConsumerRes = await activateConsumer(updatedConsumer.id, {
      creditLimit,
      creditOfficerIamIad,
      branchName: formFields.branchName!,
    });
    if ("error" in activateConsumerRes)
      switch (activateConsumerRes.error) {
        case "failed":
          return { error: `${t("activate.updatedButFailedToActivate")}: ${activateConsumerRes.message}` };

        case "connection_error":
          return { error: `${t("activate.updatedButFailedToActivate")}: ${t("connectionError")}` };

        case "unknown_error":
        default:
          return { error: `${t("activate.updatedButFailedToActivate")}: ${t("unknownError")}` };
      }

    activatedConsumer = activateConsumerRes;
  } catch (error) {
    logger.error(`Updated consumer info but failed to activate them: ${error}`);
    return { error: `${t("activate.updatedButFailedToActivate")}: ${t("unknownError")}` };
  }

  if (activatedConsumer.status !== ConsumerStatus.ACTIVE) {
    logger.error(`Consumer was not activated, consumer status: ${activatedConsumer.status}`);
    return { error: t("activate.callSuccessButConsumerNotActive", { status: activatedConsumer.status }) };
  }

  const updatedFormFields: IConsumerForm = {
    ...formFields,
    activatedAt: activatedConsumer.activated_at,
    status: activatedConsumer.status,
  };

  return { updatedConsumer: activatedConsumer, updatedFormFields };
};
export { _activateConsumer as activateConsumer }; // Export the function without the underscore
