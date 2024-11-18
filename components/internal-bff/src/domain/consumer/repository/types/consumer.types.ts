import {
  OnboardingApplicationStatus,
  OnboardingStep,
} from '../../dto/onboarding-application.dto';

interface HasuraDataAggregate {
  aggregate: {
    count: number;
  };
}

export class HasuraResponse<T> {
  data: T[];
}

interface Club {
  name: string;
  membershipId: string;
}

interface Dependant {
  name: string;
  age: number;
  relation: string;
}

interface ConsumerKyc {
  id: string;
  consumerId: string;
  jobTitle: string;
  workType: string;
  companyId: string;
  otherCompanyName: string;
  jobLevel: string;
  educationLevel: string;
  primaryIncome: number;
  additionalIncome: number;
  carModel: string;
  maritalStatus: string;
  houseLevel: string;
  club: Club;
  dependants: Dependant[];
}

interface ConsumerApplicationState {
  id: string;
  consumerApplicationId: string;
  state: OnboardingApplicationStatus;
  activeSince: string;
}

interface ConsumerData {
  step: OnboardingStep;
  isMc: boolean;
  flowId: string;
  consumerKyc: ConsumerKyc;
}

export interface Application {
  id: string;
  consumerId: string;
  phoneNumberE164: string;
  data: ConsumerData;
  consumerApplicationStates: ConsumerApplicationState[];
}

export interface getConsumerOnboardingStatusResponse {
  data: {
    consumerApplication: Application[];
  };
}

interface Governorate {
  name: string; // The name of the governorate
  id: number; // The unique identifier for the governorate
}

interface GovernoratesData {
  governorates: Governorate[]; // Array of governorate objects
  governorates_aggregate: HasuraDataAggregate; // Aggregate information for governorates
}

export interface GovernoratesHasuraApiResponse {
  data: GovernoratesData; // The main data object containing governorates and their aggregate information
}

export interface Job {
  id: number;
  name: string;
  unique_identifier: string;
}

interface JobsData {
  jobs: Job[];
  jobs_aggregate: HasuraDataAggregate;
}

export interface JobsHasuraApiResponse {
  data: JobsData;
}

interface ConsumerMaritalStatus {
  id: number;
  name_en: string;
  name_ar: string;
  status: string;
}

interface ConsumerMaritalStatusData {
  consumer_marital_status: ConsumerMaritalStatus[];
  consumer_marital_status_aggregate: HasuraDataAggregate;
}

export interface MaritalStatusHasuraApiResponse {
  data: ConsumerMaritalStatusData;
}

interface Club {
  id: number;
  name_en: string;
  name_ar: string;
}

export interface ClubsData {
  clubs: Club[];
  clubs_aggregate: HasuraDataAggregate;
}

export interface ClubsHasuraApiResponse {
  data: ClubsData;
}

interface ConsumerHouseType {
  id: number;
  name: string;
  unique_identifier: string;
}

interface ConsumerHouseTypeAggregate {
  aggregate: {
    count: number;
  };
}

interface HouseTypeData {
  consumer_house_type: ConsumerHouseType[];
  consumer_house_type_aggregate: ConsumerHouseTypeAggregate;
}

export interface HouseTypesHasuraApiResponse {
  data: HouseTypeData;
}

export class CarModel {
  id: number;
  name: string;
  unique_identifier: string;
}

interface CarModelsData {
  car_models: CarModel[];
  car_models_aggregate: HasuraDataAggregate;
}

export interface CarModelHasuraApiResponse {
  data: CarModelsData;
}

interface ConsumerPhone {
  phone_number_e164: string;
}

interface ConsumerUserDetails {
  id: string;
  consumer_id: string;
  first_name: string;
  last_name: string;
  new_consumer: Consumer;
}

interface ConsumerState {
  state: string;
}

interface Consumer {
  unique_identifier: string;
  identity_id: string;
  consumer_states: ConsumerState[];
}

interface ConsumerCreditLimit {
  available_credit_limit: number;
}

export interface GetConsumerDataHasuraApiResponse {
  data: {
    consumer_user_details: ConsumerUserDetails[];
    consumer_credit_limits: ConsumerCreditLimit[];
    consumer_phone: ConsumerPhone[];
  };
}

export interface GetConsumerIdByIamIdHasuraApiResponse {
  data: {
    consumers: {
      id: string;
    }[];
  };
}

export interface BetaConsumerResponse {
  data: {
    isBetaConsumer: boolean;
  };
}

export interface GetBetaConsumersByPhoneNumberResponse {
  data: {
    beta_consumers: {
      id: string;
      phone_number: string;
    }[];
  };
}

export interface CheckIfNationalIdExistedResponse {
  data: {
    consumers: Array<{
      phone_number: string | null;
    }> | null;
    new_consumers: Array<{
      consumer_phones: Array<{
        phone_number_e164: string | null;
      }> | null;
    }> | null;
  }
}

export interface Partner {
  id: string;
  name: string;
  categories: string[];
}

export interface CommercialOffer {
  id: string;
  financed_amount: number;
}

export interface Loan {
  id: string;
  booked_at: string;
  partner: Partner;
  loan_statuses: {
    status: string;
  }[];
  commercial_offer: CommercialOffer;
}

export interface ConsumerLoansResponse {
  data: {
    loan: Loan[];
  };
}
