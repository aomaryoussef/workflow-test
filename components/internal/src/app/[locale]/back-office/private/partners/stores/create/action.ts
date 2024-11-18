"use server"

import axios from "axios"
import { settings } from "../../../../../../../../config/settings";
import { IBranch } from '@/app/[locale]/back-office/graphql/types.ts';

const client = axios.create({
    baseURL: `${settings.hasura.baseUrl}`,
    timeout: 40_000,
    headers: { "Content-Type": "application/json" },
  });

export const getGovernorates = async (
    page: number,
    perPage: number,
    lang: string,
  ): Promise<{ data: {id: string; name: string}[]; totalCount: number }> => {
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
      const filteredGovernorates = result.data.data.governorates
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

  export const getCities = async (
    page: number,
    perPage: number,
    lang: string,
    governorateId: string | null = null,
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
    lang: string,
    governorateId: string | null = null,
    cityId: string | null = null,
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


  const API_URL = process.env.OL_BFF_PARTNER_SERVICE_BASE_URL;

  export async function createPartnerBranch(partnerId: string, branch: IBranch) {
    try {
      const body = JSON.stringify({
        name: branch.name,
        governorate_id: branch.governorate,
        city_id: branch.city,
        area_id: branch.area,
        street: branch.street,
        location: {
          latitude: branch.location.latitude,
          longitude: branch.location.longitude,
        },
        google_maps_link: branch.google_maps_link,
      });
      const response = await fetch(`${API_URL}/${partnerId}/branches`, {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
  
      return {
        data,
        error: null,
        code: data.code ? data.code : null,
        message: data.message ? data.message : null,
      };
    } catch (err) {
      console.error(err);
      let errorMessage = 'Failed to create a partner store';
      if (err instanceof Error) errorMessage = err.message;
  
      return { error: errorMessage, data: null, code: null, message: null };
    }
  }
  
