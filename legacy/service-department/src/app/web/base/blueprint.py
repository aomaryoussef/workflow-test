from json import dumps, loads
from sanic.response import json, text
from sanic import Blueprint
from sanic_ext import openapi
from src.services.postgresql import is_db_alive
from config.settings import settings

base_blueprint = Blueprint("base")


@base_blueprint.get("/")
@openapi.summary("Root")
async def get_root(request):
    app_name = settings.get("app", default={}).get("name", default="mylo-service-department")
    return text(app_name)


@base_blueprint.get("/health")
@openapi.summary("Root")
async def get_health(request):
    return json(loads(dumps(request.app.m.workers, indent=4, sort_keys=True, default=str)))


@base_blueprint.get("/is-db-alive")
@openapi.summary("Is DB alive")
@openapi.response(200, {"application/json": {"alive": bool}})
@openapi.response(500, {"application/json": {"alive": bool}})
async def is_alive(_):
    connection = is_db_alive()
    if connection:
        return json({"alive": is_db_alive()}, status=200)
    else:
        return json({"alive": is_db_alive()}, status=500)


@base_blueprint.get("/version")
@openapi.summary("Get version")
@openapi.description("Get the application version (semantic)")
@openapi.response(200, {"application/json": str})
async def get_version(request):
    major_version = settings.get("app", default={}).get("version_major", default="0")
    minor_version = settings.get("app", default={}).get("version_minor", default="0")
    patch_version = settings.get("app", default={}).get("version_patch", default="0")
    version = major_version + "." + minor_version + "." + patch_version
    return json(version)
