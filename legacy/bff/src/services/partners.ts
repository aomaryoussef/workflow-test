// partnerService.ts
import Axios from "axios";
import https from "https";
import { config } from "../../config";

const axios = Axios.create({
  baseURL: config.partnerBaseURL,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

async function registerPartner(data: any): Promise<any> {
  try {
    const response = await axios.post(``, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { status: "success", data: response.data };
  } catch (error) {
    console.error(error);
    const messageCode = error.response?.data?.code;
    if (messageCode === "103") {
      return { status: "failure", message: error.response.data.message };
    }
    throw new Error(error.response?.data?.message || "Registration failed");
  }
}

export async function getPartners(): Promise<any> {
  try {
    const response = await axios.get(``);
    return response.data || [];
  } catch (error) {
    throw new Error(error.response?.data?.message || "get partners failed");
  }
}

export async function disbursePaymentTransaction(data: any): Promise<any> {
  try {
    const response = await axios.post(`/disbursement`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error.response?.data?.message || "Disbursement failed");
  }
}

export async function getTopPartners(): Promise<any> {
  try {
    const response = await axios.get(`/top`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "top partner failed");
  }
}
async function registerEmployee(partnerId: any, data: any): Promise<any> {
  let route = (data.employee_role === "BRANCH_MANAGER" ? `/${partnerId}/branch-managers` : `/${partnerId}/cashiers`);
  console.debug(" branch_id :",data.branch_id);

  const response = await axios.post(
     route,
    {
      branch_id: data.branch_id,
      first_name: data.first_name,
      last_name: data.last_name,
      ...(data.email && { email: data.email }),
      ...(data.phone_number && { phone_number: data.phone_number }),
      ...(data.national_id && { national_id: data.national_id }),
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return response.data;
}

async function registerCashier(partnerId: any, data: any): Promise<any> {
  const response = await axios.post(
    `/${partnerId}/cashiers`,
    {
      branch_id: data.branch_id,
      first_name: data.first_name,
      last_name: data.last_name,
      phone_number: data.phone_number,
      ...(data.email && { email: data.email }),
      ...(data.national_id && { national_id: data.national_id }),
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return response.data;
}

async function getPartner(partnerId: string): Promise<any> {
  try {
    const response = await axios.get(`/${partnerId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error.response?.data?.message);
  }
}

async function resetPassword(identifier: string): Promise<any> {
  try {
    const response = await axios.post(`/reset-password`, { identifier });
    return response;
  } catch (error) {
    console.error(error);
    throw new Error(error.response?.data?.message || "Reset password failed");
  }
}

async function getPartnerCashiers(partnerId: string, page: any, per_page: any): Promise<any> {
  try {
    const response = await axios.get(`/${partnerId}/cashiers?page=${page}&per_page=${per_page}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error.response?.data?.message);
  }
}

async function updateEmployeeState(partner_id: any, employee_id: any, state: any): Promise<any> {
  try {
    const response = await axios.patch(`/${partner_id}/user-profiles/${employee_id}`, { state });
    return response;
  } catch (error) {
    console.error(error);
    throw new Error(error.response?.data?.message);
  }
}
async function updateCashierState(partner_id: any, cashier_id: any, state: any): Promise<any> {
  try {
    const response = await axios.patch(`/${partner_id}/user-profiles/${cashier_id}`, { state });
    return response;
  } catch (error) {
    console.error(error);
    throw new Error(error.response?.data?.message);
  }
}
async function getPartnerTransactions(partner_id: any, page: any, per_page: any) {
  try {
    const response = await axios.get(`/${partner_id}/transactions`, {
      params: {
        page,
        per_page,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
async function getTransactionDetails(partner_id: string, basket_id: string) {
  try {
    const response = await axios.get(`${partner_id}/transactions/${basket_id}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
async function getCashierProfile(iamId: string): Promise<any> {
  try {
    const response = await axios.get(`/cashier`, {
      params: {
        iam_id: iamId,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Get Cashier failed");
  }
}
async function addStoreForPartner(data: any, id: any): Promise<any> {
  try {
    const response = await axios.post(`/${id}/branches`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { status: "success", data: response.data };
  } catch (error) {
    console.error(error);
    const messageCode = error.response?.data?.code;
    if (messageCode === "103") {
      return { status: "failure", message: error.response.data.message };
    }
    throw new Error(error.response?.data?.message || "Registration failed");
  }
}
const partnerService = {
  registerPartner,
  getPartners,
  getPartner,
  registerCashier,
  registerEmployee,
  resetPassword,
  getPartnerCashiers,
  updateCashierState,
  updateEmployeeState,
  getPartnerTransactions,
  getCashierProfile,
  getTransactionDetails,
  disbursePaymentTransaction,
  addStoreForPartner,
};

export default partnerService;
