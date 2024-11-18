from datetime import datetime
from config.settings import settings
from src.services.logging import logger
import sdk
from sdk.models import shared, operations
from src.utils.exceptions import ResourceNotCreatedException

formance_base_url = settings.get("formance", default={}).get("base_url", default="")
formance_require_login = settings.get("formance", default={}).get("require_login", default=False)
formance_client_id = settings.get("formance", default={}).get("client_id", default="")
formance_client_secret = settings.get("formance", default={}).get("client_secret", default="")
formance_connector_id = settings.get("formance", default={}).get("connector_id", default="")


logger = logger.bind(service="formance", context="setup", action="setup")


class Formance:
    @staticmethod
    def create_payment(
        amount: int, created_at: datetime, reference: str, destinationAccount: str, metadata: dict = None
    ):
        logger.debug(
            "create_payment with input amount=%s, created_at=%s, reference=%s, destinationAccount=%s, metadata=%s"
            % (amount, created_at, reference, destinationAccount, metadata)
        )
        try:
            # create formance client
            if formance_require_login:
                formance_client = sdk.SDK(
                    server_url=formance_base_url,
                    security=shared.Security(
                        client_id=formance_client_id,
                        client_secret=formance_client_secret,
                    ),
                )
            else:
                formance_client = sdk.SDK(server_url=formance_base_url)

            res = formance_client.payments.create_payment(
                request=shared.PaymentRequest(
                    amount=amount,
                    asset="EGP/2",
                    connector_id=formance_connector_id,
                    created_at=created_at,
                    reference=reference,
                    scheme=shared.PaymentScheme.OTHER,
                    status=shared.PaymentStatus.SUCCEEDED,
                    type=shared.PaymentType.PAY_IN,
                    destination_account_id=destinationAccount,
                )
            )

            if res.payment_response is not None:
                # update the metadata
                metadata_str = {k: str(v) for k, v in metadata.items()}
                formance_client.payments.update_metadata(
                    request=operations.UpdateMetadataRequest(
                        request_body=metadata_str,
                        payment_id=res.payment_response.data.id,
                    )
                )
                return res.payment_response.data
            else:
                raise ResourceNotCreatedException("Payment not created")
        except Exception as exception:
            logger.error("An error occurred: %s" % str(exception))
            raise ResourceNotCreatedException("Payment not created")
