import axios from "axios";
import { config } from "../../config";
import { NotFoundError } from "../domain/errors/not-found-error";
import { UUID } from "crypto";
import { BadRequestError } from "../domain/errors/bad-request-error";
import { CustomLogger } from "../services/logger";
const logger = new CustomLogger("lms-service");

// eslint-disable-next-line
const client = axios.create({
  baseURL: `${config.lmsBaseURL}`,
  timeout: 40_000,
  headers: { "Content-Type": "application/json" },
});

export const getLoans = async (consumerId: UUID) => {
  try {
    logger.debug("getting consumer loans for consumer id: " + consumerId.toString());
    const res = await client.get(`/api/loans/consumer/` + consumerId.toString());
    return res.data.data;
  } catch (e) {
    if (e.response?.status === 404) {
      throw new NotFoundError(`consumer doesn't exist for id "${consumerId.toString()}`);
    } else if (e.response?.status === 400) {
      throw new BadRequestError(e.response?.data?.data?.message || "Bad request");
    }
    throw e;
  }
};

export const getPartnerLoans = async (partnerId: UUID, loans: string[]) => {
  try {
    logger.debug("getting partner loans for partner id: " + partnerId.toString());
    let url = `/api/loans/merchant/` + partnerId.toString();
    if (loans.length > 0) {
      url += `?loans=${loans.join(",")}`;
    }
    const res = await client.get(url);
    return res.data.data;
  } catch (e) {
    if (e.response?.status === 404) {
      throw new NotFoundError(`partner doesn't exist for id "${partnerId.toString()}`);
    } else if (e.response?.status === 400) {
      throw new BadRequestError(e.response?.data?.data?.message || "Bad request");
    }
    throw e;
  }
};
