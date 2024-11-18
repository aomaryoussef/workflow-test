import { ValidationError } from "../../domain/errors/validation-error";
import { NotFoundError } from "../../domain/errors/not-found-error";
import { NextFunction, Request, Response } from "express";
import { ConflictError } from "../../domain/errors/conflict-error";
import { UnAuthorizedError } from "../../domain/errors/unauthorized-error";
import { BadRequestError } from "../../domain/errors/bad-request-error";
import { config } from "../../../config";
// eslint-disable-next-line
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ValidationError) {
    return res.status(422).send({
      message: "Invalid Data",
      errors: err.errors,
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).send({
      message: err.message,
    });
  }

  if (err instanceof ConflictError) {
    console.log(err);
    return res.status(409).send({
      message: err.message,
      phone_number: err.phone_number,
      identity_conflict: err.identity_conflict,
      mc_conflict: err.mc_conflict,
      password_created: err.password_created,
    });
  }
  if (err instanceof BadRequestError) {
    return res.status(400).send({ message: err.message });
  }
  if (err instanceof UnAuthorizedError) {
    return res.status(401).send({ message: err.message });
  }
  const addStackToResponse = config.environment === "development";
  const serverErrorResponse = addStackToResponse
    ? { message: err.message, stack: err.stack }
    : { message: err.message };
  res.status(500).send(serverErrorResponse);
};
