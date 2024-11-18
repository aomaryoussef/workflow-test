""" This module contains the interface for the UserProfileRepository
"""

from abc import ABC, abstractmethod
from typing import Optional

from src.domain.partner.models.user_profile import UserProfile

from uuid import UUID
from src.domain.partner.models.user_profile import ProfileType


class UserProfileRepositoryInterface(ABC):
    """This class is the interface for the UserProfileRepository"""

    @abstractmethod
    def get(self, id: UUID = None) -> UserProfile:
        """Get UserProfile by id

        :param id: Optional[UUID]
        :return: Optional[List[UserProfile]]
        """

    @abstractmethod
    def get_all(self) -> list[UserProfile]:
        """list all UserProfiles
        :return: list[UserProfile]
        """

    @abstractmethod
    def get_by_email(self, email: str) -> Optional[UserProfile]:
        """Get UserProfile by email

        :param email: str
        :return: Optional[UserProfile]
        """

    @abstractmethod
    def get_by_phone_number(self, phone_number: str) -> Optional[UserProfile]:
        """Get UserProfile by phone number

        :param phone_number: str
        :return: Optional[UserProfile]
        """

    @abstractmethod
    def get_by_iam_id(self, iam_id: str) -> Optional[UserProfile]:
        """Get UserProfile by email

        :param iam_id: str
        :return: Optional[UserProfile]
        """

    @abstractmethod
    def create(
        self,
        iam_id: UUID,
        partner_id: UUID,
        first_name: str,
        last_name: str,
        email: str,
        phone_number: str,
        national_id: str,
        profile_type: ProfileType,
        branch_id: Optional[UUID] = None,
    ) -> Optional[UserProfile]:
        """Create a UserProfile

        :return: UserProfile
        """

    @abstractmethod
    def delete(self, id: UUID) -> bool:
        """Delete a UserProfile by id

        :return: bool
        """
