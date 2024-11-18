import { check } from "express-validator";

export const createPartnerValidations = [
  check("name")
    .notEmpty()
    .withMessage("الخانة مطلوبة")
    .isLength({ min: 3, max: 30 })
    .withMessage("برجاء ادخال من ٣ الي ٣٠ حرف"),
  check("categories").notEmpty().withMessage("الخانة مطلوبة  "),
  check("tax_registration_number")
    .notEmpty()
    .withMessage("الخانة مطلوبة")
    .isLength({ min: 9, max: 9 })
    .withMessage("برجاء ادخال ٩ أرقام"),

  check("branch_name").notEmpty().withMessage("الخانة مطلوبة  "),
  check("beneficiary_name").notEmpty().withMessage("الخانة مطلوبة  "),
  check("iban").notEmpty().withMessage("الخانة مطلوبة"),
  check("account_number").notEmpty().withMessage("الخانة مطلوبة  "),
  check("admin_first_name").notEmpty().withMessage("الخانة مطلوبة  "),
  check("admin_last_name").notEmpty().withMessage("الخانة مطلوبة  "),
  check("admin_phone_number")
    .notEmpty()
    .withMessage("الخانة مطلوبة ")
    .isLength({ min: 11, max: 11 })
    .withMessage("من فضلك ادخل رقم مصري صحيح")
    .matches("^01[0-2,5]{1}[0-9]{8}$")
    .withMessage("من فضلك ادخل رقم مصري صحيح"),
  check("admin_email").notEmpty().withMessage("الخانة مطلوبة").isEmail().withMessage("البريد الإلكتروني غير صحيح"),
];
export const activateAccountValidation = [
  check("phone_number")
    .notEmpty()
    .withMessage("الخانة مطلوبة ")
    .isLength({ min: 11, max: 13 })
    .withMessage("من فضلك ادخل رقم موبايل صحيح ")
    .matches("^(?:01|\\+201)[0-2,5]{1}[0-9]{8}$")
    .withMessage("من فضلك ادخل رقم موبايل صحيح "),
  check("national_id")
    .notEmpty()
    .withMessage("الخانة مطلوبة")
    .isLength({ min: 14, max: 14 })
    .withMessage("من فضلك ادخل رقم قومي صحيح"),
];
