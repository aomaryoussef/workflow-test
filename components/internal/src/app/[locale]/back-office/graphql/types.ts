import { EBankName } from "@common/enums/bank.enums.ts";
import { ECategory, EPartnerStatus } from "@common/enums/partner.enums.ts";

import type * as Types from "./schema.types.ts";

export type GetConsumerByPhoneNumberQueryVariables = Types.Exact<{
  phone_number: Types.Scalars["String"]["input"];
}>;

export type GetConsumerByPhoneNumberQuery = {
  consumer: Array<
    Pick<Types.Consumer, "id" | "identity_id" | "created_at_utc" | "updated_at_utc"> & {
      consumer_kycs: Array<
        Pick<
          Types.Consumer_Kyc,
          | "active_since_utc"
          | "additional_income_units"
          | "car_type"
          | "city_of_birth"
          | "insurance_type"
          | "job_title"
          | "primary_income_units"
          | "work_type"
        > & { company?: Types.Maybe<Pick<Types.Company, "name">> }
      >;
      consumer_user_mappings: Array<{
        user_detail: Pick<
          Types.User_Detail,
          "first_name" | "last_name" | "marital_status" | "middle_name" | "date_of_birth" | "gender"
        > & {
          phones: Array<Pick<Types.Phone, "phone_number_e164">>;
          addresses: Array<Pick<Types.Address, "id" | "state" | "city" | "country" | "line_1" | "zip">>;
        };
      }>;
      collaterals: Array<Pick<Types.Collateral, "collateral_number">>;
      credit_limits: Array<Pick<Types.Credit_Limit, "monthly_max_limit" | "total_max_limit">>;
      consumer_states: Array<Pick<Types.Consumer_State, "state" | "active_since_utc">>;
      guarantors: Array<Pick<Types.Guarantor, "guarantor_of" | "guarantor_relation">>;
    }
  >;
};

export type ConsumerListQueryVariables = Types.Exact<{
  offset: Types.Scalars["Int"]["input"];
  limit: Types.Scalars["Int"]["input"];
}>;

export type ConsumerListQuery = {
  consumer: Array<
    Pick<Types.Consumer, "id"> & {
      consumer_user_mappings: Array<{
        user_detail: Pick<Types.User_Detail, "id" | "first_name" | "last_name" | "date_of_birth"> & {
          phones: Array<Pick<Types.Phone, "phone_number_e164">>;
        };
      }>;
    }
  >;
  consumer_aggregate: {
    aggregate?: Types.Maybe<Pick<Types.Consumer_Aggregate_Fields, "count">>;
  };
};

export type ConsumerQueryVariables = Types.Exact<{
  id: Types.Scalars["String"]["input"];
}>;

export type ConsumerQuery = {
  consumer: Array<
    Pick<Types.Consumer, "id"> & {
      consumer_kycs: Array<
        Pick<
          Types.Consumer_Kyc,
          | "active_since_utc"
          | "additional_income_units"
          | "car_type"
          | "city_of_birth"
          | "insurance_type"
          | "job_title"
          | "primary_income_units"
          | "work_type"
        > & { company?: Types.Maybe<Pick<Types.Company, "name">> }
      >;
      consumer_user_mappings: Array<{
        user_detail: Pick<
          Types.User_Detail,
          "first_name" | "middle_name" | "last_name" | "date_of_birth" | "marital_status" | "gender"
        > & {
          phones: Array<Pick<Types.Phone, "phone_number_e164">>;
          addresses: Array<
            Pick<
              Types.Address,
              "id" | "state" | "city" | "country" | "line_1" | "line_2" | "line_3" | "further_details" | "zip"
            >
          >;
        };
      }>;
    }
  >;
};

//#region Partner
export interface IPartner {
  name: string;
  categories: ECategory[];
  tax_registration_number: string;
  commercial_registration_number: string;
  bank_account: IBankAccount;
  admin_user_profile: IUserProfile;
}

export interface IBranch {
  name: string;
  governorate: string;
  city: string;
  area: string;
  street: string;
  location: ILocation;
  google_maps_link: string;
}

export interface ILocation {
  latitude: string;
  longitude: string;
}

export interface IBankAccount {
  bank_name: EBankName;
  branch_name: string;
  beneficiary_name: string;
  iban: string;
  swift_code?: string;
  account_number: string;
}

export interface IUserProfile {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  national_id?: string;
}

export interface IPartnerResponse {
  id: string;
  name: string;
  categories: ECategory[];
  status: EPartnerStatus;
  tax_registration_number: string;
  commercial_registration_number: string;
  created_at: string;
  updated_at: string;
  branches: IBranchResponse[];
  bank_accounts: IBankAccountResponse[];
  user_profiles: IUserProfileResponse[];
}

interface IBankAccountResponse {
  id: string;
  partner_id: string;
  bank_name: EBankName;
  branch_name: string;
  beneficiary_name: string;
  iban: string;
  swift_code: string;
  account_number: string;
  created_at: string;
  updated_at: string;
}

interface IBranchResponse {
  id: string;
  partner_id: string;
  name: string;
  governorate: string;
  city: string;
  area: string;
  street: string;
  location: Location;
  google_maps_link: string;
  created_at: string;
  updated_at: string;
}

interface IUserProfileResponse {
  id: string;
  iam_id: string;
  partner_id: string;
  branch_id: null;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  national_id: null;
  profile_type: string;
  created_at: string;
  updated_at: string;
}
//#endregion
