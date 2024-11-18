import { UUID } from "crypto";
import { SessionBasket } from "../models/session-basket";
export type CommercialOfferDto = {
  id: string;
  tenure: { duration: number; unit: string };
  installmentAmount: number;
  adminFeesAmount: number;
  financedAmount: number;
  interestRate: string;
  totalInterest: number;
  totalOfPayments: number;
  downPaymentAmount: number;
  selected?: boolean;
};

export type CommercialOffersDto = { offers: CommercialOfferDto[] };
export type OrderReviewDto = {
  selectedCommercialOffer: CommercialOfferDto;
  sessionBasket: SessionBasketDto;
};

export type CreateSessionBasketDto = {
  partnerId: UUID;
  branchId: UUID;
  cashierId: UUID;
  consumerId: UUID;
  partnerName: string;
  product: Product;
};

export type Product = {
  name: string;
  price: number;
};

export type SessionBasketDto = {
  id: UUID;
  partnerName: string;
  status: string;
  totalAmount: number;
  product: {
    name: string;
    price: number;
  };
};

export const fromBasket = (basket: SessionBasket): SessionBasketDto => {
  return {
    id: basket.id,
    partnerName: basket.partnerName,
    totalAmount: basket.totalAmount,
    status: basket.status,
    product: basket.product,
  };
};
