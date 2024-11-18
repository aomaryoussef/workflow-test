import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ConsumerState } from '../models/consumer-state.entity';
import { ConsumerPhone } from '../models/consumer-phone.entity';
import { ConsumerAddress } from '../models/consumer-address.entity';
import { ConsumerKyc } from '../models/consumer-kyc.entity';
import {
    ConsumerApplicationStateUpdateInputDto,
    ConsumerApplicationUpdateInputDto,
    CreateConsumerProfileInputDto,
    CreateConsumerProfileUseCaseInputDto,
} from '../dto/api/consumer.dto';
import { ConsumerUserDetails } from '../models/consumer-user-details.entity';
import { NotFoundError } from '../../../exceptions/custom-exceptions';
import { CustomLoggerService } from '../../../common/services/logger.service';
import { LoggerFactory } from '../../../types/logger.interface';
import { ConsumerStatus } from '../types/consumer.types';
import { ConsumerRepository } from '../repository/consumer.repository';
import { LegacyConsumerRepository } from '../repository/legacy-consumer.repository';
import { ConsumerKYCRepository } from '../repository/consumer-kyc.repository';
import { ConsumerPhoneRepository } from '../repository/consumer-phone.repository';
import { ConsumerUserDetailsRepository } from '../repository/consumer-user-details.repository';
import { ConsumerAddressRepository } from '../repository/consumer-address.repository';
import { EntityManager, DataSource } from 'typeorm';
import { ConsumerApplicationRepository } from '../repository/consumer-application.repository';
import { CreditLimitRepository } from '../repository/credit-limit.repository';
import { ApplicationState, ApplicationStep } from '../types/consumer-application.types';
import { LegacyConsumer } from '../models/legacy-consumer.entity';
import { Consumer } from '../models/consumer.entity';
import { ConsumerStateRepository } from '../repository/consumer-state.repository';


@Injectable()
export class ConsumerProfileUseCase {
    private readonly logger: CustomLoggerService;

    constructor(
        @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
        private readonly consumerRepository: ConsumerRepository,
        private readonly legacyConsumerRepository: LegacyConsumerRepository,
        private readonly consumerStateRepository: ConsumerStateRepository,
        private readonly consumerKYCRepository: ConsumerKYCRepository,
        private readonly consumerPhoneRepository: ConsumerPhoneRepository,
        private readonly consumerUserDetailsRepository: ConsumerUserDetailsRepository,
        private readonly consumerAddressRepository: ConsumerAddressRepository,
        private readonly consumerApplicationRepository: ConsumerApplicationRepository,
        private readonly consumerCreditLimitRepository: CreditLimitRepository,
        private readonly dataSource: DataSource,
    ) {
        this.logger = this.loggerFactory(ConsumerProfileUseCase.name);
    }

    async createConsumerProfile(inputDto: CreateConsumerProfileUseCaseInputDto) {
        const { phoneNumber, createdBy } = inputDto;
        try {
            return await this.dataSource.transaction(async (manager: EntityManager) => {
                const consumerApplication = await this.getConsumerApplication(phoneNumber);
                const createProfileDto = new CreateConsumerProfileInputDto(consumerApplication.data)
                createProfileDto.consumerId = consumerApplication.consumerId;
                createProfileDto.phoneNumber = consumerApplication.phoneNumber;
                createProfileDto.createdBy = createdBy;

                const consumer = await this.getAndVerifyConsumer(createProfileDto.consumerId, manager);
                await this.updateConsumerUniqueIdentifier(consumer, createProfileDto.nationalId, manager);
                const consumerState = await this.createConsumerState(createProfileDto, manager);
                const consumerKyc = await this.createConsumerKYC(createProfileDto, manager);
                const consumerUserDetails = await this.createConsumerUserDetails(createProfileDto, manager);
                const consumerPhone = await this.createConsumerPhone(createProfileDto, manager);
                const consumerAddress = await this.createConsumerAddress(createProfileDto, manager);
                await this.createConsumerCreditLimit(createProfileDto.consumerId, createProfileDto.maxCreditLimit, manager);
                await this.updateConsumerApplication(consumerApplication, phoneNumber, createdBy, manager);
                await this.createLegacyConsumer({
                    consumer,
                    consumerState,
                    consumerAddress,
                    consumerKyc,
                    consumerPhone,
                    consumerUserDetails
                }, manager);
                return { success: true };
            });
        } catch (error) {
            this.logger.error({
                message: `Failed to create consumer profile for phone number: ${phoneNumber}. Error: ${error.message}`,
                error_stack: error.stack,
            });
            throw error;
        }
    }

    private async getConsumerApplication(phoneNumber: string) {
        const consumerApplication = await this.consumerApplicationRepository.findLatestApplicationByPhoneNumber(phoneNumber);
        if (!consumerApplication) {
            throw new NotFoundError('ConsumerApplication not found');
        }
        return consumerApplication;
    }

    private async getAndVerifyConsumer(consumerId: string, manager: EntityManager) {
        const consumer = await this.consumerRepository.findOne(consumerId);
        if (!consumer) {
            throw new NotFoundError('Consumer not found');
        }
        return consumer;
    }

    private async updateConsumerUniqueIdentifier(consumer: any, nationalId: string, manager: EntityManager) {
        consumer.uniqueIdentifier = nationalId;
        return await this.consumerRepository.save(consumer, manager);
    }

    private async createConsumerState(createProfileDto: CreateConsumerProfileInputDto, manager: EntityManager) {
        const existingState = await this.consumerStateRepository.findOne(createProfileDto.consumerId, manager);
        if (existingState && existingState.state !== ConsumerStatus.AWAITING_ACTIVATION) {
            throw new BadRequestException('Consumer state already exists and is not in AWAITING_ACTIVATION state.');
        }

        const consumerState = new ConsumerState();
        consumerState.id = uuidv4();
        consumerState.consumerId = createProfileDto.consumerId;
        consumerState.state = ConsumerStatus.ACTIVE //ConsumerStatus[createProfileDto.consumerStatus];
        consumerState.createdAt = new Date();
        consumerState.activeSince = new Date();
        consumerState.createdBy = createProfileDto.createdBy;
        return await this.consumerStateRepository.save(consumerState, manager);
    }

    private async createConsumerKYC(createProfileDto: CreateConsumerProfileInputDto, manager: EntityManager) {
        const consumerKYC = new ConsumerKyc();
        consumerKYC.id = uuidv4();
        consumerKYC.consumerId = createProfileDto.consumerId;
        consumerKYC.nationalId = createProfileDto.nationalId;
        consumerKYC.jobTitle = createProfileDto.jobTitle;
        consumerKYC.workType = createProfileDto.workType;
        consumerKYC.companyName = createProfileDto.companyName;
        consumerKYC.otherCompanyName = createProfileDto.otherCompanyName;
        consumerKYC.jobLevel = createProfileDto.jobLevel;
        consumerKYC.educationLevel = createProfileDto.educationLevel;
        consumerKYC.primaryIncome = createProfileDto.primaryIncome;
        consumerKYC.additionalIncome = createProfileDto.additionalIncome;
        consumerKYC.carModel = createProfileDto.carModel;
        consumerKYC.carYear = createProfileDto.carYear;
        consumerKYC.maritalStatus = createProfileDto.maritalStatus;
        consumerKYC.houseLevel = createProfileDto.houseType;
        consumerKYC.club = createProfileDto.club;
        consumerKYC.dependants = createProfileDto.dependants;
        consumerKYC.activeSince = new Date();
        consumerKYC.createdAt = new Date();
        consumerKYC.updatedAt = new Date();
        consumerKYC.createdBy = createProfileDto.createdBy;

        return await this.consumerKYCRepository.save(consumerKYC, manager);
    }

    private async createConsumerUserDetails(createProfileDto: CreateConsumerProfileInputDto, manager: EntityManager) {
        const consumerUserDetails = new ConsumerUserDetails();
        consumerUserDetails.id = uuidv4();
        consumerUserDetails.consumerId = createProfileDto.consumerId;
        consumerUserDetails.email = createProfileDto.email;
        consumerUserDetails.firstName = createProfileDto.firstName;
        consumerUserDetails.middleName = createProfileDto.middleName;
        consumerUserDetails.lastName = createProfileDto.lastName;
        consumerUserDetails.nationalId = createProfileDto.nationalId;
        consumerUserDetails.dateOfBirth = isNaN(new Date(createProfileDto.dateOfBirth).getTime()) ? null : new Date(createProfileDto.dateOfBirth);
        consumerUserDetails.cityOfBirth = createProfileDto.cityOfBirth;
        consumerUserDetails.nationality = createProfileDto.nationality;
        consumerUserDetails.createdAt = new Date();
        consumerUserDetails.updatedAt = new Date();
        consumerUserDetails.createdBy = createProfileDto.createdBy;


        return await this.consumerUserDetailsRepository.save(consumerUserDetails, manager);
    }

    private async createConsumerPhone(createProfileDto: CreateConsumerProfileInputDto, manager: EntityManager) {
        const existingPhone = await this.consumerPhoneRepository
            .findOneByWithOptions({
                where: {
                    phoneNumberE164: createProfileDto.phoneNumber,
                    isPrimary: true,
                    isActive: true
                }
            }, manager);

        if (existingPhone) {
            throw new BadRequestException('An active primary phone number already exists for this consumer.');
        }

        const consumerPhone = new ConsumerPhone();
        consumerPhone.id = uuidv4();
        consumerPhone.consumerId = createProfileDto.consumerId;
        consumerPhone.phoneNumberE164 = createProfileDto.phoneNumber;
        consumerPhone.isActive = true;
        consumerPhone.isPrimary = true;
        consumerPhone.createdAt = new Date();
        consumerPhone.createdBy = createProfileDto.createdBy;

        return await this.consumerPhoneRepository.save(consumerPhone, manager);
    }

    private async createConsumerAddress(createProfileDto: CreateConsumerProfileInputDto, manager: EntityManager) {
        const consumerAddress = new ConsumerAddress();
        consumerAddress.id = uuidv4();
        consumerAddress.consumerId = createProfileDto.consumerId;
        consumerAddress.isPrimary = true;
        consumerAddress.isActive = true;
        consumerAddress.governorateId = createProfileDto.governorateId;
        consumerAddress.cityId = createProfileDto.cityId;
        consumerAddress.areaId = createProfileDto.areaId;
        consumerAddress.addressLine1 = createProfileDto.address;
        consumerAddress.postcode = createProfileDto.postcode;
        consumerAddress.latitude = createProfileDto.latitude;
        consumerAddress.longitude = createProfileDto.longitude;
        consumerAddress.createdAt = new Date();
        consumerAddress.createdBy = createProfileDto.createdBy;

        await this.consumerAddressRepository.save(consumerAddress, manager);
        return await this.consumerAddressRepository.findOneByWithOptions({
            where: {
                id: consumerAddress.id
            },
            relations: ['governorate', 'city', 'area']
        }, manager)
    }

    private async createConsumerCreditLimit(consumerId: string, maxCreditLimit: number, manager: EntityManager) {
        this.logger.debug(`Creating CreditLimit for Consumer: ${maxCreditLimit}`);
        await this.consumerCreditLimitRepository.createCreditLimitAndUsedCreditLimit(
            consumerId,
            maxCreditLimit,
            manager,
        );
    }

    private async updateConsumerApplication(consumerApplication: any, phoneNumber: string, createdBy: string, manager: EntityManager) {
        const consumerApplicationUpdate = new ConsumerApplicationUpdateInputDto();
        consumerApplicationUpdate.data = { step: ApplicationStep.COMPLETED };
        consumerApplicationUpdate.updatedBy = createdBy;

        const consumerApplicationState = new ConsumerApplicationStateUpdateInputDto();
        consumerApplicationState.applicationState = consumerApplication.data.application_status !== ApplicationState.BLOCKED
            ? ApplicationState.SUBMITTED
            : consumerApplication.data.application_status;
        consumerApplicationState.createdBy = createdBy;

        await this.consumerApplicationRepository.updateApplicationWithState(
            phoneNumber,
            consumerApplicationUpdate,
            consumerApplicationState,
            manager,
        );
    }

    private async createLegacyConsumer(input:
        {
            consumer: Consumer,
            consumerAddress: ConsumerAddress,
            consumerPhone: ConsumerPhone,
            consumerKyc: ConsumerKyc,
            consumerState: ConsumerState,
            consumerUserDetails: ConsumerUserDetails
        },
        manager: EntityManager
    ) {
        const { consumer, consumerAddress, consumerPhone, consumerKyc, consumerState, consumerUserDetails } = input;
        const legacyConsumer = new LegacyConsumer();
        const existingConsumer = await this.legacyConsumerRepository.findOneByWithOptions({
            where: { phoneNumber: consumerPhone.phoneNumberE164 }
        })
        if (existingConsumer) {
            throw new BadRequestException(`An active primary phone number already exists on Legacy Consumer ${existingConsumer.phoneNumber}.`);
        }
        legacyConsumer.id = consumer.id;
        legacyConsumer.phoneNumber = consumerPhone.phoneNumberE164;
        legacyConsumer.status = consumerState.state;
        legacyConsumer.iamId = consumer.identityId;
        legacyConsumer.fullName = `${consumerUserDetails.firstName ?? ''} ${consumerUserDetails.middleName ?? ''} ${consumerUserDetails.lastName ?? ''}`;
        legacyConsumer.firstName = consumerUserDetails.firstName;
        legacyConsumer.lastName = consumerUserDetails.lastName;
        legacyConsumer.nationalId = consumerUserDetails.nationalId;
        legacyConsumer.jobName = consumerKyc.jobTitle;
        legacyConsumer.workType = consumerKyc.workType;
        legacyConsumer.company = consumerKyc.companyName;
        legacyConsumer.houseType = consumerKyc.houseLevel;
        legacyConsumer.governorate = consumerAddress.governorate?.nameEn || null;
        legacyConsumer.city = consumerAddress.city?.nameEn || null;
        legacyConsumer.district = consumerAddress.area?.nameEn || null;
        legacyConsumer.salary = consumerKyc.primaryIncome;
        legacyConsumer.additionalSalary = consumerKyc.additionalIncome;
        legacyConsumer.address = consumerAddress.addressLine1;
        legacyConsumer.maritalStatus = consumerKyc.maritalStatus;
        legacyConsumer.carYear = consumerKyc.carYear;
        legacyConsumer.activatedAt = consumerKyc.activeSince;
        legacyConsumer.singlePaymentDay = 1;
        legacyConsumer.classification = 'NA';
        legacyConsumer.originationChannel = 'mylo';  // or set dynamically if needed
        legacyConsumer.createdAt = new Date();
        legacyConsumer.updatedAt = new Date();

        this.logger.debug(`Creating LegacyConsumer: ${JSON.stringify(legacyConsumer)}`);
        await this.legacyConsumerRepository.save(legacyConsumer, manager);
    }
}