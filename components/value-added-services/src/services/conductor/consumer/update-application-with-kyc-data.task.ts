import { ConductorWorker, Task } from '@io-orkes/conductor-javascript';
import { transformAndValidate } from '../../../utils/validate-input.utils';
import { ConsumerUseCase } from '../../../domain/consumer/use-cases/consumer-use-case';
import { Injectable, Inject } from '@nestjs/common';
import { WithTraceId } from '../../../common/decorators/with-trace-id.decorator';
import { TraceIdService } from '../../../common/services/trace-id.service';
import { TaskStatusEnum } from '../../../types/conductor.types';
import { LoggerFactory } from '../../../types/logger.interface';
import { CustomLoggerService } from '../../../common/services/logger.service';
import { UpdateApplicationWithKYCDataInputDTO, UpdateApplicationWithKYCDataOutputDTO } from 'src/domain/consumer/dto/tasks/update-application-with-kyc-data.dto';
import { ApplicationStep } from 'src/domain/consumer/types/consumer-application.types';
import { settings } from 'config/settings';

@Injectable()
export class UpdateApplicationWithKYCDataWorker implements ConductorWorker {
  taskDefName = 'update_application_with_kyc_data';
  pollInterval = settings.conductor.pollingInterval;;
  private readonly logger: CustomLoggerService;

  constructor(
    private readonly consumerUserCase: ConsumerUseCase,
    private readonly traceIdService: TraceIdService,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory(UpdateApplicationWithKYCDataWorker.name);
  }

  @WithTraceId()
  async execute(task: Task): Promise<any> {
    this.logger.debug(
      `Starting \`update_application_with_kyc_data\` task with input: ${JSON.stringify(task.inputData)}`,
    );

    try {
      // Transform and validate input data
      const inputDto = await transformAndValidate(
        UpdateApplicationWithKYCDataInputDTO,
        task.inputData,
      );

      const { consumer_details, phone_number, consumer_id } = inputDto;

      // Invoke the use-case to handle business logic
      await this.consumerUserCase.updateApplicationByPhoneNumber(
        phone_number,
        {
          data: {
            step: ApplicationStep.RISK_ENGINE_VALIDATION,
            consumer_kyc: {
              client_id: consumer_id,
              email: consumer_details.email,
              first_name: consumer_details.first_name,
              middle_name: consumer_details.middle_name,
              last_name: consumer_details.last_name,
              job_title: consumer_details.job_title,
              job_name_map: consumer_details.job_type, // Mapping job_type to job_name_map
              company_name: consumer_details.company_name,
              house_type: consumer_details.house_type,
              marital_status: consumer_details.marital_status,
              car_model_year: consumer_details.car_year, // Mapping car_model to car_model_year
              net_income: consumer_details.primary_income,
              net_burden: 0,
              additional_income: 0,
              contract_date: new Date(),
              address_governorate: consumer_details.governorate,
              address_city: consumer_details.city,
              address_area: consumer_details.area,
              address: consumer_details.address,
              club_level: consumer_details.club,
              children_count: consumer_details.number_of_kids || 0, // Mapping number_of_kids to children_count
              ssn: consumer_details.national_id, // Mapping national_id to ssn
              nationality: consumer_details.national_id,
              address_governorate_id: consumer_details.governorate_id,
              address_city_id: consumer_details.city_id,
              address_area_id: consumer_details.area_id,
            }
          },
          updatedBy: `worker-task#${this.taskDefName}`,
        },
      );

      // Prepare output DTO
      const outputDTO = new UpdateApplicationWithKYCDataOutputDTO();
      outputDTO.success = true;

      this.logger.debug(
        `\`update_application_with_kyc_data\` task completed successfully: ${JSON.stringify(outputDTO)}`,
      );

      return {
        outputData: outputDTO,
        status: TaskStatusEnum.COMPLETED,
      };
    } catch (error: any) {
      this.logger.error(
        `Error in \`update_application_with_kyc_data\` task: ${error}`,
      );

      return {
        status: TaskStatusEnum.FAILED,
        reasonForIncompletion: error.message || 'Unknown error',
        logs: [
          {
            log: JSON.stringify(error),
            createdTime: new Date().getTime(),
          },
        ],
      };
    }
  }
}
