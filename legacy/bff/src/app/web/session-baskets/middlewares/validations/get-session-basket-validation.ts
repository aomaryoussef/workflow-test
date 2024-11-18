import { object, string } from "yup";
import { ValidationError } from "../../../../../domain/errors/validation-error";
import { NextFunction, Request, Response } from "express";

const validationSchema = object({
  id: string().uuid().required(),
});

export const validateGetSessionBasket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await validationSchema.validate(req.params, { abortEarly: false });
    next();
  } catch (err) {
    next(new ValidationError(err.errors));
  }
};
