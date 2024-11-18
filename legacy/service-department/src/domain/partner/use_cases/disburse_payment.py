import structlog
from src.domain.partner.dtos.disburse_payment_dtos import DisbursePaymentOutputDto
from src.services.workflow import Workflow

logger = structlog.get_logger()
logger = logger.bind(service="partner", context="use case", action="disburse payment")


class DisbursePaymentUseCase:
    def __init__(self, request_body: dict):
        self.request_body = request_body

    def execute(self) -> DisbursePaymentOutputDto:
        logger.debug("execute")
        workflow_id = Workflow.start_disbursement(incoming_request_body=self.request_body)
        output_dto = DisbursePaymentOutputDto(workflow_id=workflow_id)
        return output_dto
