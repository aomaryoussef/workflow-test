"use server";
import camelcaseKeys from "camelcase-keys";

import { getTypedTranslation } from "@/app/common/helpers/translation.helpers";

import { checkConsumerData, fetchUpcomingInstallements } from "./repositories/hasura.repository";
import { LoanDetails, User } from "./types";

export const checkConsumer = async (phone: string): Promise<User[] | { error: string }> => {
  const t = await getTypedTranslation();
  try {
    const phone_number = phone?.trim();
    const data = await checkConsumerData(phone_number);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((item) => camelcaseKeys(item as any, { deep: true })) as User[];
  } catch {
    return { error: t("partner.phoneNotValid") };
  }
};

export const checkUpcomingInstallements = async (id: string): Promise<LoanDetails[] | { error: string }> => {
  const t = await getTypedTranslation();
  try {
    const consumer_id = id?.trim();
    const data = await fetchUpcomingInstallements(consumer_id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((item) => camelcaseKeys(item as any, { deep: true })) as LoanDetails[];
  } catch {
    return { error: t("repay.errors.failedToGetRepaymentData") };
  }
};
