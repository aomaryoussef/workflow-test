import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

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
    // Extract error messages
    const messages = errors
      .map(error => Object.values(error.constraints || {}).join(', '))
      .join('; ');
    throw new Error(`Validation failed: ${messages}`);
  }

  return instance;
}
