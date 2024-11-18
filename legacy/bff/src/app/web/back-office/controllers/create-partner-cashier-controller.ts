import { Request, Response, NextFunction } from "express";
import partnerService from "../../../../services/partners";

export const createPartnerCashier = async (_req: Request, res: Response, next: NextFunction) => {
  const partners = await partnerService.getPartners();
  try {
    res.render("./screens/create-partner-cashier", {
      title: "تسجيل كاشير",
      errors: [],
      partners,
      layout: "layout/empty-screens",
      logoutUrl: "/private/back-office/logout",
    });
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
};
