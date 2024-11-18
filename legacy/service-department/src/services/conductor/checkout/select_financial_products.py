from conductor.client.worker.worker_task import worker_task
from src.domain.checkout.use_cases.select_financial_products import SelectFinancialProductsUseCase, InputDto, OutputDto
from src.services.logging import logger
from config.settings import settings

logger = logger.bind(service="conductor", context="worker", action="select financial products")
polling_interval = settings.get("workflow", default={}).get("polling_interval")


@worker_task(task_definition_name="select_financial_products", poll_interval_millis=polling_interval * 1000)
def worker_task(partner: dict[str, str], checkout: dict[str, str]) -> dict:
    logger.debug(f"partner {partner}")
    input_dto = InputDto(partner=partner, checkout=checkout)
    use_case = SelectFinancialProductsUseCase(input_dto=input_dto)
    try:
        output_dto: OutputDto = use_case.execute()
        return output_dto.to_dict()
    except Exception as e:
        logger.exception("Error in select financial products use case")
        raise e
