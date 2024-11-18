import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { createSdk } from '~/core-services/hasura/graphql/sdk';
import { Sdk } from '~/core-services/hasura/graphql/_generated';
import { LoggerFactory } from '~/core-services/logger/types';
import { CustomLoggerService } from '~/core-services/logger/logger.service';
import {
  LoanScheduleDto,
  UpcomingPaymentDto,
} from '~/core-services/hasura/hasura.dto';
import {
  RecordNotFoundException,
  InvalidInputException,
} from '~/core-services/hasura/hasura.exceptions';
import { AxiosResponse } from 'axios';

@Injectable()
export class HasuraService {
  private sdk: Sdk;
  private hasuraUrl: string;
  private readonly logger: CustomLoggerService;
  constructor(
    private configService: ConfigService,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
    private readonly httpService: HttpService,
  ) {
    this.logger = this.loggerFactory('hasura');
    this.hasuraUrl = this.configService.get<string>('hasura.url');
    this.sdk = createSdk(this.hasuraUrl);
  }

  async getConsumerFormanceAccount(
    phoneNumber: string,
  ): Promise<{ id: string; formanceAccount?: { id: string } }> {
    const data = await this.sdk.getConsumerFormanceAccount({ phoneNumber });
    return data.consumers[0];
  }

  async getConsumerUpcomingPayment(
    phoneNumber: string,
  ): Promise<UpcomingPaymentDto | null> {
    const data = await this.sdk.getConsumerLoans({ phoneNumber });
    if (!data.consumers.length) {
      throw new RecordNotFoundException(
        `No consumer found with phone number: ${phoneNumber}`,
      );
    }
    if (data.consumers.length > 1) {
      throw new InvalidInputException(
        `Multiple consumer found with phone number: ${phoneNumber}`,
      );
    }
    const consumer = data.consumers[0];

    if (!consumer.loans?.length) {
      this.logger.log(
        `No loans found for consumer with phone number: ${phoneNumber}`,
      );
      return null;
    }

    const unpaidSchedules = this.aggregateLoanSchedulesPerDueDate(
      consumer.loans,
    );

    if (!unpaidSchedules.length) {
      this.logger.log(
        `All loans are paid for consumer with phone number: ${phoneNumber}`,
      );
      return null;
    }
    // TODO: for now we take only the first unpaid day and  calculate total amount due
    const amount = this.calculateTotalAmountDue(unpaidSchedules[0]);

    const dueDate = unpaidSchedules[0][0].due_date;
    const issueDate = unpaidSchedules[0][0].created_at;
    const unpaidSchedulesIds = `schedule IDs: ${unpaidSchedules[0].map((schedule) => schedule.id).join(',')}`;

    const result = {
      amount: amount,
      dueDate,
      issueDate,
      extraInfo: unpaidSchedulesIds,
      unpaidSchedules: unpaidSchedules[0],
      consumerId: consumer.id,
      consumerFullName: consumer.full_name,
    };

    this.logger.debug({
      context: 'getConsumerUpcomingPayments was called',
      consumerId: consumer.id,
      ...result,
    });

    return result;
  }

  calculateTotalAmountDue(unpaidSchedule: LoanScheduleDto[]): number {
    let amount = 0;
    for (let i = 0; i < unpaidSchedule.length; i++) {
      amount +=
        unpaidSchedule[i].due_principal +
        unpaidSchedule[i].due_interest +
        unpaidSchedule[i].due_late_fee;
    }
    return amount;
  }

  aggregateLoanSchedulesPerDueDate(loans: any[]): LoanScheduleDto[][] {
    const groupedSchedules: { [key: string]: any[] } = {};

    loans.forEach((loan) => {
      loan.loan_schedules.forEach((schedule: any) => {
        if (!schedule.paid_date) {
          const dueDate = schedule.due_date;
          if (!groupedSchedules[dueDate]) {
            groupedSchedules[dueDate] = [];
          }
          groupedSchedules[dueDate].push(schedule);
        }
      });
    });

    const sortedDueDates = Object.keys(groupedSchedules).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    );

    return sortedDueDates.map((dueDate) => groupedSchedules[dueDate]);
  }

  /**
   * Execute a GraphQL query or mutation with the provided query string and variables.
   * @param query The GraphQL query string
   * @param variables The variables to be passed to the query/mutation
   * @returns The result of the query
   */
  async executeQuery<T>(
    query: string,
    variables: Record<string, any>,
  ): Promise<T> {
    const headers = {
      'Content-Type': 'application/json',
    };
    try {
      const response: AxiosResponse<T> = await this.httpService
        .post(this.hasuraUrl, {
          query,
          variables,
          headers,
        })
        .toPromise();
      return response.data;
    } catch (error) {
      // Log the error and rethrow it for higher-level handling
      this.logger.error(
        'Error executing query:' + error.response
          ? error.response.data
          : error.message,
      );
      throw new Error('Failed to execute query');
    }
  }
}
