export const getConsumerOnboardingStatusQuery = `
  query GetOnboardingApplicationStatus($phoneNumber: String) {
    consumer_application(
      order_by: { created_at: desc }
      where: { phone_number_e164: { _eq: $phoneNumber } }
    ) {
      id
      consumer_id
      phone_number_e164
      data
      consumer_application_states(order_by: { active_since: desc }, limit: 1) {
        id
        consumer_application_id
        state
        active_since
      }
    }
  }
`;

export const getGovernoratesQuery = (lang: string) => `
    query GetGovernorates ($limit: Int!, $offset: Int!) {
        governorates(limit: $limit, offset: $offset, order_by: {name_${lang}: asc}) {
            name: name_${lang}
            id
        }
        governorates_aggregate {
            aggregate {
                count
            }
        }
    }
`;

export const getCarModelsQuery = (lang: string) => `
    query GetCarModels ($limit: Int!, $offset: Int!) {
        car_models(limit: $limit, offset: $offset) {
            id
            name: name_${lang}
            unique_identifier
        }
        car_models_aggregate {
            aggregate {
                count
            }
        }
    }
`;

export const getJobsQuery = (lang: string) => `
    query GetJobs ($limit: Int!, $offset: Int!) {
        jobs(limit: $limit, offset: $offset) {
            name: name_${lang}
            id
            unique_identifier
        }
        jobs_aggregate {
            aggregate {
                count
            }
        }
    }
`;

export const getMaritalStatusQuery = (lang: string) => `
    query GetMaritalStatus ($limit: Int!, $offset: Int!) {
        consumer_marital_status(limit: $limit, offset: $offset) {
            id
            name: name_${lang}
            status
        }
        consumer_marital_status_aggregate {
            aggregate {
                count
            }
        }
    }
`;

export const getClubsQuery = (lang: string) => `
    query GetClubs ($limit: Int!, $offset: Int!) {
        clubs(limit: $limit, offset: $offset) {
            id
            name: name_${lang}
        }
        clubs_aggregate {
            aggregate {
                count
            }
        }
    }
`;

export const getBetaConsumersByPhoneNumberQuery = `
    query GetBetaConsumerByPhoneNumber($phoneNumber: String) {
        beta_consumers(where: {phone_number: {_eq: $phoneNumber}}) {
            id
            phone_number
        }
    }
`;

export const getHouseTypesQuery = (lang: string) => `
    query GetHouseTypes ($limit: Int!, $offset: Int!) {
        consumer_house_type(limit: $limit, offset: $offset) {
            id
            name: name_${lang}
            unique_identifier
        }
        consumer_house_type_aggregate {
            aggregate {
                count
            }
        }
    }
`;

export const getConsumerDataQuery = `
  query GetConsumerData($consumerId: uuid) {
    consumer_user_details: consumer_user_details(
      where: { consumer_id: { _eq: $consumerId } }
    ) {
      id
      first_name
      last_name
      consumer_id
      new_consumer {
        identity_id
        consumer_states(order_by: { active_since: desc }, limit: 1) {
          state
        }
      }
    }
    consumer_credit_limits(
      order_by: { active_since: desc }
      limit: 1
      where: { consumer_id: { _eq: $consumerId } }
    ) {
      available_credit_limit
    }
    consumer_phone(
      limit: 1
      where: { consumer_id: { _eq: $consumerId }, is_primary: { _eq: true } }
    ) {
      phone_number_e164
    }
  }
`;

// Replace iam_id by identity_id once consumer 2.0 is migrated
export const getConsumerIdByIamIdQuery = `
  query GetConsumerIdByIamIdQuery($iamId: String) {
    consumers(where: { iam_id: { _eq: $iamId } }) {
      id
    }
  }
`;

export const checkIfNationalIdExistedQuery = `
  query CheckIfNationalIdExistedQuery($nationalId: String!) {
    consumers(where: {national_id: {_eq: $nationalId}}, limit: 1) {
      phone_number
    }
    new_consumers(where: {consumer_user_details: {national_id: {_eq: $nationalId}}}, limit: 1) {
      consumer_phones(where: {is_primary: {_eq: true}}, limit: 1) {
        phone_number_e164
      }
    }
  }
`;

export const getConsumerLoansQuery = `
  query GetConsumerLoans($consumerId: String) {
    loan(
      where: { consumer_id: { _eq: $consumerId } }
      order_by: { booked_at: desc }
    ) {
      id
      booked_at
      loan_statuses(limit: 1, order_by: { created_at: desc }) {
        status
      }
      partner {
        id
        name
        categories
      }
      commercial_offer {
        financed_amount
      }
    }
  }
`;
