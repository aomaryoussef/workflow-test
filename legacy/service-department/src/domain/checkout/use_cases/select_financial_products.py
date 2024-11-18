import os
import zen
from src.services.logging import logger
from dataclasses import dataclass
from src.domain.checkout.dtos.base_dtos import BaseInputDto, BaseOutputDto

logger = logger.bind(service="checkout", context="use case", action="select financial products")


@dataclass(frozen=True)
class InputDto(BaseInputDto):
    partner: dict[str, str]
    checkout: dict[str, str]


@dataclass
class OutputDto(BaseOutputDto):
    products: list[dict[str, str]]


class SelectFinancialProductsUseCase:
    def __init__(self, input_dto: InputDto):
        self.input_dto = input_dto

    def execute(self) -> OutputDto:
        logger.debug("execute")

        rules = None
        file_path = os.path.join(
            os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", "..", "assets", "financial-product-rules.json"
        )
        with open(file_path, "r") as f:
            rules = f.read()

        engine = zen.ZenEngine()
        decision = engine.create_decision(rules)
        result = decision.evaluate(self.input_dto.to_dict())

        # Map the result to the products list
        products = [
            {"product_key": item["financialProduct"]["name"], "product_version": item["financialProduct"]["version"], "is_promo": False}
            for item in ((result.get("result"))["financialProducts"])
        ]

        promos = [
            {"product_key": item["financialProduct"]["name"], "product_version": item["financialProduct"]["version"], "is_promo": True}
            for item in ((result.get("result"))["promos"])
        ]

        if len(promos) > 0:
            output_dto: OutputDto = OutputDto(products=[promos[0]])
        else:
            output_dto: OutputDto = OutputDto(products=[products[0]])
        return output_dto
