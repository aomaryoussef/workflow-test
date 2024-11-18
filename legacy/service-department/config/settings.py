import os

from dynaconf import Dynaconf

root_path = os.path.dirname(os.path.abspath(__file__))

settings = Dynaconf(
    envvar_prefix="OL_SD",
    settings_files=[
        "settings.toml",
        ".secrets.toml",
    ],
    root_path=root_path,
)
