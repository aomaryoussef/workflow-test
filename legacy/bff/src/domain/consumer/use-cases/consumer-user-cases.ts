import { getConsumerScoring } from "../../../services/scoring";
import { ScoringDto } from "../../dtos/scoring-dto";
import {
  findConsumerByPhoneNumber,
  getConsumerBasicInfoByPhoneNumber,
  activateConsumer,
  updateConsumer,
  getConsumerCreditLimits,
} from "../../../services/consumer";
import { ConsumerDto, ConsumerBasicInfoDto, GetConsumerCreditLimitsResponse } from "../../dtos/consumer-dto";
import { getConsumerMinicashData } from "../../../services/minicash";
import { UUID } from "crypto";
import { GetConsumerLoansUseCases } from "./get-consumer-loans-use-cases";

import { CustomLogger } from "../../../services/logger";
const logger = new CustomLogger("consumer-use-case");

export class ConsumerUseCases {
  async findConsumerByPhoneNumber(phoneNumber: string): Promise<ConsumerDto> {
    return await findConsumerByPhoneNumber(phoneNumber);
  }

  /**
   * Gets basic information of a consumer by phone number.
   * @async
   * @param {string} phoneNumber - The phone number of the consumer.
   * @returns {Promise<ConsumerBasicInfoDto>} The basic information of the consumer.
   */
  async getConsumerBasicInfoByPhoneNumber(phoneNumber: string): Promise<ConsumerBasicInfoDto> {
    const consumerInfo = await getConsumerBasicInfoByPhoneNumber(phoneNumber);
    let initials = "";

    if (consumerInfo.fullName) {
      const names = consumerInfo.fullName.split(" ");
      if (names.length >= 2) {
        // Get the first letter of the first two names
        initials = names[0][0] + names[1][0];
      } else if (names.length === 1) {
        // Get the first letter of the name
        initials = names[0][0];
      }
    }

    return { ...consumerInfo, initials };
  }

  async getScoring(userData: ScoringDto): Promise<any> {
    const consumer = await getConsumerScoring(userData);
    return consumer;
  }

  async findConsumerByNationalId(nationalId: string): Promise<any> {
    const consumer = await getConsumerMinicashData(nationalId);
    return consumer;
  }
  async getConsumerCreditLimits(consumerId: UUID): Promise<GetConsumerCreditLimitsResponse> {
    logger.debug("getting consumer credit limits for consumer: " + consumerId.toString());
    const consumerCreditLimits = await getConsumerCreditLimits(consumerId);
    logger.debug("received consumer credit limits: " + JSON.stringify(consumerCreditLimits));
    consumerCreditLimits.available_limit = Math.round(consumerCreditLimits.available_limit);
    consumerCreditLimits.monthly_limit = Math.round(consumerCreditLimits.monthly_limit);
    return consumerCreditLimits;
  }

  async activateConsumer(
    consumerId: string,
    {
      creditLimit,
      creditOfficerIamIad,
      branchName,
    }: { creditLimit: number; creditOfficerIamIad: string; branchName: string },
  ) {
    const consumer = await activateConsumer(consumerId, { creditLimit, creditOfficerIamIad, branchName });
    return consumer;
  }

  async updateConsumer(consumerData: ConsumerDto) {
    const consumer = await updateConsumer(consumerData);
    return consumer;
  }
  async getConsumerLoans(consumerId: UUID, statuses: string[]) {
    return GetConsumerLoansUseCases.getConsumerLoans(consumerId, statuses);
  }
  async getConsumerLoanDetails(consumerId: UUID, loanId: string, installmentId: string) {
    try {
      logger.debug("get consumer loan details");
      return GetConsumerLoansUseCases.getConsumerLoanDetails(consumerId, loanId, installmentId);
    } catch (err) {
      logger.error(`failed to get loan details api ${err}`);
    }
  }
}
