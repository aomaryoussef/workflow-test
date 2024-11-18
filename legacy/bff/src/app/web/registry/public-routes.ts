import express from "express";
import receiptsController from "./controllers/receipts-controller";

export const publicRegistryRouter = express.Router();

publicRegistryRouter.get("/receipts/:paymentId", receiptsController.getReceipt);
