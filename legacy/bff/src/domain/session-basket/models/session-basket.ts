import { UUID, randomInt } from "crypto";
import { Product } from "./product";
import { NotFoundError } from "../../errors/not-found-error";
import { config } from "../../../../config";
import { ConflictError } from "../../errors/conflict-error";

export enum SessionBasketCancelStatuses {
  CANCELLED_BY_CASHIER = "CANCELLED_BY_CASHIER",
  CANCELLED_BY_CONSUMER = "CANCELLED_BY_CONSUMER",
}

export enum CheckoutBasketStatus {
  CREATED = "CREATED",
  COMMERCIAL_OFFERS_GENERATED = "COMMERCIAL_OFFERS_GENERATED",
  RISK_CHECK_FAILED = "RISK_CHECK_FAILED",
  COMMERCIAL_OFFERS_FAILURE = "COMMERCIAL_OFFERS_FAILURE",
  LOAN_ACTIVATED = "LOAN_ACTIVATED",
  LOAN_ACTIVATION_FAILURE = "LOAN_ACTIVATION_FAILURE",
  CREDIT_LIMIT_UPDATE_FAILURE = "CREDIT_LIMIT_UPDATE_FAILURE",
  COMMERCIAL_OFFER_SELECTED = "COMMERCIAL_OFFER_SELECTED",
  DOWN_PAYMENT_ACCEPTED = "DOWN_PAYMENT_ACCEPTED",
  IN_ACTIVE_CONSUMER_FAILURE = "IN_ACTIVE_CONSUMER_FAILURE",
  IN_ACTIVE_PARTNER_FAILURE = "IN_ACTIVE_PARTNER_FAILURE",
  IN_PROGRESS_CHECKOUT_FOUND_FAILURE = "IN_PROGRESS_CHECKOUT_FOUND_FAILURE",
  NO_GENERATED_COMMERCIAL_OFFERS_FAILURE = "NO_GENERATED_COMMERCIAL_OFFERS_FAILURE",
  NO_COMMERCIAL_OFFER_SELECTED_FAILURE = "NO_COMMERCIAL_OFFER_SELECTED_FAILURE",
  OTP_FAILURE = "OTP_FAILURE",
  FAILURE = "FAILURE",
  CANCELLED_BY_CASHIER = "CANCELLED_BY_CASHIER",
  CANCELLED_BY_CONSUMER = "CANCELLED_BY_CONSUMER",
}

export enum SessionBasketStatus {
  CREATED = "CREATED",
  EXPIRED = "EXPIRED",
  ACQUIRED = "ACQUIRED",
  CHECKOUT_INITIATED = "CHECKOUT_INITIATED",
  FAILED = "FAILED",
  CANCELLED_BY_CASHIER = SessionBasketCancelStatuses.CANCELLED_BY_CASHIER,
  CANCELLED_BY_CONSUMER = SessionBasketCancelStatuses.CANCELLED_BY_CONSUMER,
}

export type SessionBasketProps = {
  id?: UUID;
  partnerId: UUID;
  branchId: UUID;
  cashierId: UUID;
  consumerId?: UUID;
  status?: SessionBasketStatus;
  partnerName: string;
  product: Product;
  createdAt?: string;
  updatedAt?: string;
};

export class SessionBasket {
  id: UUID;
  partnerId: UUID;
  branchId: UUID;
  cashierId: UUID;
  consumerId: UUID;
  product: Product;
  partnerName: string;
  status: SessionBasketStatus;
  createdAt: string;
  updatedAt: string;

  public static create(props: SessionBasketProps): SessionBasket {
    const basket = new SessionBasket(props);
    basket.status = SessionBasketStatus.CHECKOUT_INITIATED;
    return basket;
  }

  constructor({
    id,
    partnerId,
    partnerName,
    branchId,
    cashierId,
    consumerId,
    product,
    createdAt,
    updatedAt,
    status,
  }: SessionBasketProps) {
    this.id = id;
    this.partnerId = partnerId;
    this.partnerName = partnerName;
    this.branchId = branchId;
    this.cashierId = cashierId;
    this.product = product;
    this.status = status;
    this.consumerId = consumerId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public get totalAmount(): number {
    return this.product.price;
  }
  public fail() {
    this.status = SessionBasketStatus.FAILED;
  }
  public expired(): boolean {
    if (this.status == SessionBasketStatus.EXPIRED) {
      return true;
    }
    const now = new Date().getTime();
    const expiryTime = new Date(this.createdAt).getTime() + config.basketTimeout * 1000;
    return now > expiryTime;
  }
  public cancelByCashier(status: SessionBasketStatus, cashierId: UUID) {
    const canCashierCancel = this.cashierId === cashierId;
    if (!canCashierCancel) {
      throw new NotFoundError("basket not found");
    }
    if ([SessionBasketStatus.CANCELLED_BY_CASHIER, SessionBasketStatus.CANCELLED_BY_CONSUMER].includes(this.status)) {
      throw new ConflictError({ message: this.status });
    }
    this.status = status;
  }

  private generateCode() {
    return randomInt(100000, 999999);
  }
}
