import { object, string } from "yup";
import { ValidationError } from "../../../../../domain/errors/validation-error";
import { NextFunction, Request, Response } from "express";

const validationSchema = object({
  phone_number: string().required(),
});

export const validateCreateIdentity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await validationSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (err) {
    next(new ValidationError(err.errors));
  }
};
