import {
  createConsumerIdentity as createConsumerIdentityService,
  generateRecoveryCodeForConsumer,
  generateRecoveryCodeForConsumerViaPhoneCall,
} from "../../../services/consumer";

export class IdentityUseCases {
  async createConsumerIdentity(phone_number: string, ssn: string | null = null) {
    const consumerIdentityCreationResult = await createConsumerIdentityService(phone_number, ssn);
    return consumerIdentityCreationResult;
  }

  async generateRecoveryCodeForConsumer(phone: string) {
    return await generateRecoveryCodeForConsumer(phone);
  }

  async generateRecoveryCodeForConsumerViaPhoneCall(phone: string) {
    return await generateRecoveryCodeForConsumerViaPhoneCall(phone);
  }
}
