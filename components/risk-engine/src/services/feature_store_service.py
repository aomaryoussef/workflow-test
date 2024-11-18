import os
import time

import pandas as pd
from config.settings import settings
from sqlalchemy.orm import Session
from src.ml.models.feature_store_model import FeatureStoreModel
from src.models.run import RunStatusType
from src.repositories.model_repository import ModelRepository
from src.repositories.run_repository import RunRepository
from src.services.base_model_service import BaseModelService
from src.utils.decorators import log_method_call

model_name = settings.get("feature_store_model", default={}).get("name")
model_version = settings.get("feature_store_model", default={}).get("version")


class FeatureStoreService(BaseModelService):

    def __init__(self, session: Session = None, **kwargs):
        super().__init__(session, [ModelRepository, RunRepository], **kwargs)

    @log_method_call
    def execute(self, application_data: dict) -> pd.DataFrame:
        model = self.get_model(model_name, model_version)

        start_time = time.time()
        res: pd.DataFrame or None = None
        error = None
        try:
            cust_attrib_df = pd.DataFrame(application_data, index=[0])
            # cust_trx_df = pd.DataFrame(transactional_data)

            ssn_gov_file = os.getenv(
                "SSN_governorate_PATH",
                "resources/data/20240527_ssn_governorate_mapping.xlsx",
            )
            ssn_gov_map_df_ = pd.read_excel(ssn_gov_file, sheet_name="main_translated")
            run_type = "bullet_test"

            res = FeatureStoreModel().process(
                cust_attrib_df=cust_attrib_df,
                # cust_trx_df=cust_trx_df,
                ssn_gov_map_df=ssn_gov_map_df_,
                run_type=run_type,
            )
            status = RunStatusType.SUCCESS
        except Exception as err:
            status = RunStatusType.FAILED
            error = err

        duration = int((time.time() - start_time) * 1000)

        self.log_run(
            model_id=model.id,
            input_data=application_data,
            output_data=res,
            duration=duration,
            status=status,
            error=error,
        )

        return res
