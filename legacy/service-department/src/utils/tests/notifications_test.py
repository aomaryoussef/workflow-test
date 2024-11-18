import pytest
from src.utils.notifications import Notifications
from unittest.mock import patch


class TestNotifications:
    @pytest.fixture
    def mock_email_sender(self):
        with patch.object(Notifications, "send_email") as mock_send_email:
            yield mock_send_email

    def test_send_email(self, mock_email_sender):
        Notifications.send_email("test@example.com", "Test Subject", "Test Body")
        mock_email_sender.assert_called_once_with("test@example.com", "Test Subject", "Test Body")
