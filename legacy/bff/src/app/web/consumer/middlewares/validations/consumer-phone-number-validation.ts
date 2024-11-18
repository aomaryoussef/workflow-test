import { object, string } from "yup";
import { ValidationError } from "../../../../../domain/errors/validation-error";
import { NextFunction, Request, Response } from "express";

const validationSchema = object({
  phone_number: string().required().matches(
    /^(0|\+20|0020)[1-9]{1}[0-9]{9}$/,
    'Invalid phone number format. It should be in one of the following formats: 0xxxxxxxxxx, +20xxxxxxxxxx or 0020xxxxxxxxxx'
  ),
});

export const validatePhoneNumber = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await validationSchema.validate(req.params, { abortEarly: false });
    next();
  } catch (err) {
    next(new ValidationError(err.errors));
  }
};