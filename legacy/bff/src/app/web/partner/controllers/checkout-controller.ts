import { Request, Response } from "express";
import { validationResult } from "express-validator";
import partnerUsersService from "../../../../services/partner-users";
import { SessionBasketUseCases } from "../../../../domain/session-basket/use-cases/session-basket-use-cases";
import SessionBasketRepository from "../../../../domain/session-basket/repository/session-basket-repository";
import { UUID } from "crypto";
import {
  SessionBasketCancelStatuses,
  SessionBasketStatus,
} from "../../../../domain/session-basket/models/session-basket";
import { CustomLogger } from "../../../../services/logger";
import { getConsumerBasicInfoByPhoneNumber } from "../../../../services/consumer";
import { getBasketTransactionId } from "../../../../services/hasura";

const logger = new CustomLogger("checkout");

export const initCheckout = async (req: Request, res: Response) => {
  const userIamId = req.headers["x-user-iam-id"].toString();
  logger.debug("start checkout");
  const userProfile = await partnerUsersService.getUserProfileByIamId(userIamId);
  res.render("./screens/checkout/index", {
    title: "عملية شراء جديدة",
    logoutUrl: "/private/partner/logout",
    layout: "layout/internal-wizard",
    userInfo: {
      userInitials: `${userProfile?.first_name[0]}.${userProfile?.last_name[0]}`,
      userTag: `${userProfile?.first_name} ${userProfile?.last_name}`,
      userSubTag: userProfile?.phone_number.slice(2),
    },
  });
};

export const checkoutSearchConsumer = async (req: Request, res: Response) => {
  // This function will search for a consumer info as well as any active basket sessions, if any were found, basket sessions will be canceled
  // and a new checkout process will initiate
  const consumerPhoneNumber = req.body.phoneNumber;
  logger.debug("checkout search consumer");
  let consumerInfo = null;
  try {
    consumerInfo = await getConsumerBasicInfoByPhoneNumber(consumerPhoneNumber);
  } catch (error) {
    return res.status(404).send();
  }

  const sessionBasketRepository = new SessionBasketRepository();
  const sessionBasketUseCase = new SessionBasketUseCases(sessionBasketRepository);
  try {
    await sessionBasketUseCase.cancelConsumerActiveCheckout(consumerPhoneNumber);
  } catch (error) {
    logger.error(`failed to cancel consumer active checkouts ${error}`);
  } finally {
    res.json(consumerInfo);
  }
};

export const checkoutAddProduct = async (req: Request, res: Response) => {
  logger.debug("add product");
  const { consumerId, partnerId, branchId, cashierId, partnerName } = req.body;
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    logger.debug("validation errors");
    res.status(400).json(validationErrors.mapped());
  }
  const product = { name: req.body.productName, price: parseInt(req.body.productPrice) * 100 };
  const repo = new SessionBasketRepository();
  const sessionBasketUseCase = new SessionBasketUseCases(repo);

  try {
    logger.debug(`create session basket`);
    const sessionBasket = await sessionBasketUseCase.create({
      partnerId,
      cashierId,
      branchId,
      consumerId,
      partnerName,
      product,
    });
    res.json({
      checkoutSessionId: sessionBasket.id,
      partnerId: sessionBasket.partnerId,
      branchId: sessionBasket.branchId,
      cashierId: sessionBasket.cashierId,
      consumerId: sessionBasket.consumerId,
      partnerName: sessionBasket.partnerName,
    });
    logger.debug(`session basket created with id ${sessionBasket.id}`);
  } catch (error) {
    logger.error(error);
    res.status(400).json({
      error: "لقد حدث خطا في النظام والعمليه لم تتم حاول مره اخرى",
    });
  }
};

export const checkoutGetCommercialOffers = async (req: Request, res: Response) => {
  const sessionBasketId = req.query.checkoutSessionId as UUID;
  const consumerId = req.query.consumerId as UUID;
  const repo = new SessionBasketRepository();
  logger.debug(`get commercial offers for session basket id ${sessionBasketId}`);
  const sessionBasketUseCase = new SessionBasketUseCases(repo);
  try {
    const sessionStatus = await sessionBasketUseCase.status(sessionBasketId);
    if (sessionStatus == SessionBasketStatus.CHECKOUT_INITIATED) {
      res.json({ status: SessionBasketStatus.CHECKOUT_INITIATED });
    } else {
      const offers = await sessionBasketUseCase.commercialOffers(sessionBasketId, consumerId);
      res.json({ status: SessionBasketStatus.CHECKOUT_INITIATED, offers: offers.offers });
    }
  } catch (error) {
    logger.error(error);
    res.status(400).json({
      error: "لقد حدث خطا في النظام والعمليه لم تتم حاول مره اخرى",
    });
  }
};

export const checkoutSendOTP = async (req: Request, res: Response) => {
  const sessionBasketId = req.body.checkoutSessionId as UUID;
  const consumerId = req.body.consumerId as UUID;
  const commercialOfferId = req.body.commercialOfferId as UUID;

  try {
    const repo = new SessionBasketRepository();
    const sessionBasketUseCase = new SessionBasketUseCases(repo);
    await sessionBasketUseCase.acceptCommercialOffer(sessionBasketId, consumerId, commercialOfferId);
    const result = await sessionBasketUseCase.triggerSendOtp(sessionBasketId);
    res.json({
      phoneNumber: result,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: error.message,
    });
  }
};

export const checkoutResendOtp = async (req: Request, res: Response) => {
  const sessionBasketId = req.body.checkoutSessionId as UUID;
  try {
    const repo = new SessionBasketRepository();
    const sessionBasketUseCase = new SessionBasketUseCases(repo);
    const status = await sessionBasketUseCase.resendOtp(sessionBasketId);
    if (status != "") {
      res.send({});
    } else {
      res.status(400).json({
        message: "لقد حدث خطا في النظام والعمليه لم تتم حاول مره اخرى أثناء الارسال",
      });
    }
  } catch (e) {
    res.status(400).json({
      message: "لقد حدث خطا في النظام والعمليه لم تتم حاول مره اخرى أثناء الارسال",
    });
  }
};

export const checkoutResendOtpViaPhoneCall = async (req: Request, res: Response) => {
  const sessionBasketId = req.body.checkoutSessionId as UUID;
  try {
    const repo = new SessionBasketRepository();
    const sessionBasketUseCase = new SessionBasketUseCases(repo);
    const status = await sessionBasketUseCase.resendOtpViaPhoneCall(sessionBasketId);
    if (status != "") {
      res.send({});
    } else {
      res.status(400).json({
        message: "لقد حدث خطا في النظام والعمليه لم تتم حاول مره اخرى أثناء الارسال",
      });
    }
  } catch (e) {
    res.status(400).json({
      message: "لقد حدث خطا في النظام والعمليه لم تتم حاول مره اخرى أثناء الارسال",
    });
  }
};

export const checkoutVerifyOtp = async (req: Request, res: Response) => {
  const sessionBasketId = req.body.checkoutSessionId as UUID;
  const otp = req.body.otp;
  try {
    const repo = new SessionBasketRepository();
    const sessionBasketUseCase = new SessionBasketUseCases(repo);
    const status = await sessionBasketUseCase.verifyOtp(sessionBasketId, otp);
    if (status == "VERIFIED") {
      res.send({});
    } else {
      res.status(400).send({ message: "لقد حدث خطا في النظام والعمليه لم تتم حاول مره اخرى" });
    }
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
};

export const feesCollection = async (req: Request, res: Response) => {
  const sessionBasketId = req.body.checkoutSessionId as UUID;
  const cashierId = req.body.cashierId as UUID;
  try {
    const repo = new SessionBasketRepository();
    const sessionBasketUseCase = new SessionBasketUseCases(repo);
    await sessionBasketUseCase.acceptDownPayment(sessionBasketId, cashierId);

    res.send({});
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
};

export const cancelCheckout = async (req: Request, res: Response) => {
  try {
    const repo = new SessionBasketRepository();
    const sessionBasketUseCase = new SessionBasketUseCases(repo);
    await sessionBasketUseCase.cancelByCashier(
      req.query.session_id as UUID,
      SessionBasketCancelStatuses.CANCELLED_BY_CASHIER,
      req.body.cashierId as UUID,
    );
  } catch (e) {
    logger.error(e.message);
    return;
  } finally {
    res.redirect("/private/partner/checkout");
  }
};

export const checkoutGetStatus = async (req: Request, res: Response) => {
  const sessionBasketId = req.query.checkoutSessionId as UUID;
  const repo = new SessionBasketRepository();
  const sessionBasketUseCase = new SessionBasketUseCases(repo);
  try { 
    const sessionStatus = await sessionBasketUseCase.getCheckoutBasketStatus(sessionBasketId);
    const transactionId = await getBasketTransactionId(sessionBasketId);
    res.json({ status: sessionStatus, transactionId: transactionId });
  } catch (error) {
    logger.error(error);
    res.status(400).json({
      error: "لقد حدث خطا في النظام والعمليه لم تتم حاول مره اخرى",
    });
  }
};
