import pandas as pd
import numpy as np
from src.config.logging import logger
from config.settings import settings
from src.utils.data_helpers import convert_model_params_to_dict
from src.utils.decorators import log_method_call
from src.utils.ml_helpers import apply_final_income_rules

logger = logger.bind(service="calculation_center_model", context="ml", action="Calculation Center Model")

model_name = settings.get("calculation_center_model", default={}).get("name")
model_version = settings.get("calculation_center_model", default={}).get("version")
model_params = settings.get("calculation_center_model", default={}).get("params")


class CalculationCenterModel:
    def __init__(
            self,
            model_name: str = model_name,
            model_version: int = model_version,
            parameters: dict = None
    ):
        """
        Initialize the CalculationCenterModel.
        """
        self.model_name = model_name
        self.model_version = model_version
        # default parameters, read from settings.toml
        self.default_parameters = model_params

        self.parameters = parameters if parameters is not None else convert_model_params_to_dict(
            self.default_parameters)

        if not isinstance(self.parameters, dict):
            logger.error(f"parameters should be a dictionary, instead got: {type(self.parameters)}",
                         parameters=self.parameters)
            raise ValueError(f"Parameters should be a dictionary, instead got: {type(self.parameters)}")

        logger.debug(f"CalculationCenterModel initialized", model_name=self.model_name,
                     model_version=self.model_version, parameters=self.parameters)
    
    @log_method_call
    def get_pd_adjusted(self, pd_predics, min_cwf, legacy_cwf, legacy_pd_cwf_slope):
        pd_adjusted = ((min_cwf - legacy_cwf) * legacy_pd_cwf_slope) + pd_predics
        return pd_adjusted

    @log_method_call
    def get_pd_ar(self, pd_predics, pd_threshold):
        return np.where(pd_predics <= pd_threshold, 'accept', 'reject')
    
    @log_method_call
    def get_cwf_and_segment(self, pd_series, ar_series, pd_bins_to_cwf):
        """
        Determine the Tier and Creditworthiness Factor (CWF) for accepted customers.
        If the customer is rejected (based on ar_series), return 0 and 'Rejected'.
        Edge cases where PD is higher than max or lower than min are mapped to Tier-5 and Tier-1, respectively.

        Parameters:
        pd_series (pd.Series): Series containing the probability of default (PD) values.
        ar_series (pd.Series): Series indicating 'accept' or 'reject' for each customer.
        pd_bins_to_cwf (dict): Dictionary containing the PD bins, CWF mappings, and risk segments.

        Returns:
        pd.Series, pd.Series: Two Series - cwf and risk_segment.
        """
        # Initialize default values for rejection
        results = [{'cwf': 0, 'risk_segment': 'Rejected'} if ar.lower() == 'reject' else None 
                for ar in ar_series]

        # Map accepted customers
        for i, (pd_value, ar_flag) in enumerate(zip(pd_series, ar_series)):
            if results[i] is not None:  # Skip rejected cases
                continue

            # Edge case: PD is higher than the maximum bin
            if pd_value > pd_bins_to_cwf['pd_in'][0]:
                results[i] = {
                    'cwf': pd_bins_to_cwf['cwf_map'][0],
                    'risk_segment': pd_bins_to_cwf['risk_seg_map'][0]
                }
                continue

            # Edge case: PD is smaller than the minimum bin
            if pd_value < pd_bins_to_cwf['pd_in'][-1]:
                results[i] = {
                    'cwf': pd_bins_to_cwf['cwf_map'][-1],
                    'risk_segment': pd_bins_to_cwf['risk_seg_map'][-1]
                }
                continue

            # Accepted cases: Map to corresponding bin
            for j in range(len(pd_bins_to_cwf['pd_in']) - 1):
                if pd_bins_to_cwf['pd_in'][j + 1] < pd_value <= pd_bins_to_cwf['pd_in'][j]:
                    results[i] = {
                        'cwf': pd_bins_to_cwf['cwf_map'][j],
                        'risk_segment': pd_bins_to_cwf['risk_seg_map'][j]
                    }
                    break

        # Convert results to a DataFrame
        results_df = pd.DataFrame(results)

        # Return cwf and risk_segment as separate Series
        return results_df['cwf'], results_df['risk_segment']

    @log_method_call
    def get_final_net_income(self, final_income, burdens):
        final_net_income = final_income - burdens.fillna(0)
        return final_net_income

    @log_method_call
    def set_credit_limit(self, final_net_income: pd.Series, cwf: pd.Series) -> int:
        credit_limit = final_net_income.fillna(0) * cwf.fillna(0)
        rounded_credit_limit = round(credit_limit / 1000) * 1000
        rounded_credit_limit = rounded_credit_limit.astype(int)
        return rounded_credit_limit
    
    @log_method_call
    def apply_credit_limit_cap(self, credit_limit_series, pd_ar_series, min_cap, max_cap):
        """
        Apply a min-max cap to the credit limit for customers with pd_AR as 'accept'.

        Parameters:
        credit_limit_series (pd.Series): The Series containing credit limits.
        pd_ar_series (pd.Series): The Series containing pd_AR values.
        min_cap (float): The minimum cap value.
        max_cap (float): The maximum cap value.

        Returns:
        pd.Series: The Series with the modified credit limits for 'accept' customers.
        """
        # Ensure the Series have the same length
        if len(credit_limit_series) != len(pd_ar_series):
            raise ValueError("The length of credit_limit_series and pd_ar_series must be the same.")
        
        # Apply the min-max cap only for 'accept' customers
        capped_credit_limit = credit_limit_series.copy()
        capped_credit_limit[pd_ar_series == 'accept'] = capped_credit_limit[pd_ar_series == 'accept'].clip(lower=min_cap, upper=max_cap)
        
        return capped_credit_limit

    @log_method_call
    def calculate(self, df: pd.DataFrame) -> dict:

        # get adjusted PD
        df['pd_predics_adjusted'] = self.get_pd_adjusted(
                            pd_predics=df['pd_predics'],
                            min_cwf=min(self.parameters['PD_BINS_TO_CWF']['cwf_map']),
                            legacy_cwf=self.parameters['LEGACY_CWF'],
                            legacy_pd_cwf_slope=self.parameters['LEGACY_PD_CWF_SLOPE']
                            )
        
        # get accept and Reject
        df['pd_AR'] = self.get_pd_ar(
            df['pd_predics_adjusted'],
            pd_threshold=self.parameters['PD_AR_THRESHOLD']
        )
        # get income zones logics
        df['income_ratio'], df['final_income'], df['income_zone'], df['income_rule_applied'] = apply_final_income_rules(
            df=df,
            stated_income='net_income_inflated',
            predicted_income='income_predics',
            verlogic=df['scoring_scenario'][0],
            green_zone_threshold=self.parameters['GREEN_INCOME_ZONE_THRESHOLD'],
            red_zone_threshold=self.parameters['RED_INCOME_ZONE_THRESHOLD'],
            income_ratio_cap=self.parameters['FIN_TO_PRED_INCOME_CAP']
        )
        # get cwf and bins
        df['cwf'], df['cwf_segment'] = self.get_cwf_and_segment(
            pd_series=df['pd_predics'],
            ar_series=df['pd_AR'],
            pd_bins_to_cwf=self.parameters['PD_BINS_TO_CWF']
        )
        # get final net income
        df['final_net_income'] = self.get_final_net_income(
            final_income=df['final_income'],
            burdens=df[['OpenAccounts_InstallmentAmount_sum', 'net_burden_inflated']].sum(axis=1)
        )

        # set credit limit
        df['credit_limit'] = self.set_credit_limit(
            final_net_income=df['final_net_income'],
            cwf=df['cwf']
        )

        # set credit limit caps
        df['credit_limit'] = self.apply_credit_limit_cap(
            credit_limit_series=df['credit_limit'],
            pd_ar_series=df['pd_AR'],
            min_cap= self.parameters['CL_MIN_LIMIT'],
            max_cap= self.parameters['CL_MAX_LIMIT']
            ) 
        
        response = {
            'consumer_id': str(df.at[0, 'client_id']),
            'ar_status': str(df.at[0, 'pd_AR']),
            'calc_credit_limit': int(df.at[0, 'credit_limit']),
            'pd_predictions': float(round(df.at[0, 'pd_predics'], 3)),
            'income_predictions': int(df.at[0, 'income_predics']),
            'income_zone': str(df.at[0, 'income_zone']),
            'final_net_income': int(df.at[0, 'final_net_income']),
            'cwf_segment': str(df.at[0, 'cwf_segment']),
            'cwf': float(df.at[0, 'cwf']),
        }

        return response
