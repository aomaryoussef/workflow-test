import { object, string } from "yup";
import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../../../../../domain/errors/validation-error";

const validationSchema = object({
  selected_offer_id: string().uuid().required(),
  session_id: string().uuid().required(),
});

export const validateReviewOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await validationSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (err) {
    next(new ValidationError(err.errors));
  }
};
