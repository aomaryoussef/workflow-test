import express from "express";
import backOfficeController from "./controllers/back-office-controller";
import {
  getCreatePartner,
  postCreatePartner,
  getCreateStore,
  postBranchForPartner,
  getSuccessPopup,
} from "./controllers/create-partner-controller";
import { activateAccountValidation, createPartnerValidations } from "./middlewares/validations/createPartnerValidation";
import { createBranchErrorHandler, createPartnerErrorHandler } from "./middlewares/errors/createPartnerErrorHandler";
import { createPartnerCashier } from "./controllers/create-partner-cashier-controller";
import { canUserDo } from "../middlewares/authorization";
import repaymentController from "./controllers/repayment-controller";
import { createStoreValidations } from "./middlewares/validations/createStoreValidation";

export const privateBackOfficeRouter = express.Router();

privateBackOfficeRouter.get("/logout", backOfficeController.logout);

privateBackOfficeRouter.get("/consumer", canUserDo("searchConsumers"), backOfficeController.searchConsumerData);

privateBackOfficeRouter.get(
  "/activate-consumer-account",
  canUserDo("printConsumerDocuments"),
  backOfficeController.activateConsumer,
);
privateBackOfficeRouter.post("/printDocument", canUserDo("printConsumerDocuments"), backOfficeController.printDocument);
privateBackOfficeRouter.post(
  "/activate-consumer-account",
  canUserDo("printConsumerDocuments"),
  activateAccountValidation,
  backOfficeController.searchConsumerData,
);
privateBackOfficeRouter.post(
  "/update-consumer-account",
  canUserDo("activateConsumer"),
  backOfficeController.activateConsumerCredit,
);

privateBackOfficeRouter.get("/create-partner", canUserDo("searchPartners"), getCreatePartner);
privateBackOfficeRouter.post(
  "/create-partner",
  canUserDo("createPartner"),
  createPartnerValidations,
  postCreatePartner,
  createPartnerErrorHandler,
);

privateBackOfficeRouter.get("/create-store", canUserDo("searchPartners"), getCreateStore);
privateBackOfficeRouter.post(
  "/create-store",
  canUserDo("createPartner"),
  createStoreValidations,
  postBranchForPartner,
  createBranchErrorHandler,
);
privateBackOfficeRouter.get("/create-store-success", canUserDo("createPartner"), getSuccessPopup);

privateBackOfficeRouter.get("/create-partner-cashier", canUserDo("createPartner"), createPartnerCashier);

privateBackOfficeRouter.get("/repay", canUserDo("searchCollections"), repaymentController.repay);
privateBackOfficeRouter.get("/repay/search-consumer", canUserDo("searchCollections"), repaymentController.repaySearch);
privateBackOfficeRouter.get("/repay/get-loans", canUserDo("searchCollections"), repaymentController.repayGetLoans);
privateBackOfficeRouter.post("/repay/pay-installment", canUserDo("makeCollection"), repaymentController.payInstallment);
privateBackOfficeRouter.post("/repay/early-pay", canUserDo("makeCollection"), repaymentController.payInstallment);

privateBackOfficeRouter.get(
  "/repay-activate",
  canUserDo("searchCollections"),
  canUserDo("activateConsumer"),
  backOfficeController.repayOrActivate,
);

privateBackOfficeRouter.get("/tech-support", backOfficeController.techSupport);

privateBackOfficeRouter.get("/default-url", backOfficeController.defaultUrl);
