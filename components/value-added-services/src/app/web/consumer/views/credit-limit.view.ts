import { ConsumerCreditLimit } from '../../../../domain/consumer/models/credit-limit.entity';
import { CreditLimitDto } from '../../../../domain/consumer/dto/api/credit-limit.dto';

/**
 * View class responsible for transforming `ConsumerCreditLimit` entities
 * into `CreditLimitDto` objects. This is useful for controlling the format
 * of the data that is exposed to external services or clients.
 */
export class CreditLimitView {
  /**
   * Transforms a `ConsumerCreditLimit` entity into a `CreditLimitDto`.
   *
   * This method takes an instance of `ConsumerCreditLimit` and maps its properties
   * to the corresponding fields in `CreditLimitDto`. This is typically used to
   * present a simplified and structured view of the `ConsumerCreditLimit` entity
   * when sending data to a client or another service.
   *
   * @param creditLimit - The `ConsumerCreditLimit` entity to be transformed into a DTO.
   *
   * @returns `CreditLimitDto` - A Data Transfer Object (DTO) that represents
   * the key information of the `ConsumerCreditLimit` entity.
   *
   * - `id`: The unique identifier of the credit limit.
   * - `consumerId`: The ID of the consumer associated with the credit limit.
   * - `maxLimit`: The maximum credit limit allowed for the consumer.
   * - `activeSince`: The date when the credit limit became active.
   *
   * Example usage:
   * ```typescript
   * const creditLimitDto = CreditLimitView.toDTO(consumerCreditLimitEntity);
   * ```
   */
  static toDTO(creditLimit: ConsumerCreditLimit): CreditLimitDto {
    if (!creditLimit) return null
    return {
      id: creditLimit.id,
      consumerId: creditLimit.consumerId,
      maxCreditLimit: creditLimit.maxCreditLimit,
      availableCreditLimit: creditLimit.availableCreditLimit,
      activeSince: creditLimit.activeSince,
    };
  }
}
