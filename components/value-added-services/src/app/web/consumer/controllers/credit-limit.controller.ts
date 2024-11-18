import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParamsValidation } from '../../../../pipes/params-validation.pipe';
import {
  CreateOrUpdateCreditLimitDto,
  CreditLimitDto,
} from '../../../../domain/consumer/dto/api/credit-limit.dto';
import { CreditLimitView } from '../views/credit-limit.view';
import { CreditLimitUseCase } from '../../../../domain/consumer/use-cases/credit-limit.use-case';

@ApiTags('credit-limits')
@Controller('consumers')
export class CreditLimitController {
  constructor(private readonly creditLimitUseCase: CreditLimitUseCase) { }

  @Get(':consumerId/credit-limit')
  @ApiResponse({
    status: 200,
    description: 'The latest credit limit for the specified consumer',
    type: CreditLimitDto,
  })
  async getLatestCreditLimitByConsumerId(
    @Param('consumerId', ParamsValidation('uuid')) consumerId: string,
  ): Promise<CreditLimitDto> {
    const creditLimit =
      await this.creditLimitUseCase.getLatestCreditLimitByConsumerId(
        consumerId,
      );
    return CreditLimitView.toDTO(creditLimit);
  }

  @Post(':consumerId/credit-limit')
  @ApiResponse({
    status: 201,
    description:
      'Updates (new row entry) the credit limit entry in the database for a consumer',
    type: CreditLimitDto,
  })
  async createCreditLimit(
    @Param('consumerId', ParamsValidation('uuid')) consumerId: string, // Extract consumerId from URL
    @Body() updateCreditLimitDto: CreateOrUpdateCreditLimitDto,
  ): Promise<CreditLimitDto> {
    updateCreditLimitDto.consumerId = consumerId;
    const creditLimit =
      await this.creditLimitUseCase.updateCreditLimit(updateCreditLimitDto);
    return creditLimit;
  }
}
