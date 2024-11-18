import { Request, Response } from "express";
import { ConsumerUseCases } from "../../../../domain/consumer/use-cases/consumer-user-cases";
import { config } from "../../../../../config";
import { ConsumerDto, PrintConsumerDto } from "../../../../domain/dtos/consumer-dto";
import { validationResult } from "express-validator";
import { getUserGroups } from "../../../../services/keto";
import { CustomLogger } from "../../../../services/logger";
import { executeQuery } from "../../../../services/hasura";
import { generateCustomerActivationDocs } from "../utils/pdf.utils";
import { numberToArabicText } from "../../../../utils/arabic-text-utils";

const logger = new CustomLogger("back-office", "controller");
const searchConsumerData = async (req: Request, res: Response) => {
  try {
    logger.debug("searchConsumerData");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("./screens/activate-consumer-account", {
        title: "تفعيل حساب العميل",
        getConsumerUrl: `${config.baseURL}/private/back-office/consumer`,
        consumer: { myloStatus: "LOADING" },
        showError: null,
        showSuccess: null,
        message: "",
        loading: null,
        scoringData: null,
        phoneNumber: req.body.phone_number,
        nationalId: req.body.national_id,
        checkScoringUrl: `${config.baseURL}/private/api/consumers/scoring`,
        printDocumentUrl: `${config.baseURL}/private/back-office/printDocument`,
        activateConsumerUrl: `${config.baseURL}/private/back-office/update-consumer-account`,
        logoutUrl: "/private/back-office/logout",
        layout: "layout/empty-screens",
        errors: errors.mapped(),
        centerBtn: true,
      });
      logger.debug("searchConsumerData - return consumer data");
      return;
    }

    let consumerMiniCashData = null;
    const consumerMyloData = await new ConsumerUseCases().findConsumerByPhoneNumber(req.body.phone_number.toString());
    if (consumerMyloData == null) {
      res.render("./screens/activate-consumer-account", {
        title: "تفعيل حساب العميل",
        getConsumerUrl: `${config.baseURL}/private/back-office/consumer`,
        consumer: { myloStatus: "LOADING" },
        showError: true,
        showSuccess: null,
        message: "رقم الموبايل غير مسجل علي مايلو",
        loading: null,
        scoringData: null,
        phoneNumber: req.body.phone_number,
        nationalId: req.body.national_id,
        checkScoringUrl: `${config.baseURL}/private/api/consumers/scoring`,
        printDocumentUrl: `${config.baseURL}/private/back-office/printDocument`,
        activateConsumerUrl: `${config.baseURL}/private/back-office/update-consumer-account`,
        logoutUrl: "/private/back-office/logout",
        layout: "layout/empty-screens",
        errors: [],
        centerBtn: false,
      });
      return;
    }
    if (consumerMyloData.status == "ACTIVE") {
      consumerMiniCashData = convertToMinicashDto(consumerMyloData);
    } else {
      consumerMiniCashData = await new ConsumerUseCases().findConsumerByNationalId(req.body.national_id.toString());
      let searchedPhoneNumber = req.body.phone_number;
      if (searchedPhoneNumber.startsWith("+")) {
        searchedPhoneNumber = searchedPhoneNumber.slice(2);
      }
      if (!consumerMiniCashData || consumerMiniCashData.MobileNo != searchedPhoneNumber) {
        res.render("./screens/activate-consumer-account", {
          title: "تفعيل حساب العميل",
          getConsumerUrl: `${config.baseURL}/private/back-office/consumer`,
          consumer: { myloStatus: "LOADING" },
          showError: true,
          showSuccess: null,
          message: "رقم الموبايل غير متوافق مع رقم البطاقة المسجل للعميل علي ميني كاش",
          loading: null,
          scoringData: null,
          phoneNumber: req.body.phone_number,
          nationalId: req.body.national_id,
          checkScoringUrl: `${config.baseURL}/private/api/consumers/scoring`,
          printDocumentUrl: `${config.baseURL}/private/back-office/printDocument`,
          activateConsumerUrl: `${config.baseURL}/private/back-office/update-consumer-account`,
          logoutUrl: "/private/back-office/logout",
          layout: "layout/empty-screens",
          errors: [],
          centerBtn: false,
        });
        return;
      }
    }

    consumerMiniCashData.myloStatus = consumerMyloData.status;
    consumerMiniCashData.myloId = consumerMyloData.id;
    const scoringObj = convertToScoringDto(consumerMiniCashData);

    res.render("./screens/activate-consumer-account", {
      title: "تفعيل حساب العميل",
      getConsumerUrl: `${config.baseURL}/private/back-office/consumer`,
      consumer: consumerMiniCashData,
      showError: null,
      showSuccess: null,
      message: null,
      loading: true,
      scoringData: scoringObj,
      phoneNumber: req.body.phone_number,
      nationalId: req.body.national_id,
      checkScoringUrl: `${config.baseURL}/private/api/consumers/scoring`,
      printDocumentUrl: `${config.baseURL}/private/back-office/printDocument`,
      activateConsumerUrl: `${config.baseURL}/private/back-office/update-consumer-account`,
      logoutUrl: "/private/back-office/logout",
      layout: "layout/empty-screens",
      errors: [],
      centerBtn: false,
    });
    return;
  } catch (error) {
    res.render("./screens/activate-consumer-account", {
      title: "تفعيل حساب العميل",
      getConsumerUrl: `${config.baseURL}/private/back-office/consumer`,
      consumer: { myloStatus: "LOADING" },
      showError: true,
      showSuccess: null,
      message: error.message,
      loading: null,
      scoringData: null,
      phoneNumber: req.body.phone_number,
      nationalId: req.body.national_id,
      checkScoringUrl: `${config.baseURL}/private/api/consumers/scoring`,
      printDocumentUrl: `${config.baseURL}/private/back-office/printDocument`,
      activateConsumerUrl: `${config.baseURL}/private/back-office/update-consumer-account`,
      logoutUrl: "/private/back-office/logout",
      layout: "layout/empty-screens",
      errors: [],
      centerBtn: false,
    });
    return;
  }
};

const activateConsumer = async (req: Request, res: Response) => {
  logger.debug("activateConsumer");
  res.render("./screens/activate-consumer-account", {
    title: "activate consumer",
    getConsumerUrl: `${config.baseURL}/private/back-office/consumer`,
    consumer: { myloStatus: "LOADING" },
    showError: null,
    loading: true,
    showSuccess: null,
    message: null,
    scoringData: null,
    phoneNumber: null,
    nationalId: null,
    checkScoringUrl: `${config.baseURL}/private/api/consumers/scoring`,
    printDocumentUrl: `${config.baseURL}/private/back-office/printDocument`,
    logoutUrl: "/private/back-office/logout",
    layout: "layout/empty-screens",
    activateConsumerUrl: `${config.baseURL}/private/back-office/update-consumer-account`,
    errors: [],
    centerBtn: false,
  });
};
const repayOrActivate = async (req: Request, res: Response) => {
  logger.debug("repay or activate");
  const branchId = req.headers["x-user-iam-branch-id"].toString();
  if (branchId === "" || branchId === null) {
    res.render("./screens/repay-activate", {
      title: "تفعيل حساب العميل",
      logoutUrl: "/private/back-office/logout",
      layout: "layout/empty-screens",
      repay: false,
    });
  }
  res.render("./screens/repay-activate", {
    title: "activate consumer",
    logoutUrl: "/private/back-office/logout",
    layout: "layout/empty-screens",
    repay: true,
  });
};

export const login = async (req: Request, res: Response) => {
  try {
    logger.debug(`login`);
    res.render("./screens/login", {
      title: "تسجيل الدخول",
      iamBaseURL: config.iamBaseURL,
      returnTo: `${config.baseURL}/private/back-office/default-url`,
      errors: [],
      layout: "layout/empty-screens",
      allowPhone: false,
    });
  } catch (error) {
    logger.error(`login failed ${error}`);
  }
};
export const logout = async (req: Request, res: Response) => {
  try {
    res.render("./screens/logout", {
      title: "تسجيل الخروج",
      loginUrl: `${config.baseURL}/public/back-office/login`,
      iamBaseURL: config.iamBaseURL,
      layout: "layout/empty-screens",
    });
  } catch (error) {
    logger.error(`logout failed ${error}`);
  }
};

function convertToScoringDto(consumer: any) {
  return {
    ssn: consumer.Ssn,
    salary: consumer.Salary,
    additionalSalary: consumer.AdditionalSalary,
    address: consumer.Address,
    addressDescription: consumer.AddressDescription,
    governorate: consumer.Governorate,
    stateName: consumer.Governorate,
    maritalStatus: consumer.MaritalStatus,
    car: consumer.Car,
    club: consumer.Club,
    city: consumer.City,
    company: consumer.Company,
    guarantorJob: consumer.GuarantorJob,
    guarantorRelationship: consumer.GuarantorRelationship,
    district: consumer.District,
    workType: consumer.WorkType,
    jobName: consumer.JobName,
    houseType: consumer.HouseType,
    mobileNumber: consumer.MobileNo,
    burden: null as number,
    name: consumer.FullName,
    singlePaymentDay: consumer.SinglePaymentDay ? consumer.SinglePaymentDay : 1,
  };
}

function convertToMinicashDto(consumer: ConsumerDto) {
  const date = new Date(consumer.activated_at);
  const localDate = date.toLocaleString("ar-EG-u-nu-latn", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Africa/Cairo",
  });
  let mobileNumber = consumer.phone_number;
  if (mobileNumber.startsWith("+")) {
    mobileNumber = mobileNumber.slice(2);
  }
  return {
    Ssn: consumer.national_id,
    Salary: consumer.salary,
    AdditionalSalary: consumer.additional_salary,
    Address: consumer.address,
    AddressDescription: consumer.address_description,
    Governorate: consumer.governorate,
    MaritalStatus: consumer.marital_status,
    Car: consumer.car_year,
    Club: consumer.club,
    City: consumer.city,
    Company: consumer.company,
    GuarantorJob: consumer.guarantor_job,
    GuarantorRelationship: consumer.guarantor_relationship,
    District: consumer.district,
    WorkType: consumer.work_type,
    JobName: consumer.job_name,
    HouseType: consumer.house_type,
    MobileNo: mobileNumber,
    FullName: consumer.full_name,
    ActivatedAt: localDate,
    ActivatedByIamId: consumer.activated_by_iam_id,
    ActivationBranch: consumer.branch_name,
    CreditLimit: (consumer.credit_limit / 100).toLocaleString("en-US"),
    myloId: consumer.id,
    myloStatus: consumer.status,
    SinglePaymentDay: consumer.single_payment_day ? consumer.single_payment_day : 1,
    NationalIdAddress: consumer.national_id_address,
    HomePhoneNumber: consumer.home_phone_number,
    CompanyAddress: consumer.company_address,
    WorkPhoneNumber: consumer.work_phone_number,
    AdditionalSalarySource: consumer.additional_salary_source,
  };
}

function convertToUpdateConsumerDto(consumer: any) {
  const result: ConsumerDto = {
    national_id: consumer.Ssn,
    salary: consumer.Salary,
    additional_salary: consumer.AdditionalSalary || undefined,
    address: consumer.Address,
    address_description: consumer.AddressDescription,
    governorate: consumer.Governorate,
    marital_status: consumer.MaritalStatus,
    car_year: consumer.Car,
    club: consumer.Club,
    city: consumer.City,
    company: consumer.Company,
    guarantor_job: consumer.GuarantorJob,
    guarantor_relationship: consumer.GuarantorRelationship,
    district: consumer.District,
    work_type: consumer.WorkType,
    job_name: consumer.JobName,
    house_type: consumer.HouseType,
    full_name: consumer.FullName,
    id: consumer.myloId,
    single_payment_day: consumer.SinglePaymentDay,
    national_id_address: consumer.NationalIdAddress,
    home_phone_number: consumer.HomePhoneNumber,
    company_address: consumer.CompanyAddress,
    work_phone_number: consumer.WorkPhoneNumber,
    additional_salary_source: consumer.AdditionalSalarySource || undefined,
    branch_name: consumer.BranchName,
    phone_number: "",
    iam_id: "",
    status: "",
    first_name: "",
    last_name: "",
    credit_limit: 0,
    created_at: "",
    updated_at: "",
    activated_at: "",
    activated_by_iam_id: "",
    activation_branch: "",
  };

  return result;
}

const printDocument = async (req: Request, res: Response) => {
  if (!req.body) {
    logger.debug("print consumer document - empty request body");
    res.send({ isSuccess: false, message: "لا يوجد بيانات" });
    return;
  }
  const consumer = convertToUpdateConsumerDto(req.body);
  const consumerUpdatedData: PrintConsumerDto = {
    ...consumer,
    phone_number: req.body.MobileNo,
    credit_limit: req.body.credit_limit,
    credit_limit_arabic_text: numberToArabicText(req.body.creditLimit || 0) || "",
  };
  let pdfBytes: Buffer = null;
  if (req.body.docType === "customerActivationDocs")
    pdfBytes = await generateCustomerActivationDocs(consumerUpdatedData);

  res.setHeader("Content-Disposition", `attachment; filename="${req.body.docType}.pdf"`);
  res.setHeader("Content-Type", "application/pdf");
  return res.send(pdfBytes);
};
const activateConsumerCredit = async (req: Request, res: Response) => {
  try {
    logger.debug("activateConsumerCredit");
    if (!req.body) {
      logger.debug("activateConsumerCredit - empty request body");
      res.send({ isSuccess: false, message: "لا يوجد بيانات" });
      return;
    }
    logger.debug(`activateConsumerCredit - request body: ${JSON.stringify(req.body)}`);
    const consumerUpdateData = convertToUpdateConsumerDto(req.body);
    const consumerMyloData = await new ConsumerUseCases().updateConsumer(consumerUpdateData);
    if (consumerMyloData == null) {
      logger.debug(`activateConsumerCredit - mylo consumer data is null failed to activate`);
      res.send({ isSuccess: false, message: "حدث خطأ في تفعيل حساب العميل" });
      return;
    }
    const creditLimitInCents = req.body.credit_limit * 100,
      activateConsumerData = {
        creditLimit: creditLimitInCents,
        creditOfficerIamIad: req.headers["x-user-iam-id"].toString(),
        branchName: req.body.BranchName,
      };
    logger.debug(`activateConsumerCredit - activate consumer with data: ${JSON.stringify(activateConsumerData)}`);
    const activateConsumerResult = await new ConsumerUseCases().activateConsumer(
      consumerUpdateData.id,
      activateConsumerData,
    );
    if (activateConsumerResult == null) {
      logger.debug(`activateConsumerCredit - failed to activate consumer`);
      res.send({ isSuccess: false, message: "حدث خطأ في تفعيل حساب العميل" });
      return;
    }
    res.send({ isSuccess: true, message: "تم تفعيل الحساب بنجاح!" });
    return;
  } catch (error) {
    logger.error(`activateConsumerCredit - failed to activate consumer ${error}`);
    res.send({ isSuccess: false, message: error.message });
    return;
  }
};

export const techSupport = async (req: Request, res: Response) => {
  const operation = `
    query partnerUsers {
      users: partner_user_profile {
        iam_id
        first_name
        last_name
        phone_number
        email
        profile_type
        partner {
          name
        }
      }
    }
  `;
  const result = await executeQuery(operation);
  res.render("./screens/tech-support", {
    title: "الدعم الفني",
    partnerUsers: result.users,
    logoutUrl: "/private/back-office/logout",
    layout: "layout/empty-screens",
  });
};

const defaultUrl = async (req: Request, res: Response) => {
  try {
    const userIamId = req.headers["x-user-iam-id"].toString();
    const userGroups = await getUserGroups(userIamId);
    if (userGroups.includes("relationshipManagers")) {
      res.redirect("/private/back-office/create-partner");
    }
    if (userGroups.includes("branchEmployees") && userGroups.includes("collectionAgents")) {
      res.redirect("/private/back-office/repay-activate");
    } else if (userGroups.includes("branchEmployees")) {
      res.redirect("/private/back-office/activate-consumer-account");
    } else if (userGroups.includes("collectionAgents")) {
      res.redirect("/private/back-office/repay");
    } else if (userGroups.includes("techSupport")) {
      res.redirect("/private/back-office/tech-support");
    } else {
      res.redirect(`/public/back-office/login`);
    }
  } catch (error) {
    logger.error(`failed to route to default url ${error}`);
    res.redirect(`/public/back-office/login`);
  } finally {
    return;
  }
};

export default {
  searchConsumerData,
  activateConsumer,
  login,
  logout,
  printDocument,
  activateConsumerCredit,
  repayOrActivate,
  techSupport,
  defaultUrl,
};
