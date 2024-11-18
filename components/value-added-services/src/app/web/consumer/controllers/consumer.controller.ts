import {
  Body,
  Controller,
  Param,
  Put,
  Post,
  Get,
  BadRequestException,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParamsValidation } from '../../../../pipes/params-validation.pipe';
import {
  ActivateConsumerDto,
  ActivateConsumerOutputDto,
  CheckSanctionListInputDto,
  CheckSanctionListOutputDto,
  ConsumerApplicationOutputDto,
  CreateConsumerKycDto,
  CreateConsumerKycOutputDto,
  GetFlowIdByIdentifierInputDto,
  GetFlowIdByIdentifierOutputDto,
  OnboardConsumerInputDto,
  OnboardConsumerOutputDto,
  RejectConsumerDto,
  RejectConsumerOutputDto,
  UpdateConsumerApplicationNationalIdDto,
  UpdateConsumerApplicationNationalIdOutputDto,
  UpdateConsumerApplicationStepDto,
} from '../../../../domain/consumer/dto/api/consumer.dto';
import { ConsumerUseCase } from '../../../../domain/consumer/use-cases/consumer-use-case';
import { ApplicationStep } from 'src/domain/consumer/types/consumer-application.types';
import { SanctionListUseCase } from 'src/domain/consumer/use-cases/sanction-list.use-case';
import { ConsumerActivationUseCase } from 'src/domain/consumer/use-cases/consumer-activation.use-case';

@ApiTags('consumers')
@Controller('consumers')
export class ConsumerController {
  constructor(
    private readonly consumerUseCase: ConsumerUseCase,
    private readonly consumerActivationUseCase: ConsumerActivationUseCase,
    private readonly sanctionListUseCase: SanctionListUseCase,
  ) {}

  @Post('onboarding')
  @ApiResponse({
    status: 200,
    description: 'Onboard a new consumer by phoneNumber',
    type: OnboardConsumerOutputDto,
  })
  async onboardConsumer(
    @Body() onboardConsumerInputDto: OnboardConsumerInputDto,
  ): Promise<OnboardConsumerOutputDto> {
    await this.consumerUseCase.startConsumerOnboarding(
      onboardConsumerInputDto.phoneNumber,
    );
    return { success: true };
  }

  @Put(':phoneNumber/onboarding/application/step')
  @ApiResponse({
    status: 200,
    description: 'Updates the application step',
    type: ConsumerApplicationOutputDto,
  })
  async updateApplicationStep(
    @Param('phoneNumber', ParamsValidation('string')) phoneNumber: string,
    @Body() updateConsumerApplicationStep: UpdateConsumerApplicationStepDto,
  ): Promise<ConsumerApplicationOutputDto> {
    let step;
    try {
      step = ApplicationStep[updateConsumerApplicationStep.step];
      if (step !== ApplicationStep.OTP_VALIDATION_SUCCESS) {
        throw new Error('Invalid application step');
      }
    } catch (error) {
      throw new BadRequestException('Invalid application step');
    }
    const applicationUpdate = await this.consumerUseCase.resumeSetPasscode(
      phoneNumber,
      {
        data: { step },
        updatedBy: 'worker-test',
      },
    );

    return applicationUpdate;
  }

  @Put(':phoneNumber/onboarding/application/national-id')
  @ApiResponse({
    status: 200,
    description: 'Updates the application national-id',
    type: UpdateConsumerApplicationNationalIdOutputDto,
  })
  async updateApplicationNationaId(
    @Param('phoneNumber', ParamsValidation('string')) phoneNumber: string,
    @Body()
    updateConsumerApplicationStep: UpdateConsumerApplicationNationalIdDto,
  ): Promise<UpdateConsumerApplicationNationalIdOutputDto> {
    const applicationUpdate = await this.consumerUseCase.resumeWaitSsn(
      phoneNumber,
      {
        data: {
          consumer_kyc: { ssn: updateConsumerApplicationStep.nationalId },
        },
        updatedBy: 'worker-test',
      },
    );

    return applicationUpdate;
  }

  @Post(':phoneNumber/onboarding/kyc')
  @ApiResponse({
    status: 200,
    description: 'create consumer kyc',
    type: CreateConsumerKycOutputDto,
  })
  async createKYC(
    @Param('phoneNumber', ParamsValidation('string')) phoneNumber: string,
    @Body() createConsumerKycInput: CreateConsumerKycDto,
  ): Promise<CreateConsumerKycOutputDto> {
    const kycCreatedData = await this.consumerUseCase.resumeWaitConsumerKycData(
      phoneNumber,
      createConsumerKycInput,
    );

    return kycCreatedData;
  }
  //
  @Get(':phoneNumber/flow-id')
  @ApiResponse({
    status: 200,
    description: 'Get flowId',
    type: GetFlowIdByIdentifierOutputDto,
  })
  async getFlowId(
    @Param('phoneNumber', ParamsValidation('string')) phoneNumber: string,
  ): Promise<GetFlowIdByIdentifierOutputDto> {
    const getFlowIdDto: GetFlowIdByIdentifierInputDto = {
      phoneNumber: phoneNumber,
    };
    const result =
      await this.consumerUseCase.getFlowIdByIdentifier(getFlowIdDto);

    return result;
  }

  @Post('/check-sanctions-list')
  @ApiResponse({
    status: 200,
    description: 'check if consumer in sanctions list',
    type: CheckSanctionListOutputDto,
  })
  async checkSanctionList(
    @Body() checkSactionListDto: CheckSanctionListInputDto,
  ): Promise<any> {
    const result = await this.sanctionListUseCase.searchSanction(
      checkSactionListDto.name,
      checkSactionListDto.nationalId,
    );

    const output = new CheckSanctionListOutputDto();
    output.isInSanctionList = !!result;
    output.sanctionListType = result ? result.sanctionType : null;

    return output;
  }

  @Post(':consumerId/activate')
  @ApiResponse({
    status: 200,
    description: 'activate consumer',
    type: ActivateConsumerOutputDto,
  })
  async activateConsumer(
    @Param('consumerId', ParamsValidation('string')) consumerId: string,
    @Body() activateConsumerDto: ActivateConsumerDto,
  ): Promise<ActivateConsumerOutputDto> {
    return this.consumerActivationUseCase.activateConsumer(
      consumerId,
      activateConsumerDto,
    );
  }
  @Post(':consumerId/reject')
  @ApiResponse({
    status: 200,
    description: 'reject consumer',
    type: RejectConsumerOutputDto,
  })
  async rejectConsumer(
    @Param('consumerId', ParamsValidation('string')) consumerId: string,
    @Body() rejectConsumerDto: RejectConsumerDto,
  ) {
    const output = await this.consumerActivationUseCase.rejectConsumer(
      consumerId,
      rejectConsumerDto,
    );
    return output;
  }
}
