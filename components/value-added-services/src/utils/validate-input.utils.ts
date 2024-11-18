import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

function formatValidationErrors(errors: ValidationError[]): Record<string, string[]> {
  const formattedErrors: Record<string, string[]> = {};

  errors.forEach(error => {
    if (error.constraints) {
      formattedErrors[error.property] = Object.values(error.constraints);
    }

    if (error.children && error.children.length > 0) {
      const childErrors = formatValidationErrors(error.children);
      Object.entries(childErrors).forEach(([key, value]) => {
        formattedErrors[`${error.property}.${key}`] = value;
      });
    }
  });

  return formattedErrors;
}


/**
 * Transforms and validates input data against the provided DTO class.
 * @param cls - The DTO class to validate against.
 * @param plain - The plain input object.
 * @returns An instance of the DTO if validation passes.
 * @throws An error containing validation messages if validation fails.
 */
export async function transformAndValidate<T>(
  cls: new () => T,
  plain: object,
): Promise<T> {
  // Transform plain object to class instance
  const instance = plainToClass(cls, plain);

  // Validate the instance
  const errors: ValidationError[] = await validate(instance as any);

  if (errors.length > 0) {
    // Format errors into a structured object
    const formattedErrors = formatValidationErrors(errors);

    // Throw a detailed error with the formatted validation results
    throw new Error(`Validation failed: ${JSON.stringify(formattedErrors)}`);
  }

  return instance;
}

