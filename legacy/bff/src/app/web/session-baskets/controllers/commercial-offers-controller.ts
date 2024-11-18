import { NextFunction, Request, Response } from "express";
import { UUID } from "crypto";
import { SessionBasketUseCases } from "../../../../domain/session-basket/use-cases/session-basket-use-cases";
import SessionBasketRepository from "../../../../domain/session-basket/repository/session-basket-repository";
import { baseResponse } from "../../base-response";

const getCommercialOffers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {consumerId} = req.body
    const { id } = req.params;
    const repo = new SessionBasketRepository();
    const offers = await new SessionBasketUseCases(repo).commercialOffers(id as UUID, consumerId);
    res.send(baseResponse(offers));
  } catch (err) {
    next(err);
  }
};

const reviewOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {consumerId} = req.body
    const sessionId = req.body.session_id as UUID;
    const selectedOfferId = req.body.selected_offer_id as UUID;
    const repo = new SessionBasketRepository();
    const review = await new SessionBasketUseCases(repo).reviewOrder(sessionId, consumerId, selectedOfferId);
    res.send(baseResponse(review));
  } catch (err) {
    next(err);
  }
};
const acceptCommercialOffer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {consumerId} = req.body
    const sessionId = req.body.session_id as UUID;
    const selectedOfferId = req.body.selected_offer_id as UUID;
    const repo = new SessionBasketRepository();
    const review = await new SessionBasketUseCases(repo).acceptCommercialOffer(sessionId, consumerId, selectedOfferId);
    res.send(baseResponse(review));
  } catch (err) {
    next(err);
  }
};

export default { getCommercialOffers, reviewOrder, acceptCommercialOffer };
