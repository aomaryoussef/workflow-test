export type ConsumerDto = {
  id: string;
  phone_number: string;
  iam_id: string;
  national_id: string;
  status: string;
  first_name: string;
  last_name: string;
  address: string;
  credit_limit: number;
  created_at: string;
  updated_at: string;
  activated_at: string;
  activated_by_iam_id: string;
  activation_branch: string;
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
  company_address?: string;
  work_phone_number?: string
  home_phone_number?: string
  branch_name?: string
  national_id_address?: string
  additional_salary_source?: string
};

/**
 * Type representing the basic information of a consumer.
 * @typedef {Object} ConsumerBasicInfoDto
 * @property {string} id - The ID of the consumer.
 * @property {string} full_name - The full name of the consumer.
 * @property {string} national_id - The national ID of the consumer.
 * @property {string} status - The status of the consumer.
 */
export type ConsumerBasicInfoDto = {
  id: string;
  fullName: string;
  initials: string;
  nationalId: string;
  status: string;
};

export type PrintConsumerDto = ConsumerDto & {
  credit_limit_arabic_text?: string;
}

export type GetConsumerCreditLimitsResponse = {
  available_limit: number;
  monthly_limit: number;
};