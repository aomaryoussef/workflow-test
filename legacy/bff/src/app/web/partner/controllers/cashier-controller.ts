import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import partnerService from "../../../../services/partners";
import partnerUsersService from "../../../../services/partner-users";
import { config } from "../../../../../config";
import { navList } from "./partner-controller";
import { CustomLogger } from "../../../../services/logger";
import { getDateString, getTimeString } from "../../../../utils/date-utils";
import { getPartnerBranches, getPartnerCashiers } from "../../../../services/hasura";

const logger = new CustomLogger("cashier", "controller");

export const updateCashierState = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userIamId = req.headers["x-user-iam-id"].toString();
    const userProfile = await partnerUsersService.getUserProfileByIamId(userIamId);
    const lang = req.lang;
    const page = req.page;
    const perPage = req.perPage;
    logger.debug(`updateCashierState - update cashier state`);
    await partnerService.updateCashierState(userProfile.partner_id, req.body.cashierId, req.body.state);
    const branches = (await getPartnerBranches(1, 1000, lang,userProfile.partner_id)).data;
    logger.debug(`updateCashierState - load cashiers`);
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
    logger.debug(`updateCashierState - render screen`);
    res.render("./screens/dashboard", {
      errors: [],
      title: "الرئيسيه",
      showPopup: false,
      updateStateUrl: `${config.baseURL}/private/partner/updateCashierState`,
      getCashiersUrl: `${config.baseURL}/private/partner/dashboard`,
      cashiers: cashiers,
      totalCount: response.totalCount,
      pageSelected: page,
      perPage: perPage,
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
  } catch (error) {
    logger.error(`updateCashierState - failed to update the cashier with error ${error}`);
    next(error);
  }
};

export const cashierAdd = async (req: Request, res: Response) => {
  logger.debug(`cashierAdd - start`);
  const userIamId = req.headers["x-user-iam-id"].toString();
  const userProfile = await partnerUsersService.getUserProfileByIamId(userIamId);
  const partner = await partnerService.getPartner(userProfile.partner_id);
  const lang = req.lang;
  const page = req.page;
  const perPage = req.perPage;
  logger.debug("cashierAdd - getPartnerCashiers");
  const branches = (await getPartnerBranches(1, 1000, lang,userProfile.partner_id)).data;
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

  const values = {
    branch_id: req.body.branch_id,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    phone_number: req.body.phone_number,
    email: req.body.email,
  };

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error(errors.mapped().toString());
    return res.render("./screens/dashboard", {
      errors: errors.mapped(),
      title: "الرئيسيه",
      showPopup: true,
      updateStateUrl: `${config.baseURL}/private/partner/updateCashierState`,
      getCashiersUrl: `${config.baseURL}/private/partner/dashboard`,
      cashiers: cashiers,
      totalCount: response.totalCount,
      pageSelected: page,
      perPage: perPage,
      logoutUrl: "/private/partner/logout",
      url: "/private/partner/dashboard",
      userInfo: {
        userInitials: `${userProfile.first_name[0]}.${userProfile.last_name[0]}`,
        userTag: `${userProfile.first_name} ${userProfile.last_name}`,
        userSubTag: userProfile.email,
      },
      navList: navList,
      layout: "layout/internal-screens",
      addCashierFormValues: values,
      branches: branches,
    });
  }
  if (partner.status !== "ACTIVE") {
    return res.render("./screens/dashboard", {
      errors: { phone_number: { msg: "حساب الشريك غير نشط" } },
      title: "الرئيسيه",
      showPopup: true,
      updateStateUrl: `${config.baseURL}/private/partner/updateCashierState`,
      getCashiersUrl: `${config.baseURL}/private/partner/dashboard`,
      cashiers: cashiers,
      totalCount: response.totalCount,
      pageSelected: page,
      perPage: perPage,
      logoutUrl: "/private/partner/logout",
      url: "/private/partner/dashboard",
      userInfo: {
        userInitials: `${userProfile.first_name[0]}.${userProfile.last_name[0]}`,
        userTag: `${userProfile.first_name} ${userProfile.last_name}`,
        userSubTag: userProfile.email,
      },
      navList: navList,
      layout: "layout/internal-screens",
      addCashierFormValues: values,
      branches: branches,
      partner: partner,
    });
  }

  try {
    logger.debug(`cashierAdd - registerCashier`);
    await partnerService.registerCashier(userProfile.partner_id, req.body);
    res.redirect(`${config.baseURL}/private/partner/dashboard`);
  } catch (error) {
    let errorMsg = "";
    if (error.response.status === 409) {
      errorMsg = "الكاشير مسجل بالفعل.";
    } else if (error.response.status === 400) {
      errorMsg = "الكاشير مسجل بالفعل او قد يكون مسجل لشريك اخر.";
    } else {
      errorMsg = "الرجاء التأكد من البيانات المدخلة ،حدث خطأ غير معروف.";
    }
    logger.error(`cashierAdd failed with error ${error}`);
    res.render("./screens/dashboard", {
      errors: { phone_number: { msg: errorMsg } },
      title: "الرئيسيه",
      showPopup: true,
      updateStateUrl: `${config.baseURL}/private/partner/updateCashierState`,
      getCashiersUrl: `${config.baseURL}/private/partner/dashboard`,
      cashiers: cashiers,
      totalCount: response.totalCount,
      pageSelected: page,
      perPage: perPage,
      logoutUrl: "/private/partner/logout",
      url: "/private/partner/dashboard",
      userInfo: {
        userInitials: `${userProfile.first_name[0]}.${userProfile.last_name[0]}`,
        userTag: `${userProfile.first_name} ${userProfile.last_name}`,
        userSubTag: userProfile.email,
      },
      navList: navList,
      layout: "layout/internal-screens",
      addCashierFormValues: values,
      branches: branches,
    });
  }
};
