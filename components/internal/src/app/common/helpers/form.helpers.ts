import { egyptLandlineRegex, egyptMobileRegex } from "@common/helpers/regex.helpers";

export const validateNumber = (value: any) => (value && isNaN(value) ? Promise.reject() : Promise.resolve(true));

export const validateNumberNotLessThan = (value: any, num: number) =>
  value && !isNaN(value) && +value < num ? Promise.reject() : Promise.resolve(true);

export const validateNumberNotGreaterThan = (value: any, num: number) =>
  value && !isNaN(value) && +value > num ? Promise.reject() : Promise.resolve(true);

export const validateMobile = (value: any) =>
  value && !egyptMobileRegex.test(value) ? Promise.reject() : Promise.resolve();

export const validateLandline = (value: any) =>
  value && !egyptLandlineRegex.test(value) ? Promise.reject() : Promise.resolve();

export const validateMobileOrLandline = async (value: any) => {
  try {
    await Promise.any([validateMobile(value), validateLandline(value)]);
    return Promise.resolve(); // At least one validation succeeded
  } catch {
    return Promise.reject(); // All validations failed
  }
};
