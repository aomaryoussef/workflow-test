import { NextFunction, Request, Response } from "express";
import { CustomLogger } from "../../../services/logger";
import { isPartnerUser, isUserInGroup, canUserDoAction } from "../../../services/keto";
import { UnAuthorizedError } from "../../../domain/errors/unauthorized-error";
import partnerUsersService from "../../../services/partner-users";
import { BadRequestError } from "../../../domain/errors/bad-request-error";

const logger = new CustomLogger("authorization");

export const techSupport = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let userIamId = req.headers["x-user-iam-id"]?.toString();
      const isUserTechSupport = await isUserInGroup("techSupport", userIamId);
      req.headers["x-user-iam-id"] = userIamId;
      if (isUserTechSupport) {
        // access request query parameters to get user_iam_id
        userIamId = req.query.user_iam_id.toString();
        // if userIamId is not provided in query parameters, then throw error
        if (!userIamId) {
          next(new BadRequestError("user_iam_id is required"));
        } else {
          // set the user_iam_id in headers
          req.headers["x-user-iam-id"] = userIamId;
          return next();
        }
      } else {
        return next();
      }
    } catch (err) {
      logger.error("Couldn't intercept tech support request with error " + err);
      next(new BadRequestError("Couldn't intercept tech support request with error"));
    }
  };
};

export const partnerUser = (...relations: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userIamId = req.headers["x-user-iam-id"]?.toString();
      const userProfile = await partnerUsersService.getUserProfileByIamId(userIamId);
      if (!userProfile) {
        return next(new UnAuthorizedError("Unauthorized"));
      }
      for (const relation of relations) {
        const result = await isPartnerUser(userProfile.partner_id, userIamId, relation);
        if (result) {
          return next();
        }
      }
      next(new UnAuthorizedError("Unauthorized"));
    } catch (err) {
      logger.error("couldn't get authorization with error " + err);
      next(new UnAuthorizedError("Unauthorized"));
    }
  };
};

export const UserInGroup = (group: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userIamId = req.headers["x-user-iam-id"]?.toString();
      const result = await isUserInGroup(group, userIamId);
      if (result) {
        return next();
      } else {
        next(new UnAuthorizedError("Unauthorized"));
      }
    } catch (err) {
      logger.error("couldn't get authorization with error " + err);
      next(new UnAuthorizedError("Unauthorized"));
    }
  };
};

export const canUserDo = (action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userIamId = req.headers["x-user-iam-id"]?.toString();
      const result = await canUserDoAction(userIamId, action);
      if (result) {
        return next();
      } else {
        next(new UnAuthorizedError("Unauthorized"));
      }
    } catch (err) {
      logger.error("couldn't get authorization with error " + err);
      next(new UnAuthorizedError("Unauthorized"));
    }
  };
};
