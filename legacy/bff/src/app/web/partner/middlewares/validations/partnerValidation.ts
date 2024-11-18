import { check } from "express-validator";
import { enCategory } from "../../../../../domain/partner/models/partner";
export const validateGetPartners = [
  check('limit')
    .isInt({ min: 1 })
    .withMessage('Limit must be an integer greater than or equal to 1.')
    .toInt(),
  check('offset')
    .isInt({ min: 0 })
    .withMessage('Offset must be an integer greater than or equal to 0.')
    .toInt(),

  check('governorateId')
    .optional()
    .isString()
    .withMessage('Governorate ID must be a string.')
    .withMessage('Governorate ID is required.'),

  check('category')
    .optional()
    .isString()
    .withMessage('Category must be a string.')
    .isIn(Object.keys(enCategory))
    .withMessage(`Category must be one of the following: ${Object.keys(enCategory).join(', ')}.`),
];