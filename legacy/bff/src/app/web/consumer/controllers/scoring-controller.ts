import { Request, Response } from "express";
import { ConsumerUseCases } from "../../../../domain/consumer/use-cases/consumer-user-cases";
import { CustomLogger } from "../../../../services/logger";
import { numberToArabicText } from "../../../../utils/arabic-text-utils";

const logger = new CustomLogger("scoring", "controller");

const getConsumerScoringData = async (req: Request, res: Response) => {
  logger.debug("getConsumerScoringData");
  try {
    const consumerMiniCashData = req.body;
    const singlePaymentDay = consumerMiniCashData.singlePaymentDay;
    delete consumerMiniCashData.singlePaymentDay;
    const consumerScoring = await new ConsumerUseCases().getScoring(consumerMiniCashData);
    consumerMiniCashData.singlePaymentDay = singlePaymentDay;
    if (consumerScoring.status == "APPROVED_ACTIVE") {
      consumerMiniCashData.CreditLimit = consumerScoring.creditLimit;
    } else {
      res.send({
        creditLimit: consumerScoring.creditLimit,
        creditLimitInArabicText: numberToArabicText(consumerScoring.creditLimit || 0) || "",
        consumerStatus: consumerScoring.status,
        canDownload: false,
      });
      return;
    }
    res.send({ creditLimit: consumerScoring.creditLimit, creditLimitInArabicText: numberToArabicText(consumerScoring.creditLimit || 0) || "", consumerStatus: consumerScoring.status, canDownload: true });
    return;
  } catch (error) {
    console.error(error);
    res.send({ canDownload: false, error: error.message });
    return;
  }
};

export default { getConsumerScoringData };
