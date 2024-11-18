import { LoggerFactory } from '../../../types/logger.interface';
import { CustomLoggerService } from '../../../common/services/logger.service';
import { Inject, Injectable } from '@nestjs/common';
import { HasuraService } from '../../../core-services/hasura/hasura.service';
import {
  BetaConsumerResponse,
  CarModelHasuraApiResponse,
  ClubsHasuraApiResponse,
  GetBetaConsumersByPhoneNumberResponse,
  GetConsumerDataHasuraApiResponse,
  GetConsumerIdByIamIdHasuraApiResponse,
  getConsumerOnboardingStatusResponse,
  GovernoratesHasuraApiResponse,
  HouseTypesHasuraApiResponse,
  JobsHasuraApiResponse,
  MaritalStatusHasuraApiResponse,
  CheckIfNationalIdExistedResponse,
  ConsumerLoansResponse,
} from './types/consumer.types';
import {
  checkIfNationalIdExistedQuery,
  getBetaConsumersByPhoneNumberQuery,
  getCarModelsQuery,
  getClubsQuery,
  getConsumerDataQuery,
  getConsumerIdByIamIdQuery,
  getConsumerLoansQuery,
  getConsumerOnboardingStatusQuery,
  getGovernoratesQuery,
  getHouseTypesQuery,
  getJobsQuery,
  getMaritalStatusQuery,
} from './queries/consumer.queries';
import {
  ConsumerDataDto,
  CreateConsumerProfileInputData,
  OnboardConsumerOutputDto,
} from '../dto/consumer.dto';
import { settings } from '../../../../config/settings';
import { firstValueFrom } from 'rxjs';
import { ConsumerApplicationOutputDto } from '../dto/onboarding-application.dto';
import { HttpService } from '@nestjs/axios';
import { TraceIdService } from '../../../common/services/trace-id.service';
import camelcaseKeys from 'camelcase-keys';
import { PaginationResponse } from '../dto/pagination-response';

@Injectable()
export class ConsumerRepository {
  private readonly logger: CustomLoggerService;

  constructor(
    @Inject('CUSTOM_LOGGER')
    private readonly loggerFactory: LoggerFactory,
    private readonly hasura: HasuraService,
    private readonly httpService: HttpService,
    private readonly tracingService: TraceIdService,
  ) {
    this.logger = this.loggerFactory(ConsumerRepository.name);
  }

  private header = {
    headers: {
      'Content-Type': 'application/json',
      'x-trace-id': this.tracingService.getTraceId(),
    },
  };

  async startConsumerOnboarding(phoneNumber: string) {
    try {
      const result = this.httpService.post<OnboardConsumerOutputDto>(
        `${settings.valueAddedService.baseUrl}/consumers/onboarding`,
        {
          phoneNumber: phoneNumber,
        },
        this.header,
      );
      return camelcaseKeys((await firstValueFrom(result)).data, { deep: true });
    } catch (error) {
      this.logger.error({
        error: error.stack,
      });
      throw new Error('Failed to create consumer identity');
    }
  }

  async verifyOnboardingOtpStep(phoneNumber: string, step: string) {
    try {
      const result = this.httpService.put<ConsumerApplicationOutputDto>(
        `${settings.valueAddedService.baseUrl}/consumers/${phoneNumber}/onboarding/application/step`,
        {
          step: step,
        },
        this.header,
      );
      return camelcaseKeys((await firstValueFrom(result)).data, { deep: true });
    } catch (error) {
      this.logger.error({
        error: error.stack,
      });
      throw new Error('Otp verification step failed');
    }
  }

  async isBetaConsumer(phoneNumber: string): Promise<BetaConsumerResponse> {
    try {
      this.logger.debug(
        `Checking if consumer: ${phoneNumber} is in beta onboarding list`,
      );

      const result =
        await this.hasura.executeQuery<GetBetaConsumersByPhoneNumberResponse>(
          getBetaConsumersByPhoneNumberQuery,
          { phoneNumber },
          'GetBetaConsumerByPhoneNumber',
        );

      // Check if beta_consumers array is not empty
      const isBetaUser = result.data.beta_consumers.length > 0;

      // Create response
      return {
        data: {
          isBetaConsumer: isBetaUser,
        },
      };
    } catch (error) {
      this.logger.error({ error: error.stack });
      throw new Error('Failed to check if consumer is in beta onboarding list');
    }
  }

  async getOnboardingApplicationStatus(phoneNumber: string) {
    try {
      const result =
        await this.hasura.executeQuery<getConsumerOnboardingStatusResponse>(
          getConsumerOnboardingStatusQuery,
          {
            phoneNumber: phoneNumber,
          },
          'GetOnboardingApplicationStatus',
        );

      this.logger.debug(
        `getOnboardingApplicationStatus graphql response ${JSON.stringify(result)}`,
      );
      return camelcaseKeys(result, { deep: true });
    } catch (error) {
      this.logger.error({
        message: 'Failed to fetch onboarding application status',
        error: error.stack,
      });
      throw new Error('Failed to fetch onboarding application status');
    }
  }

  async createConsumerApplication(
    phoneNumber: string,
    data: CreateConsumerProfileInputData,
  ) {
    try {
      const result = this.httpService.post<any>(
        `${settings.valueAddedService.baseUrl}/consumers/${phoneNumber}/onboarding/kyc`,
        data,
        this.header,
      );

      const response = camelcaseKeys((await firstValueFrom(result)).data, {
        deep: true,
      });

      this.logger.debug(
        `create consumer application response: ${JSON.stringify(response)}`,
      );
      return response;
    } catch (error) {
      this.logger.error({
        message: 'Failed to fetch onboarding application status',
        error: error.stack,
      });
      throw new Error('Failed to fetch onboarding application status');
    }
  }

  async getGovernorates(
    page: number,
    limit: number,
    lang: string,
  ): Promise<{ data: any; totalCount: number }> {
    const offset = (page - 1) * limit;

    const variables = {
      limit: limit,
      offset: offset,
    };
    try {
      const query = getGovernoratesQuery(lang);

      const result =
        await this.hasura.executeQuery<GovernoratesHasuraApiResponse>(
          query,
          variables,
          'GetGovernorates',
        );

      const response = result.data.governorates;

      this.logger.debug(`getGovernorates result: ${JSON.stringify(result)}`);
      return {
        data: camelcaseKeys(response, { deep: true }),
        totalCount: result.data.governorates_aggregate.aggregate.count,
      };
    } catch (error) {
      this.logger.error({
        message: 'Failed to fetch governorates from hasura',
        error: error.stack,
      });
      throw new Error('Failed to fetch governorates from hasura');
    }
  }

  async getCities(
    page: number,
    limit: number,
    lang: string,
    governorateId?: number,
  ): Promise<{ data: any; totalCount: number }> {
    const offset = (page - 1) * limit;
    const governorateVariable = governorateId ? ', $governorateId: Int!' : '';
    const filter = governorateId
      ? 'where: {governorate_id: {_eq: $governorateId}}'
      : '';

    const operation = `
      query GetCities($limit: Int!, $offset: Int!${governorateVariable}) {
        cities(limit: $limit, offset: $offset${filter ? ',' + filter : ''}, order_by: {name_${lang}: asc}) {
          name: name_${lang}
          id
          governorate_id
        }
        cities_aggregate${filter ? '(' + filter + ')' : ''} {
          aggregate {
            count
          }
        }
      }
    `;
    const variables = {
      limit: limit,
      offset: offset,
    };

    if (governorateId) {
      variables['governorateId'] = governorateId;
    }

    try {
      const result = await this.hasura.executeQuery<any>(
        operation,
        variables,
        'GetCities',
      );

      const response = result.data.cities;

      this.logger.debug(`getCities result: ${JSON.stringify(result)}`);
      return {
        data: camelcaseKeys(response, { deep: true }),
        totalCount: result.data.cities_aggregate.aggregate.count,
      };
    } catch (error) {
      this.logger.error({
        message: 'Failed to fetch cities from hasura',
        error: error.stack,
      });
      throw new Error('Failed to fetch cities from hasura');
    }
  }

  async getAreas(
    page: number,
    limit: number,
    lang: string,
    governorateId: number | null = null,
    cityId: number | null = null,
  ): Promise<{ data: any; totalCount: number }> {
    const offset = (page - 1) * limit;
    // Initialize variables with limit and offset
    const variables: { [key: string]: string | number } = {
      limit: limit,
      offset: offset,
    };

    // Initialize filters and query variables
    const filters: string[] = [];
    const queryVariables: string[] = [];

    if (governorateId) {
      variables['governorateId'] = governorateId;
      filters.push(`{governorate_id: { _eq: $governorateId } }`);
      queryVariables.push('$governorateId: Int!');
    }

    if (cityId) {
      variables['cityId'] = cityId;
      filters.push(`{ city_id: { _eq: $cityId } }`);
      queryVariables.push('$cityId: Int!');
    }

    // Build the filter and variable strings
    const filter =
      filters.length > 0 ? `where: {_and: [${filters.join(', ')}]}` : '';
    const variableString =
      queryVariables.length > 0 ? `, ${queryVariables.join(', ')}` : '';
    try {
      const operation = `
      query GetAreas($limit: Int!, $offset: Int!${variableString}) {
        areas(limit: $limit, offset: $offset${filter ? ',' + filter : ''}, order_by: {name_${lang}: asc}) {
          name: name_${lang}
          id
          city_id
          governorate_id
        }
        areas_aggregate${filter ? '(' + filter + ')' : ''} {
          aggregate {
            count
          }
        }
      }
    `;

      const result = await this.hasura.executeQuery<any>(
        operation,
        variables,
        'GetAreas',
      );

      const response = result.data.areas;

      this.logger.debug(`getAreas result: ${JSON.stringify(result)}`);
      return {
        data: camelcaseKeys(response, { deep: true }),
        totalCount: result.data.areas_aggregate.aggregate.count,
      };
    } catch (error) {
      this.logger.error({
        message: 'Failed to fetch areas from hasura',
        error: error.stack,
      });
      throw new Error('Failed to fetch areas from hasura');
    }
  }

  async getJobs(
    page: number,
    limit: number,
    lang: string,
  ): Promise<PaginationResponse<any>> {
    console.log('getJobs page', page);
    console.log('getJobs limit', limit);
    const offset = (page - 1) * limit;
    const variables = {
      limit: limit,
      offset: offset,
    };
    try {
      const query = getJobsQuery(lang);

      const result = await this.hasura.executeQuery<JobsHasuraApiResponse>(
        query,
        variables,
        'GetJobs',
      );
      this.logger.debug(`getJobs result: ${JSON.stringify(result)}`);

      const response = result.data.jobs;

      return {
        data: camelcaseKeys(response, { deep: true }),
        totalCount: result.data.jobs_aggregate.aggregate.count,
      };
    } catch (error) {
      this.logger.error({
        message: 'Failed to fetch jobs from hasura',
        error: error.stack,
      });
      throw new Error('Failed to fetch jobs from hasura');
    }
  }

  async getCarModels(
    page: number,
    limit: number,
    lang: string,
  ): Promise<PaginationResponse<any>> {
    const offset = (page - 1) * limit;

    const variables = {
      limit: limit,
      offset: offset,
    };

    try {
      const query = getCarModelsQuery(lang);

      const result = await this.hasura.executeQuery<CarModelHasuraApiResponse>(
        query,
        variables,
        'GetCarModels',
      );
      this.logger.debug(`getCarModels result: ${JSON.stringify(result)}`);

      const response = result.data.car_models;

      return {
        data: camelcaseKeys(response, { deep: true }),
        totalCount: result.data.car_models_aggregate.aggregate.count,
      };
    } catch (error) {
      this.logger.error({
        message: 'Failed to fetch car models from hasura',
        error: error.stack,
      });
      throw new Error('Failed to fetch car models from hasura');
    }
  }

  async getConsumerMaritalStatusLookup(
    page: number,
    limit: number,
    lang: string,
  ): Promise<PaginationResponse<any>> {
    const offset = (page - 1) * limit;

    const variables = {
      limit: limit,
      offset: offset,
    };
    try {
      const query = getMaritalStatusQuery(lang);

      const result =
        await this.hasura.executeQuery<MaritalStatusHasuraApiResponse>(
          query,
          variables,
          'GetMaritalStatus',
        );

      this.logger.debug(`getMaritalStatus result: ${JSON.stringify(result)}`);
      const response = result.data.consumer_marital_status;

      return {
        data: camelcaseKeys(response, { deep: true }),
        totalCount:
          result.data.consumer_marital_status_aggregate.aggregate.count,
      };
    } catch (error) {
      this.logger.error({
        message: 'Failed to fetch marital statuses from hasura',
        error: error.stack,
      });
      throw new Error('Failed to fetch marital statuses from hasura');
    }
  }

  async getClubsLookup(
    page: number,
    limit: number,
    lang: string,
  ): Promise<PaginationResponse<any>> {
    const offset = (page - 1) * limit;

    const variables = {
      limit: limit,
      offset: offset,
    };
    try {
      const query = getClubsQuery(lang);

      const result = await this.hasura.executeQuery<ClubsHasuraApiResponse>(
        query,
        variables,
        'GetClubs',
      );

      this.logger.debug(`getClubs result: ${JSON.stringify(result)}`);
      const response = result.data.clubs;

      return {
        data: camelcaseKeys(response, { deep: true }),
        totalCount: result.data.clubs_aggregate.aggregate.count,
      };
    } catch (error) {
      this.logger.error({
        message: 'Failed to fetch clubs from hasura',
        error: error.stack,
      });
      throw new Error('Failed to fetch clubs from hasura');
    }
  }

  async getConsumerHouseTypesLookup(
    page: number,
    limit: number,
    lang: string,
  ): Promise<PaginationResponse<any>> {
    const offset = (page - 1) * limit;

    const variables = {
      limit: limit,
      offset: offset,
    };
    try {
      const query = getHouseTypesQuery(lang);

      const result =
        await this.hasura.executeQuery<HouseTypesHasuraApiResponse>(
          query,
          variables,
          'GetHouseTypes',
        );

      this.logger.debug(`getHouseTypes result: ${JSON.stringify(result)}`);
      const response = result.data.consumer_house_type;

      return {
        data: camelcaseKeys(response, { deep: true }),
        totalCount: result.data.consumer_house_type_aggregate.aggregate.count,
      };
    } catch (error) {
      this.logger.error({
        message: 'Failed to fetch house types from hasura',
        error: error.stack,
      });
      throw new Error('Failed to fetch house types from hasura');
    }
  }

  async getConsumerDataByPhoneNumber(
    consumerId: string,
  ): Promise<ConsumerDataDto> {
    try {
      const result =
        await this.hasura.executeQuery<GetConsumerDataHasuraApiResponse>(
          getConsumerDataQuery,
          {
            consumerId: consumerId,
          },
          'GetConsumerData',
        );

      this.logger.debug(`getConsumerData result: ${JSON.stringify(result)}`);

      if (
        result.data?.consumer_user_details == null ||
        result.data.consumer_user_details.length === 0
      ) {
        throw new Error('Consumer not found');
      }

      const data = result.data.consumer_user_details[0];
      const status = data?.new_consumer?.consumer_states?.[0]?.state || '';
      const consumer_iam_id = data?.new_consumer?.identity_id || '';
      const phone_number =
        result.data?.consumer_phone[0]?.phone_number_e164 || '';
      const credit_limit =
        result.data.consumer_credit_limits[0]?.available_credit_limit ?? 0;

      return {
        data: {
          id: data.consumer_id,
          first_name: data.first_name,
          last_name: data.last_name,
          credit_limit: credit_limit,
          status: status,
          iam_id: consumer_iam_id,
          phone_number: phone_number,
        },
      };
    } catch (error) {
      this.logger.error({
        message: 'Failed to fetch consumer data from hasura',
        error: error.stack,
      });
      throw new Error('Failed to fetch consumer data from hasura');
    }
  }

  async getConsumerIdByIamId(iamId: string): Promise<string> {
    try {
      const result =
        await this.hasura.executeQuery<GetConsumerIdByIamIdHasuraApiResponse>(
          getConsumerIdByIamIdQuery,
          {
            iamId: iamId,
          },
          'GetConsumerIdByIamIdQuery',
        );

      this.logger.debug(
        `getConsumerIdByIamId result: ${JSON.stringify(result)}`,
      );

      if (result.data.consumers.length === 0) {
        throw new Error('Consumer not found');
      }

      return result.data.consumers[0].id;
    } catch (error) {
      this.logger.error({
        message: 'Failed to fetch consumer id from hasura',
        error: error.stack,
      });
      throw new Error('Failed to fetch consumer id from hasura');
    }
  }

  async checkIfNationalIdExisted(nationalId: string): Promise<string | null> {
    try {
      const response =
        await this.hasura.executeQuery<CheckIfNationalIdExistedResponse>(
          checkIfNationalIdExistedQuery,
          {
            nationalId: nationalId,
          },
          'CheckIfNationalIdExistedQuery',
        );
      return (
        response.data.consumers?.[0]?.phone_number ||
        response.data.new_consumers?.[0]?.consumer_phones?.[0]?.phone_number_e164 || null
      );
    } catch (error) {
      this.logger.error({
        message: 'Failed to check if national id existed from hasura',
        error: error.stack,
      });
      throw new Error('Failed to check if national id existed from hasura');
    }
  }

  async getConsumerLoans(consumerId: string): Promise<any> {
    try {
      const response = await this.hasura.executeQuery<ConsumerLoansResponse>(
        getConsumerLoansQuery,
        {
          consumerId,
        },
        'GetConsumerLoans',
      );
      return response.data.loan;
    } catch (error) {
      this.logger.error({
        message: `Failed to fetch consumer: ${consumerId} loans from hasura `,
        error: error.stack,
      });
      throw error;
    }
  }
}
