import { SessionBasketRepositoryInterface } from "../repository/session-basket-repository-interface";
import { SessionBasket, SessionBasketCancelStatuses, SessionBasketStatus } from "../models/session-basket";
import { Product } from "../models/product";
import { NotFoundError } from "../../errors/not-found-error";
import {
  checkoutBasketStatus,
  commercialOffers,
  createCheckoutBasket,
  selectCommercialOffer,
  cancelCheckoutBasket,
  cancelConsumerActiveCheckoutBasket,
  acceptDownPayment,
  getCheckoutBasket,
  triggerSendOtp,
  verifyOtp,
  resendOtp,
  resendOtpViaPhoneCall,
} from "../../../services/checkout";
import { CommercialOffersDto, CreateSessionBasketDto, OrderReviewDto, fromBasket } from "../dtos/session-basket-dto";
import { UUID } from "crypto";
import { ConflictError } from "../../errors/conflict-error";
import { CustomLogger } from "../../../services/logger";
import { BadRequestError } from "../../errors/bad-request-error";
const logger = new CustomLogger("session-basket", "use-case ");

export class SessionBasketUseCases {
  private repo: SessionBasketRepositoryInterface;

  constructor(repo: SessionBasketRepositoryInterface) {
    this.repo = repo;
  }

  async create(dto: CreateSessionBasketDto) {
    try {
      const product = new Product(dto.product);
      const { ...rest } = dto;
      const basket = SessionBasket.create({ ...rest, product });
      const sessionBasket = await this.repo.create(basket);
      logger.debug("session basket created");
      try {
        await createCheckoutBasket(sessionBasket);
        logger.debug("checkout basket created");
      } catch (error) {
        logger.error(`Failed to create checkout basket with error ${error}`);
        sessionBasket.fail();
        await this.repo.fail(sessionBasket);
        throw new BadRequestError(error);
      }
      return sessionBasket;
    } catch (error) {
      logger.error(`Failed to create checkout basket with error ${error}`);
      throw new BadRequestError(error);
    }
  }

  async find(id: UUID): Promise<SessionBasket> {
    const basket = await this.repo.find(id);
    logger.debug("find session basket");
    if (!basket) {
      logger.info(`session basket with id ${id} not found`);
      throw new NotFoundError("basket not found");
    }

    return basket;
  }

  async cancelConsumerActiveCheckout(consumerPhoneNumber: string): Promise<object> {
    try {
      logger.debug("cancel consumer active checkout");
      const response = await cancelConsumerActiveCheckoutBasket(consumerPhoneNumber);
      return response;
    } catch (error) {
      logger.error(`failed to cancel consumer active checkout with error ${error}`);
      return {};
    }
  }

  async commercialOffers(sessionId: UUID, consumerId: UUID): Promise<CommercialOffersDto> {
    logger.debug(`get commercial offers for session basket id ${sessionId}`);
    const basket = await this.find(sessionId);
    if (basket.status !== SessionBasketStatus.CHECKOUT_INITIATED || basket.consumerId !== consumerId) {
      logger.error(`session basket id ${sessionId} not found`);
      throw new NotFoundError("basket not found");
    }

    try {
      return await commercialOffers(sessionId);
    } catch (err) {
      logger.error(`failed to get commercial offers with error ${err}`);
      throw new NotFoundError("commercial offers not found");
    }
  }

  async reviewOrder(sessionId: UUID, consumerId: UUID, selectedCommercialOfferId: UUID): Promise<OrderReviewDto> {
    logger.debug(`get review order for session basket id ${sessionId}`);
    const basket = await this.find(sessionId);
    if (basket.status !== SessionBasketStatus.CHECKOUT_INITIATED || basket.consumerId !== consumerId) {
      throw new NotFoundError("basket not found");
    }

    try {
      const basketCommercialOffers = await commercialOffers(sessionId);
      const selectedCommercialOffer = basketCommercialOffers.offers.find(
        (offer) => offer.id === selectedCommercialOfferId.toString(),
      );
      return {
        sessionBasket: fromBasket(basket),
        selectedCommercialOffer,
      };
    } catch (err) {
      throw new NotFoundError("commercial offer not found");
    }
  }
  async acceptCommercialOffer(
    sessionId: UUID,
    consumerId: UUID,
    selectedCommercialOfferId: UUID,
  ): Promise<OrderReviewDto> {
    const basket = await this.find(sessionId);
    if (basket.consumerId !== consumerId) {
      throw new NotFoundError("basket not found");
    }
    if (basket.status !== SessionBasketStatus.CHECKOUT_INITIATED) {
      throw new ConflictError({ message: basket.status });
    }

    try {
      const selectedCommercialOffer = await selectCommercialOffer(sessionId, selectedCommercialOfferId);
      return {
        sessionBasket: fromBasket(basket),
        selectedCommercialOffer,
      };
    } catch (err) {
      logger.error(`Failed to select commercial offer with error ${err}`);
      throw Error(err.response.data.message);
    }
  }

  async status(sessionId: UUID) {
    const basket = await this.find(sessionId);
    if (basket.status !== SessionBasketStatus.CHECKOUT_INITIATED) return basket.status;

    const checkoutStatus = await checkoutBasketStatus(sessionId);

    if (checkoutStatus.toLowerCase() !== "created") {
      return checkoutStatus;
    }

    return SessionBasketStatus.CHECKOUT_INITIATED;
  }

  async getCheckoutBasketStatus(sessionId: UUID) {
    try {
      const result = await checkoutBasketStatus(sessionId);
      return result;
    } catch (error) {
      logger.error(`Failed to get checkout basket status with error ${error}`);
    }
  }

  async cancelByCashier(
    sessionId: UUID,
    status: SessionBasketCancelStatuses,
    consumerId: UUID,
  ): Promise<SessionBasketStatus> {
    const basket = await this.find(sessionId);
    const hasCheckoutBasket = basket.status === SessionBasketStatus.CHECKOUT_INITIATED;
    basket.cancelByCashier(status as unknown as SessionBasketStatus, consumerId);
    if (hasCheckoutBasket) {
      await cancelCheckoutBasket(basket.id, status);
    }
    this.repo.cancelByCashier(basket);

    return basket.status;
  }

  async acceptDownPayment(sessionId: UUID, cashierId: UUID) {
    const basket = await this.find(sessionId);
    const hasCheckoutBasket = basket.status === SessionBasketStatus.CHECKOUT_INITIATED;
    const canCashierAcceptDownPayment = basket.cashierId === cashierId;
    if (hasCheckoutBasket && canCashierAcceptDownPayment) {
      try {
        await acceptDownPayment(basket.id);
      } catch (error) {
        logger.error(`Failed to accept down payment with error ${error}`);
        throw Error(error.message);
      }
    } else {
      throw new NotFoundError("basket not found");
    }
  }
  async getDownPayment(sessionId: UUID): Promise<number> {
    const basket = await this.find(sessionId);
    if (basket.status !== SessionBasketStatus.CHECKOUT_INITIATED) {
      throw new NotFoundError("basket not found");
    }

    const checkoutBasket = await getCheckoutBasket(basket.id);

    if (!checkoutBasket.selected_commercial_offer_id) {
      throw new NotFoundError("basket not found");
    }

    const selectedOffer = checkoutBasket.commercial_offers.find(
      (offer) => offer.id === checkoutBasket.selected_commercial_offer_id,
    );

    return selectedOffer.admin_fee.units + selectedOffer.down_payment.units;
  }
  async triggerSendOtp(sessionId: UUID): Promise<string> {
    const basket = await this.find(sessionId);
    const hasCheckoutBasket = basket.status === SessionBasketStatus.CHECKOUT_INITIATED;
    if (hasCheckoutBasket) {
      const phone = await triggerSendOtp(basket.id);
      return phone;
    } else {
      throw new NotFoundError("basket not found");
    }
  }

  async verifyOtp(sessionId: UUID, otp: string): Promise<string> {
    const basket = await this.find(sessionId);
    const hasCheckoutBasket = basket.status === SessionBasketStatus.CHECKOUT_INITIATED;
    if (hasCheckoutBasket) {
      try {
        const status = await verifyOtp(basket.id, otp);
        return status;
      } catch (error) {
        logger.error(`Failed to verify otp with error ${error}`);
        throw Error(error.message);
      }
    } else {
      throw new NotFoundError("basket not found");
    }
  }

  async resendOtp(sessionId: UUID): Promise<string> {
    const basket = await this.find(sessionId);
    const hasCheckoutBasket = basket.status === SessionBasketStatus.CHECKOUT_INITIATED;
    if (hasCheckoutBasket) {
      const phone = await resendOtp(basket.id);
      return phone;
    } else {
      throw new NotFoundError("basket not found");
    }
  }

  async resendOtpViaPhoneCall(sessionId: UUID): Promise<string> {
    const basket = await this.find(sessionId);
    const hasCheckoutBasket = basket.status === SessionBasketStatus.CHECKOUT_INITIATED;
    if (hasCheckoutBasket) {
      const phone = await resendOtpViaPhoneCall(basket.id);
      return phone;
    } else {
      throw new NotFoundError("basket not found");
    }
  }
}
