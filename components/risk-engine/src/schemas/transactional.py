from pydantic import BaseModel, constr, Extra
from datetime import datetime


class TransactionalDataInput(BaseModel):
    customer_phone: constr(min_length=10, max_length=15)
    trx_date: datetime
    online_vs_branch: int
    sales_vs_returns: int
    net_sales: float
    net_qty: int

    class Config:
        extra = Extra.forbid  # This forbids extra fields
        json_schema_extra = {
            "example": {
                "transactions": [
                    {
                        "customer_phone": "01000000000",
                        "trx_date": "2022-03-05T00:00:00",
                        "online_vs_branch": 2,
                        "sales_vs_returns": 1,
                        "net_sales": 43.86,
                        "net_qty": 1
                    },
                    {
                        "customer_phone": "01000000000",
                        "trx_date": "2021-09-05T00:00:00",
                        "online_vs_branch": 2,
                        "sales_vs_returns": 1,
                        "net_sales": 276.32,
                        "net_qty": 1
                    }
                ]
            }
        }
