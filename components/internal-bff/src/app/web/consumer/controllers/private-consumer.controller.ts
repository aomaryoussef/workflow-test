import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Headers,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
  Req,
} from '@nestjs/common';

import {
  ConsumerDataDto,
  ConsumerLoansResponseDto,
  CreateConsumerProfileInputData,
  CreateConsumerProfileInputDto,
  OnboardConsumerOutputDto,
  VerifyOnboardingOtpStepInputDto,
} from '../../../../domain/consumer/dto/consumer.dto';
import { ConsumerApplicationOutputDto } from '../../../../domain/consumer/dto/onboarding-application.dto';
import { getEgyptianPhoneNumber } from './public-consumer.controller';
import { ConsumerService } from 'src/domain/consumer/services/consumer-service';
import { any } from 'joi';
import { SetLanguageAndPaginationInterceptor } from '../../../../middlewares/set-language-and-pagination';
import { PaginationRequest } from 'express';

@ApiTags('consumers')
@Controller('private/consumers')
export class PrivateConsumerController {
  constructor(private readonly consumerService: ConsumerService) {}

  @Put('onboarding/application/step')
  @ApiResponse({
    status: 200,
    description: 'Set onboarding step for a consumer',
    type: OnboardConsumerOutputDto,
  })
  async setOnboardingOtpStep(
    @Body() body: VerifyOnboardingOtpStepInputDto,
  ): Promise<ConsumerApplicationOutputDto> {
    const phoneNumber = getEgyptianPhoneNumber(body.phoneNumber);
    const step = body.step;
    return await this.consumerService.verifyOnboardingOtpStep(
      phoneNumber,
      step,
    );
  }

  @Post(':phone_number/onboarding/kyc')
  @ApiResponse({
    status: 200,
    description: 'Create consumer application',
    type: any,
  })
  async createConsumerApplication(
    @Param('phone_number') phoneNumber: string,
    @Body() body: CreateConsumerProfileInputDto,
  ): Promise<any> {
    const data = new CreateConsumerProfileInputData(body);
    return await this.consumerService.createConsumerApplication(
      getEgyptianPhoneNumber(phoneNumber),
      data,
    );
  }

  @UseInterceptors(SetLanguageAndPaginationInterceptor)
  @Get('loans')
  @ApiResponse({
    status: 200,
    description: 'Get consumer loans',
    type: ConsumerLoansResponseDto,
  })
  async getConsumerLoans(
    @Headers('x-user-iam-id') iamId: string,
    @Req() req: Request,
  ): Promise<ConsumerLoansResponseDto> {
    const customReq = req as PaginationRequest;
    const language = customReq.lang;
    const consumerId =
      await this.consumerService.getNewConsumerIdByIamId(iamId);
    return await this.consumerService.getConsumerLoans(consumerId, language);
  }

  @Get(':phone_number')
  @ApiResponse({
    status: 200,
    description: 'Get consumer data by phone number',
    type: any,
  })
  async getConsumerDataByPhoneNumber(
    @Headers('x-user-iam-id') iamId: string,
  ): Promise<ConsumerDataDto> {
    const consumerId =
      await this.consumerService.getNewConsumerIdByIamId(iamId);
    return await this.consumerService.getConsumerDataByPhoneNumber(consumerId);
  }

  @Get('check-national-id-existence/:national_id')
  @ApiResponse({
    status: 200,
    description: 'Check if consumer national id already exists',
    type: any,
  })
  async checkIfNationalIdExisted(@Param('national_id') nationalId: string) {
    const result =
      await this.consumerService.checkIfNationalIdExisted(nationalId);
    return {
      exists: !!result,
      phone_number: result,
    };
  }
}
