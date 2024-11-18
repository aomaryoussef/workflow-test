import { ConsumerStatus } from "./consumer.types";

// this is used as part of ConsumerApplication inside the data field {data: step: ApplicationStep}
export enum ApplicationStep {
    CREATED = 'CREATED',
    OTP_VALIDATION = 'OTP_VALIDATION',
    OTP_VALIDATION_SUCCESS = 'OTP_VALIDATION_SUCCESS',
    MC_DUPLICATE = 'MC_DUPLICATE',
    MC_SUCCESS = 'MC_SUCCESS',
    KYC_DATA = 'KYC_DATA',
    RISK_ENGINE_VALIDATION = 'RISK_ENGINE_VALIDATION',
    RISK_ENGINE_VALIDATION_TERRORIST = 'RISK_ENGINE_VALIDATION_TERRORIST',
    RISK_ENGINE_VALIDATION_SANCTION = 'RISK_ENGINE_VALIDATION_SANCTION',
    COMPLETED = 'COMPLETED',
}

export enum ApplicationState {
    APPROVED = 'APPROVED',
    BLOCKED = 'BLOCKED',
    FAILED = 'FAILED',
    REJECTED = 'REJECTED',
    IN_PROGRESS = 'IN_PROGRESS',
    SUBMITTED = 'SUBMITTED',
}
export enum MaritalStatus {
    SINGLE = 'single',
    MARRIED = 'married',
    DIVORCED = 'divorced',
    WIDOWED = 'widowed'
}
export enum MobileOsType {
    IOS = 'ios',
    ANDROID = 'android'
}

export interface ConsumerKyc {
    client_id: string;
    ssn: string;
    phone_number_1: string;
    phone_number_2?: string | null;
    email?: string;
    flag_is_mc_customer: number;
    contract_date?: Date;
    job_name_map: string;
    job_level?: string;
    job_title?: string;
    net_income: number;
    net_burden: number;
    insurance_type: string;
    marital_status: MaritalStatus;
    children_count?: number;
    address_governorate: string;
    address_city: string;
    address_area: string;
    address_governorate_id: number;
    address_city_id: number;
    address_area_id: number;
    house_type: string;
    car_type_id?: number;
    car_type?: string;
    car_model_year?: number | null;
    club_level?: string | null;
    education_level?: string;
    company_name?: string;
    other_company_name?: string;
    work_type?: string;
    nationality?: string;
    dependants?: number;
    additional_income?: number;
    postcode?: string;
    latitude?: number;
    longitude?: number;
    first_name: string;
    middle_name?: string;
    last_name: string;
    date_of_birth?: Date;
    city_of_birth?: string;
    address?: string;
    mobile_os_type?: MobileOsType;
}

export interface ConsumerCl {
    consumer_id: string;
    ar_status: string;
    calc_credit_limit: number;
    pd_predictions: number;
    income_predictions: number;
    income_zone: string;
    final_net_income: number;
    cwf_segment: string;
    cwf: number;
    is_consumer_in_lists: boolean;
}

export interface ConsumerApplicationData {
    phone_number: string;
    workflow_id: string;
    flow_id: string;
    application_status: ApplicationState;
    step: ApplicationStep;
    consumer_kyc: ConsumerKyc;
    consumer_status: ConsumerStatus;
    consumer_cl: ConsumerCl;
}
