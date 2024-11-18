from pydantic import BaseModel

class CreditScoreOutput(BaseModel):
    consumer_id: str
    ar_status: str
    calc_credit_limit: int  # Limit in cents
    pd_predictions: float
    income_predictions: int  # Income prediction in cents
    income_zone: str
    final_net_income: int  # Final net income in cents
    cwf_segment: str
    cwf: float

    class Config:
        json_schema_extra = {
            "example": {
                "consumer_id": "1010101010",
                "ar_status": "accept",
                "calc_credit_limit": 8000000,  # 80,000 pounds in cents
                "pd_predictions": 0.019,
                "income_predictions": 1359000,  # 13,590 pounds in cents
                "income_zone": 'net_income_inflated_zone',
                "final_net_income": 1100000,  # 11,000 pounds in cents
                "cwf_segment": 'Tier-2',
                "cwf": 5
            }
        }
