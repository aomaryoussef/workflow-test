import {
  IsOptional,
  IsJSON,
  IsString,
  IsUUID,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  MinLength,
  IsDate,
  IsPositive,
  IsEmail,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ConsumerStatus } from '../../types/consumer.types';
import {
  ApplicationState,
  ApplicationStep,
  ConsumerApplicationData,
  ConsumerCl,
  ConsumerKyc,
  MaritalStatus,
  MobileOsType,
} from '../../types/consumer-application.types';
import { DeepPartial } from 'src/types/mapping.types';
import { SanctionType } from '../../types/sanction-list.types';
import { ConsumerState } from '../../models/consumer-state.entity';

export class OnboardConsumerInputDto {
  @ApiProperty({
    example: '+201234567891',
    description: 'Consumer phone number with country code',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}

export class OnboardConsumerOutputDto {
  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  success: true;
}

export class SuccesStateOutputDto {
  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  success: true;
}

export class UpdateConsumerApplicationStepDto {
  @ApiProperty({
    example: 'OTP_VALIDATION_SUCCESS',
    description: 'Application Step',
  })
  @IsString()
  @IsNotEmpty()
  step: ApplicationStep;
}

export class UpdateConsumerApplicationNationalIdDto {
  @ApiProperty({
    example: '23950154231567',
    description: 'Application National-id',
  })
  @IsString()
  @MinLength(14)
  @IsNotEmpty()
  nationalId: ApplicationStep;
}

export class CreateConsumerKycDto {
  @ApiProperty({ description: 'First name of the consumer' })
  @IsString()
  firstName: string;

  @ApiPropertyOptional({ description: 'Middle name of the consumer' })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiProperty({ description: 'Email of the consumer' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Last name of the consumer' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Job type of the consumer' })
  @IsString()
  jobType: string;

  @ApiProperty({ description: 'Job title of the consumer' })
  @IsString()
  jobTitle: string;

  @ApiProperty({ description: 'Company name where the consumer works' })
  @IsString()
  companyName: string;

  @ApiProperty({ description: 'Type of house the consumer resides in' })
  @IsString()
  houseType: string;

  @ApiProperty({ description: 'Marital status of the consumer' })
  @IsEnum(MaritalStatus)
  maritalStatus: MaritalStatus;

  @ApiProperty({ description: "Model of the consumer's car" })
  @IsString()
  @IsOptional()
  carModel: string;

  @ApiProperty({ description: "Model of the consumer's car model" })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  carYear: number;

  @ApiProperty({ description: 'Primary income of the consumer', type: Number })
  @IsNumber()
  primaryIncome: number;

  @ApiProperty({ description: "Consumer's address" })
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({ description: 'Governorate_id where the consumer lives' })
  @IsNumber()
  governorateId: number;

  @ApiProperty({ description: 'City_id where the consumer lives' })
  @IsNumber()
  cityId: number;

  @ApiProperty({ description: "Consumer's area_id " })
  @IsNumber()
  areaId: number;

  @ApiProperty({ description: "Consumer's club membership" })
  @IsOptional()
  @IsString()
  club: string;

  @ApiPropertyOptional({
    description: 'Number of kids the consumer has',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => value || 0)
  numberOfKids?: number;

  @ApiProperty({ description: 'National ID of the consumer' })
  @IsString()
  nationalId: string;

  @ApiProperty({ description: "Consumer's mobile operating system type" })
  @IsOptional()
  @IsEnum(MobileOsType)
  mobileOsType: MobileOsType;
}

export class ConsumerApplicationInputDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsString()
  consumerId?: string;

  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsJSON()
  data?: any;

  @IsOptional()
  @IsString()
  applicationState?: ApplicationState;

  @IsString()
  createdBy: string;
}

export class ConsumerApplicationStateOutputDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier for the consumer application state',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174001',
    description: 'Unique identifier for the consumer application',
  })
  @IsUUID()
  consumerApplicationId: string;

  @ApiProperty({
    example: 'ACTIVE',
    description: 'Current state of the application',
  })
  @IsString()
  applicationState: string;

  @ApiProperty({
    example: '2024-01-01T12:00:00Z',
    description: 'Date when the application state became active',
  })
  @IsDate()
  activeSince: Date;

  @ApiProperty({
    example: '2024-01-01T10:00:00Z',
    description: 'Creation timestamp',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    example: 'admin',
    description: 'User who created the application state',
  })
  @IsString()
  createdBy: string;
}

export class ConsumerApplicationOutputDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier for the consumer application',
  })
  @IsString()
  id: string;

  @ApiProperty({
    example: '+201234567890',
    description: 'Phone number associated with the consumer application',
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    example: { key: 'value' },
    description: 'Additional data related to the consumer application',
  })
  data: any;

  @ApiProperty({
    example: '2024-01-01T10:00:00Z',
    description: 'Creation timestamp',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    example: 'admin',
    description: 'User who created the consumer application',
  })
  @IsString()
  createdBy: string;

  @ApiProperty({
    example: '2024-01-02T12:00:00Z',
    description: 'Timestamp of the last update',
  })
  @IsDate()
  updatedAt: Date;

  @ApiProperty({
    example: 'editor',
    description: 'User who last updated the consumer application',
  })
  @IsString()
  updatedBy: string;

  @ApiProperty({
    description: 'List of application states',
    type: [ConsumerApplicationStateOutputDto],
  })
  @Type(() => ConsumerApplicationStateOutputDto)
  applicationStates?: ConsumerApplicationStateOutputDto[];
}

export class UpdateConsumerApplicationNationalIdOutputDto {
  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  success: boolean;
}

export class CreateConsumerKycOutputDto {
  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  success: boolean;
}

export class ConsumerApplicationUpdateInputDto {
  @IsOptional()
  @IsUUID()
  consumerId?: string;

  @IsOptional()
  @IsJSON()
  data?: DeepPartial<ConsumerApplicationData>;

  @IsString()
  updatedBy: string;
}

export class ConsumerApplicationStateInputDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsUUID()
  consumerApplicationId?: string;

  @IsEnum(ApplicationState)
  applicationState?: ApplicationState;

  @IsString()
  createdBy: string;
}

export class SendOtpInputDto {
  @IsString()
  phoneNumber: string;

  @IsString()
  otpCode: string;
}

export class ConsumerApplicationStateUpdateInputDto {
  @IsEnum(ApplicationState)
  applicationState?: ApplicationState;

  @IsString()
  createdBy: string;
}

export class CreateIdentityInputDto {
  @IsString()
  phoneNumber: string;
}

export class CreateIdentityOutputDto {
  identityId: string;
}

export class CreateRecoveryCodeInputDto {
  @IsString()
  @IsNotEmpty()
  identityId: string;
}

export class CreateRecoveryCodeOutputDto {
  @IsString()
  flowId: string;

  @IsString()
  recoveryCode: string;
}

export class GetFlowIdByIdentifierInputDto {
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}

export class GetFlowIdByIdentifierOutputDto {
  @ApiProperty({
    example: 'flow123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier for kratos flow',
  })
  @IsString()
  flowId: string;
}

export class CheckSanctionListInputDto {
  @ApiProperty({
    example: 'عز الدين مغربي محمد الدباح',
    description: 'user name to search for in sanction list',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '23509202601992',
    description: 'user national id to search for in sanction list',
  })
  @IsString()
  nationalId: string;
}

export class CheckSanctionListOutputDto {
  @ApiProperty({
    example: true,
    description: 'is user in sanction list',
  })
  @IsBoolean()
  isInSanctionList: boolean;

  @ApiProperty({
    example: '23509202601992',
    description: 'sanction list type that user is in',
  })
  @IsOptional()
  @IsEnum(SanctionType)
  sanctionListType: SanctionType;
}

export class ConsumerDetailsDto {
  @IsString()
  flowId: string;
}

export class FetchConsumerCreditLimitFromScoringOutputDto {
  @IsString()
  phoneNumber: string;

  @IsNumber()
  creditLimit: number;

  @IsString()
  classification: string;

  @IsString()
  status: string;

  @IsString()
  creationDate: string;
}

export class AssignConsumerStatusAndCLOutputDto {
  @IsString()
  status: string;

  @IsNumber()
  creditLimit: number;
}

export class CreateConsumerInputDto {
  @IsString()
  @IsNotEmpty()
  identityId: string;

  @IsString()
  @IsOptional()
  uniqueIdentifier?: string;

  @IsString()
  @IsOptional()
  createdBy?: string;
}

export class CreateConsumerOutputDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier for the consumer',
  })
  @IsString()
  id: string;

  @ApiProperty({
    example: '987e4567-e89b-12d3-a456-426614174001',
    description:
      'Unique identifier for the identity associated with the consumer',
  })
  @IsString()
  identityId: string;

  @ApiProperty({
    example: 'UNIQUE123456',
    description: 'A unique identifier related to the consumer',
  })
  @IsString()
  uniqueIdentifier: string;

  @ApiProperty({
    example: '2024-01-01T10:00:00Z',
    description: 'Creation timestamp',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    example: 'admin',
    description: 'User who created the consumer',
  })
  @IsString()
  createdBy: string;
}



export class CreateConsumerProfileUseCaseInputDto {
  consumerId: string;
  createdBy: string;
  phoneNumber: string;
}

export class CreateConsumerProfileInputDto {
  consumerId: string;
  email?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: Date;
  cityOfBirth?: string;
  nationality: string;
  phoneNumber: string;
  jobLevel: string;
  houseType: string;
  jobTitle: string;
  educationLevel: string;
  otherCompanyName: string;
  workType: string;
  maritalStatus: string;
  additionalIncome: number;
  carModel: string;
  carYear: number;
  primaryIncome: number;
  governorateId: number;
  cityId: number;
  areaId: number;
  address: string;
  postcode?: string;
  latitude?: number;
  longitude?: number;
  club: string;
  dependants: number;
  activeSince: Date;
  companyName: string;
  maxCreditLimit: number;
  nationalId: string;
  consumerStatus: ConsumerStatus;
  applicationStatus: ApplicationState;
  createdBy: string;

  constructor();
  constructor(consumerApplication: ConsumerApplicationData);
  constructor(consumerApplication?: ConsumerApplicationData) {
    if (!consumerApplication) return;

    const kyc = consumerApplication.consumer_kyc || ({} as ConsumerKyc);
    const consumer_cl = consumerApplication.consumer_cl || ({} as ConsumerCl);
    this.email = consumerApplication.consumer_kyc.email;
    this.consumerId = consumerApplication.consumer_kyc.client_id;
    this.phoneNumber = consumerApplication.phone_number;
    this.firstName = kyc.first_name;
    this.middleName = kyc.middle_name;
    this.lastName = kyc.last_name;
    this.dateOfBirth = kyc.date_of_birth;
    this.cityOfBirth = kyc.city_of_birth;
    this.nationality = kyc.nationality;
    this.jobLevel = kyc.job_level;
    this.houseType = kyc.house_type;
    this.jobTitle = kyc.job_title;
    this.educationLevel = kyc.education_level;
    this.otherCompanyName = kyc.other_company_name;
    this.workType = kyc.work_type;
    this.maritalStatus = kyc.marital_status;
    this.additionalIncome = kyc.additional_income;
    this.carModel = kyc.car_type;
    this.carYear = kyc.car_model_year;
    this.primaryIncome = kyc.net_income;
    this.governorateId = kyc.address_governorate_id;
    this.cityId = kyc.address_city_id;
    this.areaId = kyc.address_area_id;
    this.address = kyc.address;
    this.postcode = kyc.postcode;
    this.latitude = kyc.latitude;
    this.longitude = kyc.longitude;
    this.club = kyc.club_level;
    this.dependants = kyc.dependants;
    this.activeSince = new Date();
    this.companyName = kyc.company_name;
    this.maxCreditLimit = consumer_cl.calc_credit_limit;
    this.nationalId = kyc.ssn;
    this.applicationStatus = consumerApplication.application_status;
    this.consumerStatus = consumerApplication.consumer_status;
  }
}

export class CreateConsumerProfileOutputDto {
  success: boolean;
  consumerId: string;
}

export class ActivateConsumerDto {
  @ApiProperty({
    example: 45000,
    description: 'Credit limit for this user',
  })
  @IsNumber()
  creditLimit: number;

  @ApiProperty({
    example: '32f8249e-1f0a-4210-99c9-5eff50248946',
    description: 'The iam id of the credit officer',
  })
  @IsUUID()
  creditOfficerIamIad: string;

  @ApiProperty({
    example: 'B.Tech Faisal',
    description: 'Branch Name',
  })
  @IsString()
  branchName: string;

  @ApiProperty({
    example: 'not verified docs',
    description: 'reason to reject consumer',
  })
  @IsOptional()
  @IsString()
  comment: string;
}

export class RejectConsumerDto {
  @ApiProperty({
    example: '32f8249e-1f0a-4210-99c9-5eff50248946',
    description: 'The iam id of the credit officer',
  })
  @IsString()
  creditOfficerIamIad: string;

  @ApiProperty({
    example: 'B.Tech Faisal',
    description: 'Branch Name',
  })
  @IsString()
  branchName: string;

  @ApiProperty({
    example: 'not verified docs',
    description: 'reason to reject consumer',
  })
  @IsString()
  comment: string;
}

export class RejectConsumerOutputDto {
  @ApiProperty({
    example: '2024-01-01T12:00:00Z',
    description: 'Date when the application state became active',
  })
  @IsDate()
  activeSince: Date;

  @ApiProperty({
    example: 'B.Tech Faisal',
    description: 'Branch Name',
  })
  @IsString()
  branchName: string;

  @ApiProperty({
    example: '32f8249e-1f0a-4210-99c9-5eff50248946',
    description: 'The iam id of the credit officer',
  })
  creditOfficerIamIad: string;

  @ApiProperty({
    example: 'B.Tech Faisal',
    description: 'Branch Name',
  })
  state: string;
  @ApiProperty({
    example: 'not verified docs',
    description: 'reason to reject consumer',
  })
  comment: string;

  constructor();
  constructor(consumerState: ConsumerState);
  constructor(consumerState?: ConsumerState) {
    if (!consumerState) return;

    this.activeSince = consumerState.activeSince;
    this.branchName = consumerState.branch;
    this.creditOfficerIamIad = consumerState.createdBy;
    this.state = consumerState.state;
    this.comment = consumerState.comment;
  }
}

export class ActivateConsumerOutputDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty({ enum: ConsumerStatus })
  status: ConsumerStatus;

  @ApiProperty({ required: false })
  iamId?: string;

  @ApiProperty({ required: false })
  fullName?: string;

  @ApiProperty({ required: false })
  firstName?: string;

  @ApiProperty({ required: false })
  lastName?: string;

  @ApiProperty({ required: false })
  nationalId?: string;

  @ApiProperty({ required: false })
  jobName?: string;

  @ApiProperty({ required: false })
  workType?: string;

  @ApiProperty({ required: false })
  company?: string;

  @ApiProperty({ required: false })
  club?: string;

  @ApiProperty({ required: false })
  houseType?: string;

  @ApiProperty({ required: false })
  city?: string;

  @ApiProperty({ required: false })
  district?: string;

  @ApiProperty({ required: false })
  governorate?: string;

  @ApiProperty({ required: false, type: 'number' })
  salary?: number;

  @ApiProperty({ required: false, type: 'number' })
  additionalSalary?: number;

  @ApiProperty({ required: false })
  addressDescription?: string;

  @ApiProperty({ required: false })
  guarantorJob?: string;

  @ApiProperty({ required: false })
  guarantorRelationship?: string;

  @ApiProperty({ required: false, type: 'number' })
  carYear?: number;

  @ApiProperty({ required: false })
  maritalStatus?: string;

  @ApiProperty({ required: false })
  address?: string;

  @ApiProperty()
  singlePaymentDay: number;

  @ApiProperty()
  activatedAt: Date;

  @ApiProperty({ required: false })
  activatedByIamId?: string;

  @ApiProperty({ required: false })
  activationBranch?: string;

  @ApiProperty()
  originationChannel: string;

  @ApiProperty()
  classification: string;

  @ApiProperty({ required: false })
  nationalIdAddress?: string;

  @ApiProperty({ required: false })
  homePhoneNumber?: string;

  @ApiProperty({ required: false })
  companyAddress?: string;

  @ApiProperty({ required: false })
  workPhoneNumber?: string;

  @ApiProperty({ required: false })
  additionalSalarySource?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: 'number' })
  creditLimit: number;
}
