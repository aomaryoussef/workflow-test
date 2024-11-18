import axios from "axios";
import { config } from "../../config";
import { Language } from "../app/web/typings/constants";
import { arCategory, categoriesIcons, enCategory } from "../domain/partner/models/partner";
import { CustomLogger } from "./logger";
import { NotFoundError } from "../domain/errors/not-found-error";
import { GetConsumerCreditLimitsResponse } from "../domain/dtos/consumer-dto";
import { UUID } from "crypto";

const logger = new CustomLogger("hasura", "service");

const client = axios.create({
  baseURL: `${config.hasuraBaseURL}`,
  timeout: 40_000,
  headers: { "Content-Type": "application/json" },
});

export const getPartnerTransactions = async (
  page: number,
  perPage: number,
  partnerId: string,
  consumerPhoneNumber: string = "",
  transactionIdSearch: string = "",
  checkoutBasketId: string = "",
): Promise<{ data: any[]; totalCount: number }> => {
  const phoneNumber = consumerPhoneNumber.startsWith("+2") ? consumerPhoneNumber : `+2${consumerPhoneNumber}`;
  const offset = (page - 1) * perPage;
  const variables: { [key: string]: string | number } = {};
  variables["limit"] = perPage;
  variables["offset"] = offset;
  variables["partnerId"] = partnerId;
  let phoneNumberVariable = "";
  let phoneNumberFilter = "";
  let checkoutBasketIdVariable = "";
  let checkoutBasketIdFilter = "";
  let transactionIdVariable = "";
  let transactionIdFilter = "";
  if (consumerPhoneNumber) {
    phoneNumberVariable = ", $phoneNumber: String!";
    phoneNumberFilter = ", consumer: {phone_number: {_eq: $phoneNumber}}";
    variables["phoneNumber"] = phoneNumber;
  }
  if (transactionIdSearch) {
    transactionIdVariable = ", $transactionId: bigint!";
    transactionIdFilter = ", transaction_id: {_eq: $transactionId}";
    variables["transactionId"] = transactionIdSearch;
  }
  if (checkoutBasketId) {
    checkoutBasketIdVariable = ", $checkoutBasketId: uuid!";
    checkoutBasketIdFilter = ", id: {_eq: $checkoutBasketId}";
    variables["checkoutBasketId"] = checkoutBasketId;
  }
  try {
    const operation = `
      query MyQuery ($limit: Int!, $offset: Int!, $partnerId: uuid!${phoneNumberVariable}${checkoutBasketIdVariable}${transactionIdVariable}) {
        checkout_baskets(limit: $limit, offset: $offset, order_by: {created_at: desc}, where: {status: {_eq: "LOAN_ACTIVATED"}, partner_id: {_eq: $partnerId}${phoneNumberFilter}${checkoutBasketIdFilter}${transactionIdFilter}}) {
          consumer_id
          id
          created_at
          workflow_id
          loan_id
          transaction_id
          cashier {
            first_name
            last_name
          }
          products
          commercial_offers
          selected_commercial_offer_id
          partner {
            partner_bank_accounts {
              bank_name
              account_number
            }
          }
          partner_branch {
            name
          }
        }
        checkout_baskets_aggregate(where: {status: {_eq: "LOAN_ACTIVATED"}, partner_id: {_eq: $partnerId}${phoneNumberFilter}}) {
          aggregate {
            count
          }
        }
      }
      `;
    const result = await client.post("", { query: operation, variables: variables });
    const returnResult = {
      data: result.data.data.checkout_baskets,
      totalCount: result.data.data.checkout_baskets_aggregate.aggregate.count,
    };
    return returnResult;
  } catch (error) {
    console.error(error);
    return {
      data: [],
      totalCount: 0,
    };
  }
};

export const getBranchTransactions = async (
  page: number,
  perPage: number,
  branchId: string,
  consumerPhoneNumber: string = "",
  transactionId: string = "",
): Promise<{ data: any[]; totalCount: number }> => {
  logger.info(`getting branch transactions for branch id: ${branchId}`);
  const phoneNumber = consumerPhoneNumber.startsWith("+2") ? consumerPhoneNumber : `+2${consumerPhoneNumber}`;
  const offset = (page - 1) * perPage;
  const variables: { [key: string]: string | number } = {};
  variables["limit"] = perPage;
  variables["offset"] = offset;
  variables["branchId"] = branchId;
  let phoneNumberVariable = "";
  let phoneNumberFilter = "";
  let transactionIdVariable = "";
  let transactionIdFilter = "";
  if (consumerPhoneNumber) {
    phoneNumberVariable = ", $phoneNumber: String!";
    phoneNumberFilter = ", consumer: {phone_number: {_eq: $phoneNumber}}";
    variables["phoneNumber"] = phoneNumber;
  }
  if (transactionId) {
    transactionIdVariable = ", $transactionId: bigint!";
    transactionIdFilter = ", transaction_id: {_eq: $transactionId}";
    variables["transactionId"] = transactionId;
  }
  try {
    const operation = `
      query MyQuery ($limit: Int!, $offset: Int!, $branchId: uuid!${phoneNumberVariable}${transactionIdVariable}) {
          checkout_baskets(
        limit: $limit,
        offset: $offset,
        order_by: { created_at: desc },
        where: {
          status: { _eq: "LOAN_ACTIVATED" },
          branch_id: { _eq: $branchId }
          ${phoneNumberFilter}${transactionIdFilter}
        }
      ) {
        consumer_id
        id
        created_at
        workflow_id
        loan_id
        cashier {
          first_name
          last_name
        }
        products
        commercial_offers
        selected_commercial_offer_id
        partner {
          partner_bank_accounts {
            bank_name
            account_number
          }
        }
        partner_branch {
          name
        }
      }
      checkout_baskets_aggregate(
        where: {
          status: { _eq: "LOAN_ACTIVATED" },
          branch_id: { _eq: $branchId}
          ${phoneNumberFilter}${transactionIdFilter}
        }
      ) {
        aggregate {
          count
        }
      }

      }
      `;
    const result = await client.post("", { query: operation, variables: variables });
    const returnResult = {
      data: result.data.data.checkout_baskets,
      totalCount: result.data.data.checkout_baskets_aggregate.aggregate.count,
    };
    return returnResult;
  } catch (error) {
    console.error(error);
    return {
      data: [],
      totalCount: 0,
    };
  }
};

export const getTopPartnersList = async (
  page: number,
  perPage: number,
  lang: Language,
  governorateId: string | null = null,
) => {
  const offset = (page - 1) * perPage;
  const variables: { [key: string]: string | number } = {
    limit: perPage,
    offset: offset,
  };
  // Initialize filters and query variables
  const filters: string[] = [];
  const queryVariables: string[] = [];
  if (governorateId) {
    variables["governorateId"] = governorateId;
    filters.push(`{ partner: { partner_branches: { governorate_id: { _eq: $governorateId } } }}`);
    queryVariables.push("$governorateId: Int!");
  }
  // filter only active partners
  filters.push("{ partner: { status:  {_eq: $status} } }");
  queryVariables.push("$status: partnerstatus!");
  variables["status"] = "ACTIVE";

  const filter = filters.length > 0 ? `where: {_and: [${filters.join(", ")}]}` : "";
  const variableString = queryVariables.length > 0 ? `, ${queryVariables.join(", ")}` : "";
  try {
    const operation = `query MyQuery($limit: Int!, $offset: Int!${variableString}) {
        partner_top(limit: $limit, offset: $offset${filter ? "," + filter : ""}, order_by: {rank: asc}) {
          rank
          partner {
            categories
            id
            name
          }
          id
        }
        partner_top_aggregate {
          aggregate {
            count
          }
        }
      }`;
    const result = await client.post("", { query: operation, variables });
    const mappedPartnerResult = result?.data?.data?.partner_top?.map((p: { partner: any }) => p.partner);
    return {
      data: updatePartnerCategories(mappedPartnerResult || [], lang),
      totalCount: result?.data?.data?.partner_top_aggregate?.aggregate?.count || 0,
    };
  } catch (error) {
    console.error(error);
    return {
      data: [],
      totalCount: 0,
    };
  }
};
export const getPartners = async (
  page: number,
  perPage: number,
  lang: Language,
  category: string | null = null,
  governorateId: string | null = null,
  search: string | null = null,
): Promise<{ data: any[]; totalCount: number }> => {
  const offset = (page - 1) * perPage;

  // Initialize variables with limit and offset
  const variables: { [key: string]: string | number } = {
    limit: perPage,
    offset: offset,
  };

  // Initialize filters and query variables
  const filters: string[] = [];
  const queryVariables: string[] = [];

  // Add governorate filter and variable if governorateId is provided
  if (governorateId) {
    variables["governorateId"] = governorateId;
    filters.push(`{ partner_branches: { governorate_id: { _eq: $governorateId } } }`);
    queryVariables.push("$governorateId: Int!");
  }
  if (search) {
    variables["search"] = `%${search}%`;
    filters.push(`{ name: { _ilike: $search } } `);
    queryVariables.push("$search: String!");
  }
  // Add category filter and variable if category is provided
  if (category) {
    variables["category"] = category;
    filters.push(`{ categories: { _contains: [$category] } }`);
    queryVariables.push("$category: partnercategory!");
  }

  // Construct the filter and variable strings
  const filter = filters.length > 0 ? `where: {_and: [${filters.join(", ")}]}` : "";
  const variableString = queryVariables.length > 0 ? `, ${queryVariables.join(", ")}` : "";

  try {
    const operation = `
      query MyQuery($limit: Int!, $offset: Int!${variableString}) {
        partner(limit: $limit, offset: $offset${filter ? "," + filter : ""}) {
          categories
          id
          name
          status
          partner_branches {
            area_id
            city_id
            id
            governorate_id
            name
            location_longitude
            location_latitude
            google_maps_link
            street
            area: area_record {
              id
              name: name_${lang}
            }
            governorate: governorate_record {
              name: name_${lang}
              id
            }
            city: city_record {
              id
              name: name_${lang}
            }
          }
          partner_user_profiles {
            branch_id
            email
            first_name
            last_name
            id
            partner_id
            phone_number
          }
        }
        partner_aggregate${filter ? "(" + filter + ")" : ""} {
          aggregate {
            count
          }
        }
      }
    `;
    const result = await client.post("", { query: operation, variables });
    return {
      data: updatePartnerCategories(result?.data?.data?.partner || [], lang),
      totalCount: result?.data?.data?.partner_aggregate.aggregate.count,
    };
  } catch (error) {
    console.error(error);
    return {
      data: [],
      totalCount: 0,
    };
  }
};

export const getCities = async (
  page: number,
  perPage: number,
  lang: Language,
  governorateId: number = null,
): Promise<{ data: any[]; totalCount: number }> => {
  const offset = (page - 1) * perPage;

  // Initialize variables with limit and offset
  const variables: { [key: string]: string | number } = {
    limit: perPage,
    offset: offset,
  };

  // Determine if governorateId is provided and prepare the corresponding variable and filter
  const governorateVariable = governorateId ? ", $governorateId: Int!" : "";
  const filter = governorateId ? "where: {governorate_id: {_eq: $governorateId}}" : "";

  // Add governorateId to variables if it's provided
  if (governorateId) {
    variables["governorateId"] = governorateId;
  }

  try {
    const operation = `
      query MyQuery($limit: Int!, $offset: Int!${governorateVariable}) {
        cities(limit: $limit, offset: $offset${filter ? "," + filter : ""}) {
          name: name_${lang}
          id
          governorate_id
        }
        cities_aggregate${filter ? "(" + filter + ")" : ""} {
          aggregate {
            count
          }
        }
      }
    `;
    const result = await client.post("", { query: operation, variables });
    return {
      data: result.data.data?.cities || [],
      totalCount: result.data.data.cities_aggregate.aggregate.count || 0,
    };
  } catch (error) {
    console.error(error);
    return {
      data: [],
      totalCount: 0,
    };
  }
};

export const getAreas = async (
  page: number,
  perPage: number,
  lang: Language,
  governorateId: number | null = null,
  cityId: number | null = null,
): Promise<{ data: any[]; totalCount: number }> => {
  const offset = (page - 1) * perPage;

  // Initialize variables with limit and offset
  const variables: { [key: string]: string | number } = {
    limit: perPage,
    offset: offset,
  };

  // Initialize filters and query variables
  const filters: string[] = [];
  const queryVariables: string[] = [];

  if (governorateId) {
    variables["governorateId"] = governorateId;
    filters.push(`{governorate_id: { _eq: $governorateId } }`);
    queryVariables.push("$governorateId: Int!");
  }

  if (cityId) {
    variables["cityId"] = cityId;
    filters.push(`{ city_id: { _eq: $cityId } }`);
    queryVariables.push("$cityId: Int!");
  }

  // Build the filter and variable strings
  const filter = filters.length > 0 ? `where: {_and: [${filters.join(", ")}]}` : "";
  const variableString = queryVariables.length > 0 ? `, ${queryVariables.join(", ")}` : "";

  try {
    const operation = `
      query MyQuery($limit: Int!, $offset: Int!${variableString}) {
        areas(limit: $limit, offset: $offset${filter ? "," + filter : ""}) {
          name: name_${lang}
          id
          city_id
          governorate_id
        }
        areas_aggregate${filter ? "(" + filter + ")" : ""} {
          aggregate {
            count
          }
        }
      }
    `;

    const result = await client.post("", { query: operation, variables });
    return {
      data: result.data.data.areas,
      totalCount: result.data.data.areas_aggregate.aggregate.count,
    };
  } catch (error) {
    console.error(error);
    return {
      data: [],
      totalCount: 0,
    };
  }
};
export const getGovernorates = async (
  page: number,
  perPage: number,
  lang: Language,
): Promise<{ data: any[]; totalCount: number }> => {
  const offset = (page - 1) * perPage;
  const variables = {
    limit: perPage,
    offset: offset,
  };
  try {
    const operation = `
      query MyQuery ($limit: Int!, $offset: Int!) {
        governorates(limit: $limit, offset: $offset) {
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
    const result = await client.post("", { query: operation, variables: variables });
    /*
         TODO: Remove this once we roll out to new governorates
         or when we create a new endpoint that is for all active governorates
         and use this one as a generic service
         */
    const whiteListedIds = await getAvailablePartnerGovernorateIds();
    const filteredGovernorates = result.data.data.governorates.filter((gov: { id: number }) =>
      whiteListedIds.includes(gov.id),
    );

    const returnResult = {
      data: filteredGovernorates,
      totalCount: result.data.data.governorates_aggregate.aggregate.count,
    };
    return returnResult;
  } catch (error) {
    console.error(error);
    return {
      data: [],
      totalCount: 0,
    };
  }
};

export async function getAvailablePartnerGovernorateIds(): Promise<number[]> {
  try {
    const operation = `
      query MyQuery {
          partner_branch(distinct_on: governorate_id) {
              governorate_id
          }
      }`;

    const result = await client.post("", { query: operation });
    logger.debug("response data: " + JSON.stringify(result.data));

    // Filter out governorate with id = 1 (Cairo) until we officially launch in Cairo
    // Remove this once we have all governorates in the system
    return (
      result.data?.data?.partner_branch
        .map((branch: { governorate_id: number }) => branch.governorate_id)
        .filter((id: number) => id !== 1) || []
    );
  } catch (error) {
    logger.error(error);
    return [];
  }
}

export const getConsumerCreditLimit = async (consumerId: string): Promise<GetConsumerCreditLimitsResponse> => {
  const variables = {
    consumerId: consumerId,
  };
  try {
    const operation = `
      query MyQuery($consumerId: uuid!) {
          consumer_credit_limits(where: { consumer_id: { _eq: $consumerId } }, order_by: { active_since: desc }, limit: 1) {
            available_credit_limit
            max_credit_limit
            id
            consumer_id
            active_since
            created_at
          }
        }
      `;

    const result = await client.post("", { query: operation, variables: variables });
    logger.debug("response data: " + JSON.stringify(result.data));
    return {
      available_limit: result.data.data.consumer_credit_limits[0].available_credit_limit,
      monthly_limit: 0,
    };
  } catch (error) {
    console.error(error);
    throw new NotFoundError(`consumer credit doesn't exist for "${consumerId.toString()}`);
  }
};

export const getUserBranches = async (
  page: number,
  perPage: number,
  lang: Language,
  iamId: string,
): Promise<{ data: any[]; totalCount: number }> => {
  const offset = (page - 1) * perPage;
  const variables = {
    limit: perPage,
    offset: offset,
    iamId: iamId,
  };

  try {
    const query = `
    query getUserBranches($limit: Int!, $offset: Int!, $iamId: uuid! ) {
      partner_branch(limit: $limit, offset: $offset, order_by: {created_at: desc},where: {partner_user_profiles: {iam_id: {_eq: $iamId}}}) {
       name
          id
          area
          created_at
          google_maps_link
          area_lookup: area_record {
            id
            name: name_${lang}
          }
          governorate: governorate_record {
            name: name_${lang}
            id
          }
          city: city_record {
            id
            name: name_${lang}
          }
            
          location_latitude
          location_longitude
          partner_id
          street
      } 
      partner_branch_aggregate(where: {partner_user_profiles: {iam_id: {_eq: $iamId}}}) {
          aggregate {
            count
          }
        }
      }
  `;
    const result = await executeQuery(query, variables);
    return {
      data: result.partner_branch,
      totalCount: result.partner_branch_aggregate.aggregate.count,
    };
  } catch (error) {
    console.error(error);
    return {
      data: [],
      totalCount: 0,
    };
  }
};

export const getPartnerBranches = async (
  page: number,
  perPage: number,
  lang: Language,
  partnerId: string,
): Promise<{ data: any[]; totalCount: number }> => {
  const offset = (page - 1) * perPage;
  const variables = {
    limit: perPage,
    offset: offset,
    partnerId: partnerId,
  };
  try {
    const operation = `
      query MyQuery ($limit: Int!, $offset: Int!, $partnerId: uuid!) {
        partner_branch(limit: $limit, offset: $offset, order_by: {created_at: desc}, where: {partner_id: {_eq: $partnerId}}) {
          name
          id
          area
          created_at
          google_maps_link
          area_lookup: area_record {
            id
            name: name_${lang}
          }
          governorate: governorate_record {
            name: name_${lang}
            id
          }
          city: city_record {
            id
            name: name_${lang}
          }
            
          location_latitude
          location_longitude
          partner_id
          street
        }
        partner_branch_aggregate(where: {partner_id: {_eq: $partnerId}}) {
          aggregate {
            count
          }
        }
      }
      `;
    const result = await client.post("", { query: operation, variables: variables });
    const returnResult = {
      data: result.data.data.partner_branch,
      totalCount: result.data.data.partner_branch_aggregate.aggregate.count,
    };
    return returnResult;
  } catch (error) {
    console.error("couldn't get branches : ", error);
    return {
      data: [],
      totalCount: 0,
    };
  }
};

export const getPartnerCashiers = async (
  page: number,
  perPage: number,
  partnerId: string,
): Promise<{ data: any[]; totalCount: number }> => {
  const offset = (page - 1) * perPage;
  const variables = {
    limit: perPage,
    offset: offset,
    partnerId: partnerId,
  };
  try {
    const operation = `
      query MyQuery ($limit: Int!, $offset: Int!, $partnerId: uuid!){
        partner_user_profile(order_by: {updated_at: desc}, where: {profile_type: {_eq: "CASHIER"}, partner_id: {_eq: $partnerId}}, limit: $limit, offset: $offset) {
          id
          iam_id
          partner_id
          branch_id
          first_name
          last_name
          email
          phone_number
          profile_type
          created_at
          updated_at
          identity {
            state
          }
          partner_branch {
            name
          }
        }
        partner_user_profile_aggregate(where: {profile_type: {_eq: "CASHIER"}, partner_id: {_eq: $partnerId}}) {
          aggregate {
            count
          }
        }
      }
      `;
    const result = await client.post("", { query: operation, variables: variables });
    const returnResult = {
      data: result.data.data.partner_user_profile,
      totalCount: result.data.data.partner_user_profile_aggregate.aggregate.count,
    };
    return returnResult;
  } catch (error) {
    console.error(error);
    return {
      data: [],
      totalCount: 0,
    };
  }
};

export const getPartnerEmployees = async (
  page: number,
  perPage: number,
  partnerId: string,
): Promise<{ data: any[]; totalCount: number }> => {
  const offset = (page - 1) * perPage;
  const variables = {
    limit: perPage,
    offset: offset,
    partnerId: partnerId,
  };
  try {
    const operation = `
    query MyQuery ($limit: Int!, $offset: Int!, $partnerId: uuid!) {
      partner_user_profile(
        order_by: {updated_at: desc}, 
        where: {profile_type: {_in: ["BRANCH_MANAGER", "CASHIER"]}, partner_id: {_eq: $partnerId}}, 
        limit: $limit, 
        offset: $offset
      ) {
        id
        iam_id
        partner_id
        branch_id
        first_name
        last_name
        email
        phone_number
        profile_type
        created_at
        updated_at
        identity {
          state
        }
        partner_branch {
          name
        }
      }
      partner_user_profile_aggregate(
        where: {profile_type: {_in: ["BRANCH_MANAGER", "CASHIER"]}, partner_id: {_eq: $partnerId}}
      ) {
        aggregate {
          count
        }
      }
    }
  `;

    const result = await client.post("", { query: operation, variables: variables });

    const returnResult = {
      data: result.data.data.partner_user_profile,
      totalCount: result.data.data.partner_user_profile_aggregate.aggregate.count,
    };

    return returnResult;
  } catch (error) {
    console.error("couldn't get employees ", error);
    return {
      data: [],
      totalCount: 0,
    };
  }
};

export const getBranchesCashiers = async (
  page: number,
  perPage: number,
  branchesIds: string[],
): Promise<{ data: any[]; totalCount: number }> => {
  const offset = (page - 1) * perPage;
  const variables = {
    limit: perPage,
    offset: offset,
    branchesIds: branchesIds,
  };
  try {
    const operation = `
    query getBranchesCashiers ($limit: Int!, $offset: Int!, $branchesIds: [uuid!]!) {
      partner_user_profile(
          order_by: { updated_at: desc }, 
          where: {
            profile_type: { _in: ["CASHIER"] }, 
            branch_id: { 
              _in: $branchesIds
            }
          }, 
          limit: $limit, 
          offset:$offset
        ) {
          id
          iam_id
          partner_id
          branch_id
          first_name
          last_name
          email
          phone_number
          profile_type
          created_at
          updated_at
          identity {
            state
          }
          partner_branch {
            name
          }
        }

        partner_user_profile_aggregate(
          where: {
            profile_type: { _in: ["BRANCH_MANAGER", "CASHIER"] }, 
            branch_id: { 
              _in: $branchesIds
            }
          }
        ) {
          aggregate {
            count
          }
        }
    }
  `;

    const result = await client.post("", { query: operation, variables: variables });

    const returnResult = {
      data: result.data.data.partner_user_profile,
      totalCount: result.data.data.partner_user_profile_aggregate.aggregate.count,
    };

    return returnResult;
  } catch (error) {
    console.error(error);
    return {
      data: [],
      totalCount: 0,
    };
  }
};

export const executeQuery = async (operation: string, variables: any = {}): Promise<any> => {
  try {
    const result = await client.post("", { query: operation, variables: variables });
    return result.data.data;
  } catch (error) {
    console.error(error);
    return {};
  }
};

export const updatePartnerCategories = (partners: any[], language: string) => {
  const categories = language === "ar" ? arCategory : enCategory;
  const ICON_FOLDER_PATH = "/public/partner/category/";

  partners.forEach((partner) => {
    partner.categories = partner.categories.map((key: string) => ({
      name: categories[key] || key,
      slug: key,
      icon: ICON_FOLDER_PATH + categoriesIcons[key],
    }));
  });

  return partners;
};

export const getBasketTransactionId = async (id: UUID): Promise<string | null> => {
  const variables = {
    id: id,
  };
  try {
    const operation = `
      query GetTransactionId($id: uuid!) {
        checkout_baskets(where: {session_basket_id: {_eq: $id}}, limit: 1) {
          transaction_id
        }
      }
    `;

    const result = await client.post("", { query: operation, variables: variables });
    logger.debug("response data: " + JSON.stringify(result.data));

    if (result.data.data.checkout_baskets.length === 0) {
      return null;
    }
    return result.data.data.checkout_baskets[0].transaction_id.toString();
  } catch (error) {
    console.error(error);
    throw new NotFoundError(`Transaction ID doesn't exist for session basket ID "${id}"`);
  }
};
