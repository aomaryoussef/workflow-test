import { Inject, Injectable } from '@nestjs/common';
import { HasuraService } from '~/core-services/hasura/hasura.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { toPound } from '~/utils/currency.utils';
import { LoggerFactory } from '~/core-services/logger/types';
import { CustomLoggerService } from '~/core-services/logger/logger.service';
export class GetActiveConsumerByPhoneNumberResponseDto {
  data: {
    consumers: [
      {
        id: string;
        status: string;
      },
    ];
  };
}

export const getActiveConsumerByPhoneNumberQuery = `
  query getActiveConsumerByPhoneNumber($phoneNumber: String!) {
    consumers(where: {phone_number: {_eq: $phoneNumber}, status: {_eq: "ACTIVE"}}) {
      id
      status
    }
  }
`;
@Injectable()
export class ConsumerRepository {
  private serviceDepartmentUrl: string;
  private readonly logger: CustomLoggerService;

  constructor(
    private readonly hasuraService: HasuraService,
    private readonly httpService: HttpService,
    private configService: ConfigService,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.serviceDepartmentUrl = this.configService.get<string>(
      'serviceDepartment.url',
    );
    this.logger = this.loggerFactory('paymob consumer repository');
  }

  async getActiveConsumer(
    phoneNumber: string,
  ): Promise<{ id: string; status: string }> {
    this.logger.debug(`getActiveConsumer called with phoneNumber: ${phoneNumber}`);
    try {
      const result: GetActiveConsumerByPhoneNumberResponseDto =
        await this.hasuraService.executeQuery<GetActiveConsumerByPhoneNumberResponseDto>(
          getActiveConsumerByPhoneNumberQuery,
          { phoneNumber },
        );
      const consumers = result.data.consumers;
      if (!consumers) {
        return null;
      }
      return consumers[0];
    } catch (error) {
      this.logger.error('Error fetching active consumer:' + error);
      throw new Error('Unable to fetch active consumer');
    }
  }

  async getConsumerCreditLimit(consumerId: string): Promise<number> {
    this.logger.debug(`getConsumerCreditLimit called with consumerId: ${consumerId}`);
    try {
      const getConsumerCreditLimitUrl = `${this.serviceDepartmentUrl}/consumers/${consumerId}/credit-limit`;
      const { data } = await firstValueFrom(
        this.httpService.get(getConsumerCreditLimitUrl).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data.toString());
            throw 'An error happened!';
          }),
        ),
      );
      let creditLimit = toPound(data.credit_limit);
      return creditLimit;
    } catch (error) {
      this.logger.error('Error fetching consumer credit limit:' + error);
      throw new Error('Unable to fetch consumer credit limit');
    }
  }
}
