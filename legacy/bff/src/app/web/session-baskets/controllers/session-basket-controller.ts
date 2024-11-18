import { NextFunction, Request, Response } from "express";
import { decamelizeKeys } from "humps";
import { UUID } from "crypto";
import { config } from "../../../../../config";
import SessionBasketRepository from "../../../../domain/session-basket/repository/session-basket-repository";
import { SessionBasketUseCases } from "../../../../domain/session-basket/use-cases/session-basket-use-cases";
import { CreateSessionBasketDto, fromBasket } from "../../../../domain/session-basket/dtos/session-basket-dto";
import { SessionBasketCancelStatuses } from "../../../../domain/session-basket/models/session-basket";
import { baseResponse } from "../../base-response";
import { CustomLogger } from "../../../../services/logger";
const logger = new CustomLogger("session-basket-controller");
const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cashierId, partnerId, branchId, partnerName } = req.body;
    const dto: CreateSessionBasketDto = {
      partnerName,
      partnerId,
      branchId,
      cashierId,
      consumerId: req.body.consumer_id,
      product: { name: req.body.product_name, price: Number(req.body.product_price) },
    };
    const repo = new SessionBasketRepository();
    logger.debug("create session basket");
    const { id } = await new SessionBasketUseCases(repo).create(dto);
    logger.debug("session basket created");
    res.send({ id: id, expiry_duration: config.basketTimeout });
  } catch (err) {
    logger.error(`failed to create session basket ${err}`);
    next(err);
  }
};

const find = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const repo = new SessionBasketRepository();
    const basket = await new SessionBasketUseCases(repo).find(id as UUID);
    res.send(decamelizeKeys(fromBasket(basket)));
  } catch (err) {
    logger.error(`failed to get session basket ${err}`);
    next(err);
  }
};

const status = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const repo = new SessionBasketRepository();
    const status = await new SessionBasketUseCases(repo).status(id as UUID);
    res.send({ status });
  } catch (err) {
    next(err);
  }
};

const cancelByCashier = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { cashierId } = req.body;
    const repo = new SessionBasketRepository();
    const status = await new SessionBasketUseCases(repo).cancelByCashier(
      id as UUID,
      SessionBasketCancelStatuses.CANCELLED_BY_CASHIER,
      cashierId,
    );

    res.send(baseResponse({ status }));
  } catch (err) {
    next(err);
  }
};
const acceptDownPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { cashierId } = req.body;
    const repo = new SessionBasketRepository();
    await new SessionBasketUseCases(repo).acceptDownPayment(id as UUID, cashierId);
    res.send(baseResponse({ status: "DOWN_PAYMENT_ACCEPTED" }));
  } catch (err) {
    next(err);
  }
};

const getDownPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const repo = new SessionBasketRepository();
    const downPayment = await new SessionBasketUseCases(repo).getDownPayment(id as UUID);
    res.send(baseResponse({ downPayment }));
  } catch (err) {
    next(err);
  }
};

export default {
  create,
  find,
  status,
  cancelByCashier,
  acceptDownPayment,
  getDownPayment,
};
