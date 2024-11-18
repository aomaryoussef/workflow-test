from pydantic import BaseModel


class ErrorResponse(BaseModel):
    message: str
    error_code: str
    trace_id: str
    status: str = "failed"

    class Config:
        json_schema_extra = {
            "example": {
                "error_code": "bad_request",
                "details": "This is a bad request",
                "trace_id": "2a81b5ad-fc4e-4dba-b618-9b2f0d91802b",
                "status": "failed"
            }
        }
