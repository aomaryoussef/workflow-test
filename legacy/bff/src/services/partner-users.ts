// partnerService.ts
import Axios from "axios";
import https from "https";
import { config } from "../../config";

const axios = Axios.create({
  baseURL: config.partnerUsersBaseURL,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

export async function getUserProfileByIamId(iamId: string): Promise<any> {
  try {
    const response = await axios.get("", {
      params: {
        iam_id: iamId,
      },
    });
    let userProfile = null;
    if (response.data.total_count > 0) {
      userProfile = response.data.data[0];
    }
    return userProfile;
  } catch (error) {
    console.error(error);
    throw new Error(error.response?.data?.message || "get user profile by IAM failed");
  }
}

const partnerUsersService = {
  getUserProfileByIamId,
};

export default partnerUsersService;
