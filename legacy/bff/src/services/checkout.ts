import axios from "axios";
import { config } from "../../config";
import { UUID } from "crypto";
import { SessionBasket, SessionBasketCancelStatuses } from "../domain/session-basket/models/session-basket";
import { ConflictError } from "../domain/errors/conflict-error";
import { BadRequestError } from "../domain/errors/bad-request-error";
import { CommercialOfferDto, CommercialOffersDto } from "../domain/session-basket/dtos/session-basket-dto";
import { CustomLogger } from "./logger";

const logger = new CustomLogger("checkout-service");
// eslint-disable-next-line
const client = axios.create({
  baseURL: config.checkoutDomain,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

type Money = {
  units: number;
  currency: string;
};

type Offer = {
  id: string;
  tenure: string;
  monthly_instalment: Money;
  admin_fee: Money;
  financed_amount: Money;
  total_amount: Money;
  annual_interest_percentage: number;
  down_payment: Money;
};

export type CommercialOffersResponse = {
  commercial_offers: Offer[];
};

type CheckoutBasket = {
  status: string;
  selected_commercial_offer_id: string;
  commercial_offers: Offer[];
};

type CheckoutBasketResponse = {
  data: {
    checkout_basket: CheckoutBasket;
  };
};

export const createCheckoutBasket = async (sessionBasket: SessionBasket) => {
  try {
    await client.post("/checkout_baskets", {
      session_basket_id: sessionBasket.id,
      partner_id: sessionBasket.partnerId,
      branch_id: sessionBasket.branchId,
      cashier_id: sessionBasket.cashierId,
      consumer_id: sessionBasket.consumerId,
      gross_basket_value: sessionBasket.product.price,
      products: [sessionBasket.product],
      consumer_device_metadata: {},
      origination_channel: "web",
    });
  } catch (e) {
    if (e.response?.status === 400) {
      throw new BadRequestError(e.response?.data?.errors || "Bad request");
    }
    throw e;
  }
};

const tenureValue = (tenure: string): { duration: number; unit: string } => {
  const [a, b] = tenure.split("_");
  return { duration: Number(a), unit: b.replace(/s$/, "") };
};

const totalOfPaymentsValue = (offer: Offer, tenureUnit: number): number => {
  return offer.monthly_instalment.units * tenureUnit;
};

const mapOfferResponseToDto = (offer: Offer): CommercialOfferDto => {
  const tenure = tenureValue(offer.tenure);
  const totalOfPayments = totalOfPaymentsValue(offer, tenure.duration);

  return {
    tenure,
    id: offer.id,
    installmentAmount: offer.monthly_instalment.units,
    adminFeesAmount: offer.admin_fee.units,
    downPaymentAmount: offer.down_payment.units,
    financedAmount: offer.financed_amount.units,
    interestRate: offer.annual_interest_percentage.toString(),
    totalInterest: Math.floor((offer.financed_amount.units * offer.annual_interest_percentage) / 100), // placeholder
    totalOfPayments,
  };
};

export const commercialOffers = async (sessionBasketId: UUID): Promise<CommercialOffersDto> => {
  const res = await client.get<CommercialOffersResponse>(`/checkout_baskets/${sessionBasketId}/commercial-offers`);
  const offers: CommercialOfferDto[] = res.data.commercial_offers.map((offer) => {
    return mapOfferResponseToDto(offer);
  });

  return { offers };
};

export const selectCommercialOffer = async (
  sessionBasketId: UUID,
  selectedOfferID: UUID,
): Promise<CommercialOfferDto> => {
  const res = await client.post<{ data: { offer: Offer } }>(
    `/checkout_baskets/${sessionBasketId}/commercial-offers/select`,
    {
      selected_offer_id: selectedOfferID,
    },
  );

  return mapOfferResponseToDto(res.data.data.offer);
};

export const getCheckoutBasket = async (sessionBasketId: UUID): Promise<CheckoutBasket> => {
  const res = await client.get<CheckoutBasketResponse>(`/checkout_baskets/${sessionBasketId}`);

  return res.data.data.checkout_basket;
};

export const checkoutBasketStatus = async (sessionBasketId: UUID): Promise<string> => {
  const res = await client.get<{ data: { checkout_basket: { status: string } } }>(
    `/checkout_baskets/${sessionBasketId}`,
  );

  return res.data.data.checkout_basket.status;
};

export const cancelCheckoutBasket = async (sessionBasketId: UUID, status: SessionBasketCancelStatuses) => {
  try {
    const res = await client.post<{ data: { status: string } }>(`/checkout_baskets/${sessionBasketId}/cancel`, {
      status,
    });
    return res.data.data.status;
  } catch (err) {
    if (err.response.status === 409) {
      throw new ConflictError({ message: err.response.data.message });
    } else {
      throw err;
    }
  }
};

export const cancelConsumerActiveCheckoutBasket = async (phoneNumber: string) => {
  try {
    const res = await client.delete<{ data: { status: string } }>(
      `/checkout_baskets?consumer_phone_number=${phoneNumber}`,
    );
    return res.data;
  } catch (err) {
    if (err.response.status === 409) {
      throw new ConflictError({ message: err.response.data.message });
    } else {
      throw err;
    }
  }
};

export const acceptDownPayment = async (sessionBasketId: UUID) => {
  try {
    const res = await client.post<{ data: { checkout_basket: { status: string } } }>(
      `/checkout_baskets/${sessionBasketId}/accept-down-payment`,
    );
    return res.data.data.checkout_basket.status;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const triggerSendOtp = async (sessionBasketId: UUID) => {
  try {
    const res = await client.get(`/checkout_baskets/${sessionBasketId}/send-otp`);

    return res.data.data.phone_number;
  } catch (err) {
    throw new BadRequestError(err.response?.data?.message);
  }
};

export const resendOtp = async (sessionBasketId: UUID) => {
  const res = await client.get(`/checkout_baskets/${sessionBasketId}/resend-otp`);

  return res.data.data.phone_number;
};

export const resendOtpViaPhoneCall = async (sessionBasketId: UUID) => {
  const res = await client.get(`/checkout_baskets/${sessionBasketId}/resend-otp/callme`);
  return res.data.data.phone_number;
};

export const verifyOtp = async (sessionBasketId: UUID, otp: string) => {
  try {
    const res = await client.post<{ data: { status: string } }>(`/checkout_baskets/${sessionBasketId}/verify-otp`, {
      otp: otp,
    });
    return res.data.data.status;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const getConsumerCheckoutBaskets = async (consumerId: UUID, statuses: string[]) => {
  try {
    const res = await client.get(`/checkout_baskets?consumer_id=${consumerId}&statuses=${statuses}`);
    return res.data;
  } catch (error) {
    // check if status code 404, return an empty array
    if (error.response.status === 404) {
      return [];
    }
    throw new Error(error.response.data.message);
  }
};
