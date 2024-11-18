from uuid import UUID
from dataclasses import dataclass, asdict
from src.utils.dict_factory import asdict_factory
from src.domain.consumer.dtos.base_dtos import BaseInputDto, BaseOutputDto
from src.domain.consumer.models.consumer import Consumer


@dataclass(frozen=True)
class InputDto(BaseInputDto):
    consumer_id: UUID
    credit_limit: int
    credit_officer_iam_id: str
    branch_name: str


@dataclass
class OutputDto(BaseOutputDto):
    consumer: Consumer

    def to_dict(self):
        result = asdict(self.consumer, dict_factory=asdict_factory)
        result["credit_limit"] = self.consumer.credit_limit.value
        return result
