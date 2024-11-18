from sanic import Sanic
from sanic.config import Config
from src.app.web.base.blueprint import base_blueprint
from src.app.web.checkout.routes.checkout_baskets_blueprint import checkout_baskets_blueprint
from src.app.web.partner.routes.partners_blueprint import partners_blueprint
from src.app.web.consumer.routes.consumers_blueprint import consumers_blueprint
from src.app.web.partner.routes.users_blueprint import partner_users_blueprint
from src.app.web.registry.routes.registry_blueprint import registry_blueprint
from config.settings import settings

app_name = settings.get("app", default={}).get("name", default="mylo-service-department")
use_test_data = settings.get("app", default={}).get("use_test_data", default=False)


class WebAppConfig(Config):
    AUTO_RELOAD = use_test_data


app = Sanic(app_name, config=WebAppConfig(), inspector=use_test_data)

app.blueprint(base_blueprint)
app.blueprint(checkout_baskets_blueprint)
app.blueprint(partners_blueprint)
app.blueprint(consumers_blueprint)
app.blueprint(partner_users_blueprint)
app.blueprint(registry_blueprint)
