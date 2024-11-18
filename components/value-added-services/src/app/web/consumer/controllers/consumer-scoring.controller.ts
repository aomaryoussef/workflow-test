import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ScoreConsumerInputDto,
  ScoreConsumerOutputDto,
} from 'src/domain/consumer/dto/api/consumer-scoring.dto';
import { ConsumerScoringUseCase } from 'src/domain/consumer/use-cases/consumer-scoring.use-case';
import { ParamsValidation } from 'src/pipes/params-validation.pipe';

@ApiTags('consumer-scoring')
@Controller(['consumers'])
export class ConsumerScoringController {
  constructor(
    private readonly consumerScoringService: ConsumerScoringUseCase,
  ) {}

  @Post(':consumerId/score')
  @ApiResponse({
    status: 201,
    description: 'score consumer using new data',
    type: ScoreConsumerOutputDto,
  })
  async scoreConsumer(
    @Param('consumerId', ParamsValidation('uuid')) consumerId: string, // Extract consumerId from URL
    @Body() scoreConsumerDto: ScoreConsumerInputDto,
  ): Promise<ScoreConsumerOutputDto> {
    const scoringResult = await this.consumerScoringService.getRiskScore(
      consumerId,
      scoreConsumerDto,
    );
    return scoringResult;
  }
}
