import { check } from "express-validator";

export const validateGetGovernorates = [
  check('limit')
    .isInt({ min: 1 })
    .withMessage('Limit must be an integer greater than or equal to 1.')
    .toInt(),
  check('offset')
    .isInt({ min: 0 })
    .withMessage('Offset must be an integer greater than or equal to 0.')
    .toInt(),
];

export const validateGetCities = [
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
];

export const validateGetAreas = [
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
    .withMessage('Governorate ID must be a string.'),

  check('cityId')
    .optional()
    .isString()
    .withMessage('city ID must be a string.')
];