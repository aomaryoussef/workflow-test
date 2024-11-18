import axios from "axios";
import url from "url";
import { config } from "../../config";
import { CustomLogger } from "./logger";
import { NotFoundError } from "../domain/errors/not-found-error";
import { BadRequestError } from "../domain/errors/bad-request-error";
import { UUID } from "crypto";
import { findConsumerById } from "./consumer";

const client = axios.create({
  baseURL: config.minicashBaseURL,
  timeout: 50000,
});
const logger = new CustomLogger("minicash");

export const getConsumerMinicashData = async (national_id: string) => {
  const params = new url.URLSearchParams({
    username: config.minicashUsername,
    password: config.minicashPassword,
    grant_type: "password",
  });
  logger.debug("get consumer data minicash");

  let consumer = null;
  try {
    const bearer_token = (
      await client.post(config.minicashLoginURL, params.toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
    ).data.access_token;

    logger.debug("got token");

    consumer = (
      await client.get(config.scoringEngineGetUserDataURL, {
        params: {
          ssn: national_id,
        },
        headers: {
          Authorization: `Bearer ${bearer_token}`,
        },
      })
    ).data.Data;

    logger.debug(`got consumer with ssn:  ${consumer.Ssn} and mobile: ${consumer.MobileNo}`);
  } catch (error) {
    console.error(error);
    logger.error(`Failed to get user minicash data with error ${error}`);
  }
  return consumer;
};

export const getLoansFromMiniCash = async (consumerId: UUID) => {
  try {
    logger.debug("getting consumer loans for consumer with ID: " + consumerId);
    const { national_id } = await findConsumerById(consumerId);
    const res = await client.post("/PaymentGateWay/api/MyloPayment/GetOrdersBySSN", {
      SSN: national_id,
    });
    return res.data;
  } catch (e) {
    if (e.response?.status === 404) {
      throw new NotFoundError(`Loans do not exist for SSN this consumer`);
    } else if (e.response?.status === 400) {
      console.log("bad request happened");
      throw new BadRequestError(e.data?.ErrMsg || "Bad request");
    }
    throw e;
  }
};
