import gql from "graphql-tag";

export const CONSUMERS_LIST_QUERY = gql`
  query ConsumerList($offset: Int!, $limit: Int!) {
    consumer(offset: $offset, limit: $limit) {
      id
      consumer_user_mappings {
        user_detail {
          id
          first_name
          last_name
          date_of_birth
          phones {
            phone_number_e164
          }
        }
      }
    }
    consumer_aggregate {
      aggregate {
        count
      }
    }
  }
`;
export const CONSUMER_QUERY = gql`
  query Consumer($id: String!) {
    consumer(where: { id: { _eq: $id } }) {
      id
      consumer_kycs(order_by: {active_since_utc: desc}, limit: 1, where: {active_until_utc: {_gte: "now()"}}) {
      active_since_utc
      additional_income_units
      car_type
      city_of_birth
      company {
        name
      }
      insurance_type
      job_title
      primary_income_units
      work_type
    }
      consumer_user_mappings {
        user_detail {
          first_name
          middle_name
          last_name
          date_of_birth
          marital_status
          gender
          phones {
            phone_number_e164
          }
          addresses {
            id
            state
            city
            country
            line_1
            line_2
            line_3
            further_details
            zip
          }
        }
      }
    }
  }
`;
