import { Inject, Injectable } from '@nestjs/common';
import { StartCheckoutResponseDto } from './dtos/paymob.start-checkout.dto';
import {
  ErrorResponseDto,
  PaymobBaseResponseDto,
  PaymobErrorStatusCode,
} from './dtos/paymob.base-response.dto';
import {
  SelectedInstallmentPlanDto,
  SelectInstallmentsPlanResponseDto,
} from './dtos/paymob.select-installment-plan.dto';

import { ConsumerRepository } from './repository/consumer.repository';
import { CheckoutRepository } from './repository/checkout.repository';
import { PartnerProvider } from './providers/partner.provider';
import { PaymobSessionBasketRepository } from './repository/paymob-session-basket.repository';
import { PaymobSessionBasket } from './entities/paymob-session-basket.entity';
import { v4 as uuidv4 } from 'uuid';
import { CancelCheckoutResponseDto } from './dtos/paymob.cancel-checkout.dto';
import {
  ReceiptDataDto,
  VerifyAndConfirmRequestDto,
  VerifyAndConfirmResponseDto,
} from './dtos/paymob.verify-and-confirm.dto';
import { CustomLoggerService } from '~/core-services/logger/logger.service';
import { LoggerFactory } from '~/core-services/logger/types';
import { RefundResponseDto } from './dtos/paymob-refund.dto';
import { LoanRepository } from './repository/loan.repository';
import { toPound } from '~/utils/currency.utils';
@Injectable()
export class PaymobService {
  readonly minAmountToBeFinanced = 500;
  readonly maxAmountToBeFinanced = 1000000;
  private readonly logger: CustomLoggerService;

  constructor(
    private readonly consumerRepository: ConsumerRepository,
    private readonly checkoutRepository: CheckoutRepository,
    private readonly sessionBasketRepository: PaymobSessionBasketRepository,
    private readonly loanRepository: LoanRepository,
    private readonly partnerProvider: PartnerProvider,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory('paymob');
  }

  async startCheckout(
    phoneNumber: string,
    productPrice: number,
    productName: string,
    downPayment: number = 0,
    terminalId: number,
    merchant_id: string,
  ): Promise<PaymobBaseResponseDto<StartCheckoutResponseDto>> {
    this.logger.debug(`startCheckout called with phoneNumber: ${phoneNumber}, productPrice: ${productPrice}, productName: ${productName}, downPayment: ${downPayment}, terminalId: ${terminalId}, merchant_id: ${merchant_id}`);
    const phoneNumberPattern = /^(012|011|010|015)\d{8}$/;
    const partner = this.partnerProvider.partner;
    const formattedPhoneNumber = '+2' + phoneNumber;
    const response = new PaymobBaseResponseDto<StartCheckoutResponseDto>();

    const amountToBeFinanced = productPrice - downPayment;
    
      if (!phoneNumberPattern.test(phoneNumber)) {
        response.error = new ErrorResponseDto(
          PaymobErrorStatusCode.InvalidMobileNumber,
        );
        return response;
      }
      if (
        amountToBeFinanced < this.minAmountToBeFinanced ||
        amountToBeFinanced > this.maxAmountToBeFinanced
      ) {
        response.error = new ErrorResponseDto(
          PaymobErrorStatusCode.InvalidAmountToBeFinanced,
        );
        return response;
      }
      const consumer =
        await this.consumerRepository.getActiveConsumer(formattedPhoneNumber);
      if (!consumer) {
        response.error = new ErrorResponseDto(
          PaymobErrorStatusCode.NotAMyloUserOrPendingActivation,
        );
        return response;
      }
      const creditLimit = await this.consumerRepository.getConsumerCreditLimit(
         consumer.id,
       );
      const consumerHasEnoughCredit = creditLimit >= amountToBeFinanced;
      if (!consumerHasEnoughCredit) {
        response.error = new ErrorResponseDto(
          PaymobErrorStatusCode.InsufficientCreditLimit,
        );
        return response;
      }
      this.checkoutRepository.cancelAnyOpenCheckout(formattedPhoneNumber);
      // Initialize the new session basket
      let paymobSessionBasket: Partial<PaymobSessionBasket> = {
        id: uuidv4(),
        terminal_id: terminalId,
        product_price: productPrice,
        down_payment: downPayment,
        merchant_id: merchant_id,
      };

      await this.sessionBasketRepository.save(paymobSessionBasket);
       const createCheckoutBasketResponse =
        await this.checkoutRepository.CreateCheckoutBasket(
          paymobSessionBasket.id,
          partner.id,
          partner.branchId,
          consumer.id,
          partner.category,
          amountToBeFinanced,
          productName
        ); 
      const transactionId = createCheckoutBasketResponse["transaction_id"] ;
      paymobSessionBasket = await this.sessionBasketRepository.update(
        paymobSessionBasket.id,
        {
          transaction_id: transactionId,
        },
      );
      if (createCheckoutBasketResponse) {
        let installment_plans = await this.checkoutRepository.getInstallmentPlans(
          paymobSessionBasket.id,
        );
        if (installment_plans.length == 0) {
          response.error = new ErrorResponseDto(
            PaymobErrorStatusCode.CouldNotGetSelectedPlan,
          );
          return response;
        }

        response.data = new StartCheckoutResponseDto({
          financed_amount: amountToBeFinanced,
          transaction_id: transactionId,
          installment_plans: installment_plans,
        });
        return response;
      }
      response.error = new ErrorResponseDto(PaymobErrorStatusCode.CheckoutFailed);
      return response;
  }

  async selectInstallmentsPlan(
    transactionId: bigint,
    selectedInstallmentPlanId: string,
  ): Promise<PaymobBaseResponseDto<SelectInstallmentsPlanResponseDto>> {
    this.logger.debug(`selectInstallmentsPlan called with transactionId: ${transactionId}, selectedInstallmentPlanId: ${selectedInstallmentPlanId}`);
    const response =
      new PaymobBaseResponseDto<SelectInstallmentsPlanResponseDto>();
    try {
      const sessionBasketId = (
        await this.sessionBasketRepository.findOneByFilter({
          transaction_id: transactionId,
        })
      ).id;
      const selectResponse = this.checkoutRepository.selectInstallmentPlan(
        sessionBasketId,
        selectedInstallmentPlanId,
      );
      if (selectResponse) {
        //Wait 3 seconds
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await this.checkoutRepository.sendOtp(sessionBasketId);
        const responseData = new SelectInstallmentsPlanResponseDto();
        const selectedPlan =
          await this.getSelectedInstallmentPlan(transactionId);
        if (!selectedPlan) {
          response.error = new ErrorResponseDto(
            PaymobErrorStatusCode.CouldNotSelectPlan,
          );
          return response;
        }
        responseData.offer_details = selectedPlan;
        response.data = responseData;
      } else {
        response.error = new ErrorResponseDto(
          PaymobErrorStatusCode.CouldNotSelectPlan,
        );
      }
    } catch (error) {
    this.logger.debug(`Error when selecting installment plans,transaction_id : ${transactionId}, error:${error}`);
     response.error = new ErrorResponseDto(
        PaymobErrorStatusCode.CouldNotSelectPlan,
      );
    }

    return response;
  }

  private async getSelectedInstallmentPlan(
    transactionId: bigint,
  ): Promise<SelectedInstallmentPlanDto> {
    this.logger.debug(`getSelectedInstallmentPlan called with transactionId: ${transactionId}`);
    try {
      const sessionBasketId = (
        await this.sessionBasketRepository.findOneByFilter({
          transaction_id: transactionId,
        })
      ).id;

      const plan =
        await this.checkoutRepository.getSelectedInstallmentPlan(
          sessionBasketId,
        );

      const selectedPlan =  this.getReceiptDataDto(plan);
      return selectedPlan;
    } catch (error) {
      this.logger.error(  
        `Error when selecting installment plans,transactionId: ${transactionId} error:${error}`
      );
    }
    return null;
  }

  private calculateNextInstallmentDate(): string {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth(); // getMonth() returns 0-based month (0 = January)
    const currentYear = today.getFullYear();

    let nextInstallmentDate: Date;

    // Check if today is within the first 10 days of the month
    if (currentDay <= 10) {
      // Set the next installment date to the 1st day of the next month
      nextInstallmentDate = new Date(currentYear, currentMonth + 1, 1);
    } else {
      // Set the next installment date to the 1st day of the month after the next
      nextInstallmentDate = new Date(currentYear, currentMonth + 2, 1);
    }

    return nextInstallmentDate.toDateString();
  }

  async verifyAndConfirm(
    transactionId: bigint,
    request: VerifyAndConfirmRequestDto,
  ): Promise<PaymobBaseResponseDto<any>> {
    this.logger.debug(`verifyAndConfirm called with transactionId: ${transactionId}, request: ${JSON.stringify(request)}`);
    const response = new PaymobBaseResponseDto<VerifyAndConfirmResponseDto>();
    try {
      const sessionBasket = await this.sessionBasketRepository.findOneByFilter({
        transaction_id: transactionId,
      });
      let successVerifyOutResponse = await this.checkoutRepository.verifyOtp(
        sessionBasket.id,
        request.otp,
      );
      if (successVerifyOutResponse) {
        const updatePaymobTransResponse = this.updatePaymobTransactionId(
          sessionBasket.id,
          request.paymob_transaction_id,
        );
        if(!updatePaymobTransResponse)
        {
          response.error = new ErrorResponseDto(
            PaymobErrorStatusCode.DuplicateTransactionId,
          );
          return response;
        }
        await new Promise((resolve) => setTimeout(resolve, 3000));
        let confirmResponse = await this.checkoutRepository.confirmCheckout(
          sessionBasket.id,
        );
        if (!confirmResponse) {
          response.error = new ErrorResponseDto(
            PaymobErrorStatusCode.CouldNotConfirmCheckout,
          );
          return response;
        }
        const recipe_data = await this.getReceiptData(transactionId);
        if (!recipe_data) {
          response.error = new ErrorResponseDto(
            PaymobErrorStatusCode.CouldNotGetSelectedPlan,
          );
          return response;
        }
        response.data = { recipe_data: recipe_data };
      } else
        response.error = new ErrorResponseDto(PaymobErrorStatusCode.InvalidOTP);
      return response;
    } catch (error) {
     this.logger.debug(`Error when verify and confirm ,transaction_id : ${transactionId}, error:${error}`);
      response.error = new ErrorResponseDto(PaymobErrorStatusCode.InvalidOTP);
      return response;
    }
  }

  async inquiryCheckout(
    transactionId: bigint,
  ): Promise<PaymobBaseResponseDto<ReceiptDataDto>> {
    this.logger.debug(`inquiryCheckout called with transactionId: ${transactionId}`);
    const response = new PaymobBaseResponseDto<ReceiptDataDto>();
    try {
      const sessionBasket = await this.sessionBasketRepository.findOneByFilter({
        transaction_id: transactionId,
      });
      let loanCreated = await this.checkoutRepository.isLoanCreated(
        sessionBasket.id,
      );
      if (loanCreated) {
        response.data = await this.getReceiptData(transactionId);
      } else {
      this.logger.error('Loan was not yest created' );
        response.error = new ErrorResponseDto(
          PaymobErrorStatusCode.CouldNotInquiryCheckout,
        );
      }
      return response;
    } catch (error) {
      this.logger.error(`Error when inquiring checkout,transaction_id: ${transactionId}, error:${error}`);
      response.error = new ErrorResponseDto(
        PaymobErrorStatusCode.CouldNotInquiryCheckout,
      );
    }
  }

  private async updatePaymobTransactionId(
    sessionBasketId: string,
    paymob_transaction_id: string,
  ): Promise<boolean> {
    this.logger.debug(`updatePaymobTransactionId called with sessionBasketId: ${sessionBasketId}, paymob_transaction_id: ${paymob_transaction_id}`);
    try {
      const updateResponse = await this.sessionBasketRepository.update(
        sessionBasketId,
        {
          paymob_transaction_id: paymob_transaction_id,
        },
      );
      if (updateResponse) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      this.logger.error(
        `Error when updating paymob transaction ,sessionBasketId: ${sessionBasketId},  , error:  ${error}`,
      );
      return false;
    }
  }

  private async getReceiptData(transactionId: bigint): Promise<ReceiptDataDto> {
    this.logger.debug(`getReceiptData called with transactionId: ${transactionId}`);
    try {
      const sessionBasket = await this.sessionBasketRepository.findOneByFilter({
        transaction_id: transactionId,
      });

      const plan = await this.checkoutRepository.getSelectedInstallmentPlan(
        sessionBasket.id,
      );

      const selectedPlan = this.getReceiptDataDto(plan) ;
      selectedPlan.down_payment = Number(sessionBasket.down_payment);
      selectedPlan.transaction_id = Number(transactionId);
      return selectedPlan;
    } catch (error) {
      this.logger.error(
        'Error when selecting installment plans, error:' + error,
      );
      return null;
    }
  }
  private getReceiptDataDto(plan: any): ReceiptDataDto{
    this.logger.debug(`getReceiptDataDto called with plan: ${JSON.stringify(plan)}`);
    plan.financed_amount.units= toPound(plan.financed_amount.units);
    plan.total_amount.units= toPound(plan.total_amount.units);
    const selectedPlan = new ReceiptDataDto();
    selectedPlan.id = plan.id;
    selectedPlan.duration = plan.tenure;
    selectedPlan.monthly_installment =
      toPound(plan.monthly_instalment.units);
    selectedPlan.admin_fees = toPound(plan.admin_fee.units);
    selectedPlan.murabha_rate = Number(plan.annual_interest_percentage);
    selectedPlan.financed_amount = plan.financed_amount.units;
    selectedPlan.next_installment_date = this.calculateNextInstallmentDate();
    selectedPlan.total_amount_with_murabha_rate = plan.total_amount.units;
    return selectedPlan;
  }
  async resendOTP(transactionId: bigint, method: string): Promise<any> {
    this.logger.debug(`resendOTP called with transactionId: ${transactionId}, method: ${method}`);
    const response = new PaymobBaseResponseDto<any>();
    try {
      const sessionBasket = await this.sessionBasketRepository.findOneByFilter({
        transaction_id: transactionId,
      });
      const resendResponse = await this.checkoutRepository.resendOtp(
        sessionBasket.id,
        method,
      );
      if (resendResponse) {
        response.data = { is_success: true };
      } else {
        response.error = new ErrorResponseDto(
          PaymobErrorStatusCode.CouldNotResendOTP,
        );
      }
      return response;
    } catch (error) {
      this.logger.error(  
        `Error when getReceiptDataDto ,transaction_id: ${transactionId}, error:${error}`,
      );
      response.error = new ErrorResponseDto(
        PaymobErrorStatusCode.CouldNotResendOTP,
      );
    }
  }

  async cancelCheckout(transactionId: bigint): Promise<any> {
    this.logger.debug(`cancelCheckout called with transactionId: ${transactionId}`);
    const response = new PaymobBaseResponseDto<CancelCheckoutResponseDto>();
    try {
      const sessionBasket = await this.sessionBasketRepository.findOneByFilter({
        transaction_id: transactionId,
      });
      const checkoutResponse = await this.checkoutRepository.cancelCheckout(
        sessionBasket.id,
      );
      if (checkoutResponse) response.data = { is_success: true };
      else
        response.error = new ErrorResponseDto(
          PaymobErrorStatusCode.CouldNotCancelCheckout,
        );
      return response;
    } catch (error) {
      this.logger.error(
        `Error when canceling checkout,transaction_id: ${transactionId}, error:${error}`,
      );
      response.error = new ErrorResponseDto(
        PaymobErrorStatusCode.CouldNotCancelCheckout,
      );
    }
  }
 
  async refund(transactionId: bigint): Promise<any> {
    this.logger.debug(`refund called with transactionId: ${transactionId}`);
    const response = new PaymobBaseResponseDto<RefundResponseDto>();
  try {
    const partner = this.partnerProvider.partner;
    if (partner.status === "ACTIVE") {
       const sessionBasket= await this.sessionBasketRepository.findOneByFilter({
          transaction_id : transactionId,
        });
      const sessionBasketId = sessionBasket.id;    
      const checkoutBasket= (await this.checkoutRepository.getCheckoutBasket(sessionBasketId)).data.checkout_baskets[0];
      const loanId = checkoutBasket.loan_id;
      const consumerId =checkoutBasket.consumer_id;
      let loan_details = await this.loanRepository.getLoanDetails(loanId);
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(new Date().getMonth() - 1);
      if(!loan_details||loan_details.numberOfPayedInstallments > 0||new Date(loan_details.bookedDate) <oneMonthAgo )
      {
        console.error("Couldn't cancel this loan");
        response.error = new ErrorResponseDto(
          PaymobErrorStatusCode.ProductCannotBeReturned,
        );
        return response;
      }
      const result =await this.loanRepository.cancelLoan(loanId, consumerId,partner.id);
      if (result) {
        let recipe_data= new ReceiptDataDto();
        recipe_data= await this.getReceiptData(sessionBasket.transaction_id);
        
       // Destructure to remove `next_installment_date`
        const { next_installment_date, ...cleanedRecipeData } = recipe_data;
        response.data = { recipe_data: cleanedRecipeData };
      }
      else {
        response.error = new ErrorResponseDto(
          PaymobErrorStatusCode.CouldNotProcessProductReturn,
        );
      }
      }
       else {

        response.error = new ErrorResponseDto(
          PaymobErrorStatusCode.ProductCannotBeReturned,
        );
      }
      return response;

  } catch (error) {
    this.logger.error(
      `Error when refunding,transaction_id: ${transactionId}, error:${error}`,
    );
    response.error = new ErrorResponseDto(
      PaymobErrorStatusCode.CouldNotProcessProductReturn,
    );
    return response;
  }
  }
}
