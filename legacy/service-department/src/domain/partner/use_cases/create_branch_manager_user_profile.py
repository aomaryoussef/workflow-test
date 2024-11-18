import structlog
import os

from src.domain.partner.dtos.create_partner_user_profile_dtos import InputDto, OutputDto
from src.domain.partner.dtos.validations.create_user_profile_validator import CreateUserProfileInputDtoValidator
from src.domain.partner.repository.repository_user_profile_interface import UserProfileRepositoryInterface
from src.domain.partner.models.user_profile import ProfileType
from src.utils.kratos import Kratos, KratosIdentitySchema
from src.utils.keto import Keto, KETO_CONSTANTS
from src.utils.notifications import Notifications
from src.utils.exceptions import ResourceNotCreatedException
from config.settings import settings
from src.utils.kratos import Kratos

logger = structlog.get_logger()
logger = logger.bind(
    service="partner", context="use case", action="create branch manager user profile"
)


class CreateBranchManagerUserProfileUseCase:
    """ "This class is responsible for initializing a branch_manager_user_profile."""

    def __init__(self, repository: UserProfileRepositoryInterface):
        self.repository = repository
        self.kratos = Kratos
        self.keto = Keto

    def execute(self, input_dto: InputDto) -> OutputDto:
        logger.debug("execute")
        validator = CreateUserProfileInputDtoValidator(input_dto.to_dict())
        validator.validate()

        # Create branch manager identity ORY
        iam_id = self.kratos.create_identity(
            kratos_schema=KratosIdentitySchema.EMAIL,
            identifier=input_dto.email,
        )
        if iam_id is None:
            logger.error("Unable to create a branch manager identity")
            raise Exception("Unable to create a branch manager identity")

        # Create partner admin permission
        if not self.keto.add_user_permission(
            group=input_dto.partner_id,
            user=iam_id,
            relation=KETO_CONSTANTS.BRANCHES_MANAGERS.value,
            namespace=KETO_CONSTANTS.PARTNER.value,
        ):
            logger.error("Unable to create a branch manager permission")
            raise Exception("Unable to create a branch manager permission")
        recovery_dict = self.kratos.create_recovery_code(str(iam_id))
        base_url = settings.get("BFF", default={}).get("base_url", default="")

        recovery_link = (
            f"{base_url}/public/partner/reset-password?"
            f"recovery_flow_id={recovery_dict.get('flow_id')}&"
            f"recovery_code={recovery_dict.get('recovery_code')}&"
        )
        template_path = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            "..",
            "..",
            "..",
            "..",
            "static",
            "templates",
            "partner",
            "reset_pass_template.html",
        )
        email_subject = "تغيير كلمة المرور"
        email_body = Notifications.render_template(
            template_path=template_path,
            name=input_dto.first_name,
            recovery_link=recovery_link,
        )
        Notifications.send_email(
            recipient=input_dto.email, subject=email_subject, body=email_body
        )

        try:
            user_profile = self.repository.create(
                iam_id=iam_id,
                partner_id=input_dto.partner_id,
                first_name=input_dto.first_name,
                last_name=input_dto.last_name,
                email=input_dto.email,
                phone_number=input_dto.phone_number,
                national_id=input_dto.national_id,
                profile_type=ProfileType.BRANCH_MANAGER,
                branch_id=input_dto.branch_id,
            )
            if user_profile is None:
                self.kratos.delete_identity(iam_id)
                logger.error("Unable to create a branch manager profile")
                raise Exception("Unable to create a branch manager profile")
        except Exception as exception:
            raise ResourceNotCreatedException(
                f"Unable to create a partner branch manager with error {exception}"
            )
        return OutputDto(user_profile=user_profile)
