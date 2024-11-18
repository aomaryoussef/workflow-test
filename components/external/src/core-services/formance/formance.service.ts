import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { SDK, SDKOptions } from '@formance/formance-sdk';
import {
  AccountType,
  Payment,
  PaymentScheme,
  PaymentStatus,
  PaymentType,
} from '@formance/formance-sdk/sdk/models/shared';
import { CustomLoggerService } from '../logger/logger.service';
import { LoggerFactory } from 'src/core-services/logger/types';
import { CreatePaymentResponse } from '@formance/formance-sdk/sdk/models/operations';

@Injectable()
export class FormanceService {
  private formanceSDK: SDK;
  private baseURL: string;
  private clientId: string;
  private clientSecret: string;
  private connectorId: string;
  private assetId = 'EGP/2';
  private requireLogin: boolean;
  private readonly logger: CustomLoggerService;

  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory('formance');
    this.baseURL = this.configService.get<string>('formance.baseURL');
    this.requireLogin = this.configService.get<boolean>(
      'formance.requireLogin',
      false,
    );
    this.clientId = this.configService.get<string>('formance.clientId');
    this.clientSecret = this.configService.get<string>('formance.clientSecret');
    this.connectorId = this.configService.get<string>('formance.connectorId');
    this.init();
  }

  private async init(): Promise<void> {
    this.logger.debug('init');
    let sdkOptions: SDKOptions;
    if (this.requireLogin) {
      sdkOptions = {
        serverURL: this.baseURL,
        security: {
          clientID: this.clientId,
          clientSecret: this.clientSecret,
        },
        timeoutMs: 60000,
      };
    } else {
      sdkOptions = {
        serverURL: this.baseURL,
        timeoutMs: 60000,
      };
    }
    this.logger.debug({
      context: 'init',
      ...sdkOptions,
    });
    this.formanceSDK = new SDK(sdkOptions);
  }

  async createAccount(consumerId: string): Promise<string> {
    try {
      const response = await this.formanceSDK.payments.v1.createAccount({
        accountName: `Internal consumer account for consumer ID ${consumerId}`,
        connectorID: this.connectorId,
        createdAt: new Date(),
        defaultAsset: this.assetId,
        reference: consumerId,
        type: AccountType.Internal,
      });
      if (response.statusCode == 200) {
        return response.paymentsAccountResponse.data.id;
      } else {
        throw Error('Error creating Formance account');
      }
    } catch (error) {
      this.logger.error({
        context: 'Error creating Formance account',
        ...error,
      });
      return null;
    }
  }

  async createPayment(request: {
    amount: number;
    createdAt: Date;
    reference: string;
    sourceAccountID: string;
    destinationAccountID: string;
  }): Promise<Payment> {
    try {
      const paymentPayload = {
        amount: BigInt(request.amount),
        asset: this.assetId,
        connectorID: this.connectorId,
        createdAt: request.createdAt,
        reference: request.reference,
        sourceAccountID: request.sourceAccountID,
        destinationAccountID: request.destinationAccountID,
        scheme: PaymentScheme.Other,
        status: PaymentStatus.Succeeded,
        type: PaymentType.PayIn,
      };
      const createPaymentResponse: CreatePaymentResponse =
        await this.formanceSDK.payments.v1.createPayment(paymentPayload);
      if (createPaymentResponse.statusCode == 200) {
        return createPaymentResponse.paymentResponse.data;
      }
      this.logger.debug({
        context: 'createPayment response',
        ...createPaymentResponse.paymentResponse.data,
      });
      throw Error('Error creating Formance payment');
    } catch (error) {
      this.logger.error({
        context: 'Error creating Formance payment',
        ...error,
      });
      return null;
    }
  }

  async updatePaymentMetadata(
    paymentId: string,
    metadata: Record<string, string>,
  ): Promise<void> {
    try {
      await this.formanceSDK.payments.v1.updateMetadata({
        requestBody: metadata,
        paymentId,
      });
    } catch (error) {
      this.logger.error({
        context: 'Error updating Formance payment metadata',
        ...error,
      });
    }
  }

  async findPayment(referenceId: string): Promise<Payment> {
    try {
      const paymentResponse = await this.formanceSDK.payments.v1.listPayments({
        query: JSON.stringify({
          $match: {
            reference: referenceId,
          },
        }),
      });
      if (
        paymentResponse.statusCode == 200 &&
        paymentResponse.paymentsCursor.cursor.data.length > 0
      ) {
        return paymentResponse.paymentsCursor.cursor.data[0];
      } else {
        return null;
      }
    } catch (error) {
      this.logger.error({
        context: 'Error finding Formance payment',
        ...error,
      });
      return null;
    }
  }

  async isServiceAvailable(): Promise<boolean> {
    try {
      const response = await this.formanceSDK.payments.v1.listPayments({});
      return response.statusCode == 200;
    } catch (error) {
      this.logger.error({
        context: 'Error checking Formance health',
        ...error,
      });
      return false;
    }
  }
}
