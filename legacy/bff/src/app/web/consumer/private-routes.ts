import { Router } from "express";
import consumersController from "./controllers/consumers-controller";
import scoringController from "./controllers/scoring-controller";
import { getConsumerIdentity } from "../middlewares/get-consumer-id";
import { validateGetConsumerLoans } from "./middlewares/validations/get-consumer-loans-validation";
import { getCashierIdentity } from "../middlewares/get-cashier-id";
import { validatePhoneNumber } from "./middlewares/validations/consumer-phone-number-validation";
import { validateGetLoanDetails } from "./middlewares/validations/get-loan-details-validation";
import branchesController from "../static/controllers/branches-controller";

export const privateConsumerRouter = Router();

privateConsumerRouter.get("/branches", branchesController.index);
privateConsumerRouter.get("/:phone_number", consumersController.find);
privateConsumerRouter.get(
  "/basic-info/:phone_number",
  [validatePhoneNumber, getCashierIdentity],
  consumersController.getConsumerBasicInfo,
);
privateConsumerRouter.get(
  "/credit-limits/:consumer_id",
  getConsumerIdentity,
  consumersController.getConsumersCreditLimits,
);
privateConsumerRouter.get(
  "/loans/:consumer_id",
  [validateGetConsumerLoans, getConsumerIdentity],
  consumersController.getConsumerLoans,
);
privateConsumerRouter.post("/scoring", scoringController.getConsumerScoringData);
privateConsumerRouter.get(
  "/loan-details/:consumer_id",
  [validateGetLoanDetails, getConsumerIdentity],
  consumersController.getConsumerLoanDetails,
);
