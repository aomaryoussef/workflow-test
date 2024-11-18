import { Request, Response } from "express";

export const createPartnerErrorHandler = (err: Error, req: Request, res: Response) => {
  console.error(err.message);
  res.status(500).render("./screens/create-partner-failure", { title: err.message });
};

export const createBranchErrorHandler = (err: Error, req: Request, res: Response) => {
  console.error(err.message);
  res.status(500).render("./screens/create-partner-failure", { title: err.message });
};
