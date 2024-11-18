import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import {
  FawryInquiryRequestDto,
  FawryInquiryResponseDto,
  FawryStatusCode,
} from '~/fawry/dtos/fawry.bill_inquiry.dto';
import {
  FawryNotifyRequestDto,
  FawryNotifyResponseDto,
} from '~/fawry/dtos/fawry.payment_notify.dto';
import { FormanceService } from '~/core-services/formance/formance.service';
import { CustomLoggerService } from '~/core-services/logger/logger.service';
import { LoggerFactory } from '~/core-services/logger/types';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { HasuraService } from '~/core-services/hasura/hasura.service';
import {
  RecordNotFoundException,
  InvalidInputException,
} from '~/core-services/hasura/hasura.exceptions';
import { OrkesService } from '~/core-services/orkes/orkes.service';

const PAYMENT_CHANNEL = 'FAWRY';

@Injectable()
export class FawryService {
  private static readonly EGYPTIAN_PHONE_NUMBER_REGEX =
    /^(010|011|012|015)[0-9]{8}$/;
  private readonly logger: CustomLoggerService;
  private worldPaymentAccountId: string;

  constructor(
    private configService: ConfigService,
    private readonly formanceService: FormanceService,
    private readonly hasuraService: HasuraService,
    private readonly orkesService: OrkesService,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory('fawry');
    this.worldPaymentAccountId = this.configService.get<string>(
      'formance.worldPaymentAccountId',
    );
  }

  private generateSignature(...args: (string | null | undefined)[]): string {
    const trimmedArgs = args.map((arg) =>
      typeof arg === 'string' ? arg.trim() : '',
    );
    const concatenatedString =
      trimmedArgs.join('') +
      this.configService.get<string>('fawry.securityKey');
    const hash = createHash('sha256');
    hash.update(concatenatedString);
    return hash.digest('base64');
  }

  async getUpcomingPayment(
    request: FawryInquiryRequestDto,
  ): Promise<FawryInquiryResponseDto> {
    this.logger.debug({
      context: 'getUpcomingPayment was called with data',
      ...request,
    });

    // verify that the sender is Fawry via the signature
    const verificationSignature = this.generateSignature(
      request.serviceCode,
      request.billingAcct,
    );
    if (verificationSignature !== request.signature) {
      this.logger.error({
        context: 'getUpcomingPayment failed',
        message: 'Invalid signature',
        expectedSignature: verificationSignature,
        request,
      });
      return new FawryInquiryResponseDto({
        statusCode: FawryStatusCode.AuthError,
        description: 'Message Authentication Error',
        signature: this.generateSignature(FawryStatusCode.AuthError, ''),
      });
    }
    this.logger.debug({
      context: 'getUpcomingPayment',
      message: 'Signature verified',
    });

    const isValidPhoneNumber = FawryService.EGYPTIAN_PHONE_NUMBER_REGEX.test(
      request.billingAcct,
    );

    if (!isValidPhoneNumber) {
      return new FawryInquiryResponseDto({
        statusCode: FawryStatusCode.InvalidAcc,
        description: 'Invalid Billing Account (Length or Formatting)',
        signature: this.generateSignature(FawryStatusCode.InvalidAcc, ''),
      });
    }
    this.logger.debug({
      context: 'getUpcomingPayment',
      message: 'Phone number validated',
    });

    try {
      const customerLoans = await this.hasuraService.getConsumerUpcomingPayment(
        `+2${request.billingAcct}`,
      );
      if (!customerLoans) {
        return new FawryInquiryResponseDto({
          statusCode: FawryStatusCode.NoBill,
          description: 'Bill not available for payment or no payment dues',
          signature: this.generateSignature(FawryStatusCode.NoBill, ''),
        });
      }
      this.logger.debug({
        context: 'getUpcomingPayment',
        message: 'Customer loans fetched',
        customerLoans,
      });
      const receiptMessage = [
        `اسم العميل: ${customerLoans.consumerFullName}`,
        'برجاء العلم أن الأقساط المدفوعة تشمل أقساط مايلو فقط',
        'للدعم والاستفسارات الرجاء الاتصال على 15070',
      ];
      const response: FawryInquiryResponseDto = new FawryInquiryResponseDto({
        statusCode: FawryStatusCode.Success,
        description: 'Success',
        amount: `${(customerLoans.amount / 100).toFixed(2)}`,
        dueDate: customerLoans.dueDate,
        issueDate: '',
        extraBillInfo: receiptMessage.join(';'),
        signature: this.generateSignature(
          FawryStatusCode.Success,
          `${customerLoans.amount}`,
        ),
      });

      this.logger.debug({
        context: 'getUpcomingPayment was called with data',
        ...response,
      });

      return response;
    } catch (err) {
      this.logger.error({ context: 'getUpcomingPayment failed', err });

      if (err instanceof RecordNotFoundException) {
        return new FawryInquiryResponseDto({
          statusCode: FawryStatusCode.NotFoundAcc,
          description: 'Billing Account does not existed',
          signature: this.generateSignature(FawryStatusCode.NotFoundAcc, ''),
        });
      }

      if (err instanceof InvalidInputException) {
        return new FawryInquiryResponseDto({
          statusCode: FawryStatusCode.InvalidAcc,
          description: 'Invalid Billing Account (Length or Formatting)',
          signature: this.generateSignature(FawryStatusCode.InvalidAcc, ''),
        });
      }

      // Unknown errors, Nest will return 500 response and log the actual error message
      throw new HttpException(
        'Get upcoming payment failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: err,
        },
      );
    }
  }

  async bookPayment(request: FawryNotifyRequestDto) {
    this.logger.debug({
      context: 'bookPayment was called with data',
      ...request,
    });

    // if formance service is not available, return an error because we cannot accept payments
    if (!(await this.formanceService.isServiceAvailable())) {
      throw new HttpException(
        'System is unable to receive payments at the moment',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    // verify that the sender is Fawry via the signature
    const verificationSignature = this.generateSignature(
      request.serviceCode,
      request.billingAcct,
      request.amount,
    );
    if (verificationSignature !== request.signature) {
      this.logger.error({
        context: 'bookPayment failed',
        message: 'Invalid signature',
        expectedSignature: verificationSignature,
        request,
      });
      return new FawryNotifyResponseDto({
        statusCode: FawryStatusCode.AuthError,
        description: 'Message Authentication Error',
        signature: this.generateSignature(FawryStatusCode.AuthError, ''),
      });
    }
    this.logger.debug({
      context: 'bookPayment',
      message: 'Signature verified',
    });

    // check if this payment has already been registered in the system
    const existingPayment = await this.formanceService.findPayment(
      request.paymentId,
    );

    let executionId: string = '';

    if (existingPayment && !request.isRetry) {
      return new FawryNotifyResponseDto({
        statusCode: FawryStatusCode.DuplicatePayment,
        description: 'Duplicate payment transaction',
        billerPmtId: existingPayment.metadata.workflowId,
        extraBillInfo: 'شكرا لاستخدامكم خدمات مايلو للتمويل الاستهلاكي',
        signature: this.generateSignature(
          FawryStatusCode.DuplicatePayment,
          existingPayment.metadata.workflowId,
        ),
      });
    } else if (existingPayment && request.isRetry) {
      // a workflow has already been initiated for this payment, return the same executionId
      executionId = existingPayment.metadata.workflowId;
    } else {
      this.logger.debug({
        context: 'bookPayment',
        message: 'Payment not found in Formance',
      });
      let consumerFormanceAccountId: string;
      const formanceAccount =
        await this.hasuraService.getConsumerFormanceAccount(
          `+2${request.billingAcct}`,
        );
      console.log(formanceAccount);
      if (!formanceAccount.formanceAccount) {
        consumerFormanceAccountId = await this.formanceService.createAccount(
          formanceAccount.id,
        );
      } else {
        consumerFormanceAccountId = formanceAccount.formanceAccount.id;
      }
      // verify that the amount sent by Fawry is the same amount expected by the system, reject otherwise
      const consumerLoans = await this.hasuraService.getConsumerUpcomingPayment(
        `+2${request.billingAcct}`,
      );
      this.logger.debug({
        context: 'bookPayment',
        message: 'Consumer loans fetched',
        consumerLoans,
      });
      // sum all due amounts in the unpaid schedules (principal + interest + late fee)
      const totalDueAmount = consumerLoans.unpaidSchedules.reduce(
        (acc, schedule) => {
          return (
            acc +
            schedule.due_principal +
            schedule.due_interest +
            schedule.due_late_fee
          );
        },
        0,
      );

      // if the amount sent by Fawry is not the same as the total due amount, return an error
      const requestAmountInCents = Math.round(parseFloat(request.amount) * 100);
      if (totalDueAmount !== requestAmountInCents) {
        return new FawryNotifyResponseDto({
          statusCode: FawryStatusCode.PaymentAmountValidationErro,
          description: 'Payment Amount validation Error',
          signature: this.generateSignature(
            FawryStatusCode.PaymentAmountValidationErro,
            '',
          ),
        });
      }
      this.logger.debug({
        context: 'bookPayment',
        message: 'Amount validated',
      });
      // Now create the payment in Formance
      const dateInCairo = DateTime.fromISO(request.clientDt, {
        zone: 'Africa/Cairo',
      });
      const payment = await this.formanceService.createPayment({
        amount: requestAmountInCents,
        createdAt: dateInCairo.toJSDate(),
        reference: request.paymentId,
        sourceAccountID: this.worldPaymentAccountId,
        destinationAccountID: consumerFormanceAccountId,
      });

      // initiate a new workflow for this payment
      const myloRepayments = consumerLoans.unpaidSchedules.map((schedule) => ({
        loan_id: schedule.loan_id,
        loan_schedule_id: schedule.id,
        amount:
          schedule.due_principal +
          schedule.due_interest +
          schedule.due_late_fee,
        collected_as_early_settlement: false,
        due_principal: schedule.due_principal,
        due_interest: schedule.due_interest,
        due_late_fee: schedule.due_late_fee,
        due_date: schedule.due_date,
      }));
      executionId = await this.orkesService.initConsumerRepaymentWorkflow(
        {
          consumer_id: consumerLoans.consumerId,
          booking_time: dateInCairo.toUTC().toString(),
          payment_channel: PAYMENT_CHANNEL,
          payment_details: {
            id: request.paymentId,
            booking_time: dateInCairo.toUTC().toString(),
            raw_request: request,
            amount_currency: 'EGP',
            amount_units: requestAmountInCents,
            channel: PAYMENT_CHANNEL,
            collected_as_early_settlement: false,
          },
          mylo_repayments: myloRepayments,
          fawry_payment_details: {
            ...request,
            amount: requestAmountInCents,
            myloRepayments: JSON.stringify(myloRepayments),
            consumerId: consumerLoans.consumerId,
          },
        },
        request.paymentId,
      );
      this.logger.debug({
        context: 'bookPayment',
        message: 'Workflow initiated',
        executionId,
      });
      this.formanceService.updatePaymentMetadata(payment.id, {
        ...request,
        amount: requestAmountInCents.toString(),
        myloRepayments: JSON.stringify(myloRepayments),
        consumerId: consumerLoans.consumerId,
        isRetry: request.isRetry.toString(),
        workflowId: executionId,
        paymentChannel: PAYMENT_CHANNEL,
      });
    }

    return new FawryNotifyResponseDto({
      statusCode: FawryStatusCode.Success,
      description: 'Success',
      billerPmtId: executionId,
      extraBillInfo: '',
      signature: this.generateSignature(FawryStatusCode.Success, executionId),
    });
  }
}
