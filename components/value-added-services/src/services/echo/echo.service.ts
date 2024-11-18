import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { firstValueFrom, timeout } from 'rxjs';
import { settings } from '../../../config/settings';
import {
  BadRequestError,
  GenericError,
  ServiceUnavailableError,
} from '../../exceptions/custom-exceptions';

@Injectable()
export class EchoService {
  private readonly logger = new Logger(EchoService.name);
  private readonly phoneSafeList = settings.app.phoneNumbersSafeList;
  private readonly useTestData = settings.app.useTestData;
  private readonly apiUrl = settings.echoService.baseUrl;
  private readonly apiKey = settings.echoService.apiKey;

  constructor(private readonly httpService: HttpService) {}

  async generateOtp(userId: string, recipient: string): Promise<string | null> {
    try {
      // Remove the country code if it exists. Example: +201234567890 -> 201234567890
      recipient = recipient.startsWith('+2') ? recipient.slice(2) : recipient;
      // If we are using test data, only send OTP to numbers in the safe list
      if (this.useTestData && !this.phoneSafeList.includes(recipient)) {
        return '123456';
      }

      const headers: AxiosRequestConfig['headers'] = {
        'Content-Type': 'application/json',
        'API-Key': this.apiKey,
      };

      const payload = { user_id: userId };
      this.logger.log(`otp parameters are: ${JSON.stringify(payload)}`);

      const response: AxiosResponse = await firstValueFrom(
        this.httpService
          .post(`${this.apiUrl}/api/v1/otp/generate`, payload, { headers })
          .pipe(timeout(5000)), // Set the timeout to 5 seconds
      );

      if (response.status !== 201) {
        this.logger.error(
          `An error occurred generating otp from ECHO with status code: ${response.status}`,
        );
        this.logger.log(
          `failure generating otp from ECHO, response: ${response.data}`,
        );
        throw new GenericError(
          `Failed to generate OTP from ECHO: ${response.data}`,
        );
      }
      this.logger.log(`generate otp from ECHO response: ${response.data}`);
      // example of response {"otp": "123456"}
      return response.data.otp;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        this.logger.error(
          'Timeout occurred while waiting for OTP generation API',
        );
        throw new ServiceUnavailableError(
          'OTP generation service is currently unavailable. Please try again later.',
        );
      } else if (error.response) {
        // API response returned an error
        this.logger.error('Error response received from OTP generation API', {
          error: error.response.data,
          statusCode: error.response.status,
        });
        throw new BadRequestError(
          `Error response received from OTP generation API: ${error.response.data.message}`,
        );
      } else {
        // Handle generic errors such as network issues, or request not being sent
        this.logger.error(
          'Error occurred while sending request to OTP generation API',
          {
            message: error.message,
          },
        );
        throw new GenericError(
          'Something went wrong while communicating with the OTP generation service. Might be a network issue. Please try again later.',
        );
      }
    }
  }
  async verifyOtp(otpCode: string, userId: string): Promise<string> {
    // If we are using test data, only accept the OTP code '123456'
    if (this.useTestData && otpCode === '123456') {
      return 'VERIFIED';
    }
    try {
      const requestBody = { otp_code: otpCode, user_id: userId };
      this.logger.debug(
        `verify otp parameters are: ${JSON.stringify(requestBody)}`,
      );

      const headers: AxiosRequestConfig['headers'] = {
        'Content-Type': 'application/json',
        accept: 'application/json',
        'API-Key': this.apiKey,
      };

      const response: AxiosResponse = await firstValueFrom(
        this.httpService
          .post(`${this.apiUrl}/api/v1/otp/verify`, requestBody, { headers })
          .pipe(timeout(5000)), // Set the timeout to 5 seconds
      );

      if (response.status === 400) {
        return 'NOT_VERIFIED';
      }
      if (response.status !== 200) {
        this.logger.error(
          `An error occurred verify otp with status code: ${response.status}`,
        );
        throw new GenericError(
          `Failed to verify OTP from ECHO: ${response.data}`,
        );
      }

      this.logger.debug(`verify otp response: ${response.data}`);
      return 'VERIFIED';
    } catch (error) {
      if (error.name === 'TimeoutError') {
        this.logger.error(
          'Timeout occurred while waiting for OTP verification API',
        );
        throw new ServiceUnavailableError(
          'OTP verification service is currently unavailable. Please try again later.',
        );
      } else if (error.response) {
        // API response returned an error
        this.logger.error('Error response received from OTP verification API', {
          error: error.response.data,
          statusCode: error.response.status,
        });
        throw new BadRequestError(
          `Error response received from OTP verification API: ${error.response.data.message}`,
        );
      } else {
        // Handle generic errors such as network issues, or request not being sent
        this.logger.error(
          'Error occurred while sending request to OTP verification API',
          {
            message: error.message,
          },
        );
        throw new GenericError(
          'Something went wrong while communicating with the OTP verification service. Might be a network issue. Please try again later.',
        );
      }
    }
  }
}
