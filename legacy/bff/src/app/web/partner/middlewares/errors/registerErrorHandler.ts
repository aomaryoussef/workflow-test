import { Request, Response, NextFunction } from "express";

export const registerErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.message);
  res.status(500).render("./shared/failure-alert", { title: err.message });
};
