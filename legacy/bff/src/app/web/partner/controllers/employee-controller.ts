import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import partnerService from "../../../../services/partners";
import partnerUsersService from "../../../../services/partner-users";
import { config } from "../../../../../config";
import { navList } from "./partner-controller";
import { CustomLogger } from "../../../../services/logger";
import { getDateString, getTimeString } from "../../../../utils/date-utils";
import { getPartnerBranches, getPartnerEmployees } from "../../../../services/hasura";
import { isPartnerUser } from "../../../../services/keto";
import { addCashierValidation } from "../middlewares/validations/cashierValidation";
import { addBranchManagerValidation } from "../middlewares/validations/employeeValidation";

const logger = new CustomLogger("employee", "controller");

export const employeeRoles = [
  { name: "كاشير", value: "CASHIER" },
  { name: "رئيس فرع", value: "BRANCH_MANAGER" },
];

export const updateEmployeeState = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userIamId = req.headers["x-user-iam-id"].toString();
    const userProfile = await partnerUsersService.getUserProfileByIamId(userIamId);
    const isPartnerBranchManger = await isPartnerUser(userProfile.partner_id, userIamId, "branchesManagers");
    const lang = req.lang;
    const page = req.page;
    const perPage = req.perPage;

    await partnerService.updateEmployeeState(userProfile.partner_id, req.body.employeeId, req.body.state);

    const branches = (await getPartnerBranches(1, 1000, lang, userProfile.partner_id)).data;
    const response = await getPartnerEmployees(page, perPage, userProfile.partner_id);
    let employees = transformEmployee(response.data);

    logger.debug(`updateEmployeeState - render screen`);
    res.render("./screens/employees", {
      errors: [],
      title: "الموظفين",
      showPopup: false,
      updateStateUrl: `${config.baseURL}/private/partner/updateEmployeeState`,
      getEmployeesUrl: `${config.baseURL}/private/partner/employees`,
      employees,
      totalCount: response.totalCount,
      pageSelected: page,
      perPage,
      logoutUrl: "/private/partner/logout",
      url: "/private/partner/employees",
      userInfo: {
        userInitials: `${userProfile.first_name[0]}.${userProfile.last_name[0]}`,
        userTag: `${userProfile.first_name} ${userProfile.last_name}`,
        userSubTag: userProfile.email,
      },
      navList,
      layout: "layout/internal-screens",
      addEmployeeFormValues: {},
      branches,
      employeeRoles: isPartnerBranchManger
        ? employeeRoles.filter((item) => item.value !== "BRANCH_MANAGER")
        : employeeRoles,
    });
  } catch (error) {
    logger.error(`updateEmployeeState - failed to update the employee with error ${error}`);
    next(error);
  }
};

export const addEmployee = async (req: Request, res: Response) => {
  logger.debug(`addEmployee - start`);
  if (req.body.employee_role === "BRANCH_MANAGER") {
    await Promise.all(addBranchManagerValidation.map((validation) => validation.run(req)));
  } else if (req.body.employee_role === "CASHIER") {
    await Promise.all(addCashierValidation.map((validation) => validation.run(req)));
  }
  const userIamId = req.headers["x-user-iam-id"].toString();
  const userProfile = await partnerUsersService.getUserProfileByIamId(userIamId);

  const isPartnerBranchManger = await isPartnerUser(userProfile.partner_id, userIamId, "branchesManagers");
  const partner = await partnerService.getPartner(userProfile.partner_id);
  const lang = req.lang;
  const page = req.page;
  const perPage = req.perPage;

  logger.debug("addEmployee - getPartnerEmployee");

  const branches = (await getPartnerBranches(1, 1000, lang, userProfile.partner_id)).data;
  const response = await getPartnerEmployees(page, perPage, userProfile.partner_id);
  let employees = transformEmployee(response.data);
  let employeeRolesToReturn = isPartnerBranchManger
    ? employeeRoles.filter((item) => item.value !== "BRANCH_MANAGER")
    : employeeRoles;

  const values = {
    branch_id: req.body.branch_id,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    phone_number: req.body.phone_number,
    email: req.body.email,
    employee_role: req.body.employee_role,
  };

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error(errors.mapped().toString());
    return res.render("./screens/employees", {
      errors: errors.mapped(),
      title: "الموظفين",
      showPopup: true,
      updateStateUrl: `${config.baseURL}/private/partner/updateEmployeeState`,
      getEmployeesUrl: `${config.baseURL}/private/partner/employees`,
      employees,
      totalCount: response.totalCount,
      pageSelected: page,
      perPage,
      logoutUrl: "/private/partner/logout",
      url: "/private/partner/employees",
      userInfo: {
        userInitials: `${userProfile.first_name[0]}.${userProfile.last_name[0]}`,
        userTag: `${userProfile.first_name} ${userProfile.last_name}`,
        userSubTag: userProfile.email,
      },
      navList,
      layout: "layout/internal-screens",
      addEmployeeFormValues: values,
      branches,
      employeeRoles: employeeRolesToReturn,
    });
  }

  if (partner.status !== "ACTIVE") {
    return res.render("./screens/dashboard", {
      errors: { email: { msg: "الموظف غير نشط" } },
      title: "",
      showPopup: true,
      updateStateUrl: `${config.baseURL}/private/partner/updateEmployeeState`,
      getEmployeesUrl: `${config.baseURL}/private/partner/employees`,
      employees,
      totalCount: response.totalCount,
      pageSelected: page,
      perPage,
      logoutUrl: "/private/partner/logout",
      url: "/private/partner/employees",
      userInfo: {
        userInitials: `${userProfile.first_name[0]}.${userProfile.last_name[0]}`,
        userTag: `${userProfile.first_name} ${userProfile.last_name}`,
        userSubTag: userProfile.email,
      },
      navList,
      layout: "layout/internal-screens",
      addEmployeeFormValues: values,
      branches,
      partner,
      employeeRoles: employeeRolesToReturn,
    });
  }

  try {
    logger.debug(`addEmployee - registerEmployee`);
    await partnerService.registerEmployee(userProfile.partner_id, req.body);
    res.redirect(`${config.baseURL}/private/partner/employees`);
  } catch (error) {
    let errorMsg = "";
    if (error.response.status === 409) {
      errorMsg = "الموظف مسجل بالفعل.";
    } else if (error.response.status === 400) {
      errorMsg = "الموظف مسجل بالفعل او قد يكون مسجل لشريك اخر.";
    } else {
      errorMsg = "الرجاء التأكد من البيانات المدخلة ،حدث خطأ غير معروف.";
    }
    logger.error(`addEmployee failed with error ${error}`);
    res.render("./screens/employees", {
      errors: { general: { msg: errorMsg } },
      title: "الموظفين",
      showPopup: true,
      updateStateUrl: `${config.baseURL}/private/partner/updateEmployeeState`,
      getEmployeesUrl: `${config.baseURL}/private/partner/employees`,
      employees,
      totalCount: response.totalCount,
      pageSelected: page,
      perPage,
      logoutUrl: "/private/partner/logout",
      url: "/private/partner/employees",
      userInfo: {
        userInitials: `${userProfile.first_name[0]}.${userProfile.last_name[0]}`,
        userTag: `${userProfile.first_name} ${userProfile.last_name}`,
        userSubTag: userProfile.email,
      },
      navList,
      layout: "layout/internal-screens",
      addEmployeeFormValues: values,
      branches,
      employeeRoles: employeeRolesToReturn,
    });
  }
};

function transformEmployee(employees: any): any {
  employees.map((item: any) => {
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
  return employees;
}
