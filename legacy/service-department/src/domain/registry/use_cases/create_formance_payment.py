from datetime import datetime
from src.services.logging import logger
from src.services.formance import Formance
from dataclasses import dataclass
from src.domain.registry.dtos.base_dtos import BaseInputDto, BaseOutputDto
from config.settings import settings

fawry_account_id = settings.get("formance", default={}).get("fawry_account_id", default="")

logger = logger.bind(service="registry", context="use case", action="create formance payment")


@dataclass(frozen=True)
class InputDto(BaseInputDto):
    payment_channel: str
    amount: int
    created_at: datetime
    reference: str
    metadata: dict = None


@dataclass
class OutputDto(BaseOutputDto):
    id: str


class CreateFormancePaymentUseCase:
    def __init__(self, input_dto: InputDto):
        self.input_dto = input_dto

    def execute(self) -> OutputDto:
        logger.debug("execute")
        # check if payment channel is equal to FAWRY then the destination account should be the FAWRY account id
        if self.input_dto.payment_channel == "FAWRY":
            destination_account = fawry_account_id
        else:
            destination_account = None
        result = Formance.create_payment(
            amount=self.input_dto.amount,
            created_at=self.input_dto.created_at,
            reference=self.input_dto.reference,
            destinationAccount=destination_account,
            metadata=self.input_dto.metadata,
        )
        output_dto = OutputDto(id=result.id)
        return output_dto
