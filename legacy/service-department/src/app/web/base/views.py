from sanic.response import json
from sanic.response.types import JSONResponse
from src.services.logging import logger
from src.utils.exceptions import (
    NotFoundException,
    ResourceNotCreatedException,
    ResourceNotUpdatedException,
    ConflictException,
    FailedToProcessRequestException,
)


logger = logger.bind(service="base", context="views", action="setup")


class BaseViews:
    @staticmethod
    def show(output_dto) -> JSONResponse:
        return json(output_dto.to_dict(), status=200)

    @staticmethod
    def show_created(output_dto) -> JSONResponse:
        return json(output_dto.to_dict(), status=201)

    @staticmethod
    def error(error: Exception) -> JSONResponse:
        error_code = "999"
        error_message = str(error)
        error_status = 500

        if isinstance(error, NotFoundException):
            logger.error({"action": "error_resource_not_found", "error": error_message})
            error_code = "102"
            error_status = 404
        elif isinstance(error, ResourceNotCreatedException):
            logger.error({"action": "error_resource_not_created", "error": error_message})
            error_code = "103"
            error_status = 500
        elif isinstance(error, ResourceNotUpdatedException):
            logger.error({"action": "error_resource_not_created", "error": error_message})
            error_code = "104"
            error_status = 500
        elif isinstance(error, ConflictException):
            logger.error({"action": "error_conflict", "error": error_message})
            error_code = "105"
            error_status = 409
        elif isinstance(error, FailedToProcessRequestException):
            logger.error({"action": "unable_to_process_request", "error": error_message})
            error_code = "106"
            error_status = 503
        else:
            logger.error({"action": "error_generic", "error": error_message})
            error_code = "101"
            error_status = 400

        return json({"code": error_code, "message": error_message}, status=error_status)
