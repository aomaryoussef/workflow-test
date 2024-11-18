import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { HasuraService } from '~/core-services/hasura/hasura.service';
import { InstallmentPlanDto } from '../dtos/paymob.installment-plan.dto';
import { toCent, toPound } from '~/utils/currency.utils';
import { CustomLoggerService } from '~/core-services/logger/logger.service';
import { LoggerFactory } from '~/core-services/logger/types';

export class CreateCheckoutBasketResponseDto {
  data: {
    id: string;
    workflow_id: string;
    partner_id: string;
    cashier_id: string;
    branch_id: string;
    consumer_id: string;
    session_basket_id: string;
    selected_commercial_offer_id: string | null;
    status: string;
    products: object[];
    commercial_offers: any | null;
    consumer_device_metadata: Record<string, any>;
    gross_basket_value: number;
    created_at: string;
    updated_at: string;
    loan_id: string | null;
    category: string;
  };
}
export class CurrencyAmountDto {
  units: number;
  currency_code: string;
}
export class CommercialOfferDTO {
  id: string;
  tenure: string;
  admin_fee: CurrencyAmountDto;
  monthly_instalment: CurrencyAmountDto;
  annual_interest_percentage: number;
  total_amount: string;
  financed_amount: string;
}
export class GetInstallmentPlansResponseDto {
  data: {
    checkout_baskets: [
      {
        id: string;
        status: string;
        commercial_offers: CommercialOfferDTO[];
      },
    ];
  };
}

export class GetSelectedInstallmentPlanQueryResponseDto {
  data: {
    checkout_baskets: {
      commercial_offers: CommercialOfferDTO[];
      selected_commercial_offer_id: string;
    }[];
  };
}

export class GetCheckoutBasketQueryResponseDto {
  data: {
    checkout_baskets: {
      status: string;
      loan_id:string;
      consumer_id:string;
    }[];
  };
}

const getInstallmentPlansQuery = `
  query getInstallmentPlans($sessionBasketId: uuid!) {
    checkout_baskets(where: {session_basket_id: {_eq: $sessionBasketId}}) {
      id
      status
      commercial_offers 
    }
  }
`;
const getSelectedInstallmentPlanQuery = `
   query GetSelectedCommercialOffer($sessionBasketId: uuid!) {
      checkout_baskets(where: {session_basket_id: {_eq: $sessionBasketId}}) {
        commercial_offers
        selected_commercial_offer_id
      }
    }
`;
const getCheckoutBasketQuery = `  
  query getLoanStatus($sessionBasketId: uuid!) {
  checkout_baskets(where: {session_basket_id: {_eq:  $sessionBasketId}}) {
    status
    loan_id
    consumer_id
  }
  }
`;

@Injectable()
export class CheckoutRepository {
  private serviceDepartmentUrl: string;
  private readonly logger: CustomLoggerService;

  constructor(
    private readonly hasuraService: HasuraService,
    private readonly httpService: HttpService,
    private configService: ConfigService,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.serviceDepartmentUrl = this.configService.get<string>(
      'serviceDepartment.url',
    );
    this.logger = this.loggerFactory('paymob checkout repository');
  }

  async CreateCheckoutBasket(
    sessionBasketId: string,
    partnerId: string,
    branchId: string,
    consumerId: string,
    category: string,
    amountToBeFinancedInPound: number,
    productName: string,
  ): Promise<boolean> {
    this.logger.debug(`CreateCheckoutBasket called with sessionBasketId: ${sessionBasketId}, partnerId: ${partnerId}, branchId: ${branchId}, consumerId: ${consumerId}, category: ${category}, amountToBeFinancedInPound: ${amountToBeFinancedInPound}, productName: ${productName}`);
    try {
      const createCheckoutBasket = `${this.serviceDepartmentUrl}/checkout_baskets`;

      const payload = {
        partner_id: partnerId,
        cashier_id: partnerId,
        branch_id: branchId,
        consumer_id: consumerId,
        session_basket_id: sessionBasketId,
        origination_channel: "paymob",
        products: [
          {
            name: productName,
            price: toCent(amountToBeFinancedInPound),
            category,
          },
        ],
        gross_basket_value: toCent(amountToBeFinancedInPound),
        category,
        consumer_device_metadata: {},
      };

      const response = await firstValueFrom(
        this.httpService.post(createCheckoutBasket, payload).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data.toString());
            throw 'An error happened!';
          }),
        ),
      );
      if (response.status === 201) {
        return response.data.data.checkout_basket;
      }
      return null;
    } catch (error) {
      this.logger.error('Error creating checkout basket:' + error);
      return null;
    }
  }

  async getInstallmentPlans(
    sessionBasketId: string,
  ): Promise<InstallmentPlanDto[] | null> {
    this.logger.debug(`getInstallmentPlans called with sessionBasketId: ${sessionBasketId}`);
    const maxAttempts = 10; // Maximum number of attempts
    const delayBetweenAttempts = 3000; // Delay in milliseconds (3 seconds)

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const installmentPlans: GetInstallmentPlansResponseDto =
          await this.hasuraService.executeQuery<GetInstallmentPlansResponseDto>(
            getInstallmentPlansQuery,
            { sessionBasketId },
          );

        const checkoutBasket = installmentPlans.data.checkout_baskets[0];
        const checkoutbasketstatus = checkoutBasket?.status;
        const commercialOffers = checkoutBasket?.commercial_offers;
        if (checkoutbasketstatus === 'FAILURE') {
          this.logger.error('Unable to fetch installment plans');
          throw new Error('Unable to fetch installment plans');
        }
        if (!commercialOffers) {
          this.logger.log(
            `Attempt ${attempt}: No commercial offers found. Retrying...`,
          );

          // Wait for the specified delay before the next attempt
          await new Promise((resolve) =>
            setTimeout(resolve, delayBetweenAttempts),
          );
          continue; // Skip to the next attempt
        }

        const installmentPlanDtos = commercialOffers.map((offer) => {
          const installmentPlan = new InstallmentPlanDto();
          installmentPlan.id = offer.id;
          installmentPlan.duration = offer.tenure;
          installmentPlan.monthly_installment = toPound(
            offer.monthly_instalment.units,
          );
          installmentPlan.admin_fees = toPound(
            offer.admin_fee.units,
          );
          installmentPlan.murabha_rate = Number(offer.annual_interest_percentage);
          return installmentPlan;
        });

        const result =
          installmentPlanDtos.length > 0 ? installmentPlanDtos : null;

        return result;
      } catch (error) {
        this.logger.error('Error fetching installment plans:' + error);
        throw new Error('Unable to fetch installment plans');
      }
    }

    // If all attempts fail, return null
    this.logger.log('All attempts failed. No valid installment plans found.');
    return null;
  }

  async selectInstallmentPlan(
    sessionBasketId: string,
    selectedPlanId: string,
  ): Promise<boolean> {
    this.logger.debug(`selectInstallmentPlan called with sessionBasketId: ${sessionBasketId}, selectedPlanId: ${selectedPlanId}`);
    try {
      const selectInstallmentURL = `${this.serviceDepartmentUrl}/checkout_baskets/${sessionBasketId}/commercial-offers/select`;
      const payload = {
        selected_offer_id: selectedPlanId,
      };

      const response = await firstValueFrom(
        this.httpService.post(selectInstallmentURL, payload).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(
              'error while selecting Installments' +
                error.response.data.toString(),
            );
            throw error.response.data;
          }),
        ),
      );

      return response.status === 200;
    } catch (error) {
      this.logger.error('Error selecting installment plans:' + error);
      throw new Error('Unable to select installment plans' + error);
    }
  }

  async sendOtp(sessionBasketId: string): Promise<boolean> {
    this.logger.debug(`sendOtp called with sessionBasketId: ${sessionBasketId}`);
    try {
      const sendOtpURL = `${this.serviceDepartmentUrl}/checkout_baskets/${sessionBasketId}/send-otp`;
      const response = await firstValueFrom(
        this.httpService.get(sendOtpURL).pipe(
          catchError((error: AxiosError) => {
            throw error;
          }),
        ),
      );
      return response.status === 200;
    } catch (error) {
      this.logger.error('Error sending OTP:' + error);
      throw new Error('Unable to send OTP');
    }
  }

  async verifyOtp(sessionBasketId: string, otp: string): Promise<boolean> {
    this.logger.debug(`verifyOtp called with sessionBasketId: ${sessionBasketId}, otp: ${otp}`);
    try {
      const verifyOtpURL = `${this.serviceDepartmentUrl}/checkout_baskets/${sessionBasketId}/verify-otp`;
      const payload = {
        otp,
      };
      const response = await firstValueFrom(
        this.httpService.post(verifyOtpURL, payload).pipe(
          catchError((error: AxiosError) => {
            this.logger.log('error.response.data ' + error);
            throw error;
          }),
        ),
      );
      return response.status === 200 && response.data.result !== 'NOT_VERIFIED';
    } catch (error) {
      this.logger.error('Unable to verify OTP');
      return false;
    }
  }

  async resendOtp(sessionBasketId: string, method: string): Promise<boolean> {
    this.logger.debug(`resendOtp called with sessionBasketId: ${sessionBasketId}, method: ${method}`);
    try {
      let reSendOtpURL = `${this.serviceDepartmentUrl}/checkout_baskets/${sessionBasketId}/resend-otp`;
      if (method === 'CALL') reSendOtpURL = reSendOtpURL + '/callme';
      const response = await firstValueFrom(
        this.httpService.get(reSendOtpURL).pipe(
          catchError((error: AxiosError) => {
            throw error;
          }),
        ),
      );
      return response.status === 200;
    } catch (error) {
      this.logger.error('Error resend OTP:' + error);
      throw new Error('Unable to resend OTP');
    }
  }

  async getSelectedInstallmentPlan(
    sessionBasketId: string,
  ): Promise<CommercialOfferDTO> {
    this.logger.debug(`getSelectedInstallmentPlan called with sessionBasketId: ${sessionBasketId}`);
    try {
      const GetSelectedInstallmentPlanResponse: GetSelectedInstallmentPlanQueryResponseDto =
        await this.hasuraService.executeQuery<GetSelectedInstallmentPlanQueryResponseDto>(
          getSelectedInstallmentPlanQuery,
          { sessionBasketId },
        );
      const data = GetSelectedInstallmentPlanResponse.data;
      const checkoutBasket =
        GetSelectedInstallmentPlanResponse.data.checkout_baskets[0];
      if (
        checkoutBasket &&
        checkoutBasket.commercial_offers &&
        checkoutBasket.commercial_offers.length > 0
      ) {
        const selectedOffer = checkoutBasket.commercial_offers.find(
          (offer) => offer.id === checkoutBasket.selected_commercial_offer_id,
        );
        return selectedOffer;
      } else {
        throw new Error('Unable to get plan');
      }
    } catch (error) {
      this.logger.error('Error get plan:' + error);
      throw new Error('Unable to get plan');
    }
  }

  async confirmCheckout(sessionBasketId: string): Promise<boolean> {
    this.logger.debug(`confirmCheckout called with sessionBasketId: ${sessionBasketId}`);
    try {
      const confirmCheckoutURL = `${this.serviceDepartmentUrl}/checkout_baskets/${sessionBasketId}/accept-down-payment`;
      const response = await firstValueFrom(
        this.httpService.post(confirmCheckoutURL).pipe(
          catchError((error: AxiosError) => {
            throw error;
          }),
        ),
      );
      return response.status === 200;
    } catch (error) {
      this.logger.error('Error confirming checkout:' + error);
      return false;
    }
  }

  async cancelCheckout(sessionBasketId: string): Promise<boolean> {
    this.logger.debug(`cancelCheckout called with sessionBasketId: ${sessionBasketId}`);
    try {
      const cancelCheckoutURL = `${this.serviceDepartmentUrl}/checkout_baskets/${sessionBasketId}/cancel`;
      const payload = {
        status: 'CANCELLED_BY_CASHIER',
      };
      const response = await firstValueFrom(
        this.httpService.post(cancelCheckoutURL, payload).pipe(
          catchError((error: AxiosError) => {
            throw error;
          }),
        ),
      );

      return response.status === 200;
    } catch (error) {
      this.logger.error('Error cancelling checkout:' + error);
      return false;
    }
  }

  async cancelAnyOpenCheckout(consumer_phone_number: string): Promise<boolean> {
    this.logger.debug(`cancelAnyOpenCheckout called with consumer_phone_number: ${consumer_phone_number}`);
    try {
      const cancelCheckoutURL = `${this.serviceDepartmentUrl}/checkout_baskets?consumer_phone_number=${encodeURIComponent(consumer_phone_number)}`;

      const response = await firstValueFrom(
        this.httpService.delete(cancelCheckoutURL).pipe(
          catchError((error: AxiosError) => {
            throw error;
          }),
        ),
      );
      return response.status === 200;
    } catch (error) {
      this.logger.error('Error cancelling checkout:' + error);
      throw new Error('Unable to cancel checkout');
    }
  }

  async isLoanCreated(sessionBasketId: string): Promise<boolean> {
    this.logger.debug(`isLoanCreated called with sessionBasketId: ${sessionBasketId}`);
    try {
      const getLoanStatusResponse =
        await this.getCheckoutBasket(sessionBasketId);

      return (
        getLoanStatusResponse &&
        getLoanStatusResponse.data.checkout_baskets &&
        getLoanStatusResponse.data.checkout_baskets.length > 0 &&
        getLoanStatusResponse.data.checkout_baskets[0].status ===
          'LOAN_ACTIVATED'
      );
    } catch (error) {
      this.logger.error(
        'Error when checking if loan was created, error:' + error,
      );
      return false;
    }
  }

  async getCheckoutBasket(sessionBasketId: string): Promise<GetCheckoutBasketQueryResponseDto>{
    this.logger.debug(`getCheckoutBasket called with sessionBasketId: ${sessionBasketId}`);
    console.log('sessionBasketId',sessionBasketId);
    return  await this.hasuraService.executeQuery<GetCheckoutBasketQueryResponseDto>(
          getCheckoutBasketQuery,
          { sessionBasketId },
        );
  }
}
