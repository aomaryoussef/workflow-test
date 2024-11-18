import joblib
import pandas as pd
from src.config.logging import logger
from config.settings import settings
from src.utils.data_helpers import convert_model_params_to_dict
from src.utils.decorators import log_method_call
from src.utils.ml_helpers import enforce_dtype_constraints, apply_final_income_rules, validate_categorical_values

logger = logger.bind(service="pd_model", context="ml", action="PD Model")

model_name = settings.get("pd_model", default={}).get("name")
model_version = settings.get("model_version", default={}).get("version")
model_params = settings.get("pd_model", default={}).get("params")
model_path = settings.get("pd_model", default={}).get("path")


class PDModel:
    def __init__(
            self,
            model_name: str = model_name,
            model_version: int = model_version,
            model_path: str = model_path,
            parameters: dict = None
    ):
        """
        Initialize the PDModel.
        """
        self.model_name = model_name
        self.model_version = model_version
        self.model_path = model_path
        self._raw_model = self.load()
        self.model = self._raw_model['object']
        self.feats_names = self._raw_model['features_names']
        self.feats_dtypes = self._raw_model['features_dtypes']
        # default parameters, read from settings.toml
        self.default_parameters = model_params

        self.parameters = parameters if parameters is not None else convert_model_params_to_dict(
            self.default_parameters)

        if not isinstance(self.parameters, dict):
            logger.error(f"parameters should be a dictionary, instead got: {type(self.parameters)}",
                         parameters=self.parameters)
            raise ValueError(f"Parameters should be a dictionary, instead got: {type(self.parameters)}")

        logger.debug(f"PDModel initialized", model_name=self.model_name,
                     model_version=self.model_version, parameters=self.parameters)

    def load(self):
        return joblib.load(self.model_path)

    @log_method_call
    def predict(self, df: pd.DataFrame) -> float:
        df['final_income'] = apply_final_income_rules(
            df=df,
            stated_income='net_income_inflated',
            predicted_income='income_predics',
            verlogic=df['scoring_scenario'][0],
            green_zone_threshold=self.parameters['GREEN_INCOME_ZONE_THRESHOLD'],
            red_zone_threshold=self.parameters['RED_INCOME_ZONE_THRESHOLD'],
            income_ratio_cap=self.parameters['FIN_TO_PRED_INCOME_CAP']
        )[1]
        
        df = df.copy()
        # categorical input validation
        validate_categorical_values(df, self.feats_dtypes, allow_nulls=True, exception_columns=['address_governorate',
                                                                                                    'address_city',
                                                                                                    'address_area',
                                                                                                    'job_name_map'])
        # match dtypes
        df = enforce_dtype_constraints(df, self.feats_dtypes)
        # inference
        df['pd_predics'] = self.model.predict_proba(df[self.feats_names])[:, 1]
        # return probability of default
        return round(df['pd_predics'].iloc[0], 4)
