import { Request, Response } from "express";
import { validationResult } from "express-validator";
import partnerService from "../../../../services/partners";

export const getCreatePartner = (_req: Request, res: Response) => {
  res.render("./screens/index", {
    title: "تسجيل شريك",
    logoutUrl: "/private/back-office/logout",
    errors: [],
    submittedData: {
      admin_user_profile: {},
      branch: { location: {} },
      bank_account: {},
    },
    layout: "layout/empty-screens",
    showPopup: false,
    validForm: false,
    formName: "create-partner",
  });
};

export const postCreatePartner = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  const categories = req.body.categories
    ? Array.isArray(req.body.categories)
      ? [...req.body.categories]
      : [req.body.categories]
    : [];
  const formSubmittedData = {
    name: req.body.name,
    commercial_registration_number: req.body.commercial_registration_number || '',
    tax_registration_number: req.body.tax_registration_number,
    categories: categories,
    admin_user_profile: {
      first_name: req.body.admin_first_name,
      last_name: req.body.admin_last_name,
      email: req.body.admin_email.toLowerCase(),
      phone_number: req.body.admin_phone_number,
    },
    branch: {
      governorate: req.body.governorate,
      city: req.body.city,
      area: req.body.area,
      street: req.body.street_name,
      google_maps_link: req.body.location_link,
      location: {
        latitude: req.body.location_latitude,
        longitude: req.body.location_longitude,
      },
    },
    bank_account: {
      bank_name: req.body.bank_name,
      branch_name: req.body.branch_name,
      beneficiary_name: req.body.beneficiary_name,
      iban: req.body.iban,
      swift_code: req.body.swift_code,
      account_number: req.body.account_number,
    },
  };
  if (!errors.isEmpty()) {
    return res.render("./screens/index", {
      errors: errors.mapped(),
      title: "تسجيل شريك",
      logoutUrl: "/private/back-office/logout",
      submittedData: formSubmittedData,
      layout: "layout/empty-screens",
      formName: "create-partner",
    });
  }
  try {
    const result = await partnerService.registerPartner(formSubmittedData);
    if (result.status === "success") {
      res.render("./screens/index", {
        title: "تسجيل شريك",
        logoutUrl: "/private/back-office/logout",
        errors: [],
        submittedData: {
          admin_user_profile: {},
          branch: { location: {} },
          bank_account: {},
        },
        layout: "layout/empty-screens",
        validForm: true,
        showPopup: true,
        formName: "create-partner",
      });
    } else {
      res.render("./screens/index", {
        title: "تسجيل شريك",
        logoutUrl: "/private/back-office/logout",
        errors: [],
        submittedData: formSubmittedData,
        layout: "layout/empty-screens",
        validForm: false,
        showPopup: true,
        formName: "create-partner",
      });
    }
  } catch (error) {
    res.render("./screens/index", {
      title: "تسجيل شريك",
      logoutUrl: "/private/back-office/logout",
      errors: [],
      submittedData: formSubmittedData,
      layout: "layout/empty-screens",
      validForm: false,
      showPopup: true,
      formName: "create-partner",
    });
  }
};
// store form controllers
export const getCreateStore = async (_req: Request, res: Response) => {
  const partners = await partnerService.getPartners();
  let uniqueArr: any[] = [];
  const unique: { [key: string]: any } = {};
  partners.forEach((partner: any) => {
    unique[partner.name] = partner;
  });
  uniqueArr = Object.values(unique);
  res.render("./screens/index", {
    title: "تسجيل شريك",
    logoutUrl: "/private/back-office/logout",
    errors: [],
    submittedData: {
      admin_user_profile: {},
      branch: { location: {} },
      bank_account: {},
    },
    layout: "layout/empty-screens",
    showPopup: false,
    validForm: false,
    formName: "create-store",
    partners: uniqueArr,
  });
};
export const getSuccessPopup = async (_req: Request, res: Response) => {
  res.render("./screens/create-store-success", {
    title: "تم إنشاء الحساب بنجاح",
    logoutUrl: "/private/back-office/logout",
    layout: "layout/empty-screens",
  });
};
export const postBranchForPartner = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  const partners = await partnerService.getPartners();
  const formSubmittedData = {
    name: req.body.branch_name,
    governorate_id: Number(req.body.governorate_id) || null,
    city_id: Number(req.body.city_id) || null,
    area_id: Number(req.body.area_id)  || null ,
    street: req.body.street_name,
    location: {
      latitude: req.body.location_latitude,
      longitude: req.body.location_longitude,
    },
    google_maps_link: req.body.location_link,
  };
  if (!errors.isEmpty()) {
    return res.render("./screens/index", {
      errors: errors.mapped(),
      title: "تسجيل فرع",
      logoutUrl: "/private/back-office/logout",
      submittedData: formSubmittedData,
      layout: "layout/empty-screens",
      formName: "create-store",
      partners: partners,
    });
  }
  try {
    const result = await partnerService.addStoreForPartner(formSubmittedData, req.body.partner_name);
    if (result.status === "success") {
      res.redirect("/private/back-office/create-store-success");
    } else {
      res.render("./screens/index", {
        title: "تسجيل فرع",
        logoutUrl: "/private/back-office/logout",
        errors: [],
        submittedData: formSubmittedData,
        layout: "layout/empty-screens",
        validForm: false,
        showPopup: true,
        formName: "create-store",
        partners: partners,
      });
    }
  } catch (error) {
    res.render("./screens/index", {
      title: "تسجيل فرع",
      logoutUrl: "/private/back-office/logout",
      errors: [],
      submittedData: formSubmittedData,
      layout: "layout/empty-screens",
      validForm: false,
      showPopup: true,
      formName: "create-store",
      partners: partners,
    });
  }
};
