from dataclasses import dataclass
from src.domain.consumer.models.consumer import Consumer


@dataclass
class GetConsumerByIamIdOutputDto:
    consumer: Consumer

    def __init__(self, consumer: Consumer):
        self.consumer = consumer

    def to_dict(self):
        return {"id": str(self.consumer.id)}
