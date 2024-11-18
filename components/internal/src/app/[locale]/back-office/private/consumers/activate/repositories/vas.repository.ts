import { CONNECTION_ERROR_CODES } from "@common/constants/error.constants";
import axios, { isAxiosError } from "axios";

import { ConnectionError, InvalidResponseError } from "@/app/common/exceptions";

import { SanctionType } from "../enums";

const axiosClient = axios.create({
  baseURL: process.env.OL_BFF_VAS_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const checkSanctionsList = async (
  nationalId: string,
  name: string
): Promise<{ exists: boolean; sanctionType: SanctionType }> => {
  try {
    const res = await axiosClient.post<{ isInSanctionList: boolean; sanctionListType: SanctionType }>(
        "consumers/check-sanctions-list",
        { name, nationalId }
      ),
      { isInSanctionList, sanctionListType } = res.data;

    if (typeof isInSanctionList !== "boolean")
      throw new InvalidResponseError("Invalid response from VAS service", "boolean", typeof isInSanctionList);

    return { exists: isInSanctionList, sanctionType: sanctionListType };
  } catch (e) {
    if (isAxiosError(e)) {
      if (CONNECTION_ERROR_CODES.includes(e.code!))
        throw new ConnectionError(`Failed to connect to ${e.config?.url}`, e);
    }
    // TODO: Check why INVALID_URL is being thrown as TypeError, is it because of the logger?
    else if (e instanceof TypeError) throw e;

    throw e;
  }
};
