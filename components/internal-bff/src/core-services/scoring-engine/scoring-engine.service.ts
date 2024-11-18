import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, timeout } from 'rxjs';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
import { settings } from '../../../config/settings';

import { LoggerFactory } from 'src/types/logger.interface';
import { CustomLoggerService } from 'src/common/services/logger.service';

@Injectable()
export class ScoringEngineService {
  private readonly logger: CustomLoggerService;

  private readonly apiUrl = settings.scoringEngine.url;
  private readonly apiKey = settings.scoringEngine.apiKey;

  constructor(
    private readonly httpService: HttpService,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory(ScoringEngineService.name);
  }


  async checkMiniCashConsumerBySSN(
    ssn: string,
  ): Promise<any> {
    try {
      const headers: AxiosRequestConfig['headers'] = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      };

      const body = {
        query: `
          {
            checkMiniCashConsumer: getCreditLimitBySSN(body: { ssn: "${ssn}" }) {
              userExists
            }
          }`,
      }

      this.logger.debug({ message: 'Sending scoring engine request', body });

      const response: AxiosResponse = await firstValueFrom(
        this.httpService
          .post(this.apiUrl, body, { headers })
          .pipe(timeout(120000)), // Set the timeout to 120 seconds
      );
      this.logger.debug({
        message: 'Received scoring engine response',
        responseData: response.data,
      });

      const data = response.data.data;

      const checkMiniCashConsumer = data.checkMiniCashConsumer;
      return !!checkMiniCashConsumer?.userExists

    } catch (err) {
      this.logger.error({ message: `Error in scoring engine service while checking consumer with SSN ${ssn}`, error: err });
      return false;
    }
  }
  async checkMiniCashConsumerByPhone(
    phoneNumber: string,
  ): Promise<any> {
    try {
      const headers: AxiosRequestConfig['headers'] = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      };

      let phoneNumberWithoutCountryCode;

      if (phoneNumber) {
        // Remove the country code from the phone number if it exists
        phoneNumberWithoutCountryCode = phoneNumber.startsWith('+2')
          ? phoneNumber.slice(2)
          : phoneNumber;
      }
      const body = {
        query: `
          {
            checkMiniCashConsumer: getCreditLimit(body: { mobileNumber: "${phoneNumberWithoutCountryCode}" }) {
              userExists
            }
          }`,
      }
      this.logger.debug({ message: 'Sending scoring engine request', body });

      const response: AxiosResponse = await firstValueFrom(
        this.httpService
          .post(this.apiUrl, body, { headers })
          .pipe(timeout(120000)), // Set the timeout to 120 seconds
      );
      this.logger.debug({
        message: 'Received scoring engine response',
        responseData: response.data,
      });
      const errors = response.data?.errors;
      if (errors) {
        this.logger.debug(`Error in scoring engine response: ${errors}`);
        if (Array.isArray(errors)) {
          const errorMessage = errors[0].message;
          if (
            errorMessage.split(':')[0] === '9 FAILED_PRECONDITION' ||
            errorMessage.split(':')[3] === ' 409'
          ) {
            this.logger.debug('Multiple users found with the same phone number');
            return true;
          }
        }
      }
      const checkMiniCashConsumer = response.data?.data?.checkMiniCashConsumer;
      return !!checkMiniCashConsumer?.userExists

    } catch (err) {
      this.logger.error({ message: `Error in scoring engine service while checking consumer with phone ${phoneNumber}`, error: err });
      return false;
    }
  }
} 
