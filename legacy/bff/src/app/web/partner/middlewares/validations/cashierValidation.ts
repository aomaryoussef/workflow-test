import { check } from "express-validator";
export const cashierValidations = [
  check("first_name").notEmpty().withMessage("الخانة مطلوبة  "),
  check("last_name").notEmpty().withMessage("الخانة مطلوبة  "),
  check("phone_number").notEmpty().withMessage("الخانة مطلوبة "),
];
export const addCashierValidation = [
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
  check("email").optional({ checkFalsy: true }).isEmail().withMessage("البريد الإلكتروني غير صحيح"),
  check("phone_number")
    .notEmpty()
    .withMessage("الخانة مطلوبة ")
    .isLength({ min: 11, max: 11 })
    .withMessage("رقم الموبايل غير صحيح")
    .matches("^01[0-2,5]{1}[0-9]{8}$")
    .withMessage("رقم الموبايل غير صحيح "),
];
export const checkoutAddProductValidation = [
  check("productPrice")
    .notEmpty()
    .withMessage("الخانة مطلوبة ")
    .isNumeric()
    .withMessage("من فضلك ادخل السعر")
    .isLength({ min: 0, max: 1000 })
    .withMessage("من فضلك ادخل السعر"),
  check("productName")
    .notEmpty()
    .withMessage("الخانة مطلوبة ")
    .isString()
    .withMessage("الخانة مطلوبة  ")
    .isLength({ min: 0, max: 1000 })
    .withMessage("من فضلك ادخل اسم منتج صحيح"),
  check("consumerId").notEmpty().withMessage("failed to get consumer"),
];
