import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { CustomLoggerService } from 'src/common/services/logger.service';
import { LoggerFactory } from 'src/types/logger.interface';
import { settings } from '../../../config/settings';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HasuraService {
  private readonly logger: CustomLoggerService;

  constructor(
    private readonly httpService: HttpService,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory(HasuraService.name);
  }

  async executeQuery<TResponse>(
    query: string,
    variables: {
      [key: string]: any;
    },
    operationName: string,
  ) {
    try {
      const result = this.httpService.post<TResponse>(
        settings.hasura.baseUrl,
        {
          query: query,
          variables: variables,
          operationName: operationName,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      return (await firstValueFrom(result)).data;
    } catch (e) {
      this.logger.error({
        error: e,
      });
      throw new Error('Failed to execute query');
    }
  }
}
