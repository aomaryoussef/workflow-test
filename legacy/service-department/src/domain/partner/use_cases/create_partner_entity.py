import structlog
from src.domain.partner.dtos.create_partner_entity_dtos import InputDto, OutputDto
from src.domain.partner.dtos.validations.create_partner_entity_validator import CreatePartnerEntityInputDtoValidator
from src.domain.partner.repository.repository_partner_interface import PartnerRepositoryInterface
from src.utils.exceptions import ResourceNotCreatedException

logger = structlog.get_logger()
logger = logger.bind(service="partner", context="use case", action="create partner entity")


class CreatePartnerEntityUseCase:
    def __init__(self, partner_repository: PartnerRepositoryInterface, input_dto: InputDto):
        self.partner_repository = partner_repository
        self.input_dto = input_dto

    def execute(self) -> OutputDto:
        logger.debug("execute")
        validator = CreatePartnerEntityInputDtoValidator(self.input_dto.to_dict())
        validator.validate()

        try:
            partner = self.partner_repository.create(
                name=self.input_dto.name,
                categories=self.input_dto.categories,
                tax_registration_number=self.input_dto.tax_registration_number,
                commercial_registration_number=self.input_dto.commercial_registration_number,
            )
            if partner is None:
                raise ResourceNotCreatedException("Unable to create a partner")

            output_dto = OutputDto(partner=partner)
            return output_dto
        except Exception as e:
            raise ResourceNotCreatedException(f"Unable to create a partner, {e}")
