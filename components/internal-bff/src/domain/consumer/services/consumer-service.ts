import { CustomLoggerService } from '../../../common/services/logger.service';
import { LoggerFactory } from '../../../types/logger.interface';
import { ConsumerRepository } from '../repository/consumer.repository';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  ConsumerApplicationOutputDto,
  OnboardingApplication,
  OnboardingApplicationStatus,
  OnboardingStep,
} from '../dto/onboarding-application.dto';
import {
  categories,
  CategoryDto,
  ConsumerDataDto,
  ConsumerLoansResponseDto,
  CreateConsumerProfileInputData,
  LoanDto,
  OnboardConsumerOutputDto,
} from '../dto/consumer.dto';
import {
  BasicLookupOutputDto,
  LookupOutputDto,
} from '../dto/lookup-output.dto';
import { PaginationResponse } from '../dto/pagination-response';
import { MinicashService } from 'src/core-services/minicash/minicash.service';
import { ScoringEngineService } from 'src/core-services/scoring-engine/scoring-engine.service';
import { Loan } from '../repository/types/consumer.types';

@Injectable()
export class ConsumerService {
  private readonly logger: CustomLoggerService;

  constructor(
    @Inject('CUSTOM_LOGGER')
    private readonly loggerFactory: LoggerFactory,
    private readonly repository: ConsumerRepository,
    private readonly minicashService: MinicashService,
    private readonly scoringEngineService: ScoringEngineService,
  ) {
    this.logger = this.loggerFactory(ConsumerService.name);
  }

  async getConsumerOnboardingStatus(
    phoneNumber: string,
  ): Promise<OnboardingApplication> {
    try {
      const { data: onboardingStatusResponse } =
        await this.repository.getOnboardingApplicationStatus(phoneNumber);
      const isMinicashConsumer =
        await this.scoringEngineService.checkMiniCashConsumerByPhone(
          phoneNumber,
        );

      this.logger.debug(`isMinicashConsumer: ${isMinicashConsumer}`);
      this.logger.debug(
        `onboardingApplicationStatusResponse ${JSON.stringify(onboardingStatusResponse)}`,
      );

      const onboardingApplicationData =
        onboardingStatusResponse?.consumerApplication?.[0] ?? null;

      this.logger.debug(
        `onboardingApplicationData ${JSON.stringify(onboardingApplicationData)}`,
      );

      if (!onboardingApplicationData || isMinicashConsumer) {
        this.logger.log({
          message: 'getConsumerOnboardingStatus: application status is empty',
        });

        return this.createDefaultOnboardingStatusResponse(isMinicashConsumer);
      }

      this.logger.debug(
        `getConsumerOnboardingStatus: data ${JSON.stringify(onboardingApplicationData)}`,
      );

      return {
        data: {
          step: onboardingApplicationData?.data?.step,
          is_mc: onboardingApplicationData?.data?.isMc,
          status:
            onboardingApplicationData?.consumerApplicationStates[0]?.state,
          flow_id: onboardingApplicationData?.data?.flowId,
        },
        id: onboardingApplicationData.id,
      };
    } catch (error) {
      this.logger.error({
        message:
          'getOnboardingApplicationStatus: failed to fetch onboarding application status',
        error: error.stack,
      });
      throw error;
    }
  }

  private createDefaultOnboardingStatusResponse(
    isMinicashConsumer: boolean,
  ): OnboardingApplication {
    return {
      data: {
        step: isMinicashConsumer
          ? OnboardingStep.OLD_CONSUMER_ONBOARDING
          : OnboardingStep.NEW_CONSUMER_ONBOARDING,
        is_mc: isMinicashConsumer,
        status: OnboardingApplicationStatus.IN_PROGRESS,
        flow_id: '',
      },
      id: '',
    };
  }

  async startConsumerOnboarding(
    phoneNumber: string,
  ): Promise<OnboardConsumerOutputDto> {
    try {
      this.logger.debug(
        'startConsumerOnboarding for phone number ${phoneNumber}',
      );
      return await this.repository.startConsumerOnboarding(phoneNumber);
    } catch (error) {
      this.logger.error({
        message: `Failed to Create Consumer Identity for phone number ${phoneNumber}. Error: ${error.message}`,
        error: error.stack,
      });
      throw new BadRequestException(
        'Failed to Create Consumer Identity for phone number.',
      );
    }
  }

  async verifyOnboardingOtpStep(
    phoneNumber: string,
    step: string,
  ): Promise<ConsumerApplicationOutputDto> {
    try {
      this.logger.log({
        message: `verifyOnboardingOtpStep: execute for phone number ${phoneNumber} and step ${step}`,
      });

      return this.repository.verifyOnboardingOtpStep(phoneNumber, step);
    } catch (error) {
      this.logger.error({
        message: `Failed to verify onboarding OTP step for phone number ${phoneNumber} and step ${step}. Error: ${error.message}`,
        error: error.stack,
      });
      throw new Error('Failed to verify onboarding OTP step');
    }
  }

  async createConsumerApplication(
    phoneNumber: string,
    data: CreateConsumerProfileInputData,
  ): Promise<any> {
    try {
      this.logger.log({
        message: `createConsumerApplication start`,
      });

      return this.repository.createConsumerApplication(phoneNumber, data);
    } catch (error) {
      this.logger.error({
        message: `Failed to create consumer profile. Error: ${error.message}`,
        error: error.stack,
      });
      throw new Error('Failed to create consumer profile');
    }
  }

  async getGovernorates(
    page: number,
    limit: number,
    lang: string,
  ): Promise<any> {
    try {
      return this.repository.getGovernorates(page, limit, lang);
    } catch (error) {
      console.log(JSON.stringify(error));
      this.logger.error({
        message: `Failed to fetch governorates Error: ${error.message}`,
        error: error.stack,
      });
      throw new Error('Failed to fetch governorates');
    }
  }

  async getCities(
    page: number,
    limit: number,
    language: string,
    governorateId?: number,
  ): Promise<any> {
    try {
      return this.repository.getCities(page, limit, language, governorateId);
    } catch (error) {
      console.log(JSON.stringify(error));
      this.logger.error({
        message: `Failed to fetch cities. Error: ${error.message}`,
        error: error.stack,
      });
      throw new Error('Failed to fetch cities');
    }
  }

  async getAreas(
    page: number,
    limit: number,
    language: string,
    governorateId?: number,
    cityId?: number,
  ): Promise<any> {
    try {
      return this.repository.getAreas(
        page,
        limit,
        language,
        governorateId,
        cityId,
      );
    } catch (error) {
      console.log(JSON.stringify(error));
      this.logger.error({
        message: `Failed to fetch areas. Error: ${error.message}`,
        error: error.stack,
      });
      throw new Error('Failed to fetch areas');
    }
  }

  async getConsumerMaritalStatusLookup(
    page: number,
    limit: number,
    lang: string,
  ): Promise<PaginationResponse<LookupOutputDto>> {
    try {
      const result = await this.repository.getConsumerMaritalStatusLookup(
        page,
        limit,
        lang,
      );
      return {
        data: result.data.map(maritalStatus => {
          return {
            id: maritalStatus.id.toString(),
            slug: maritalStatus.status,
            name: maritalStatus.name,
          };
        }),
        totalCount: result.totalCount,
      };
    } catch (error) {
      console.log(JSON.stringify(error));
      this.logger.error({
        message: `Failed to fetch consumer marital statuses. Error: ${error.message}`,
        error: error.stack,
      });
      throw new Error('Failed to fetch consumer marital statuses');
    }
  }

  async getClubsLookup(
    page: number,
    limit: number,
    lang: string,
  ): Promise<PaginationResponse<BasicLookupOutputDto>> {
    try {
      const result = await this.repository.getClubsLookup(page, limit, lang);
      console.log('result:', JSON.stringify(result));
      return {
        data: result.data.map(club => {
          return {
            id: club.id.toString(),
            name: club.name,
          };
        }),
        totalCount: result.totalCount,
      };
    } catch (error) {
      console.log(JSON.stringify(error));
      this.logger.error({
        message: `Failed to fetch consumer house types. Error: ${error.message}`,
        error: error.stack,
      });
      throw new Error('Failed to fetch consumer house types');
    }
  }

  async getConsumerHouseTypesLookup(
    page: number,
    limit: number,
    lang: string,
  ): Promise<PaginationResponse<LookupOutputDto>> {
    try {
      const result = await this.repository.getConsumerHouseTypesLookup(
        page,
        limit,
        lang,
      );
      return {
        data: result.data.map(houseType => {
          return {
            id: houseType.id.toString(),
            slug: houseType.uniqueIdentifier,
            name: houseType.name,
          };
        }),
        totalCount: result.totalCount,
      };
    } catch (error) {
      console.log(JSON.stringify(error));
      this.logger.error({
        message: `Failed to fetch consumer house types. Error: ${error.message}`,
        error: error.stack,
      });
      throw new Error('Failed to fetch consumer house types');
    }
  }

  async getJobs(
    page: number,
    limit: number,
    lang: string,
  ): Promise<PaginationResponse<LookupOutputDto>> {
    try {
      console.log('getJobs page', page);
      console.log('getJobs limit', limit);
      const result = await this.repository.getJobs(page, limit, lang);
      return {
        data: result.data.map(job => {
          return {
            id: job.id.toString(),
            slug: job.uniqueIdentifier,
            name: job.name,
          };
        }),
        totalCount: result.totalCount,
      };
    } catch (error) {
      console.log(JSON.stringify(error));
      this.logger.error({
        message: `Failed to fetch jobs. Error: ${error.message}`,
        error: error.stack,
      });
      throw new Error('Failed to fetch jobs');
    }
  }

  async getCarModels(
    page: number = 1,
    limit: number = 10,
    lang: string,
  ): Promise<PaginationResponse<LookupOutputDto>> {
    try {
      const result = await this.repository.getCarModels(page, limit, lang);
      return {
        data: result.data.map(carModel => {
          return {
            id: carModel.id.toString(),
            slug: carModel.uniqueIdentifier,
            name: carModel.name,
          };
        }),
        totalCount: result.totalCount,
      };
    } catch (error) {
      console.log(JSON.stringify(error));
      this.logger.error({
        message: `Failed to fetch car models. Error: ${error.message}`,
        error: error.stack,
      });
      throw new Error('Failed to fetch car models');
    }
  }

  async getConsumerDataByPhoneNumber(
    phoneNumber: string,
  ): Promise<ConsumerDataDto> {
    try {
      return await this.repository.getConsumerDataByPhoneNumber(phoneNumber);
    } catch (error) {
      console.log(JSON.stringify(error));
      this.logger.error({
        message: `Failed to fetch consumer data. Error: ${error.message}`,
        error: error.stack,
      });
      throw new Error('Failed to fetch consumer data');
    }
  }

  async getNewConsumerIdByIamId(iamId: string): Promise<string> {
    try {
      this.logger.debug(`getNewConsumerIdByIamId for iamId ${iamId}`);
      return await this.repository.getConsumerIdByIamId(iamId);
    } catch (error) {
      console.log(JSON.stringify(error));
      this.logger.error({
        message: `Failed to fetch consumer id by iam id. Error: ${error.message}`,
        error: error.stack,
      });
      throw new Error('Failed to fetch consumer id by iam id');
    }
  }

  async checkIfNationalIdExisted(nationalId: string): Promise<string> {
    try {
      const myloConsumerPhone =
        await this.repository.checkIfNationalIdExisted(nationalId);
      const mincashConsumerData =
        await this.minicashService.getConsumerMinicashDataByNationalId(
          nationalId,
        );
      return myloConsumerPhone || mincashConsumerData?.MobileNo || null;
    } catch (error) {
      this.logger.error({
        message: `Failed to check if national id existed. Error: ${error.message}`,
        error: error.stack,
      });
      throw new Error('Failed to check if national id existed');
    }
  }

  async getConsumerLoans(
    consumerId: string,
    lang: string,
  ): Promise<ConsumerLoansResponseDto> {
    try {
      this.logger.debug('Fetching consumer loans');
      const result = await this.repository.getConsumerLoans(consumerId);
      this.logger.debug(`Consumer loans: ${JSON.stringify(result)}`);
      const mappedLoans = this.mapLoans(result, lang);
      this.logger.debug(
        `Mapped consumer loans: ${JSON.stringify(mappedLoans)}`,
      );
      return {
        loans: mappedLoans,
      };
    } catch (error) {
      this.logger.error({
        message: `Failed to fetch consumer loans. Error: ${error.message}`,
        error: error.stack,
      });
      throw new Error('Failed to fetch consumer loans');
    }
  }

  // Function to map categories
  mapCategoryDetails(categoryKeys: string[], lang: string): CategoryDto[] {
    return categoryKeys.map(key => ({
      slug: key,
      name:
        lang === 'en'
          ? (categories[key]?.enName ?? 'Unknown')
          : (categories[key]?.arName ?? 'غير معروف'),
      icon: categories[key]?.icon ?? '',
    }));
  }

  // Function to map loan data
  mapLoans(loansData: Loan[], lang: string): LoanDto[] {
    return loansData.map(loan => ({
      id: loan.id,
      booked_at: loan.booked_at,
      status: loan.loan_statuses?.[0]?.status,
      total_amount: loan.commercial_offer?.financed_amount,
      partner_name: loan.partner?.name ?? '',
      category_icon: this.mapCategoryDetails(
        loan?.partner?.categories ?? [],
        lang,
      )?.[0]?.icon,
    }));
  }
}
