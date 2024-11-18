import { Inject, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, timeout } from 'rxjs';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
import { settings } from '../../../config/settings';
import {
  BadRequestError,
  DuplicateError,
  ServiceUnavailableError,
} from '../../exceptions/custom-exceptions';
import moment from 'moment';
import { LoggerFactory } from 'src/types/logger.interface';
import { CustomLoggerService } from 'src/common/services/logger.service';
import { ConsumerStatus } from 'src/domain/consumer/types/consumer.types';

@Injectable()
export class ScoringEngineService {
  private logger: CustomLoggerService;

  private readonly apiUrl = settings.scoringEngine.url;
  private readonly apiKey = settings.scoringEngine.apiKey;

  constructor(
    private readonly httpService: HttpService,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory(ScoringEngineService.name);
  }

  /**
   * Retrieves the consumer's credit limit from the scoring engine service.
   * @param {string} phoneNumber - The phone number of the consumer.
   * @param {string} [ssn] - The social security number of the consumer (optional).
   * @returns {Promise<any>} The consumer's credit limit data.
   * @throws {ServiceUnavailableError} If the scoring engine service is unavailable or a timeout occurs.
   * @throws {BadRequestError} If the scoring engine API returns an error response.
   * @throws {DuplicateError} If multiple users are found with the same phone number.
   */
  async getConsumerCreditLimit(
    phoneNumber?: string,
    ssn?: string,
  ): Promise<any> {
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

    const body = ssn
      ? {
        query: `
          {
            getCreditLimitQuery: getCreditLimitBySSN(body: { ssn: "${ssn}" }) {
              userExists
              creditLimit
              classification
              creationDate
              status
            }
          }`,
      }
      : {
        query: `
          {
            getCreditLimitQuery: getCreditLimit(body: { mobileNumber: "${phoneNumberWithoutCountryCode}" }) {
              userExists
              creditLimit
              classification
              creationDate
              status
            }
          }`,
      };

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
    const errors = response.data.errors;

    if (data) {
      const creditLimitData = data.getCreditLimitQuery;
      return {
        userExists: creditLimitData.userExists,
        creditLimit: creditLimitData.creditLimit,
        classification: creditLimitData.classification,
        status: creditLimitData.status,
        creationDate: creditLimitData.creationDate,
      };
    } else {
      this.logger.error(`Error in scoring engine response: ${errors}`);
      if (errors) {
        const errorMessage = errors[0].message;
        if (
          errorMessage.split(':')[0] === '9 FAILED_PRECONDITION' ||
          errorMessage.split(':')[3] === ' 409'
        ) {
          throw new DuplicateError(
            'Multiple users found with the same phone number',
          );
        } else {
          throw new BadRequestError(errorMessage);
        }
      }
    }
  }
}

@Injectable()
export class ConsumerStatusFilteringService {
  private readonly logger = new Logger(ConsumerStatusFilteringService.name);

  assignConsumerStatus(
    creditLimit: number,
    classification: string,
    status: string,
    creationDate: string,
  ): ConsumerStatus {
    this.logger.debug('Consumer is mini cash customer');
    const convertedCreationDate = this.convertToDate(creationDate);

    let consumerStatus: ConsumerStatus;

    if (status === 'DECLINED') {
      this.logger.debug('Consumer is blocked due to declined status', {
        status,
        classification,
        creationDate,
        creditLimit,
      });
      consumerStatus = ConsumerStatus.BLOCKED;
    } else if (['N2', 'C', 'C1'].includes(classification)) {
      this.logger.debug(
        "Consumer is blocked due to classification, it's either N2, C, C1",
        {
          status,
          classification,
          creationDate,
          creditLimit,
        },
      );
      consumerStatus = ConsumerStatus.BLOCKED;
    } else if (classification === 'E' && creditLimit >= 20000) {
      this.logger.debug(
        'Consumer is marked as AWAITING_ACTIVATION with status E and CL above 20,000',
        {
          status,
          classification,
          creationDate,
          creditLimit,
        },
      );
      consumerStatus = ConsumerStatus.AWAITING_ACTIVATION;
    }
    //  else if (classification === 'E' && creditLimit < 10000) {
    //   this.logger.debug(
    //     'Consumer is marked as WAITING_LIST with status E and CL below 10,000',
    //     {
    //       status,
    //       classification,
    //       creationDate,
    //       creditLimit,
    //     },
    //   );
    //   consumerStatus = ConsumerStatus.WAITING_LIST;
    // } 
    else if (
      creditLimit === 0 &&
      this.isMoreThanTwoYearsOld(convertedCreationDate)
    ) {
      this.logger.debug(
        'Consumer is marked as WAITING_LIST with CL 0 and creation date more than 2 years old',
        {
          status,
          classification,
          creationDate,
          creditLimit,
        },
      );
      consumerStatus = ConsumerStatus.WAITING_LIST;
    } else if (
      creditLimit === 0 &&
      !this.isMoreThanTwoYearsOld(convertedCreationDate)
    ) {
      this.logger.debug(
        'Consumer is marked as BLOCKED with CL 0 and creation date less than 2 years old',
        {
          status,
          classification,
          creationDate,
          creditLimit,
        },
      );
      consumerStatus = ConsumerStatus.BLOCKED;
    } else {
      consumerStatus = ConsumerStatus.AWAITING_ACTIVATION;
    }

    return consumerStatus;
  }

  parseCreditLimit(creditLimit: number): number {
    this.logger.debug('Parsing credit limit from mini cash');
    return this.resolveCreditLimitFromMC(creditLimit);
  }

  private resolveCreditLimitFromMC(creditLimit: number): number {
    if (typeof creditLimit !== 'number') {
      this.logger.debug(
        `Credit limit is not an integer ${creditLimit}, type: ${typeof creditLimit}`,
      );
      return 0;
    }
    return creditLimit >= 0.0 ? creditLimit * 100 : creditLimit;
  }

  private convertToDate(dateString: string): Date | null {
    try {
      this.logger.debug(
        `Converting date string ${dateString} to datetime object`,
      );
      return moment(dateString, 'YYYY-MM-DD').toDate();
    } catch (exception) {
      this.logger.error(
        `Failed to convert date string ${dateString} to datetime object ${exception}`,
      );
      return null;
    }
  }

  private isMoreThanTwoYearsOld(date: Date): boolean {
    try {
      const twoYearsAgo = moment().subtract(2, 'years').toDate();
      return date < twoYearsAgo;
    } catch (err) {
      this.logger.error(
        `Failed to check if date is more than two years old ${err}`,
      );
      return false;
    }
  }
}
