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
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly phoneSafeList = settings.app.phoneNumbersSafeList;
  private readonly useTestData = settings.app.useTestData;
  private readonly apiUrl = settings.greenService.baseUrl;
  private readonly apiKey = settings.greenService.apiKey;

  constructor(private readonly httpService: HttpService) {}

  async sendSms(
    templateId: string,
    recipient: string,
    sendProvider: string = 'vodafone',
    templateParameters: Record<string, any>,
  ): Promise<string | null> {
    this.logger.debug(`send sms to: ${recipient}`);
    try {
      // Remove the country code if it exists. Example: +201234567890 -> 201234567890
      const phoneNumber = recipient.startsWith('+2')
        ? recipient.slice(2)
        : recipient;
      this.logger.debug(
        `SMS parameters are: ${JSON.stringify(templateParameters)}`,
      );

      // If we are using test data, only send SMS to numbers in the safe list
      if (this.useTestData && !this.phoneSafeList.includes(phoneNumber)) {
        return null;
      }

      const requestBody = {
        channel: 'sms',
        priority: 1,
        sender: 'mylo',
        recipient_list: phoneNumber,
        template_id: templateId,
        send_provider: sendProvider,
        template_parameters: templateParameters,
      };
      this.logger.debug(`SMS parameters are: ${JSON.stringify(requestBody)}`);

      const headers: AxiosRequestConfig['headers'] = {
        'Content-Type': 'application/json',
        accept: 'application/json',
        'API-Key': this.apiKey,
      };

      const response: AxiosResponse = await firstValueFrom(
        this.httpService
          .post(`${this.apiUrl}/api/v1/notifications/send`, requestBody, {
            headers,
          })
          .pipe(timeout(5000)), // Set the timeout to 5 seconds
      );

      if (response.status !== 201) {
        this.logger.error(
          `An error occurred send sms with status code: ${response.status}`,
        );
        throw new GenericError(`Failed to send SMS: ${response.data}`);
      }
      this.logger.debug(`send sms response: ${response.data.request_id}`);
      // Return: {"request_id": "d598ce33-656a-4aba-a379-718b869d9b8f"}
      return response.data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        this.logger.error('Timeout occurred while waiting for SMS sending API');
        throw new ServiceUnavailableError(
          'SMS sending service is currently unavailable. Please try again later.',
        );
      } else if (error.response) {
        // API response returned an error
        this.logger.error(
          `Error response received from SMS sending API: ${error.response.status}, ${error.response.data}`,
        );
        throw new BadRequestError(
          `Error response received from SMS sending API: ${error.response.data}`,
        );
      } else {
        // Handle generic errors such as network issues, or request not being sent
        this.logger.error(
          `Error occurred while sending request to SMS sending API: ${error.message}`,
        );
        throw new GenericError(
          'Something went wrong while communicating with the SMS sending service. Might be a network issue. Please try again later.',
        );
      }
    }
  }
}
