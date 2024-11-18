from fastapi import Depends, FastAPI, Security
from config.settings import settings
from src.api.routers import models, health, scoring, lookup
from src.middlewares.auth import api_key_header, authenticate_request

MAJOR_VERSION = settings.get("app", default={}).get("version_major", default="0")
MINOR_VERSION = settings.get("app", default={}).get("version_minor", default="0")
PATCH_VERSION = settings.get("app", default={}).get("version_patch", default="0")

app = FastAPI(
    title=f'Risk Engine REST API v{MAJOR_VERSION}.{MINOR_VERSION}.{PATCH_VERSION}',
    description=f'This is the definition of **Risk Engine REST API** v{MAJOR_VERSION}.{MINOR_VERSION}.{PATCH_VERSION}'
                '\n\n Some useful information about **API** responses:'
                '\n\n All error responses are returned as **ErrorResponse**'
                '\n\n **Query** request: will always return **Pagination** as response'
                '\n\n **Get** request: will always return **ObjectResponse** as response.'
                '\n\n If any **error** occurs: will always return **ErrorResponse** as response. You can find out which is **Query** or **Get** in the Description of each Endpoint.'
                '\n\n Available Authentications:'
                '\n- **API-Key** (`api-key` in header) (development)'
                '\n- **Bearer JWT** (staging and production)"',
    termsOfService='https://myloapp.com/terms',
    contact={
        'name': 'mylo',
        'url': 'https://myloapp.com',
        'email': 'contact@myloapp.com',
    },
    license={'name': 'Under XXXX License, Terms and Conditions', 'url': 'https://myloapp.com'},
    version=f'{MAJOR_VERSION}.{MINOR_VERSION}.{PATCH_VERSION}',
    root_path='/api/risk',
    # docs_url='/api/risk/docs',
    # redoc_url='/api/risk/redoc',
    # openapi_url='/api/risk/openapi.json',
)

app.include_router(scoring.router, dependencies=[Security(api_key_header), Depends(authenticate_request)])
app.include_router(models.router, dependencies=[Security(api_key_header), Depends(authenticate_request)])
app.include_router(lookup.router, dependencies=[Security(api_key_header), Depends(authenticate_request)])
app.include_router(health.router)
