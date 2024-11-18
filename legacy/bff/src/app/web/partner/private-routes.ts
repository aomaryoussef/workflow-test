import express from "express";
import {
  logout,
  getTransactions,
  getSuppoort,
  getTransactionDetails,
  defaultUrl,
  resetPasswordCashier,
  disbursePayment,
  initReturn,
  branches,
  employees,
} from "./controllers/partner-controller";
import { registerErrorHandler } from "./middlewares/errors/registerErrorHandler";
import { addCashierValidation, checkoutAddProductValidation } from "./middlewares/validations/cashierValidation";
import { dashboard } from "./controllers/partner-controller";
import { cashierAdd, updateCashierState } from "./controllers/cashier-controller";
import {
  initCheckout,
  checkoutSearchConsumer,
  checkoutAddProduct,
  checkoutGetCommercialOffers,
  checkoutSendOTP,
  checkoutResendOtp,
  checkoutVerifyOtp,
  feesCollection,
  cancelCheckout,
  checkoutGetStatus,
  checkoutResendOtpViaPhoneCall,
} from "./controllers/checkout-controller";
import { getCashierIdentity } from "../middlewares/get-cashier-id";
import { partnerUser, techSupport } from "../middlewares/authorization";
import { setLanguageAndPagination } from "../middlewares/set-language-and-pagination ";
import { addEmployee, updateEmployeeState } from "./controllers/employee-controller";
import { addEmployeeValidation } from "./middlewares/validations/employeeValidation";

export const privatePartnerRouter = express.Router();

privatePartnerRouter.get("/logout", logout);

privatePartnerRouter.get("/set-password", resetPasswordCashier);

privatePartnerRouter.get("/transactions", techSupport(), partnerUser("admins", "branchesManagers"), getTransactions);
privatePartnerRouter.get(
  "/transactions/:transaction_id",
  techSupport(),
  partnerUser("admins", "branchesManagers"),
  getTransactionDetails,
);
privatePartnerRouter.get(
  "/employees",
  techSupport(),
  partnerUser("admins", "branchesManagers"),
  setLanguageAndPagination,
  employees,
);
privatePartnerRouter.post(
  "/employee/add",
  partnerUser("admins", "branchesManagers"),
  addEmployeeValidation,
  setLanguageAndPagination,
  addEmployee,
  registerErrorHandler,
);
privatePartnerRouter.patch(
  "/updateEmployeeState",
  partnerUser("admins", "branchesManagers"),
  setLanguageAndPagination,
  updateEmployeeState,
);

privatePartnerRouter.get("/dashboard", techSupport(), partnerUser("admins"), setLanguageAndPagination, dashboard);
privatePartnerRouter.post(
  "/cashier/add",
  partnerUser("admins"),
  addCashierValidation,
  setLanguageAndPagination,
  cashierAdd,
  registerErrorHandler,
);
privatePartnerRouter.patch("/updateCashierState", partnerUser("admins"), setLanguageAndPagination, updateCashierState);
privatePartnerRouter.get(
  "/branches",
  techSupport(),
  partnerUser("admins", "branchesManagers"),
  setLanguageAndPagination,
  branches,
);
privatePartnerRouter.get("/support", techSupport(), partnerUser("admins"), getSuppoort);
privatePartnerRouter.get("/default-url", defaultUrl);

privatePartnerRouter.get("/checkout", techSupport(), partnerUser("cashiers"), getCashierIdentity, initCheckout);
privatePartnerRouter.post(
  "/checkout/search-consumer",
  techSupport(),
  partnerUser("cashiers"),
  getCashierIdentity,
  checkoutSearchConsumer,
);
privatePartnerRouter.post(
  "/checkout/add-product",
  techSupport(),
  partnerUser("cashiers"),
  checkoutAddProductValidation,
  getCashierIdentity,
  checkoutAddProduct,
);
privatePartnerRouter.get(
  "/checkout/get-commercial-offers",
  techSupport(),
  partnerUser("cashiers"),
  checkoutGetCommercialOffers,
);
privatePartnerRouter.post(
  "/checkout/send-otp",
  techSupport(),
  partnerUser("cashiers"),
  getCashierIdentity,
  checkoutSendOTP,
);
privatePartnerRouter.post(
  "/checkout/resend-otp",
  techSupport(),
  partnerUser("cashiers"),
  getCashierIdentity,
  checkoutResendOtp,
);
privatePartnerRouter.post(
  "/checkout/resend-otp/callme",
  techSupport(),
  partnerUser("cashiers"),
  getCashierIdentity,
  checkoutResendOtpViaPhoneCall,
);
privatePartnerRouter.post(
  "/checkout/verify-otp",
  techSupport(),
  partnerUser("cashiers"),
  getCashierIdentity,
  checkoutVerifyOtp,
);
privatePartnerRouter.post("/checkout/collect-fees", partnerUser("cashiers"), getCashierIdentity, feesCollection);
privatePartnerRouter.get(
  "/checkout/cancel-checkout",
  techSupport(),
  partnerUser("cashiers"),
  getCashierIdentity,
  cancelCheckout,
);
privatePartnerRouter.get(
  "/checkout/get-checkout-status",
  techSupport(),
  partnerUser("cashiers"),
  getCashierIdentity,
  checkoutGetStatus,
);

privatePartnerRouter.post("/disburse", disbursePayment);
privatePartnerRouter.post("/return", partnerUser("admins", "branchesManagers"), initReturn);
