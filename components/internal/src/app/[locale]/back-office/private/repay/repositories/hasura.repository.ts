"use server";
import axios from "axios";

import { LoanDetails, UserDto } from "../dto";

export const checkConsumerData = async (phone: string): Promise<UserDto[]> => {
  const phone_number = phone?.trim();
  const res = await axios.post(process.env.OL_BFF_GRAPHQL_URL!, {
    query: ` query FindConsumer {
          consumers(where: {phone_number: {_eq: "+2${phone_number}"}}  ) {
          id
          iam_id
          full_name
          national_id
          loans {
            loan_schedules {
              due_date
              due_interest
              due_late_fee
              due_principal
              is_cancelled
              id
              loan_id
              paid_date
            }
            loan_schedules_aggregate(where: {}) {
              aggregate {
                count
              }
            }
          }
        }
      }
    `,
  });
  const data: UserDto[] = res.data.data.consumers;
  return data;
};

///
export const fetchUpcomingInstallements = async (id: string): Promise<LoanDetails[]> => {
  const consumer_id = id?.trim();
  const res = await axios.post(process.env.OL_BFF_GRAPHQL_URL!, {
    query: `query ListConsumerInstallements {
                    loan_schedule(where: {loan: {consumer_id: {_eq: "${consumer_id}"}}, paid_date: {_is_null: true}, is_cancelled: {_eq: false}}, order_by: {due_date: asc}) {
                        id
                        loan_id
                        paid_date
                        due_principal
                        due_interest
                        due_late_fee
                        due_date
                        loan {
                        merchant_global_id
                        loan_statuses {
                            status
                        }
                              partner {
                                        id
                                        name
                                     }
                        } 
                    }
                 } `,
  });
  const data: LoanDetails[] = res.data.data.loan_schedule;
  return data;
};
