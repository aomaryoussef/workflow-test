import joblib
import pandas as pd
import numpy as np
from src.config.logging import logger
from config.settings import settings
from src.utils.decorators import log_method_call
from src.utils.ml_helpers import enforce_dtype_constraints, validate_categorical_values

logger = logger.bind(sservice="income_model", context="ml", action="Income Model")

model_name = settings.get("income_model", default={}).get("name")
model_version = settings.get("income_model", default={}).get("version")
model_params = settings.get("income_model", default={}).get("params")
model_path = settings.get("income_model", default={}).get("path")


class IncomeModel:
    def __init__(
            self,
            model_name: str = model_name,
            model_version: int = model_version,
            model_path: str = model_path
    ):
        """
        Initialize the IncomeModel.
        """
        self.model_name = model_name
        self.model_version = model_version
        self.model_path = model_path
        self._raw_model = self.load()
        self.model = self._raw_model['object']
        self.feats_names = self._raw_model['features_names']
        self.feats_dtypes = self._raw_model['features_dtypes']

        logger.debug(f"IncomeModel initialized", model_name=self.model_name, model_version=self.model_version)

    def load(self):
        return joblib.load(self.model_path)

    @log_method_call
    def predict(self, df: pd.DataFrame) -> int:

        df = df.copy()
        
        # categorical input validation
        validate_categorical_values(df, self.feats_dtypes, allow_nulls=True, exception_columns=['address_governorate',
                                                                                                    'address_city',
                                                                                                    'address_area',
                                                                                                    'job_name_map'])
        # match dtypes
        df = enforce_dtype_constraints(df, self.feats_dtypes)
        # inference
        df["income_predics"] = self.model.predict(df[self.feats_names])
        # inverse log transform
        df["income_predics"] = round(np.exp(df["income_predics"]) - 1, 1)

        # return predicted income
        return int(df["income_predics"].iloc[0])
