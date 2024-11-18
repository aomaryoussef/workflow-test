import structlog

from src.domain.partner.dtos.create_partner_user_profile_dtos import InputDto, OutputDto
from src.domain.partner.dtos.validations.create_user_profile_validator import CreateUserProfileInputDtoValidator
from src.domain.partner.repository.repository_user_profile_interface import UserProfileRepositoryInterface
from src.domain.partner.models.user_profile import ProfileType
from src.utils.kratos import Kratos, KratosIdentitySchema
from src.utils.keto import Keto, KETO_CONSTANTS
from src.utils.notifications import Notifications
from src.utils.exceptions import ResourceNotCreatedException
from config.settings import settings

logger = structlog.get_logger()
logger = logger.bind(service="partner", context="use case", action="create user profile")

cashier_welcome_sms = settings.get("sms_templates", default={}).get("cashier_onboarding_welcome", default="")
reset_password_link = settings.get("BFF", default={}).get("base_url", default="") + "/public/partner/forget-password"


class CreateCashierUserProfileUseCase:
    """ "This class is responsible for initializing a user_profile."""

    def __init__(self, repository: UserProfileRepositoryInterface):
        self.repository = repository
        self.kratos = Kratos
        self.keto = Keto

    def execute(self, input_dto: InputDto) -> OutputDto:
        logger.debug("execute")
        validator = CreateUserProfileInputDtoValidator(input_dto.to_dict())
        validator.validate()

        # Create Cashier identity ORY
        iam_id = self.kratos.create_identity(
            kratos_schema=KratosIdentitySchema.PHONE,
            identifier=input_dto.phone_number,
        )
        if iam_id is None:
            logger.error("Unable to create a cashier identity")
            raise Exception("Unable to create a cashier identity")

        # Create partner admin permission
        if not self.keto.add_user_permission(
            group=input_dto.partner_id,
            user=iam_id,
            relation=KETO_CONSTANTS.CASHIERS.value,
            namespace=KETO_CONSTANTS.PARTNER.value,
        ):
            logger.error("Unable to create a cashier permission")
            raise Exception("Unable to create a cashier permission")

        phone_number = (
            input_dto.phone_number if input_dto.phone_number.startswith("+2") else "+2" + input_dto.phone_number
        )

        Notifications.send_sms(template_id=cashier_welcome_sms, recipient=phone_number, link=reset_password_link)

        try:
            user_profile = self.repository.create(
                iam_id=iam_id,
                partner_id=input_dto.partner_id,
                first_name=input_dto.first_name,
                last_name=input_dto.last_name,
                email=input_dto.email,
                phone_number=input_dto.phone_number,
                national_id=input_dto.national_id,
                profile_type=ProfileType.CASHIER,
                branch_id=input_dto.branch_id,
            )
            if user_profile is None:
                self.kratos.delete_identity(iam_id)
                logger.error("Unable to create a cashier profile")
                raise Exception("Unable to create a cashier profile")
        except Exception as exception:
            raise ResourceNotCreatedException(f"Unable to create a partner cashier with error {exception}")
        return OutputDto(user_profile=user_profile)
