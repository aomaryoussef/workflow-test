import { NextFunction, Request, Response } from "express";
import { IdentityUseCases } from "../../../../domain/consumer/use-cases/identity-use-cases";
import { baseResponse } from "../../base-response";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone_number, ssn } = req.body;
    const identityResponse = await new IdentityUseCases().createConsumerIdentity(phone_number, ssn);
    res.send(baseResponse(identityResponse));
  } catch (err) {
    next(err);
  }
};
const generateRecoveryCodeForConsumer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const identityResponse = await new IdentityUseCases().generateRecoveryCodeForConsumer(req.body.phone_number);
    res.send(baseResponse(identityResponse));
  } catch (err) {
    next(err);
  }
};

const callmeRecoveryCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const identityResponse = await new IdentityUseCases().generateRecoveryCodeForConsumerViaPhoneCall(
      req.body.phone_number,
    );
    res.send(baseResponse(identityResponse));
  } catch (err) {
    next(err);
  }
};

export default { create, generateRecoveryCodeForConsumer, callmeRecoveryCode };
