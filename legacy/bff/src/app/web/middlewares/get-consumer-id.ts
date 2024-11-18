import { NextFunction, Request, Response } from "express";
import { findConsumerByIamId } from "../../../services/consumer";
import { UnAuthorizedError } from "../../../domain/errors/unauthorized-error";
import { CustomLogger } from "../../../services/logger";
const logger = new CustomLogger("get-consumer-id-middleware");
export const getConsumerIdentity = async (req: Request, _: Response, next: NextFunction) => {
  try {
    let consumerIamId = req.headers["x-user-iam-id"];
    logger.info("Try to get consumer id for IAM id " + consumerIamId);
    consumerIamId = typeof consumerIamId == "string" ? consumerIamId : consumerIamId[0];
    const consumerId = await findConsumerByIamId(consumerIamId);
    logger.info("found consumer id " + consumerId);
    req.body.consumerId = consumerId;
    next();
  } catch (err) {
    logger.error("couldn't find consumer id with error " + err);
    next(new UnAuthorizedError("Consumer unauthorized"));
  }
};
