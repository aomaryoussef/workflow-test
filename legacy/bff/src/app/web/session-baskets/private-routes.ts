import { Router } from "express";
import sessionBasketController from "./controllers/session-basket-controller";
import { validateCreateSessionBasket } from "./middlewares/validations/create-session-basket-validation";
import commercialOffersController from "./controllers/commercial-offers-controller";
import { validateReviewOrder } from "./middlewares/validations/review-order-validation";
import { validateGetSessionBasket } from "./middlewares/validations/get-session-basket-validation";
import { getConsumerIdentity } from "../middlewares/get-consumer-id";
import { getCashierIdentity } from "../middlewares/get-cashier-id";

export const privateSessionBasketRouter = Router();

privateSessionBasketRouter.post("/", [validateCreateSessionBasket, getCashierIdentity], sessionBasketController.create);
privateSessionBasketRouter.get("/:id", validateGetSessionBasket, sessionBasketController.find);
privateSessionBasketRouter.get("/:id/status", sessionBasketController.status);
privateSessionBasketRouter.get(
  "/:id/commercial-offers",
  getConsumerIdentity,
  commercialOffersController.getCommercialOffers,
);
privateSessionBasketRouter.post(
  "/review-order",
  [validateReviewOrder, getConsumerIdentity],
  commercialOffersController.reviewOrder,
);
privateSessionBasketRouter.post(
  "/accept-commercial-offer",
  [validateReviewOrder, getConsumerIdentity],
  commercialOffersController.acceptCommercialOffer,
);
privateSessionBasketRouter.post("/:id/cancel-by-cashier", getCashierIdentity, sessionBasketController.cancelByCashier);
privateSessionBasketRouter.post(
  "/:id/accept-down-payment",
  getCashierIdentity,
  sessionBasketController.acceptDownPayment,
);
privateSessionBasketRouter.get("/:id/down-payment", sessionBasketController.getDownPayment);
