import { Request, Response, NextFunction } from "express";
import { config } from "../../../../../config";
import partnerService from "../../../../services/partners";
import partnerUsersService from "../../../../services/partner-users";
import { baseResponse } from "../../base-response";
import { PartnerUseCase } from "../../../../domain/partner/use-cases/partner-use-case";
import { CustomLogger } from "../../../../services/logger";
import { isPartnerUser } from "../../../../services/keto";
import { getDateString, getTimeString } from "../../../../utils/date-utils";
import { formatNumber } from "../../../../utils/number-utils";
import { startWorkflow } from "../../../../services/workflow";
import { StartWorkflowRequest } from "@io-orkes/conductor-javascript";
import { getLoans, getPartnerLoans } from "../../../../services/lms";
import {
  getPartnerBranches,
  getPartnerEmployees,
  getPartnerCashiers,
  getPartners,
  getPartnerTransactions,
  getTopPartnersList,
  getUserBranches,
  getBranchesCashiers,
  getBranchTransactions,
} from "../../../../services/hasura";

const logger = new CustomLogger("partner-controller");

export const navList = [
  {
    title: "المبيعات",
    url: "/private/partner/transactions",
    icon: "icon-sales-icon",
  },
  {
    title: "الموظفين",
    url: "/private/partner/employees",
    icon: "icon-cashier-icon",
  },
  {
    title: "الكاشير",
    url: "/private/partner/dashboard",
    icon: "icon-cashier-icon",
    extra_class: "d-none",
  },
  {
    title: "الفروع",
    url: "/private/partner/branches",
    icon: "icon-manage_accounts",
  },
  {
    title: "الدعم",
    url: "/private/partner/support",
    icon: "icon-support-icon",
  },
];
export const branchMangerNavList = [
  {
    title: "المبيعات",
    url: "/private/partner/transactions",
    icon: "icon-sales-icon",
  },
  {
    title: "الموظفين",
    url: "/private/partner/employees",
    icon: "icon-cashier-icon",
  },
  {
    title: "الفروع",
    url: "/private/partner/branches",
    icon: "icon-manage_accounts",
  },
];
export const employeeRoles = [
  {
    name: "كاشير",
    value: "CASHIER",
  },
  {
    name: "رئيس فرع",
    value: "BRANCH_MANAGER",
  },
];

export const login = async (req: Request, res: Response) => {
  try {
    res.render("./screens/login", {
      title: "تسجيل الدخول",
      iamBaseURL: config.iamBaseURL,
      returnTo: `${config.baseURL}/private/partner/default-url`,
      forgetPasswordUrl: "/public/partner/forget-password",
      errors: [],
      layout: "layout/empty-screens",
      allowPhone: true,
    });
  } catch (error) {
    console.error(error);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.render("./screens/logout", {
      title: "تسجيل الخروج",
      logoutUrl: "/private/partner/logout",
      loginUrl: `${config.baseURL}/public/partner/login`,
      iamBaseURL: config.iamBaseURL,
      layout: "layout/empty-screens",
    });
  } catch (error) {
    console.error(error);
  }
};

export const setFirstPassword = async (req: Request, res: Response) => {
  // TODO: get the partner name using the partner id form the query params
  const partner = await partnerService.getPartner(req.query.partner_id.toString());
  res.render("./screens/set-first-password", {
    title: "تفعيل الحساب",
    recoveryFlowUrl: `${config.iamBaseURL}/self-service/recovery?flow=${req.query.recovery_flow_id}`,
    createSettingsFlowUrl: `${config.iamBaseURL}/self-service/settings/browser`,
    redirectUrl: "/public/partner/reset-password-success",
    recoveryCode: req.query.recovery_code,
    partnerName: partner.name,
    errors: [],
    layout: "layout/empty-screens",
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  res.render("./screens/reset-password", {
    title: "استعادة كلمة المرور",
    recoveryFlowUrl: `${config.iamBaseURL}/self-service/recovery?flow=${req.query.recovery_flow_id}`,
    createSettingsFlowUrl: `${config.iamBaseURL}/self-service/settings/browser`,
    redirectUrl: "/public/partner/reset-password-success",
    recoveryCode: req.query.recovery_code,
    errors: [],
    layout: "layout/empty-screens",
  });
};

export const resetPasswordSuccess = async (req: Request, res: Response) => {
  res.render("./screens/reset-password-success", {
    title: "استعادة كلمة المرور",
    errors: [],
    loginUrl: "/public/partner/login",
    layout: "layout/empty-screens",
  });
};

export const forgetPassword = async (req: Request, res: Response) => {
  res.render("./screens/forget-password", {
    title: "استعادة كلمة المرور",
    layout: "layout/empty-screens",
  });
};

export const postForgetPassword = async (req: Request, res: Response) => {
  try {
    const response = await partnerService.resetPassword(req.body.identifier);
    if (response.data.recovery_flow_id) {
      res.render("./screens/verify-otp", {
        title: "تأكيد رمز التحقق",
        recoveryFlowUrl: `${config.iamBaseURL}/self-service/recovery?flow=${response.data.recovery_flow_id}`,
        createSettingsFlowUrl: `${config.iamBaseURL}/self-service/settings/browser?return_to=${config.baseURL}/public/partner/resetPasswordSuccess`,
        layout: "layout/empty-screens",
      });
    } else {
      res.render("./screens/forget-password", {
        title: "استعادة كلمة المرور",
        successMessage: true,
        message: "تم إرسال رابط إعادة الضبط إلى بريدك الإلكتروني",
        layout: "layout/empty-screens",
      });
    }
  } catch (error) {
    res.render("./screens/forget-password", {
      title: "استعادة كلمة المرور",
      errorMessage: true,
      message: "حدث خطأ",
      layout: "layout/empty-screens",
    });
  }
};

export const resetPasswordCashier = async (req: Request, res: Response) => {
  res.render("./screens/reset-password-cashier", {
    title: "كلمة المرور الجديدة",
    createSettingsFlowUrl: `${config.iamBaseURL}/self-service/settings/browser`,
    redirectUrl: "/public/partner/reset-password-success",
    layout: "layout/empty-screens",
  });
};

export const dashboard = async (req: Request, res: Response) => {
  const userIamId = req.headers["x-user-iam-id"].toString();
  const userProfile = await partnerUsersService.getUserProfileByIamId(userIamId);
  const page = req.page;
  const perPage = req.perPage;
  const lang = req.lang;
  const branches = (await getPartnerBranches(1, 1000, lang, userProfile.partner_id)).data;

  const response = await getPartnerCashiers(page, perPage, userProfile.partner_id);
  let cashiers = response.data;
  cashiers = cashiers.map((item: any) => {
    const createdAt = new Date(item.created_at);
    const createdAtDate = getDateString(createdAt);
    const createdAtTime = getTimeString(createdAt);
    item.created_at = createdAtDate;
    item["current_time"] = createdAtTime;
    item["phone_number"] = item["phone_number"].slice(2);
    item["enabled"] = item["identity"]["state"] === "active";
    item["branch_name"] = item["partner_branch"]["name"];
    return item;
  });

  res.render("./screens/dashboard", {
    title: "dashboard",
    updateStateUrl: `${config.baseURL}/private/partner/updateCashierState`,
    getCashiersUrl: `${config.baseURL}/private/partner/dashboard`,
    cashiers: cashiers,
    totalCount: response.totalCount,
    pageSelected: page,
    perPage: perPage,
    errors: [],
    showPopup: false,
    logoutUrl: "/private/partner/logout",
    url: "/private/partner/dashboard",
    userInfo: {
      userInitials: `${userProfile.first_name[0]}.${userProfile.last_name[0]}`,
      userTag: `${userProfile.first_name} ${userProfile.last_name}`,
      userSubTag: userProfile.email,
    },
    navList: navList,
    layout: "layout/internal-screens",
    addCashierFormValues: {},
    branches: branches,
  });
};

export const employees = async (req: Request, res: Response) => {
  const userIamId = req.headers["x-user-iam-id"].toString();
  const userProfile = await partnerUsersService.getUserProfileByIamId(userIamId);
  const page = req.page;
  const perPage = req.perPage;
  const lang = req.lang;
  const isPartnerBranchManger = await isPartnerUser(userProfile.partner_id, userIamId, "branchesManagers");
  let getPartnerEmployeesResponse: any = {};
  let branches: any = {};
  if (isPartnerBranchManger) {
    branches = (await getUserBranches(1, 1000, lang, userProfile.iam_id)).data;
    console.debug("before branchIds");
    const branchIds = branches.map((branch: any) => branch.id);
    console.debug("branchIds", branchIds);
    getPartnerEmployeesResponse = await getBranchesCashiers(page, perPage, branchIds);
  } else {
    branches = (await getPartnerBranches(1, 1000, lang, userProfile.partner_id)).data;
    getPartnerEmployeesResponse = await getPartnerEmployees(page, perPage, userProfile.partner_id);
  }
  let employees = getPartnerEmployeesResponse.data;
  employees = employees.map((item: any) => {
    const createdAt = new Date(item.created_at);
    const createdAtDate = getDateString(createdAt);
    const createdAtTime = getTimeString(createdAt);
    item.created_at = createdAtDate;
    item["current_time"] = createdAtTime;
    item["phone_number"] = item["phone_number"].slice(2);
    item["enabled"] = item["identity"]["state"] === "active";
    item["branch_name"] = item["partner_branch"]["name"];
    item["profile_type"] =
      item["profile_type"] === "BRANCH_MANAGER"
        ? "رئيس فرع"
        : item["profile_type"] === "CASHIER"
          ? "كاشير"
          : "غير معروف";
    return item;
  });

  res.render("./screens/employees", {
    title: "employees",
    updateStateUrl: `${config.baseURL}/private/partner/updateEmployeeState`,
    getEmployeesUrl: `${config.baseURL}/private/partner/employees`,
    employees: employees,
    totalCount: getPartnerEmployeesResponse.totalCount,
    pageSelected: page,
    perPage: perPage,
    errors: [],
    showPopup: false,
    logoutUrl: "/private/partner/logout",
    url: "/private/partner/employees",
    userInfo: {
      userInitials: `${userProfile.first_name[0]}.${userProfile.last_name[0]}`,
      userTag: `${userProfile.first_name} ${userProfile.last_name}`,
      userSubTag: userProfile.email,
    },
    navList: isPartnerBranchManger ? branchMangerNavList : navList,
    layout: "layout/internal-screens",
    addEmployeeFormValues: {},
    branches: branches,
    employeeRoles: isPartnerBranchManger
      ? employeeRoles.filter((item) => item.value !== "BRANCH_MANAGER")
      : employeeRoles,
  });
};

export const branches = async (req: Request, res: Response) => {
  const userIamId = req.headers["x-user-iam-id"].toString();
  const userProfile = await partnerUsersService.getUserProfileByIamId(userIamId);
  const isPartnerBranchManger = await isPartnerUser(userProfile.partner_id, userIamId, "branchesManagers");
  const lang = req.lang;
  const page = req.page;
  const perPage = req.perPage;
  let response: any;
  if (isPartnerBranchManger) response = await getUserBranches(page, perPage, lang, userProfile.iam_id);
  else response = await getPartnerBranches(page, perPage, lang, userProfile.partner_id);


  const branches = response.data.map((item: any) => {
    const createdAt = new Date(item.created_at);
    const createdAtDate = getDateString(createdAt);
    const createdAtTime = getTimeString(createdAt);
    item.created_at = createdAtDate;
    item["current_time"] = createdAtTime;
    return item;
  });

  res.render("./screens/branches", {
    title: "Branches",
    branches: branches,
    totalCount: response.totalCount,
    pageSelected: page,
    perPage: perPage,
    errors: [],
    showPopup: false,
    logoutUrl: "/private/partner/logout",
    url: "/private/partner/branches",
    userInfo: {
      userInitials: `${userProfile.first_name[0]}.${userProfile.last_name[0]}`,
      userTag: `${userProfile.first_name} ${userProfile.last_name}`,
      userSubTag: userProfile.email,
    },
    navList: isPartnerBranchManger ? branchMangerNavList : navList,
    layout: "layout/internal-screens",
  });
};

export const getTransactions = async (req: Request, res: Response) => {
  const userIamId = req.headers["x-user-iam-id"].toString();
  const userProfile = await partnerUsersService.getUserProfileByIamId(userIamId);
  const isPartnerBranchManger = await isPartnerUser(userProfile.partner_id, userIamId, "branchesManagers");
  const page = Number(req.query.page ? req.query.page : 1);
  const perPage = Number(req.query.perPage ? req.query.perPage : 10);
  const consumerPhoneNumber = String(req.query.consumerPhoneNumber ? req.query.consumerPhoneNumber : "");
  const transactionIdSearch = String(req.query.transactionIdSearch ? req.query.transactionIdSearch : "");
  let transactions = [];
  let totalCount = 0;
  try {
    let tempPartnerTransactions: any;
    if (isPartnerBranchManger)
      tempPartnerTransactions = await getBranchTransactions(page, perPage, userProfile.branch_id, consumerPhoneNumber, transactionIdSearch);
    else
      tempPartnerTransactions = await getPartnerTransactions(
        page,
        perPage,
        userProfile.partner_id,
        consumerPhoneNumber,
        transactionIdSearch,
      );
    const tempPartnerLoans = await getPartnerLoans(
      userProfile.partner_id,
      tempPartnerTransactions.data.map((item: any) => item.loan_id),
    );
    const partnerLoans: { [key: string]: string } = {};
    tempPartnerLoans.loans.forEach((loan: { loan_id: string; payment_status: string }) => {
      partnerLoans[loan.loan_id] = loan.payment_status;
    });
    transactions = tempPartnerTransactions.data.map((item: any) => {
      const selectedFinancialOffer = item.commercial_offers.find(
        (commercialOffer: { id: string; selected_commercial_offer_id: string }) =>
          commercialOffer.id === item.selected_commercial_offer_id,
      );
      const createdAt = new Date(item.created_at);
      const createdAtDate = getDateString(createdAt);
      const createdAtTime = getTimeString(createdAt);
      item.transaction_date = createdAtDate;
      item["current_time"] = createdAtTime;
      item["transaction_id"] = item.id;
      item["status"] = partnerLoans[item.loan_id];
      item["cashier_name"] = item.cashier.first_name + " " + item.cashier.last_name;
      item["name"] = item.products[0].name;
      item["bank_name"] = item.partner.partner_bank_accounts[0].bank_name;
      item["bank_account_number"] = item.partner.partner_bank_accounts[0].account_number;
      item["amount_financed"] = selectedFinancialOffer.financed_amount.units / 100;
      item["down_payment"] = selectedFinancialOffer.down_payment.units / 100;
      item["admin_fees"] = selectedFinancialOffer.admin_fee.units / 100;
      item["amount_collected"] =
        selectedFinancialOffer.down_payment.units / 100 + selectedFinancialOffer.admin_fee.units / 100;
      item["transferred_amount"] =
        partnerLoans[item.loan_id] === "PAID" ? selectedFinancialOffer.financed_amount.units / 100 : 0;
      item["branch"] = item.partner_branch.name;
      return item;
    });
    totalCount = tempPartnerTransactions.totalCount;
  } catch (erro) {
    console.error(erro);
  } finally {
    return res.render("./screens/transactions", {
      title: "الرئيسيه",
      showPopup: true,
      getTransactionsUrl: `${config.baseURL}/private/partner/transactions`,
      transactions: transactions,
      totalCount: totalCount,
      pageSelected: page,
      perPage: perPage,
      url: "/private/partner/transactions",
      logoutUrl: "/private/partner/logout",
      userInfo: {
        userInitials: `${userProfile.first_name[0]}.${userProfile.last_name[0]}`,
        userTag: `${userProfile.first_name} ${userProfile.last_name}`,
        userSubTag: userProfile.email,
      },
      consumerPhoneNumber: consumerPhoneNumber,
      transactionIdSearch: transactionIdSearch,
      navList: isPartnerBranchManger ? branchMangerNavList : navList,
      layout: "layout/internal-screens",
    });
  }
};

export const getSuppoort = async (req: Request, res: Response) => {
  const userIamId = req.headers["x-user-iam-id"].toString();
  const userProfile = await partnerUsersService.getUserProfileByIamId(userIamId);
  res.render("./screens/support", {
    title: "الدعم",
    url: "/private/partner/support",
    logoutUrl: "/private/partner/logout",
    userInfo: {
      userInitials: `${userProfile.first_name[0]}.${userProfile.last_name[0]}`,
      userTag: `${userProfile.first_name} ${userProfile.last_name}`,
      userSubTag: userProfile.email,
    },
    navList: navList,
    layout: "layout/internal-screens",
  });
};

export const groupedByCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lang = req.header("Accept-Language");
    const data = await PartnerUseCase.getPartnersByCategory(lang);
    res.json(baseResponse(data));
  } catch (e) {
    next(e);
  }
};

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info("get categories");
    const lang = req.header("Accept-Language");
    const governorateId = req.query.governorateId ? Number(req.query.governorateId) : null;
    const data = await PartnerUseCase.getCategories(lang, governorateId);
    res.json(baseResponse(data));
  } catch (e) {
    logger.error(`failed to get categories ${e}`);
    next(e);
  }
};
export const getAllPartners = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info("get all partners by filters");

    let lang = req.lang;
    const page = req.page;
    const perPage = req.perPage;
    const category = req.query.category ? String(req.query.category) : null;
    const governorateId = req.query.governorateId ? String(req.query.governorateId) : null;
    const search = req.query.search ? String(req.query.search) : null;
    const result = await getPartners(page, perPage, lang, category, governorateId, search);
    res.json({ data: result.data, totalCount: result.totalCount });
  } catch (e) {
    logger.error(`failed to get all partners  by filters ${e}`);
    next(e);
  }
};

export const getTransactionDetails = async (req: Request, res: Response) => {
  try {
    const userIamId = req.headers["x-user-iam-id"].toString();
    const userProfile = await partnerUsersService.getUserProfileByIamId(userIamId);
    const partner = await partnerService.getPartner(userProfile.partner_id);
    const { transaction_id } = req.params;

    const tempPartnerTransactions = await getPartnerTransactions(1, 1, userProfile.partner_id, "", "", transaction_id);
    const tempTransaction = tempPartnerTransactions.data[0];

    const tempPartnerLoans = await getPartnerLoans(
      userProfile.partner_id,
      tempPartnerTransactions.data.map((item) => item.loan_id),
    );
    const consumerLoans = await getLoans(tempTransaction.consumer_id);
    const filteredConsumerLoans = consumerLoans.loans.filter((loan: any) => loan.loan_id === tempTransaction.loan_id);
    let canReturnProduct = false;
    // Can return the product only if the first installment is not paid yet
    // and the due date is today or in the future
    const firstInstallment = filteredConsumerLoans[0].payment_schedule[0];
    const dueDate = new Date(firstInstallment.due_date);
    const bookingDate = new Date(filteredConsumerLoans[0].booked_at);
    const oneMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1));
    
    if (
      filteredConsumerLoans[0].payment_schedule.every((schedule: any) => schedule.paid_date === null) &&
      dueDate >= new Date() &&
      bookingDate > oneMonthAgo &&
      partner.status === "ACTIVE"
    ) {
      canReturnProduct = true;
    }
    const createdAt = new Date(tempTransaction.created_at);
    const createdAtDate = getDateString(createdAt);
    const createdAtTime = getTimeString(createdAt);
    tempTransaction.transaction_date = createdAtDate;
    tempTransaction.transaction_time = createdAtTime;

    const selectedFinancialOffer = tempTransaction.commercial_offers.find(
      (commercialOffer: { id: string; selected_commercial_offer_id: string }) =>
        commercialOffer.id === tempTransaction.selected_commercial_offer_id,
    );
    tempTransaction["basket_id"] = tempTransaction.id;
    tempTransaction["transaction_id"] = formatNumber(tempTransaction.transaction_id);
    tempTransaction["status"] = tempPartnerLoans.loans[0].payment_status;
    tempTransaction["cashier_name"] = tempTransaction.cashier.first_name + " " + tempTransaction.cashier.last_name;
    tempTransaction["name"] = tempTransaction.products[0].name;
    tempTransaction["bank_name"] = tempTransaction.partner.partner_bank_accounts[0].bank_name;
    tempTransaction["bank_account_number"] = tempTransaction.partner.partner_bank_accounts[0].account_number;
    tempTransaction["amount_financed"] = selectedFinancialOffer.financed_amount.units / 100;
    tempTransaction["down_payment"] = selectedFinancialOffer.down_payment.units / 100;
    tempTransaction["admin_fees"] = selectedFinancialOffer.admin_fee.units / 100;
    tempTransaction["amount_collected"] =
      selectedFinancialOffer.down_payment.units / 100 + selectedFinancialOffer.admin_fee.units / 100;
    tempTransaction["transferred_amount"] =
      tempPartnerLoans.loans[0].payment_status === "PAID" ? selectedFinancialOffer.financed_amount.units / 100 : 0;
    tempTransaction["branch"] = tempTransaction.partner_branch.name;
    return res.render("./screens/transaction-details", {
      title: "transaction details",
      logoutUrl: "/private/partner/logout",
      userInfo: {
        userInitials: `${userProfile.first_name[0]}.${userProfile.last_name[0]}`,
        userTag: `${userProfile.first_name} ${userProfile.last_name}`,
        userSubTag: userProfile.email,
      },
      transaction: tempTransaction,
      navList: navList,
      activateReturnButton: canReturnProduct,
      layout: "layout/internal-screens",
      partnerStatus: partner.status,
    });
  } catch (error) {
    console.error(error);
  }
};

export const initReturn = async (req: Request, res: Response) => {
  try {
    const userIamId = req.headers["x-user-iam-id"].toString();
    const userProfile = await partnerUsersService.getUserProfileByIamId(userIamId);
    const loanId = req.body.loanId;
    const consumerId = req.body.consumerId;
    const partnerId = userProfile.partner_id;
    const partner = await partnerService.getPartner(userProfile.partner_id);
    if (partner.status === "ACTIVE") {
      const workflowRequest: StartWorkflowRequest = {
        name: "cancel_loan",
        correlationId: loanId,
        input: {
          cancel_loan_details: {
            reference_id: "123",
            loan_id: loanId,
            consumer_id: consumerId,
            merchant_id: partnerId,
            cancellation_time: new Date().toISOString(),
            reason: "PRODUCT_RETURN",
          },
        },
      };
      const result = await startWorkflow(workflowRequest);
      return res.status(200).json(result);
    } else {
      return res.status(403).send();
    }
  } catch (error) {
    console.error(error);
    return res.status(400).send();
  }
};

export const getTopPartners = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info("get top partners");
    const lang = req.lang;
    const page = req.page;
    const perPage = req.perPage;
    const governorateId = req.query.governorateId ? String(req.query.governorateId) : null;
    const result = await getTopPartnersList(page, perPage, lang, governorateId);
    res.json({ data: result.data, totalCount: result.totalCount });
  } catch (e) {
    logger.error(`failed to get top partners ${e}`);
    next(e);
  }
};

export const defaultUrl = async (req: Request, res: Response) => {
  try {
    const userIamId = req.headers["x-user-iam-id"].toString();
    const userProfile = await partnerUsersService.getUserProfileByIamId(userIamId);
    const isPartnerAdmin = await isPartnerUser(userProfile.partner_id, userIamId, "admins");
    const isPartnerCashier = await isPartnerUser(userProfile.partner_id, userIamId, "cashiers");
    const isPartnerBranchManger = await isPartnerUser(userProfile.partner_id, userIamId, "branchesManagers");
    if (isPartnerAdmin || isPartnerBranchManger) {
      res.redirect(`/private/partner/transactions`);
    } else if (isPartnerCashier) {
      const partner = await partnerService.getPartner(userProfile.partner_id);
      if (partner.status === "ACTIVE") {
        res.redirect(`/private/partner/checkout`);
      } else {
        throw new Error("Partner is not active");
      }
    } else {
      res.redirect(`/public/partner/login`);
    }
  } catch (error) {
    console.error(error);
    res.redirect(`/public/partner/login`);
  } finally {
    return;
  }
};

export const disbursePayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await PartnerUseCase.disbursePayment(req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
};
