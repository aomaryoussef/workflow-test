import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, timeout } from 'rxjs';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
import { settings } from '../../../config/settings';
import {
  BadRequestError,
  ServiceUnavailableError,
  GenericError,
} from '../../exceptions/custom-exceptions';
import {
  GetRiskEngineScoreInputDTO,
  GetRiskEngineScoreOutputDTO,
} from './dto/risk-score.dto';
import { ScoringScenarios } from './types/risk-engine.types';

@Injectable()
export class RiskEngineService {
  private readonly logger = new Logger(RiskEngineService.name); // Logger instance

  private readonly apiUrl = settings.riskEngine.url;
  private readonly apiKey = settings.riskEngine.apiKey;

  constructor(private readonly httpService: HttpService) {}

  async getRiskScore(
    bookingTime: string,
    scenario: ScoringScenarios,
    data: GetRiskEngineScoreInputDTO,
  ): Promise<GetRiskEngineScoreOutputDTO> {
    const headers: AxiosRequestConfig['headers'] = {
      'Content-Type': 'application/json',
      'api-key': this.apiKey,
    };

    const params = {
      trace_id: 'custom_trace_id',
    };

    const payload = {
      booking_time: bookingTime,
      scenario,
      data: data,
    };
    // TODO: to add trace_id to params
    // add trace_id as parameter to the request

    this.logger.debug('Sending risk score request', { payload });

    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService
          .post(this.apiUrl, payload, { headers, params })
          .pipe(timeout(60000)), // Set the timeout to 60 seconds
      );
      this.logger.debug('Received risk score response', {
        responseData: response.data,
      });
      // Example of response:
      // {
      //     "consumer_id": "f7ef7538-b878-4c50-a88f-3abea2b8ede6",
      //     "ar_status": "accept",
      //     "calc_credit_limit": 20000,
      //     "pd_predictions": 0.16,
      //     "income_predictions": 8648,
      //     "income_zone": "Yellow Zone",
      //     "final_net_income": 8648,
      //     "cwf_segment": "Tier-4",
      //     "cwf": 2
      // }
      return response.data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        this.logger.error('Timeout occurred while waiting for risk score API');
        throw new ServiceUnavailableError(
          'Risk score service is currently unavailable. Please try again later.',
        );
      } else if (error.response) {
        // API response returned an error
        this.logger.error('Error response received from risk score API', {
          error: error.response.data,
          statusCode: error.response.status,
        });
        throw new BadRequestError(
          `Error response received from risk score API: ${error.response.data.message}`,
        );
      } else {
        // Handle generic errors such as network issues, or request not being sent
        this.logger.error(
          'Error occurred while sending request to risk score API',
          {
            message: error.message,
          },
        );
        throw new GenericError(
          'Something went wrong while communicating with the Risk Engine. Might be a network issue. Please try again later.',
        );
      }
    }
  }
}
