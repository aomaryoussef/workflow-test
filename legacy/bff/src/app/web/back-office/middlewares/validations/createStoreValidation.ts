import { check } from "express-validator";

export const createStoreValidations = [
  check("governorate_id").notEmpty().withMessage("الخانة مطلوبة  "),
  check("city_id").notEmpty().withMessage("الخانة مطلوبة  "),
  check("area_id").notEmpty().withMessage("الخانة مطلوبة  "),
  check("street_name").notEmpty().withMessage("الخانة مطلوبة  "),

  check("location_link").notEmpty().withMessage("الخانة مطلوبة  "),
];
