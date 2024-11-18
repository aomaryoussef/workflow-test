import { NextFunction, Request, Response } from "express";
import { ConsumerUseCases } from "../../../../domain/consumer/use-cases/consumer-user-cases";
import { baseResponse } from "../../base-response";
import { UnAuthorizedError } from "../../../../domain/errors/unauthorized-error";
import { UUID } from "crypto";
import { CustomLogger } from "../../../../services/logger";
const logger = new CustomLogger("consumer", "controller");

const find = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone_number } = req.params;
    const consumerDto = await new ConsumerUseCases().findConsumerByPhoneNumber(phone_number);
    res.send(baseResponse(consumerDto));
  } catch (err) {
    logger.error(`find consumer - ${err}`);
    next(err);
  }
};

/**
 * API endpoint for getting basic consumer information.
 * @async
 * @throws Will throw an error if the retrieval process fails.
 */
const getConsumerBasicInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone_number } = req.params;
    logger.debug(`getConsumerBasicInfo - for phone number ${phone_number}`);
    const consumerBasicInfoDto = await new ConsumerUseCases().getConsumerBasicInfoByPhoneNumber(phone_number);
    res.send(baseResponse(consumerBasicInfoDto));
  } catch (err) {
    logger.error(`getConsumerBasicInfo - ${err}`);
    next(err);
  }
};

const getConsumersCreditLimits = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { consumerId } = req.body;
    const requestedConsumerId = req.params.consumer_id as UUID;
    logger.debug(`getConsumersCreditLimits - for consumer id ${requestedConsumerId}`);
    if (consumerId !== requestedConsumerId) {
      logger.error(`getConsumersCreditLimits - consumer id doesn't match logged in consumer`);
      throw new UnAuthorizedError("Cannot get consumers credit limit");
    }
    const consumersCreditLimit = await new ConsumerUseCases().getConsumerCreditLimits(requestedConsumerId);
    logger.debug(`getConsumersCreditLimits - return consumer credit limits for id ${requestedConsumerId}`);
    res.send(baseResponse(consumersCreditLimit));
  } catch (err) {
    next(err);
  }
};
const getConsumerLoans = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { consumerId } = req.body;
    const status = req.query.status as string;
    const statuses = status.split(",");
    const requestedConsumerId = req.params.consumer_id as UUID;
    logger.debug(`getConsumerLoans - for consumer id ${requestedConsumerId}`);
    if (consumerId !== requestedConsumerId) {
      logger.error(`getConsumerLoans -  consumer id doesn't match logged in consumer`);
      throw new UnAuthorizedError("Cannot get consumers loans");
    }
    const response = await new ConsumerUseCases().getConsumerLoans(requestedConsumerId, statuses);
    logger.debug(`getConsumerLoans - got loans`);
    res.send(baseResponse(response));
  } catch (err) {
    next(err);
  }
};
const getConsumerLoanDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info("getConsumerLoanDetails - get consumer loan details");
    const { consumerId } = req.body;
    const loanId = req.query.loanId as string;
    const installmentId = req.query.installmentId as string;
    const requestedConsumerId = req.params.consumer_id as UUID;
    if (consumerId !== requestedConsumerId) {
      logger.error(`getConsumerLoanDetails -  consumer id doesn't match logged in consumer`);
      throw new UnAuthorizedError("Cannot get consumers loans");
    }
    const loanDetails = await new ConsumerUseCases().getConsumerLoanDetails(requestedConsumerId, loanId, installmentId);
    logger.debug(`getConsumerLoanDetails - got loans`);
    res.send(baseResponse(loanDetails[0]));
  } catch (err) {
    logger.error(`failed to get loan details ${err}`);
    next(err);
  }
};

export default { find, getConsumerBasicInfo, getConsumersCreditLimits, getConsumerLoans, getConsumerLoanDetails };
