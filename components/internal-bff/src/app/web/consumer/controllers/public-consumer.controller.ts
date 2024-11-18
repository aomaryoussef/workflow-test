import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  OnboardConsumerInputDto,
  OnboardConsumerOutputDto,
} from '../../../../domain/consumer/dto/consumer.dto';
import { OnboardingApplication } from '../../../../domain/consumer/dto/onboarding-application.dto';
import { ConsumerService } from 'src/domain/consumer/services/consumer-service';
import { SetLanguageAndPaginationInterceptor } from '../../../../middlewares/set-language-and-pagination';
import { PaginationResponse } from '../../../../domain/consumer/dto/pagination-response';
import {
  BasicLookupOutputDto,
  LookupOutputDto,
} from '../../../../domain/consumer/dto/lookup-output.dto';
import { PaginationRequest } from 'express';

@ApiTags('consumers')
@Controller('public/consumers')
export class PublicConsumerController {
  constructor(private readonly consumerService: ConsumerService) {}

  @Post('onboarding')
  @ApiResponse({
    status: 200,
    description: 'Onboard a new consumer by phoneNumber',
    type: OnboardConsumerOutputDto,
  })
  async startConsumerOnboarding(
    @Body() onboardConsumerInputDto: OnboardConsumerInputDto,
  ): Promise<OnboardConsumerOutputDto> {
    const phoneNumber = getEgyptianPhoneNumber(
      onboardConsumerInputDto.phoneNumber,
    );
    return await this.consumerService.startConsumerOnboarding(phoneNumber);
  }

  @Get('onboarding/status/:phone_number')
  @ApiResponse({
    status: 200,
    description: 'Get consumer onboarding status by phoneNumber',
    type: OnboardConsumerOutputDto,
  })
  async getConsumerOnboardingStatus(
    @Param('phone_number') phoneNumber: string,
  ): Promise<OnboardingApplication> {
    return await this.consumerService.getConsumerOnboardingStatus(
      getEgyptianPhoneNumber(phoneNumber),
    );
  }

  @Get('lookups/governorates')
  @UseInterceptors(SetLanguageAndPaginationInterceptor)
  @ApiResponse({
    status: 200,
    description: 'Get governorates',
    type: OnboardConsumerOutputDto,
  })
  async getAllGovernorates(
    @Req() req: Request,
  ): Promise<OnboardingApplication> {
    const customReq = req as PaginationRequest;
    const page = customReq.page;
    const limit = customReq.limit;
    const language = customReq.lang;
    return await this.consumerService.getGovernorates(page, limit, language);
  }

  @Get('lookups/cities')
  @UseInterceptors(SetLanguageAndPaginationInterceptor)
  @ApiResponse({
    status: 200,
    description: 'Get cities',
    type: OnboardConsumerOutputDto,
  })
  async getAllCities(
    @Req() req: Request,
    @Query() query: any,
  ): Promise<OnboardingApplication> {
    const customReq = req as unknown as PaginationRequest;
    const page = customReq.page;
    const limit = customReq.limit;
    const language = customReq.lang;
    const govId = isNaN(Number(query.governorateId))
      ? null
      : Number(query.governorateId);

    return await this.consumerService.getCities(page, limit, language, govId);
  }

  @Get('lookups/areas')
  @UseInterceptors(SetLanguageAndPaginationInterceptor)
  @ApiResponse({
    status: 200,
    description: 'Get areas',
    type: OnboardConsumerOutputDto,
  })
  async getAllAreas(
    @Req() req: Request,
    @Query() query: any,
  ): Promise<OnboardingApplication> {
    const customReq = req as unknown as PaginationRequest;
    const page = customReq.page;
    const limit = customReq.limit;
    const language = customReq.lang;
    const govId = isNaN(Number(query.governorateId))
      ? null
      : Number(query.governorateId);
    const cityId = isNaN(Number(query.cityId)) ? null : Number(query.cityId);

    return await this.consumerService.getAreas(
      page,
      limit,
      language,
      govId,
      cityId,
    );
  }

  @Get('lookups/jobs')
  @UseInterceptors(SetLanguageAndPaginationInterceptor)
  @ApiResponse({
    status: 200,
    description: 'Get consumer onboarding jobs',
    type: PaginationResponse<LookupOutputDto>,
  })
  async getJobTypes(
    @Req() req: Request,
  ): Promise<PaginationResponse<LookupOutputDto>> {
    const customReq = req as PaginationRequest;
    const page = customReq.page;
    const limit = customReq.limit;
    console.log('getJobTypes page', page);
    console.log('getJobTypes limit', limit);
    console.log('getJobTypes customReq', customReq);
    const language = customReq.lang;
    return await this.consumerService.getJobs(page, limit, language);
  }

  @Get('lookups/car-models')
  @UseInterceptors(SetLanguageAndPaginationInterceptor)
  @ApiResponse({
    status: 200,
    description: 'Get consumer onboarding jobs',
    type: PaginationResponse<LookupOutputDto>,
  })
  async getCarModels(
    @Req() req: Request,
  ): Promise<PaginationResponse<LookupOutputDto>> {
    const customReq = req as PaginationRequest;
    const page = customReq.page;
    const limit = customReq.limit;
    const language = customReq.lang;
    return await this.consumerService.getCarModels(page, limit, language);
  }

  @Get('lookups/marital-status')
  @UseInterceptors(SetLanguageAndPaginationInterceptor)
  @ApiResponse({
    status: 200,
    description: 'Get martial statuses',
    type: LookupOutputDto,
  })
  async getMaritalStatus(
    @Req() req: Request,
  ): Promise<PaginationResponse<LookupOutputDto>> {
    const customReq = req as PaginationRequest;
    const page = customReq.page;
    const limit = customReq.limit;
    const language = customReq.lang;
    return await this.consumerService.getConsumerMaritalStatusLookup(
      page,
      limit,
      language,
    );
  }

  @Get('lookups/clubs')
  @UseInterceptors(SetLanguageAndPaginationInterceptor)
  @ApiResponse({
    status: 200,
    description: 'Get martial statuses',
    type: LookupOutputDto,
  })
  async getClubs(
    @Req() req: Request,
  ): Promise<PaginationResponse<BasicLookupOutputDto>> {
    const customReq = req as PaginationRequest;
    const page = customReq.page;
    const limit = customReq.limit;
    const language = customReq.lang;
    return await this.consumerService.getClubsLookup(page, limit, language);
  }

  @Get('lookups/house-types')
  @UseInterceptors(SetLanguageAndPaginationInterceptor)
  @ApiResponse({
    status: 200,
    description: 'Get consumer house types',
    type: LookupOutputDto,
  })
  async getHouseTypes(
    @Req() req: Request,
  ): Promise<PaginationResponse<LookupOutputDto>> {
    const customReq = req as PaginationRequest;
    const page = customReq.page;
    const limit = customReq.limit;
    const language = customReq.lang;
    return await this.consumerService.getConsumerHouseTypesLookup(
      page,
      limit,
      language,
    );
  }
}

export function getEgyptianPhoneNumber(phoneNumber: string): string {
  return phoneNumber.startsWith('+2') ? phoneNumber : `+2${phoneNumber}`;
}
