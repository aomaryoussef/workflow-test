import axios from "axios";
import { config } from "../../config";
import { ScoringDto } from "../domain/dtos/scoring-dto";
import { CustomLogger } from "../services/logger";

const logger = new CustomLogger("scoring", "service");

export const getConsumerScoring = async (userData: ScoringDto) => {
  logger.debug("getConsumerScoring");
  // Round the salary to the nearest integer because the scoring engine doesn't accept decimal values
  userData["salary"] = Math.floor(userData["salary"]);
  logger.debug(`userData ${JSON.stringify(userData)}`);
  try {
    const query = `query($body: ScoreInput!) {
      getMyloScore(body: $body) {
            creditLimit
            status
          }
        }`;
    logger.debug(`query: ${query}`);
    const response = await axios.post(
      config.scoringBaseURL,
      {
        query: query,
        variables: { body: userData },
      },
      {
        headers: {
          Authorization: `Bearer ${config.scoringToken}`,
        },
      },
    );
    logger.debug(`response: ${JSON.stringify(response.data)}`);

    return response.data.data.getMyloScore;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};
