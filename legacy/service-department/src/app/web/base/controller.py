from typing import Dict
from src.services.logging import logger
from config.settings import settings

logger = logger.bind(service="base", context="controller", action="base controller")


class BaseController:
    """Base partner controller class."""

    def __init__(self, BaseDB) -> None:
        self.BaseDB = BaseDB

    def execute(self) -> Dict:
        """Executes the controller
        :returns: Dict
        """
        raise Exception("Not implemented")
