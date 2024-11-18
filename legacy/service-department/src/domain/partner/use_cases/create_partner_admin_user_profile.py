import structlog
from src.domain.partner.dtos.create_partner_admin_user_profile_dtos import InputDto, OutputDto
from src.domain.partner.dtos.validations.create_user_profile_validator import CreateUserProfileInputDtoValidator
from src.domain.partner.repository.repository_user_profile_interface import UserProfileRepositoryInterface
from src.domain.partner.models.user_profile import ProfileType
from src.utils.exceptions import ResourceNotCreatedException

logger = structlog.get_logger()
logger = logger.bind(service="partner", context="use case", action="create partner user profile")


class CreatePartnerAdminUserProfileUseCase:
    def __init__(self, repository: UserProfileRepositoryInterface, input_dto: InputDto):
        self.repository = repository
        self.input_dto = input_dto

    def execute(self) -> OutputDto:
        logger.debug("execute")
        validator = CreateUserProfileInputDtoValidator(self.input_dto.to_dict())
        validator.validate()

        try:
            user_profile = self.repository.create(
                iam_id=self.input_dto.iam_id,
                partner_id=self.input_dto.partner_id,
                first_name=self.input_dto.first_name,
                last_name=self.input_dto.last_name,
                email=self.input_dto.email,
                phone_number=self.input_dto.phone_number,
                national_id=self.input_dto.national_id,
                profile_type=ProfileType.ADMIN,
            )
            if user_profile is None:
                raise ResourceNotCreatedException("Unable to create a partner user")
        except Exception as exception:
            raise ResourceNotCreatedException(f"Unable to create a partner user with error {exception}")
        return OutputDto(user_profile=user_profile)
