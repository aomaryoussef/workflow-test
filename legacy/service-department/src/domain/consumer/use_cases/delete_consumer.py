import structlog
from src.domain.consumer.repository.repository_interface import ConsumerRepositoryInterface

logger = structlog.get_logger()


class DeleteConsumerUseCase:
    def __init__(self, repo: ConsumerRepositoryInterface, phone_number: str):
        self.repo = repo
        self.phone_number = phone_number

    def execute(self) -> bool:
        try:
            consumer = self.repo.get_by_phone_number(self.phone_number)
            deleted = self.repo.delete(consumer)
            return deleted
        except Exception as e:
            logger.error("Error deleting consumer: {}".format(str(e)))
            return False
