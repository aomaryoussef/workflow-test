import { check } from "express-validator";

export const addEmployeeValidation = [
  check("employee_role").notEmpty().withMessage("الخانة مطلوبة  "),
  check("branch_id").notEmpty().withMessage("الخانة مطلوبة  "),
  check("first_name")
    .notEmpty()
    .withMessage("الخانة مطلوبة  ")
    .isLength({ min: 3, max: 50 })
    .withMessage("لا يقل عن ٣ أحرف ولا يزيد عن ٥٠ حرف"),
  check("last_name")
    .notEmpty()
    .withMessage("الخانة مطلوبة  ")
    .isLength({ min: 3, max: 50 })
    .withMessage("لا يقل عن ٣ أحرف ولا يزيد عن ٥٠ حرف"),
];

export const addBranchManagerValidation = [
  check("email").notEmpty().withMessage('الخانة مطلوبة').isEmail().withMessage("البريد الإلكتروني غير صحيح"),
  check("phone_number")
    .optional({ checkFalsy: true })
    .isLength({ min: 11, max: 11 })
    .withMessage("رقم الموبايل غير صحيح")
    .matches("^01[0-2,5]{1}[0-9]{8}$")
    .withMessage("رقم الموبايل غير صحيح "),
];

export const addCashierValidation = [
  check("email").optional({ checkFalsy: true }).notEmpty().isEmail().withMessage("البريد الإلكتروني غير صحيح"),
  check("phone_number")
    .isLength({ min: 11, max: 11 })
    .withMessage("رقم الموبايل غير صحيح")
    .matches("^01[0-2,5]{1}[0-9]{8}$")
    .withMessage("رقم الموبايل غير صحيح "),
];
