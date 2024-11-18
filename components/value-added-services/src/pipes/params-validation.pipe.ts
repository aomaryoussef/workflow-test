import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isUUID } from 'class-validator';

/**
 * A custom validation pipe that checks and transforms incoming request parameters
 * based on the specified type (`uuid`, `int`, or `string`). If the parameter
 * fails validation, a `BadRequestException` is thrown.
 */
@Injectable()
class ParamsValidationPipe implements PipeTransform {
  /**
   * Initializes the pipe with the desired type of validation.
   *
   * @param type - The expected type of the parameter to be validated. It can be one of:
   *   - `'uuid'`: Validates that the parameter is a valid UUID.
   *   - `'int'`: Validates that the parameter is a valid integer.
   *   - `'string'`: Validates that the parameter is a non-empty string.
   */
  constructor(private readonly type: 'uuid' | 'int' | 'string') {}

  /**
   * Transforms and validates the incoming parameter based on the specified type.
   *
   * If the validation fails, a `BadRequestException` is thrown with an appropriate message.
   *
   * @param value - The incoming value to be validated and transformed.
   *
   * @returns The transformed value if validation is successful.
   *
   * - If the type is `'uuid'`, it returns the original value if valid.
   * - If the type is `'int'`, it parses the value into an integer and returns it.
   * - If the type is `'string'`, it trims the string and returns it.
   *
   * @throws `BadRequestException` if the value fails validation for the specified type.
   */
  transform(value: any) {
    switch (this.type) {
      case 'uuid':
        if (!isUUID(value)) {
          throw new BadRequestException(`${value} is not a valid UUID`);
        }
        break;
      case 'int':
        const intVal = parseInt(value, 10);
        if (isNaN(intVal)) {
          throw new BadRequestException(`${value} is not a valid integer`);
        }
        return intVal; // Return the value as an integer
      case 'string':
        if (typeof value !== 'string' || value.trim().length === 0) {
          throw new BadRequestException(`Value must be a non-empty string`);
        }
        return value.trim(); // Return the trimmed string
      default:
        throw new BadRequestException(
          `Unsupported validation type: ${this.type}`,
        );
    }
    return value;
  }
}

/**
 * Factory function to create an instance of `ParamsValidationPipe` with the desired type.
 *
 * @param type - The expected type of the parameter to be validated. It can be one of:
 *   - `'uuid'`: Validates that the parameter is a valid UUID.
 *   - `'int'`: Validates that the parameter is a valid integer.
 *   - `'string'`: Validates that the parameter is a non-empty string.
 *
 * @returns `ParamsValidationPipe` - An instance of the custom validation pipe.
 *
 * Example usage:
 * ```typescript
 * @Get(':id')
 * someEndpoint(@Param('id', ParamsValidation('uuid')) id: string) {
 *   // id will be validated and passed in as a valid UUID
 * }
 * ```
 */
export function ParamsValidation(type: 'uuid' | 'int' | 'string') {
  return new ParamsValidationPipe(type);
}
