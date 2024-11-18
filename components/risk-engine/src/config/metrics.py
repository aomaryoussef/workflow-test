from prometheus_fastapi_instrumentator import Instrumentator


# TODO: max retries, timeout, etc
def setup_metrics(app):
    Instrumentator().instrument(app).expose(app, endpoint="/metrics")
