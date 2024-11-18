import { object, string } from "yup";
import { ValidationError } from "../../../../../domain/errors/validation-error";
import { NextFunction, Request, Response } from "express";
import { InstallmentStatuses } from "../../../../../domain/consumer/models/installment";
const enumKeys = Object.values(InstallmentStatuses) as string[];
const isValidStatus = (value: string) => enumKeys.includes(value.toUpperCase());
const validationSchema = object().shape({
  status: string()
    .required()
    .test(
      "status",
      `Invalid installment status expected one of these values ${enumKeys.join(",")}`,
      (value) => value && value.split(",").every(isValidStatus),
    ),
});
export const validateGetConsumerLoans = async (req: Request, _: Response, next: NextFunction) => {
  try {
    validationSchema.validateSync(req.query, { abortEarly: true });
    next();
  } catch (err) {
    next(new ValidationError(err.errors));
  }
};
