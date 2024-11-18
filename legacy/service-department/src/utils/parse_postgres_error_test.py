from src.utils.parse_postgres_error import parse_error_message

import pytest


class TestParseErrorMessage:
    @pytest.mark.parametrize(
        "error_message, expected",
        [
            (
                'duplicate key value violates unique constraint "users_email_key"',
                ("email", "unique constraint violation"),
            ),
            (
                'null value in column "name" violates not-null constraint',
                ("name", "not-null constraint violation"),
            ),
            (
                "some unknown error message",
                (None, "unknown error"),
            ),
        ],
    )
    def test_parse_error_message(self, error_message, expected):
        result = parse_error_message(error_message)

        assert result == expected

    def test_parse_error_message_invalid_input(self):
        result = parse_error_message("invalid error message")

        assert result == (None, "unknown error")
