import { Router } from "express";
import identitiesController from "./controllers/identities-controller";
import { validateCreateIdentity } from "./middlewares/validations/create-consumer-identity-validation";

export const publicConsumerRouter = Router();

publicConsumerRouter.post("/identity", [validateCreateIdentity], identitiesController.create);
publicConsumerRouter.post(
  "/identity/resend-recovery",
  validateCreateIdentity,
  identitiesController.generateRecoveryCodeForConsumer,
);
publicConsumerRouter.post("/identity/callme", validateCreateIdentity, identitiesController.callmeRecoveryCode);
