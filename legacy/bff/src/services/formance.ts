import { SDK, SDKOptions } from "@formance/formance-sdk";
import {
  AccountType,
  Payment,
  PaymentScheme,
  PaymentStatus,
  PaymentType,
} from "@formance/formance-sdk/sdk/models/shared";
import { config } from "../../config";
import { CustomLogger } from "../services/logger";
import { CreatePaymentResponse } from "@formance/formance-sdk/sdk/models/operations";

const logger = new CustomLogger("formance", "service");

const formanceBaseURL = config.formanceBaseURL;
const formanceRequireLogin = config.formanceRequireLogin;
const formanceClientId = config.formanceClientId;
const formanceClientSecret = config.formanceClientSecret;
const formanceConnectorId = config.formanceConnectorId;

let formanceSDKOptions: SDKOptions;
if (formanceRequireLogin) {
  formanceSDKOptions = {
    serverURL: formanceBaseURL,
    security: {
      clientID: formanceClientId,
      clientSecret: formanceClientSecret,
    },
    timeoutMs: 60000,
  };
} else {
  formanceSDKOptions = {
    serverURL: formanceBaseURL,
    timeoutMs: 60000,
  };
}
const formanceSDK: SDK = new SDK(formanceSDKOptions);

export const findPayment = async (referenceId: string): Promise<Payment> => {
  try {
    const paymentResponse = await formanceSDK.payments.v1.listPayments({
      query: JSON.stringify({
        $match: {
          reference: referenceId,
        },
      }),
    });
    if (paymentResponse.statusCode == 200 && paymentResponse.paymentsCursor.cursor.data.length > 0) {
      return paymentResponse.paymentsCursor.cursor.data[0];
    } else {
      return null;
    }
  } catch (error) {
    logger.error({
      context: "Error finding Formance payment",
      ...error,
    });
    return null;
  }
};

export const updatePaymentMetadata = async (paymentId: string, metadata: Record<string, string>): Promise<void> => {
  try {
    await formanceSDK.payments.v1.updateMetadata({
      requestBody: metadata,
      paymentId,
    });
  } catch (error) {
    logger.error({
      context: "Error updating Formance payment metadata",
      ...error,
    });
  }
};

export const createPayment = async (paymentData: {
  amount: number;
  createdAt: Date;
  reference: string;
  sourceAccountID: string;
  destinationAccountID: string;
}): Promise<string> => {
  try {
    const paymentPayload = {
      amount: BigInt(paymentData.amount),
      asset: "EGP/2",
      connectorID: formanceConnectorId,
      createdAt: paymentData.createdAt,
      reference: paymentData.reference,
      sourceAccountID: paymentData.sourceAccountID,
      destinationAccountID: paymentData.destinationAccountID,
      scheme: PaymentScheme.Other,
      status: PaymentStatus.Succeeded,
      type: PaymentType.PayIn,
    };
    const createPaymentResponse: CreatePaymentResponse = await formanceSDK.payments.v1.createPayment(paymentPayload);
    if (createPaymentResponse.statusCode == 200) {
      return createPaymentResponse.paymentResponse.data.id;
    }
    throw new Error("Error creating Formance payment");
  } catch (error) {
    logger.error({
      context: "Error creating Formance payment",
      ...error,
    });
    return null;
  }
};

export const createAccount = async (consumerId: string): Promise<string> => {
  try {
    const response = await formanceSDK.payments.v1.createAccount({
      accountName: `Internal consumer account for consumer ID ${consumerId}`,
      connectorID: formanceConnectorId,
      createdAt: new Date(),
      defaultAsset: "EGP/2",
      reference: consumerId,
      type: AccountType.Internal,
    });
    if (response.statusCode == 200) {
      return response.paymentsAccountResponse.data.id;
    } else {
      throw Error("Error creating Formance account");
    }
  } catch (error) {
    logger.error({
      context: "Error creating Formance account",
      ...error,
    });
    return null;
  }
};

export const isServiceAvailable = async (): Promise<boolean> => {
  try {
    const response = await formanceSDK.payments.v1.listPayments({});
    return response.statusCode == 200;
  } catch (error) {
    logger.error({
      context: "Error checking Formance health",
      ...error,
    });
    return false;
  }
};
