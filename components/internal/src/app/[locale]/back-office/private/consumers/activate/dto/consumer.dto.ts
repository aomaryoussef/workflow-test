import { ConsumerStatus } from "../enums";

export interface IConsumerDto {
  id: string;
  iam_id: string;
  first_name: null;
  last_name: null;
  phone_number: string;
  national_id: string;
  address: string;
  credit_limit: number;
  status: ConsumerStatus;
  created_at: string;
  updated_at: string;
  full_name: string;
  job_name: string;
  work_type: string;
  club: string;
  house_type: string;
  city: string;
  district: string;
  governorate: string;
  salary: number;
  additional_salary: number;
  address_description: string;
  guarantor_job: string;
  guarantor_relationship: string;
  car_year: number;
  marital_status: string;
  company: string;
  single_payment_day: number;
  branch_name?: string;
  activated_at?: string;
  national_id_address?: string;
  home_phone_number?: string;
  company_address?: string;
  work_phone_number?: string;
  additional_salary_source?: string;
}
