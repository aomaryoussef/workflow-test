import { object, string, number } from "yup";
import { ValidationError } from "../../../../../domain/errors/validation-error";
import { NextFunction, Request, Response } from "express";
const maxPrice = 999_999_99;
const validationSchema = object({
  product_name: string().trim().required().max(50).min(3),
  product_price: number().integer().required().positive().max(maxPrice),
  consumer_id: string().trim().required().max(36).min(36),
});

export const validateCreateSessionBasket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await validationSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (err) {
    next(new ValidationError(err.errors));
  }
};
