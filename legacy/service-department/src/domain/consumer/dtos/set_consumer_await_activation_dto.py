from dataclasses import dataclass
from uuid import UUID
from src.domain.checkout.dtos.base_dtos import BaseInputDto, BaseOutputDto

from src.domain.consumer.models.consumer import Consumer


@dataclass(frozen=True)
class InputDto(BaseInputDto):
    consumer_id: UUID
    credit_limit: int


@dataclass
class OutputDto(BaseOutputDto):
    consumer: Consumer

    def __init__(self, consumer: Consumer):
        self.consumer = consumer

    def to_dict(self):
        consumer_dict = self.consumer.to_dict()
        consumer_dict["credit_limit"] = self.consumer.credit_limit
        return consumer_dict
