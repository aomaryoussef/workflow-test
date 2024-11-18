import { object, string } from "yup";
import { ValidationError } from "../../../../../domain/errors/validation-error";
import { NextFunction, Request, Response } from "express";
const validationSchema = object().shape({
  loanId: string()
    .required(),
  installmentId: string().required(),
});
export const validateGetLoanDetails = async (req: Request, _: Response, next: NextFunction) => {
  try {
    validationSchema.validateSync(req.query, { abortEarly: true });
    next();
  } catch (err) {
    next(new ValidationError(err.errors));
  }
};
