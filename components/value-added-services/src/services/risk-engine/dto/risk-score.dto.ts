import { ScoreConsumerData } from 'src/domain/consumer/dto/api/consumer-scoring.dto';
import { ScoreConsumerViaRiskEngineInputDTO } from 'src/domain/consumer/dto/tasks/score-consumer-via-risk-engine.dto';
import {
  MaritalStatus,
  MobileOsType,
} from 'src/domain/consumer/types/consumer-application.types';

export class GetRiskEngineScoreInputDTO {
  client_id: string;
  phone_number_1?: string;
  flag_is_mc_customer: number;
  ssn: string;
  contract_date: Date;
  job_name_map: string;
  net_income: number;
  net_burden: number;
  insurance_type?: string | null;
  marital_status: MaritalStatus;
  children_count?: number;
  address_governorate: string;
  address_city: string;
  address_area: string;
  house_type: string;
  car_type_id?: string | null;
  car_model_year?: number | null;
  club_level?: string;
  mobile_os_type?: MobileOsType;

  constructor();
  constructor(inputDto: ScoreConsumerViaRiskEngineInputDTO | ScoreConsumerData);
  constructor(
    inputDto?: ScoreConsumerViaRiskEngineInputDTO | ScoreConsumerData,
  ) {
    this.flag_is_mc_customer = 0; // not used yet
    this.net_burden = 0; // not used yet
    this.insurance_type = null; // not used yet
    this.contract_date = new Date(); // Sets current date
    this.car_type_id = null; // not used yet
    this.car_model_year = null; // not used yet

    if (inputDto) {
      if (inputDto instanceof ScoreConsumerViaRiskEngineInputDTO) {
        // Mapping from ScoreConsumerViaRiskEngineInputDTO
        this.client_id = inputDto.consumer_id;
        this.phone_number_1 = inputDto.phone_number;
        this.ssn = inputDto.consumer_details.national_id;
        this.job_name_map = inputDto.consumer_details.job_title;
        this.net_income = inputDto.consumer_details.primary_income;
        this.marital_status = inputDto.consumer_details.marital_status;
        this.children_count = inputDto.consumer_details.number_of_kids;
        this.address_governorate = inputDto.consumer_details.governorate;
        this.address_city = inputDto.consumer_details.city;
        this.address_area = inputDto.consumer_details.area || 'other';
        this.house_type = inputDto.consumer_details.house_type;
        this.club_level = inputDto.consumer_details.club;
        this.mobile_os_type = inputDto.consumer_details.mobile_os_type;
      } else if (inputDto instanceof ScoreConsumerData) {
        // Mapping from GetRiskScoreData
        this.phone_number_1 = inputDto.phoneNumber;
        this.ssn = inputDto.nationalId;
        this.job_name_map = inputDto.jobTitle;
        this.net_income = inputDto.primaryIncome * 100;
        this.marital_status = inputDto.maritalStatus;
        this.children_count = inputDto.numberOfKids;
        this.house_type = inputDto.houseType;
        this.club_level = inputDto.club;
        this.mobile_os_type = inputDto.mobileOsType;
      }
    }
  }
}
export class GetRiskEngineScoreOutputDTO {
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
