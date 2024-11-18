import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CustomLoggerService } from '../../../common/services/logger.service';
import { LoggerFactory } from '../../../types/logger.interface';
import { DataSource } from 'typeorm';
import { GetRiskEngineScoreInputDTO } from 'src/services/risk-engine/dto/risk-score.dto';
import { RiskEngineService } from 'src/services/risk-engine/risk-engine.service';
import { AreaRepository } from '../repository/area.repository';
import { ScoringScenarios } from 'src/services/risk-engine/types/risk-engine.types';
import {
  ScoreConsumerInputDto,
  ScoreConsumerOutputDto,
} from '../dto/api/consumer-scoring.dto';
import { ConsumerUserDetailsRepository } from '../repository/consumer-user-details.repository';

@Injectable()
export class ConsumerScoringUseCase {
  private readonly logger: CustomLoggerService;

  constructor(
    private readonly riskEngineService: RiskEngineService,
    private readonly areaRepository: AreaRepository,

    private readonly consumerUserDetailsRepository: ConsumerUserDetailsRepository,

    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
    private readonly dataSource: DataSource,
  ) {
    this.logger = this.loggerFactory('CreditLimitUseCase');
  }

  /**
   * Fetches the risk score for a given consumer from the Risk Engine service.
   *
   * This method takes the `GetRiskScoreInputDto` object as input and returns the risk score in the `GetRiskScoreOutputDto` format.
   * @param inputDto - The input data for fetching the risk score.
   * @returns A promise that resolves to the risk score data in `GetRiskScoreOutputDto` format.
   *
   * @example
   *
   **/
  async getRiskScore(
    consumerId: string,
    inputDto: ScoreConsumerInputDto,
  ): Promise<ScoreConsumerOutputDto> {
    const { bookingTime, data, verified_income } = inputDto;
    this.logger.debug(
      `Fetching risk score for input : ${JSON.stringify(inputDto)}`,
    );
    try {
      const consumerDetails =
        await this.consumerUserDetailsRepository.findOneBy({ consumerId });
      if (!consumerDetails) {
        throw new NotFoundException(
          `no consumer found for consumerId: ${consumerId}`,
        );
      }
      const area = await this.areaRepository.getAreaWithCityAndGovernorateById(
        data.areaId,
      );
      if (
        !area ||
        area.cityId !== data.cityId ||
        area.governorateId !== data.governorateId
      ) {
        throw new BadRequestException(
          'Area details are not valid for the given city and governorate',
        );
      }
      const scenario = verified_income
        ? ScoringScenarios.VERIFIED_SCORE_INCOME
        : ScoringScenarios.VERIFIED_SCORE;
      const scoringInput = new GetRiskEngineScoreInputDTO(data);
      scoringInput.client_id = consumerId;
      scoringInput.address_governorate = area.governorate?.nameEn;
      scoringInput.address_city = area.city?.nameEn;
      scoringInput.address_area = area.nameEn;

      const riskScoreResponse = await this.riskEngineService.getRiskScore(
        bookingTime,
        scenario,
        scoringInput,
      );
      this.logger.debug(
        `Risk score fetched successfully: ${JSON.stringify(riskScoreResponse)}`,
      );

      // Map the response to the output DTO
      const outputDto = new ScoreConsumerOutputDto(riskScoreResponse);
      return outputDto;
    } catch (error) {
      this.logger.error({
        message: `Failed to fetch risk score. Error: ${error.message}`,
        errorStack: error.stack,
      });
      throw new BadRequestException('Failed to fetch risk score.');
    }
  }
}
