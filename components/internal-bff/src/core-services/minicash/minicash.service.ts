import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { settings } from '../../../config/settings';
import {
  BadRequestError,
  ServiceUnavailableError,
} from '../../exceptions/custom-exceptions';

@Injectable()
export class MinicashService {
  private readonly logger = new Logger(MinicashService.name);

  private readonly loginUrl = settings.minicash.baseUrl + settings.minicash.loginUrl;
  private readonly getUserDataUrl =
    settings.minicash.baseUrl + '/MiniCashAPI/api/Scoring/GetUserData';
  private readonly username = settings.minicash.username;
  private readonly password = settings.minicash.password;

  constructor(private readonly httpService: HttpService) { }

  /**
   * Authenticates with the Minicash service and retrieves a bearer token.
   * @returns {Promise<string>} The bearer token.
   * @throws {ServiceUnavailableError} If authentication fails.
   */
  private async authenticate(): Promise<string> {
    const params = new URLSearchParams({
      username: this.username,
      password: this.password,
      grant_type: 'password',
    });

    this.logger.debug('Authenticating with Minicash');

    try {
      const tokenResponse: AxiosResponse = await firstValueFrom(
        this.httpService.post(this.loginUrl, params.toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }),
      );
      const bearerToken = tokenResponse.data.access_token;
      this.logger.debug('Token received from Minicash');
      return bearerToken;
    } catch (error) {
      this.logger.error(
        `Failed to authenticate with Minicash: ${error.message}`,
      );
      throw new ServiceUnavailableError(
        'Minicash authentication failed. Please try again later.',
      );
    }
  }

  /**
   * Fetches consumer data from the Minicash service using the provided bearer token and either national ID.
   * @param {string} bearerToken - The bearer token obtained from authentication.
   * @param {string} [nationalId] - The national ID of the consumer.
   * @returns {Promise<any>} The consumer data.
   * @throws {BadRequestError} If the Minicash API returns an error response.
   * @throws {ServiceUnavailableError} If the Minicash service is unavailable.
   */
  private async fetchConsumerData(
    bearerToken: string,
    nationalId: string,
  ): Promise<MinicashUserData> {
    this.logger.debug(
      `Fetching consumer data from Minicash, nationalId: ${nationalId}}`,
    );
    try {
      const consumerResponse: AxiosResponse<FetchMinicashConsumerDataApiResponse> = await firstValueFrom(
        this.httpService.get(this.getUserDataUrl, {
          params: {
            ssn: nationalId,
          },
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }),
      );

      const consumer = consumerResponse.data.Data;
      this.logger.debug(
        `Got consumer with ssn: ${consumer.Ssn} and mobile: ${consumer.MobileNo}`,
      );
      return consumer;
    } catch (error) {
      this.logger.error(`Failed to get user Minicash data: ${error.message}`);
      if (error.status === 500)
        return null;
      else if (error.response) {
        throw new BadRequestError(
          `Error response received from Minicash API: ${error.response.data?.message}`,
        );
      } else {
        throw new ServiceUnavailableError(
          'Minicash service is currently unavailable. Please try again later.',
        );
      }
    }
  }

  /**
   * Retrieves consumer data from the Minicash service by National Id.
   * @param {string} nationalId - The national ID of the consumer.
   * @returns {Promise<any>} The consumer data.
   * @throws {ServiceUnavailableError} If authentication or data retrieval fails.
   */
  async getConsumerMinicashDataByNationalId(nationalId: string): Promise<MinicashUserData> {
    const bearerToken = await this.authenticate();
    return this.fetchConsumerData(bearerToken, nationalId);
  }

}
