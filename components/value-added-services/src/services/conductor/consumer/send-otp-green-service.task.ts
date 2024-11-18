import { ConductorWorker, Task } from '@io-orkes/conductor-javascript';
import { IsNotEmpty, IsString } from 'class-validator';
import { transformAndValidate } from '../../../utils/validate-input.utils';
import { ConsumerUseCase } from '../../../domain/consumer/use-cases/consumer-use-case';
import { Injectable, Inject } from '@nestjs/common';
import { WithTraceId } from '../../../common/decorators/with-trace-id.decorator';
import { TraceIdService } from '../../../common/services/trace-id.service';
import { TaskStatusEnum, WorkerResponse } from '../../../types/conductor.types';
import { LoggerFactory } from '../../../types/logger.interface';
import { CustomLoggerService } from '../../../common/services/logger.service';
import { SendOtpInputDto } from '../../../domain/consumer/dto/api/consumer.dto';
import { settings } from 'config/settings';

/**
 * Input DTO for the `send_otp_green_service` task.
 */
class SendOtpInputDTO {
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}

@Injectable()
export class SendOtpGreenServiceWorker implements ConductorWorker {
  taskDefName = 'send_otp_green_service';
  pollInterval = settings.conductor.pollingInterval;;
  private readonly logger: CustomLoggerService;

  constructor(
    private readonly consumerUseCase: ConsumerUseCase,
    private readonly traceIdService: TraceIdService,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory(SendOtpGreenServiceWorker.name);
  }

  @WithTraceId()
  async execute(task: Task): Promise<WorkerResponse<SendOtpInputDTO>> {
    this.logger.debug(
      `Starting \`send_otp_green_service\` task with input: ${JSON.stringify(task.inputData)}`,
    );

    try {
      // Transform and validate input data
      const inputDto = await transformAndValidate(
        SendOtpInputDTO,
        task.inputData,
      );

      const sendOtpDto: SendOtpInputDto = {
        phoneNumber: inputDto.phone_number,
        otpCode: inputDto.otp,
      };

      // Invoke the use-case to handle business logic
      await this.consumerUseCase.sendOtp(sendOtpDto);

      this.logger.debug(
        `\`send_otp_green_service\` task completed successfully`,
      );

      return {
        status: TaskStatusEnum.COMPLETED,
      };
    } catch (error: any) {
      this.logger.error(
        `Error in \`send_otp_green_service\` task: ${error.message}`,
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
