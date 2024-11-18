from pydantic import BaseModel
from src.domain.partner.models.user_profile import UserProfileState


class UpdateUserProfileValidator(BaseModel):
    state: UserProfileState = UserProfileState.ACTIVE.value

    class Config:
        use_enum_values = True
