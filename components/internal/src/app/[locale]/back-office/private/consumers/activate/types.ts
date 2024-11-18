import camelcaseKeys from "camelcase-keys";

import { IConsumerDto } from "@/app/[locale]/back-office/private/consumers/activate/dto/consumer.dto";

import { ScoringStatus } from "./enums";

export interface IScoringInput {
  ssn: string;
  salary: number;
  jobName: string;
  workType: string;
  company: string;
  city: string;
  district: string;
  governorate: string;
  club: string;
  name: string;

  additionalSalary?: number;
  address?: string;
  addressDescription?: string;
  houseType?: string;
  guarantorJob?: string;
  guarantorRelationship?: string;
  car?: number;
  burden?: { amount?: number; burdenType?: string }[];
  maritalStatus?: string;
  stateName?: string;
  mobileNumber?: string;
}

export interface IScoringResponse {
  status: ScoringStatus;
  canDownload: boolean;
  creditLimit: number;
}

export interface IConsumerMiniCash {
  Ssn: string;
  FullName: string;
  MobileNo: string;
  JobName: string;
  WorkType: string;
  Company: string;
  Club: string;
  Address: string;
  HouseType: string;
  City: string;
  District: string;
  Governorate: string;
  Salary: number;
  AdditionalSalary: number;
  AddressDescription: string;
  GuarantorJob: string;
  GuarantorRelationship: string;
  Car: number;
  CreditLimit: string;
  MaritalStatus: string;
  SinglePaymentDay: number;
  HomePhone: string;
  WorkPhone: string;
  WorkAddress: string;
}

export type IConsumerForm = Pick<
  ReturnType<typeof camelcaseKeys<IConsumerDto & { [key: string]: unknown }>>, // The `& { [key: string]: unknown }` is just to pass a typescript error
  | "nationalId"
  | "phoneNumber"
  | "fullName"
  | "status"
  | "address"
  | "nationalIdAddress"
  | "homePhoneNumber"
  | "jobName"
  | "company"
  | "companyAddress"
  | "workPhoneNumber"
  | "salary"
  | "additionalSalary"
  | "additionalSalarySource"
  | "branchName"
  | "activatedAt"
  | "singlePaymentDay"
>;
//#endregion
