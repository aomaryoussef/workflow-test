#!/usr/bin/python
import sys
from src.app.web.server import app
from src.services.logging import logger
from config.settings import settings

logger = logger.bind(service="web", context="app", action="launch web server")
debug = settings.get("log", default={}).get("level", default="INFO") == "DEBUG"
use_test_data = settings.get("app", default={}).get("use_test_data", default=False)


def __check_python_version():
    supported_python = sys.version_info.major >= 3 and sys.version_info.minor >= 10
    if not supported_python:
        print("unsupported python version, minimum requirements Python 3.10.x")
        logger.critical("unsupported pythoasdasdsn version, minimum requirements Python 3.10.x")
        sys.exit(0)


if __name__ == "__main__":
    __check_python_version()
    try:
        app.run(host="0.0.0.0", port=1337, debug=debug, access_log=debug, dev=use_test_data, fast=not use_test_data)
    except Exception as e:
        logger.critical("Unable to start web server %s" % str(e))
