import { CONNECTION_ERROR_CODES } from "@common/constants/error.constants";
import { sortLabelsFn } from "@common/helpers/array.helpers";
import axios, { isAxiosError } from "axios";

import { IConsumerDto } from "@/app/[locale]/back-office/private/consumers/activate/dto/consumer.dto";
import { removeCountryCode } from "@/app/common/helpers/phone.helps";
import { CustomLogger } from "@/logger";

const logger = new CustomLogger({
  service: "backoffice",
  context: "consumer-activation_service-department-repository",
});

const axiosClient = axios.create({
  baseURL: process.env.OL_BFF_CONSUMER_SERVICE_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const getConsumerByPhone = async (
  phoneNumber: string
): Promise<IConsumerDto | { error: "consumer_not_found" | "connection_error" | "unknown_error" }> => {
  try {
    phoneNumber = removeCountryCode(phoneNumber);

    const res = await axiosClient.get<IConsumerDto>("", {
        headers: { "Content-Type": "application/json" },
        params: { phone_number: phoneNumber },
      }),
      consumer = res.data;

    if (!consumer || Object.keys(consumer).length === 0) {
      return { error: "consumer_not_found" };
    }

    return consumer;
  } catch (e) {
    logger.error("error fetching consumer:");
    logger.error(e);

    if (isAxiosError(e)) {
      if ((e.response?.data?.message as string).toLowerCase() === "consumer not found") {
        logger.error(`Consumer not found with phone number: ${phoneNumber}`);
        return { error: "consumer_not_found" };
      }

      if (CONNECTION_ERROR_CODES.includes(e.code!)) return { error: "connection_error" };
    }

    return { error: "unknown_error" };
  }
};

export const getBTechBranches = async (): Promise<
  { label: string; value: string }[] | { error: "connection_error" | "unknown_error" }
> => {
  try {
    return [
      { label: "بي تك - أسيوط", value: "بي تك - أسيوط" },
      { label: "بي تك إكس - أسيوط", value: "بي تك إكس - أسيوط" },
      { label: "بي تك ميجا - أسيوط", value: "بي تك ميجا - أسيوط" },
      { label: "بى تك - قنا", value: "بى تك - قنا" },
      { label: "بى تك ميجا - نجع حمادى", value: "بى تك ميجا - نجع حمادى" },
      { label: "بى تك إكس - سوهاج", value: "بى تك إكس - سوهاج" },
      { label: "بى تك الجديد - سوهاج", value: "بى تك الجديد - سوهاج" },
      { label: "بى تك - سوهاج", value: "بى تك - سوهاج" },
    ].sort(sortLabelsFn);
  } catch (e) {
    logger.error("error fetching B.Tech branches", e);

    if (isAxiosError(e)) {
      if (CONNECTION_ERROR_CODES.includes(e.code!)) return { error: "connection_error" };
    }

    return { error: "unknown_error" };
  }
};

export async function updateConsumer(
  consumer: IConsumerDto
): Promise<IConsumerDto | { error: "failed"; message: string } | { error: "connection_error" | "unknown_error" }> {
  try {
    const body = JSON.stringify(consumer),
      response = await axiosClient.put("", body),
      updatedConsumer = response.data;
    return updatedConsumer;
  } catch (e) {
    logger.error(`Failed to update consumer: ${e}`);

    if (isAxiosError(e)) {
      if (e.response?.data?.message) return { error: "failed", message: e.response.data.message };
      if (CONNECTION_ERROR_CODES.includes(e.code!)) return { error: "connection_error" };
    }

    return { error: "unknown_error" };
  }
}

export async function activateConsumer(
  consumerId: string,
  {
    creditLimit,
    creditOfficerIamIad,
    branchName,
  }: {
    creditLimit: number;
    creditOfficerIamIad: string;
    branchName: string;
  }
): Promise<IConsumerDto | { error: "failed"; message: string } | { error: "connection_error" | "unknown_error" }> {
  try {
    const creditLimitInCents = creditLimit * 100,
      body = JSON.stringify({
        credit_limit: creditLimitInCents,
        credit_officer_iam_id: creditOfficerIamIad,
        branch_name: branchName,
      }),
      response = await axiosClient.post(`${consumerId}/activate`, body),
      activatedConsumer = await response.data;
    return activatedConsumer;
  } catch (e) {
    logger.error(`Failed to activate consumer: ${e}`);

    if (isAxiosError(e)) {
      if (e.response?.data?.message) return { error: "failed", message: e.response.data.message };
      if (CONNECTION_ERROR_CODES.includes(e.code!)) return { error: "connection_error" };
    }

    return { error: "unknown_error" };
  }
}
