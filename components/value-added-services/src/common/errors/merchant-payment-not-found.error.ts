export class MerchantPaymentNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MerchantPaymentNotFound';
  }
}