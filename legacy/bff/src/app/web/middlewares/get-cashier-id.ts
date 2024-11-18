import { NextFunction, Request, Response } from "express";
import { UnAuthorizedError } from "../../../domain/errors/unauthorized-error";
import partnerService from "../../../services/partners";
import { CustomLogger } from "../../../services/logger";
const logger = new CustomLogger("get-cashier-id-middleware");
export const getCashierIdentity = async (req: Request, _: Response, next: NextFunction) => {
  try {
    const cashierIamId = req.headers["x-user-iam-id"].toString();
    const { partner_id, cashier_id, partner_name, branch_id } = await partnerService.getCashierProfile(cashierIamId);
    req.body.partnerId = partner_id;
    req.body.cashierId = cashier_id;
    req.body.partnerName = partner_name;
    req.body.branchId = branch_id;
    next();
  } catch (err) {
    logger.error("couldn't find cashier id with error " + err);
    next(new UnAuthorizedError("Cashier unauthorized"));
  }
};
