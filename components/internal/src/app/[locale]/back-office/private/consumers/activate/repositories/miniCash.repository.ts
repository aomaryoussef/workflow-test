import { CONNECTION_ERROR_CODES } from "@common/constants/error.constants";
import axios, { isAxiosError } from "axios";
import url from "url";

import { CustomLogger } from "@/logger";

import { ScoringStatus } from "../enums";
import { IConsumerMiniCash, IScoringInput } from "../types";

const logger = new CustomLogger({ service: "backoffice", context: "consumer-activation_minicash-repository" });

const axiosClients = {
  miniCash: axios.create({ baseURL: process.env.OL_BFF_MINICASH_BASE_URL }),
  scoring: axios.create({ baseURL: process.env.OL_BFF_SCORING_URL }),
};

export const authenticateMiniCash = async (): Promise<
  string | { error: "unsupported_grant_type" | "invalid_grant" | "failed" | "connection_error" | "unknown_error" }
> => {
  const params = new url.URLSearchParams({
    grant_type: "password",
    username: process.env.OL_BFF_MINICASH_USERNAME!,
    password: process.env.OL_BFF_MINICASH_PASSWORD!,
  });

  try {
    const { access_token: accessToken } = (
      await axiosClients.miniCash.post(process.env.OL_BFF_MINICASH_LOGIN_URL!, params.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
    ).data;

    if (!accessToken) return { error: "failed" };

    return accessToken;
  } catch (e) {
    logger.error(e);

    if (isAxiosError(e)) {
      switch (e.response?.data?.error) {
        case "unsupported_grant_type":
          return { error: "unsupported_grant_type" };

        case "invalid_grant":
          return { error: "invalid_grant" };
      }

      if (CONNECTION_ERROR_CODES.includes(e.code!)) return { error: "connection_error" };
    }

    return { error: "unknown_error" };
  }
};

export const getMiniCashData = async (
  accessToken: string,
  nationalId: string
): Promise<
  | IConsumerMiniCash
  | { error: "invalid_auth_token" | "consumer_not_found" | "failed" | "connection_error" | "unknown_error" }
> => {
  try {
    const consumer = (
      await axiosClients.miniCash.get(process.env.OL_BFF_SCORING_ENGINE_GET_USER_DATA_URL!, {
        params: { ssn: nationalId },
        headers: { Authorization: `Bearer ${accessToken}` },
      })
    ).data.Data;

    if (!consumer || Object.keys(consumer).length === 0) return { error: "failed" };

    return consumer;
  } catch (e) {
    logger.error(e);

    if (isAxiosError(e)) {
      if (
        String(e.response?.data?.Message).toLowerCase() ===
        "Authorization has been denied for this request.".toLowerCase()
      )
        return { error: "invalid_auth_token" };

      if (
        String(e.response?.data).toLowerCase() ===
        "An error occurred while executing the command definition. See the inner exception for details.".toLowerCase()
      )
        return { error: "consumer_not_found" };

      if (CONNECTION_ERROR_CODES.includes(e.code!)) return { error: "connection_error" };
    }

    return { error: "unknown_error" };
  }
};

export const checkSanctionsList = async (
  ssn: string,
  name: string
): Promise<{ exists: boolean } | { error: "invalid_response" | "connection_error" | "unknown_error" }> => {
  try {
    const query = `query($body: CheckSanctionsListInput!) {
    checkSanctionsList(body: $body) {
        exists
    }
}`,
      response = await axiosClients.scoring.post(
        "",
        { query: query, variables: { body: { ssn, name } } },
        { headers: { Authorization: `Bearer ${process.env.OL_BFF_SCORING_TOKEN!}` } }
      ),
      exists = response.data?.data?.checkSanctionsList?.exists;

    if (typeof exists !== "boolean") return { error: "invalid_response" };

    return { exists };
  } catch (e) {
    logger.error(e);

    if (isAxiosError(e)) {
      if (CONNECTION_ERROR_CODES.includes(e.code!)) return { error: "connection_error" };
    }

    return { error: "unknown_error" };
  }
};

export const getConsumerScoringData = async (
  scoringObj: IScoringInput
): Promise<
  | {
      status: ScoringStatus;
      canDownload: boolean;
      creditLimit: number;
    }
  | { error: "failed" | "connection_error" | "unknown_error" }
> => {
  try {
    const query = `query($body: ScoreInput!) {
        getMyloScore(body: $body) {
              creditLimit
              status
            }
          }`,
      response = await axiosClients.scoring.post(
        "",
        { query, variables: { body: scoringObj } },
        { headers: { Authorization: `Bearer ${process.env.OL_BFF_SCORING_TOKEN!}` } }
      ),
      consumerScoring = response.data?.data?.getMyloScore;

    if (response.data?.errors) {
      logger.error("Error getting consumer scoring:", response.data?.errors);
      return { error: "failed" };
    }

    return {
      creditLimit: consumerScoring.creditLimit,
      status: consumerScoring.status,
      canDownload: consumerScoring.status == "APPROVED_ACTIVE",
    };
  } catch (e) {
    logger.error(e);

    if (isAxiosError(e)) {
      if (CONNECTION_ERROR_CODES.includes(e.code!)) return { error: "connection_error" };
    }

    return { error: "unknown_error" };
  }
};
