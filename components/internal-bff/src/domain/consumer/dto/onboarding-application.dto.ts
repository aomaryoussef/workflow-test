import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export type OnboardingApplication = {
  id: string;
  data: {
    status: OnboardingApplicationStatus;
    step: OnboardingStep;
    is_mc: boolean;
    flow_id: string;
  };
};

export enum OnboardingApplicationStatus {
  APPROVED = 'APPROVED',
  BLOCKED = 'BLOCKED',
  REJECTED = 'REJECTED',
  SUBMITTED = 'SUBMITTED',
  IN_PROGRESS = 'IN_PROGRESS',
}

export enum OnboardingStep {
  CREATED = 'CREATED',
  OTP_VALIDATION = 'OTP_VALIDATION',
  OTP_VALIDATION_SUCCESS = 'OTP_VALIDATION_SUCCESS',
  RISK_ENGINE_VALIDATION = 'RISK_ENGINE_VALIDATION',
  RISK_ENGINE_VALIDATION_TERRORIST = 'RISK_ENGINE_VALIDATION_TERRORIST',
  RISK_ENGINE_VALIDATION_SANCTION_LIST = 'RISK_ENGINE_VALIDATION_SANCTION_LIST',
  COMPLETED = 'COMPLETED',
  OLD_CONSUMER_ONBOARDING = 'OLD_CONSUMER_ONBOARDING',
  NEW_CONSUMER_ONBOARDING = 'NEW_CONSUMER_ONBOARDING',
}

export class ConsumerApplicationOutputDto {
  id: string;
  phoneNumber: string;
  data: any;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;

  @ValidateNested({ each: true })
  @Type(() => ConsumerApplicationStateOutputDto)
  applicationStates?: ConsumerApplicationStateOutputDto[];
}

export class ConsumerApplicationStateOutputDto {
  id: string;
  consumerApplicationId: string;
  applicationState: OnboardingApplicationStatus;
  activeSince: Date;
  createdAt: Date;
  createdBy: string;
}
