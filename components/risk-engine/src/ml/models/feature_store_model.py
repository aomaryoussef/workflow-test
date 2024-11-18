import json
import re
from datetime import datetime

import numpy as np
import pandas as pd
# import pyspark.sql.functions as F
from config.settings import settings
# from pyspark.sql.types import DateType
from src.config.logging import logger
from src.utils.decorators import log_method_call
import ast

logger = logger.bind(
    service="feature_store_model", context="ml", action="Feature Store Model"
)

model_name = settings.get("feature_store_model", default={}).get("name")
model_version = settings.get("feature_store_model", default={}).get("version")


class FeatureStoreModel:
    def __init__(
        self,
        model_name: str = model_name,
        model_version: int = model_version,
    ):
        # TODO: quick fix for current date .. ideally it should be part of the request 
        self.data_date = datetime.now().strftime('%Y%m%d')
        self.model_name = model_name
        self.model_version = model_version

        logger.debug(
            f"FeatureStoreModel initialized",
            model_name=self.model_name,
            model_version=self.model_version,
        )

    @log_method_call
    def select_relevant_iscore_columns(self, df):
        return df[['client_id','is_iscore', 'iscore_score', 'iscore_report']]

    @log_method_call
    def update_no_hit_consumers(self, df):
        no_hit_mask = df['iscore_report'].str.contains('iScoreNohitConsumer') | df['iscore_report'].str.contains('Response NoHit')
        df.loc[no_hit_mask, 'is_iscore'] = 0
        df = df[df['is_iscore'] == 1]
        return df

    @log_method_call
    def update_iscore_report_format(self, df):
        data_packet_mask = df['iscore_report'].str.contains('<DATAPACKET>')
        df['is_iscore_new_format'] = (~data_packet_mask).astype('int16')
        iscore_nohit_mask = df['is_iscore'] == 0
        df.loc[iscore_nohit_mask, 'is_iscore_new_format'] = np.nan
        return df

    @log_method_call
    def process_open_accounts_old_format(self, df):
        @log_method_call
        def extract_open_accounts_old(report):
            try:
                CONSUMER_CREDIT_FACILITY = report.split('CONSUMER_CREDIT_FACILITY')[1]
            except IndexError:
                return pd.Series({
                    'OpenAccounts_count_old': 0,
                    'OpenAccounts_ApprovalAmount_sum_old': 0,
                    'OpenAccounts_BalanceAmount_sum_old': 0,
                    'OpenAccounts_InstallmentAmount_sum_old': 0,
                    'OpenAccounts_MaxDaysDue_sum_old': 0,
                }, dtype='float64')

            def extract_sum(pattern, data):
                matches = re.findall(pattern, data)
                return sum(int(x) for x in matches if x.isdigit()) if matches else 0

            OpenAccounts_count_old = len(re.findall(r'CREDIT_DETAILS ID', CONSUMER_CREDIT_FACILITY))
            OpenAccounts_ApprovalAmount_sum_old = extract_sum(r'<APPROVAL_AMOUNT>(.*?)</APPROVAL_AMOUNT>', CONSUMER_CREDIT_FACILITY)
            OpenAccounts_BalanceAmount_sum_old = extract_sum(r'<CURRENT_BALANCE>(.*?)</CURRENT_BALANCE>', CONSUMER_CREDIT_FACILITY)
            OpenAccounts_InstallmentAmount_sum_old = extract_sum(r'<AMT_OF_INSTALMENT>(.*?)</AMT_OF_INSTALMENT>', CONSUMER_CREDIT_FACILITY)
            OpenAccounts_MaxDaysDue_sum_old = extract_sum(r'<MAX_NUM_DAYS_DUE>(.*?)</MAX_NUM_DAYS_DUE>', CONSUMER_CREDIT_FACILITY)

            return pd.Series({
                'OpenAccounts_count_old': float(OpenAccounts_count_old),
                'OpenAccounts_ApprovalAmount_sum_old': float(OpenAccounts_ApprovalAmount_sum_old),
                'OpenAccounts_BalanceAmount_sum_old': float(OpenAccounts_BalanceAmount_sum_old),
                'OpenAccounts_InstallmentAmount_sum_old': float(OpenAccounts_InstallmentAmount_sum_old),
                'OpenAccounts_MaxDaysDue_sum_old': float(OpenAccounts_MaxDaysDue_sum_old),
            })

        columns = [
            'OpenAccounts_count_old',
            'OpenAccounts_ApprovalAmount_sum_old',
            'OpenAccounts_BalanceAmount_sum_old',
            'OpenAccounts_InstallmentAmount_sum_old',
            'OpenAccounts_MaxDaysDue_sum_old'
        ]
        for col in columns:
            df[col] = np.nan

        mask = (df['is_iscore'] == 1) & (df['is_iscore_new_format'] == 0)
        df.loc[mask, columns] = df.loc[mask, 'iscore_report'].apply(extract_open_accounts_old)
        df[columns] = df[columns].fillna(0).astype('int64')

        return df

    @log_method_call
    def process_closed_accounts_old_format(self, df):
        @log_method_call
        def extract_closed_accounts_old(report):
            parts = report.split('CONSUMER_CLOSED_ACCOUNT')
            if len(parts) == 3:
                CONSUMER_CLOSED_ACCOUNT = parts[1]
            else:
                return pd.Series({
                    'ClosedAccounts_count_old': 0,
                    'ClosedAccounts_ApprovalAmount_sum_old': 0,
                    'ClosedAccounts_InstallmentAmount_sum_old': 0,
                    'ClosedAccounts_MaxDaysDue_sum_old': 0,
                }, dtype='float64')

            def extract_sum(pattern, data):
                matches = re.findall(pattern, data)
                return sum(int(x) for x in matches if x.isdigit()) if matches else 0

            ClosedAccounts_count_old = len(re.findall(r'CLOSED_ACCOUNTS ID', CONSUMER_CLOSED_ACCOUNT))
            ClosedAccounts_ApprovalAmount_sum_old = extract_sum(r'<APPROVAL_AMOUNT>(.*?)</APPROVAL_AMOUNT>', CONSUMER_CLOSED_ACCOUNT)
            ClosedAccounts_InstallmentAmount_sum_old = extract_sum(r'<AMT_OF_INSTALMENT>(.*?)</AMT_OF_INSTALMENT>', CONSUMER_CLOSED_ACCOUNT)
            ClosedAccounts_MaxDaysDue_sum_old = extract_sum(r'<MAX_NUM_DAYS_DUE>(.*?)</MAX_NUM_DAYS_DUE>', CONSUMER_CLOSED_ACCOUNT)

            return pd.Series({
                'ClosedAccounts_count_old': float(ClosedAccounts_count_old),
                'ClosedAccounts_ApprovalAmount_sum_old': float(ClosedAccounts_ApprovalAmount_sum_old),
                'ClosedAccounts_InstallmentAmount_sum_old': float(ClosedAccounts_InstallmentAmount_sum_old),
                'ClosedAccounts_MaxDaysDue_sum_old': float(ClosedAccounts_MaxDaysDue_sum_old),
            })

        columns = [
            'ClosedAccounts_count_old',
            'ClosedAccounts_ApprovalAmount_sum_old',
            'ClosedAccounts_InstallmentAmount_sum_old',
            'ClosedAccounts_MaxDaysDue_sum_old'
        ]
        for col in columns:
            df[col] = np.nan

        mask = (df['is_iscore'] == 1) & (df['is_iscore_new_format'] == 0)
        df.loc[mask, columns] = df.loc[mask, 'iscore_report'].apply(extract_closed_accounts_old)
        df[columns] = df[columns].fillna(0).astype('int64')

        return df

    @log_method_call
    def process_open_accounts_new_format(self, df):
        @log_method_call
        def extract_open_accounts_new(report):  
            # Try to load JSON data, fallback to raw report on failure
            try:  
                report = json.loads(report)
            except json.JSONDecodeError:
                return pd.Series({
                    'OpenAccounts_count_new': 0,
                    'OpenAccounts_ApprovalAmount_sum_new': 0,
                    'OpenAccounts_BalanceAmount_sum_new': 0,
                    'OpenAccounts_InstallmentAmount_sum_new': 0,
                    'OpenAccounts_MaxDaysDue_sum_new': 0,
                }, dtype='float64')

            # Initialize variables
            CreditFacilities = []
            OpenAccount = []

            # Extract CreditFacilities from the report
            if isinstance(report, list):
                for module in report:
                    if isinstance(module, dict) and module.get('ModuleId') == 'iScoreCreditProfileOverviewConsumer':
                        content = module.get('Content', {})
                        data = content.get('DATA', [{}])
                        CreditFacilities = data[0].get('CreditFacilities', [])
                        OpenAccount = data[0].get('OpenAccount', [])

            # Define helper function for parsing integers
            def try_parse_int(s):
                try:
                    return int(s)
                except ValueError:
                    return 0

            # Calculate results
            result = {
                'OpenAccounts_count_new': sum(try_parse_int(x.get('NoOfAccounts', 0)) for x in CreditFacilities),
                'OpenAccounts_ApprovalAmount_sum_new': sum(try_parse_int(x.get('TotalApprovalAmt', 0)) for x in CreditFacilities),
                'OpenAccounts_BalanceAmount_sum_new': sum(try_parse_int(x.get('TotalBalanceAmount', 0)) for x in CreditFacilities),
                'OpenAccounts_InstallmentAmount_sum_new': sum(try_parse_int(x.get('TotalMonthlyInstallmentAmt', 0)) for x in CreditFacilities),
                'OpenAccounts_MaxDaysDue_sum_new': sum(try_parse_int(x.get('MAX_NUM_DAYS_DUE', 0)) for x in OpenAccount) if OpenAccount else 0,
            }
            
            return pd.Series(result)

        # Define columns
        columns = [
            'OpenAccounts_count_new',
            'OpenAccounts_ApprovalAmount_sum_new',
            'OpenAccounts_BalanceAmount_sum_new',
            'OpenAccounts_InstallmentAmount_sum_new',
            'OpenAccounts_MaxDaysDue_sum_new'
        ]

        # Initialize columns with NaN values
        for col in columns:
            df[col] = np.nan

        # Apply extraction logic
        mask = (df['is_iscore'] == 1) & (df['is_iscore_new_format'] == 1)
        result = df.loc[mask, 'iscore_report'].apply(extract_open_accounts_new)
        result_df = pd.DataFrame(result, index=df.loc[mask].index)
        
        # Update the DataFrame with results
        df.loc[mask, columns] = result_df.fillna(0).astype('int64')

        # Fill NaN values for all rows in the specified columns
        df[columns] = df[columns].fillna(0).astype('int64')

        return df

    @log_method_call
    def process_closed_accounts_new_format(self, df):
        @log_method_call
        def extract_closed_accounts_new(report):
            # Try to load JSON data, fallback to raw report on failure
            try:  
                report = json.loads(report)
            except json.JSONDecodeError:
                return pd.Series({
                    'ClosedAccounts_count_new': 0,
                    'ClosedAccounts_ApprovalAmount_sum_new': 0,
                    'ClosedAccounts_InstallmentAmount_sum_new': 0,
                    'ClosedAccounts_MaxDaysDue_sum_new': 0,
                }, dtype='float64')

            # Initialize variables
            ClosedAccountDetails = []

            # Extract ClosedAccountDetails from the report
            if isinstance(report, list):
                for module in report:
                    if isinstance(module, dict) and module.get('ModuleId') == 'iScoreClosedFacilitiesConsumer':
                        content = module.get('Content', {})
                        data = content.get('DATA', [{}])
                        ClosedAccountDetails = data[0].get('ClosedAccountDetails', [])

            # Define helper function for parsing integers
            def try_parse_int(s):
                try:
                    return int(s)
                except ValueError:
                    return 0

            # Calculate results
            if ClosedAccountDetails:
                result = {
                    'ClosedAccounts_count_new': len(ClosedAccountDetails),
                    'ClosedAccounts_ApprovalAmount_sum_new': sum(try_parse_int(x.get('SANCTION_AMT', 0)) for x in ClosedAccountDetails),
                    'ClosedAccounts_InstallmentAmount_sum_new': sum(try_parse_int(x.get('AMT_OF_INSTALMENT', 0)) for x in ClosedAccountDetails if x.get('AMT_OF_INSTALMENT')),
                    'ClosedAccounts_MaxDaysDue_sum_new': sum(try_parse_int(x.get('MAX_NUM_DAYS_DUE', 0)) for x in ClosedAccountDetails)
                }
            else:
                result = {
                    'ClosedAccounts_count_new': 0,
                    'ClosedAccounts_ApprovalAmount_sum_new': 0,
                    'ClosedAccounts_InstallmentAmount_sum_new': 0,
                    'ClosedAccounts_MaxDaysDue_sum_new': 0
                }
            
            return pd.Series(result)

        # Define columns
        columns = [
            'ClosedAccounts_count_new',
            'ClosedAccounts_ApprovalAmount_sum_new',
            'ClosedAccounts_InstallmentAmount_sum_new',
            'ClosedAccounts_MaxDaysDue_sum_new'
        ]

        # Initialize columns with NaN values
        for col in columns:
            df[col] = np.nan

        # Apply extraction logic
        mask = (df['is_iscore'] == 1) & (df['is_iscore_new_format'] == 1)
        result = df.loc[mask, 'iscore_report'].apply(extract_closed_accounts_new)
        result_df = pd.DataFrame(result, index=df.loc[mask].index)

        # Update the DataFrame with results
        df.loc[mask, columns] = result_df.fillna(0).astype('int64')

        # Fill NaN values for all rows in the specified columns
        df[columns] = df[columns].fillna(0).astype('int64')

        return df

    @log_method_call
    def combine_old_and_new_formats(self, df):
        df = df.copy()
        
        # Define the column mappings for open and closed accounts
        open_accounts_old = {
            'OpenAccounts_count': 'OpenAccounts_count_old',
            'OpenAccounts_ApprovalAmount_sum': 'OpenAccounts_ApprovalAmount_sum_old',
            'OpenAccounts_BalanceAmount_sum': 'OpenAccounts_BalanceAmount_sum_old',
            'OpenAccounts_InstallmentAmount_sum': 'OpenAccounts_InstallmentAmount_sum_old',
            'OpenAccounts_MaxDaysDue_sum': 'OpenAccounts_MaxDaysDue_sum_old'
        }
        
        open_accounts_new = {
            'OpenAccounts_count': 'OpenAccounts_count_new',
            'OpenAccounts_ApprovalAmount_sum': 'OpenAccounts_ApprovalAmount_sum_new',
            'OpenAccounts_BalanceAmount_sum': 'OpenAccounts_BalanceAmount_sum_new',
            'OpenAccounts_InstallmentAmount_sum': 'OpenAccounts_InstallmentAmount_sum_new',
            'OpenAccounts_MaxDaysDue_sum': 'OpenAccounts_MaxDaysDue_sum_new'
        }
        
        closed_accounts_old = {
            'ClosedAccounts_count': 'ClosedAccounts_count_old',
            'ClosedAccounts_ApprovalAmount_sum': 'ClosedAccounts_ApprovalAmount_sum_old',
            'ClosedAccounts_InstallmentAmount_sum': 'ClosedAccounts_InstallmentAmount_sum_old',
            'ClosedAccounts_MaxDaysDue_sum': 'ClosedAccounts_MaxDaysDue_sum_old'
        }
        
        closed_accounts_new = {
            'ClosedAccounts_count': 'ClosedAccounts_count_new',
            'ClosedAccounts_ApprovalAmount_sum': 'ClosedAccounts_ApprovalAmount_sum_new',
            'ClosedAccounts_InstallmentAmount_sum': 'ClosedAccounts_InstallmentAmount_sum_new',
            'ClosedAccounts_MaxDaysDue_sum': 'ClosedAccounts_MaxDaysDue_sum_new'
        }

        # Fill NaN values with 0
        df = df.fillna(0)

        # Combine old and new format columns
        for combined_col, old_col in open_accounts_old.items():
            new_col = open_accounts_new[combined_col]
            df[combined_col] = df[old_col] + df.get(new_col, 0)

        for combined_col, old_col in closed_accounts_old.items():
            new_col = closed_accounts_new[combined_col]
            df[combined_col] = df[old_col] + df.get(new_col, 0)
        
        # Drop old and new format columns
        old_new_columns = [col for col in df.columns if 'old' in col or 'new' in col]
        df = df.drop(columns=old_new_columns)
        
        return df

    @log_method_call
    def new_report_to_json(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Transform the 'iscore_report' column for rows where 'is_iscore_new_format' == 1.
        Converts valid string representations of dictionaries to JSON-like strings.

        Parameters:
        df (pd.DataFrame): Input DataFrame with 'iscore_report' and 'is_iscore_new_format' columns.

        Returns:
        pd.DataFrame: Transformed DataFrame with updated 'iscore_report' where applicable.
        """

        def parse_and_convert_to_json(report):
            """Parse the report using ast and convert it to a JSON-like string."""
            try:
                parsed_data = ast.literal_eval(report)
                return json.dumps(parsed_data, ensure_ascii=False)
            except (ValueError, SyntaxError) as e:
                # print(f"Error parsing report: {e}")
                return report  # Handle errors gracefully

        # Apply the transformation only to rows where 'is_iscore_new_format' == 1
        df.loc[df['is_iscore_new_format'] == 1, 'iscore_report'] = (
            df.loc[df['is_iscore_new_format'] == 1, 'iscore_report']
            .apply(parse_and_convert_to_json)
        )
        
        return df 

    @log_method_call
    def process_iscore(self, df, full_df=False):
        # This is v0.1 of the process_iscore function
        # A lot of other attriburtes can be extracted
        # Preserve original DataFrame without specific columns
        df_org = df.drop(columns=["is_iscore", "iscore_score", "iscore_report"])
        df = df[df["is_iscore"] == 1]
        df = self.select_relevant_iscore_columns(df)
        df = self.update_no_hit_consumers(df)
        df = self.update_iscore_report_format(df)
        df = self.new_report_to_json(df)
        df = self.process_open_accounts_old_format(df)
        df = self.process_closed_accounts_old_format(df)
        df = self.process_open_accounts_new_format(df)
        df = self.process_closed_accounts_new_format(df)
        df = self.combine_old_and_new_formats(df)

        # Fill missing values and drop unnecessary columns
        df = df.fillna(0)
        df = df.drop(columns=['iscore_report'], errors='ignore')  # to handle cases where the column may not exist
        
        # Merge with the original DataFrame if full_df is True
        if full_df:
            df_final = df_org.merge(df, on='client_id', how='left')
            df_final['is_iscore'] = df_final['is_iscore'].fillna(0)
        else:
            df_final = df
        
        return df_final

    @log_method_call
    def adjust_ssn(self, df):
        df["ssn"] = df["ssn"].str[-14:]
        return df

    @log_method_call
    def calculate_age(self, df, data_date):
        df["ssn_century_birth"] = df["ssn"].str[0]
        df["ssn_date_birth"] = df["ssn"].str[1:7]
        df["ssn_date_birth"] = np.where(
            df["ssn_century_birth"] == "3",
            "20" + df["ssn_date_birth"],
            "19" + df["ssn_date_birth"],
        )
        data_date = datetime.strptime(data_date, "%Y%m%d")
        df["ssn_date_birth"] = pd.to_datetime(df["ssn_date_birth"], errors="coerce")
        df["contract_date"] = pd.to_datetime(df["contract_date"])
        df["age_at_contract"] = (
            df["contract_date"].dt.year - df["ssn_date_birth"].dt.year
        )
        df["age_at_data_date"] = data_date.year - df["ssn_date_birth"].dt.year
        return df

    @log_method_call
    def map_governorate(self, df, df2):
        df["ssn_governorate_code"] = df["ssn"].str[7:9]
        df["ssn_governorate_code"] = df["ssn_governorate_code"].astype(int)
        df = df.merge(df2, how="left", on="ssn_governorate_code")
        return df

    @log_method_call
    def determine_gender(self, df):
        df["ssn_gender_code"] = df["ssn"].str[12]
        df["ssn_gender"] = np.where(
            df["ssn_gender_code"].astype(int) % 2 == 0, "female", "male"
        )
        df["ssn_gender"] = df["ssn_gender"].map({"male": 1, "female": 0})
        df = df.rename(columns={"ssn_gender": "ssn_is_male"})
        return df

    @log_method_call
    def process_ssn_data(self, df, ssn_gov_map_df, data_date):
        df = df[["client_id", "ssn", "contract_date"]].copy()
        df = self.adjust_ssn(df)
        df = self.calculate_age(df, data_date)
        df = self.map_governorate(df, ssn_gov_map_df)
        df = self.determine_gender(df)
        df = df[["client_id", "ssn_is_male", "ssn_governorate", "age_at_contract"]]
        return df

    @log_method_call
    def stnd_missing_values_type(self, df):
        """
        Standardizes missing values in a DataFrame by converting them to NaN.

        Parameters:
        df (pd.DataFrame): The input DataFrame to process.

        Returns:
        pd.DataFrame: A DataFrame with standardized missing values.
        """
        orig_dtypes = df.dtypes
        df = df.convert_dtypes()

        for col in df.columns:
            if df[col].dtype.kind in "biufc":
                df[col] = df[col].replace(
                    [np.inf, -np.inf, "None", "<NA>", np.nan], np.nan
                )
            elif df[col].dtype.kind in "O":
                df[col] = df[col].replace(
                    ["", " ", "NULL", "NaN", "None", "<NA>", np.nan], np.nan
                )
            elif df[col].dtype.kind in "M":
                df[col] = df[col].replace([pd.NaT, "None", "<NA>", np.nan], pd.NaT)

        for col in df.columns:
            df[col] = df[col].astype(orig_dtypes[col])

        return df

    @log_method_call
    def adjust_date_range(self, df, column, df_engine="pandas"):
        """Adjusts the date range of a given column in a DataFrame."""
        if df_engine == "spark":
            # df = df.withColumn(
            #     column,
            #     F.when(
            #         F.year(df[column]) < 1970, F.lit("1970-01-01").cast(DateType())
            #     ).otherwise(df[column]),
            # )
            # df = df.withColumn(
            #     column,
            #     F.when(
            #         F.year(df[column]) > 2038, F.lit("2038-12-31").cast(DateType())
            #     ).otherwise(df[column]),
            # )
            pass
        elif df_engine == "pandas":
            df[column] = pd.to_datetime(df[column])
            df.loc[df[column].dt.year < 1970, column] = pd.Timestamp("1970-01-01")
            df.loc[df[column].dt.year > 2038, column] = pd.Timestamp("2038-12-31")
        return df

    @log_method_call
    def filter_transactions(self, df, df_cust, df_engine="pandas"):
        """Filters out past transactions based on customer data."""
        if df_engine == "spark":
            # df_cust_1 = df_cust.selectExpr(
            #     "client_id as client_id_1",
            #     "phone_number_1 as phone",
            #     "contract_date as contract_date_1",
            # ).dropna(subset=["phone"])
            # df_cust_2 = df_cust.selectExpr(
            #     "client_id as client_id_2",
            #     "phone_number_2 as phone",
            #     "contract_date as contract_date_2",
            # ).dropna(subset=["phone"])

            # df = df.join(
            #     F.broadcast(df_cust_1), df.customer_phone == df_cust_1.phone, how="left"
            # )
            # df = df.join(
            #     F.broadcast(df_cust_2), df.customer_phone == df_cust_2.phone, how="left"
            # )

            # df = df.withColumn("client_id", F.coalesce(df.client_id_1, df.client_id_2))
            # df = df.drop("client_id_1", "client_id_2")

            # df = df.withColumn(
            #     "contract_date", F.coalesce(df.contract_date_1, df.contract_date_2)
            # )

            # # Check if 'phone' column exists before dropping
            # if "phone" in df.columns:
            #     df = df.drop("contract_date_1", "contract_date_2", "phone")
            # else:
            #     df = df.drop("contract_date_1", "contract_date_2")

            # df = df.withColumn("trx_date", df["trx_date"].cast(DateType()))
            # df = df.withColumn("contract_date", df["contract_date"].cast(DateType()))

            # df = df.filter(df.trx_date < df.contract_date)
            # df = df.withColumn(
            #     "days_from_last_trx", F.datediff(df["contract_date"], df["trx_date"])
            # )
            # df = df.filter(df.days_from_last_trx > 1)
            pass
        elif df_engine == "pandas":
            df_cust_1 = (
                df_cust[["client_id", "phone_number_1", "contract_date"]]
                .rename(
                    columns={
                        "client_id": "client_id_1",
                        "phone_number_1": "phone",
                        "contract_date": "contract_date_1",
                    }
                )
                .dropna(subset=["phone"])
            )
            df_cust_2 = (
                df_cust[["client_id", "phone_number_2", "contract_date"]]
                .rename(
                    columns={
                        "client_id": "client_id_2",
                        "phone_number_2": "phone",
                        "contract_date": "contract_date_2",
                    }
                )
                .dropna(subset=["phone"])
            )

            df = df.merge(
                df_cust_1, left_on="customer_phone", right_on="phone", how="left"
            )
            df = df.merge(
                df_cust_2, left_on="customer_phone", right_on="phone", how="left"
            )

            df["client_id"] = df[["client_id_1", "client_id_2"]].apply(
                lambda x: x.dropna().iloc[0] if not x.dropna().empty else None, axis=1
            )
            df = df.drop(columns=["client_id_1", "client_id_2"])

            df["contract_date"] = df["contract_date_1"].combine_first(
                df["contract_date_2"]
            )

            # Check if 'phone' column exists before dropping
            columns_to_drop = ["contract_date_1", "contract_date_2", "phone"]
            existing_columns_to_drop = [
                col for col in columns_to_drop if col in df.columns
            ]
            df = df.drop(columns=existing_columns_to_drop)

            df["trx_date"] = pd.to_datetime(df["trx_date"])
            df["contract_date"] = pd.to_datetime(df["contract_date"])

            df = df[df["trx_date"] < df["contract_date"]]
            df["days_from_last_trx"] = (df["contract_date"] - df["trx_date"]).dt.days
            df = df[df["days_from_last_trx"] > 1]
        return df

    @log_method_call
    def aggregate_transactions(self, df, df_engine="pandas"):
        """Aggregates transaction data by client id."""
        if df_engine == "spark":
            # df = df.groupBy("client_id").agg(
            #     F.datediff(F.min("contract_date"), F.min("trx_date")).alias(
            #         "days_from_first_trx"
            #     ),
            #     F.datediff(F.max("contract_date"), F.max("trx_date")).alias(
            #         "days_from_last_trx"
            #     ),
            #     F.sum(F.when(df.online_vs_branch == 1, 1).otherwise(0)).alias(
            #         "n_trx_online"
            #     ),
            #     F.sum(F.when(df.online_vs_branch == 2, 1).otherwise(0)).alias(
            #         "n_trx_branch"
            #     ),
            #     F.sum(F.when(df.net_sales > 0, df.net_sales).otherwise(0)).alias(
            #         "net_sales_pos"
            #     ),
            #     F.sum(F.when(df.net_sales < 0, df.net_sales).otherwise(0)).alias(
            #         "net_sales_neg"
            #     ),
            #     F.sum(F.when(df.net_qty > 0, df.net_qty).otherwise(0)).alias(
            #         "net_qty_pos"
            #     ),
            #     F.sum(F.when(df.net_qty < 0, df.net_qty).otherwise(0)).alias(
            #         "net_qty_neg"
            #     ),
            # )
            pass
        elif df_engine == "pandas":
            df["days_from_first_trx"] = (
                df.groupby("client_id")["contract_date"].transform("min")
                - df.groupby("client_id")["trx_date"].transform("min")
            ).dt.days
            df["days_from_last_trx"] = (
                df.groupby("client_id")["contract_date"].transform("max")
                - df.groupby("client_id")["trx_date"].transform("max")
            ).dt.days
            df["n_trx_online"] = (
                df[df["online_vs_branch"] == 1]
                .groupby("client_id")["online_vs_branch"]
                .transform("count")
            )
            df["n_trx_branch"] = (
                df[df["online_vs_branch"] == 2]
                .groupby("client_id")["online_vs_branch"]
                .transform("count")
            )
            df["net_sales_pos"] = (
                df[df["net_sales"] > 0]
                .groupby("client_id")["net_sales"]
                .transform("sum")
            )
            df["net_sales_neg"] = (
                df[df["net_sales"] < 0]
                .groupby("client_id")["net_sales"]
                .transform("sum")
            )
            df["net_qty_pos"] = (
                df[df["net_qty"] > 0].groupby("client_id")["net_qty"].transform("sum")
            )
            df["net_qty_neg"] = (
                df[df["net_qty"] < 0].groupby("client_id")["net_qty"].transform("sum")
            )
            df = df.drop_duplicates(subset=["client_id"])
        return df

    @log_method_call
    def process_transactions_data(self, df, df_cust, df_engine="pandas"):
        """Processes transactions data"""
        df = self.adjust_date_range(df, "trx_date", df_engine)
        df = self.filter_transactions(df, df_cust, df_engine)
        df = self.aggregate_transactions(df, df_engine)

        if df_engine == "spark":
            # # Get numeric columns
            # numeric_columns = [
            #     col_name for col_name, dtype in df.dtypes if dtype in ["int", "double"]
            # ]
            # # Apply abs and round functions to numeric columns
            # for column in numeric_columns:
            #     df = df.withColumn(column, F.round(F.abs(F.col(column)), 1))
            # df = df.toPandas()
            pass
        elif df_engine == "pandas":
            numeric_columns = df.select_dtypes(include=["int64", "float64"]).columns
            df[numeric_columns] = df[numeric_columns].abs().round(1)

        return df

    @log_method_call
    def adj_income_data(self, df, ssn_df):
        """
        Adjusts income data by renaming columns and merging with another DataFrame.
        #"""
        if "last_income_up_date" not in df.columns:
            df["last_income_up_date"] = df["contract_date"]
            df["net_income_last"] = df["net_income"]
            df["net_burden_last"] = df["net_burden"]
        if "first_income_up_date" not in df.columns:
            df["first_income_up_date"] = df["contract_date"]
            df["net_income_first"] = df["net_income"]
            df["net_burden_first"] = df["net_burden"]

        df = df[
            [
                "client_id",
                "net_income_first",
                "net_income",
                "net_burden",
                "net_income_last",
                "net_burden_last",
                "last_income_up_date",
                # "ss_min_income",
                # "ss_max_income",
                "job_map_min_salary",
                "job_map_max_salary",
            ]
        ].copy()
        # df['net_income'] = df['net_income_last'] # line only for training not prod
        # df['net_burden'] = df['net_burden_last'] # line only for training not prod

        df = df.merge(
            ssn_df[["client_id", "age_at_contract"]], on="client_id", how="left"
        )

        return df

    @log_method_call
    def apply_inflation(self, df, data_date, inflation_rate=0.20):
        """
        Applies an inflation factor to all value columns in a DataFrame based on the year of each record.
        """
        df["last_income_up_date"] = pd.to_datetime(df["last_income_up_date"])
        df["Year"] = df["last_income_up_date"].dt.year

        data_date = datetime.strptime(data_date, "%Y%m%d")
        data_date_year = data_date.year
        df["YearsFromNow"] = data_date_year - df["Year"]

        # account for retirement age
        df["YearsFromNow"] = np.where(
            df["age_at_contract"] + df["YearsFromNow"] > 60,
            60 - df["age_at_contract"],
            df["YearsFromNow"],
        )
        # If 'YearsFromNow' is negative, set it to 0
        df["YearsFromNow"] = np.where(df["YearsFromNow"] < 0, 0, df["YearsFromNow"])

        # calculate inflation based on compounded interest
        df["InflationFactor"] = (1 + inflation_rate) ** df["YearsFromNow"]

        # Only inflate 'net_income' and 'net_burden' columns
        value_cols = ["net_income", "net_burden"]

        for value_col in value_cols:
            inflated_value = (df[value_col] * df["InflationFactor"]).round(0)
            # Drop rows with non-finite values
            inflated_value = inflated_value.replace([np.inf, -np.inf], np.nan).dropna()
            df[value_col + "_inflated"] = inflated_value.astype(int)

        df = df.drop(columns=["Year", "YearsFromNow", "InflationFactor"])

        return df

    @log_method_call
    def add_ss_data(self, df):
        df = df.copy()
        # TODO those three lines are only for training
        # df = df[df['ss_min_income'].notna() & (df['ss_min_income'] != 0)]
        # df.loc[df['net_income_inflated'] < df['ss_min_income'], 'net_income_inflated'] = df['ss_min_income']
        # df.loc[(df['net_income_inflated'] > df['ss_max_income']) & (df['net_income_inflated'] > 100000), 'net_income_inflated'] = 100000

        return df

    @log_method_call
    def return_dbr(self, df, df_iscore):
        df = df.merge(df_iscore, on="client_id", how="left")
        df["OpenAccounts_InstallmentAmount_sum"] = df[
            "OpenAccounts_InstallmentAmount_sum"
        ].fillna(0)
        df["first_ord_monthly_collect"] = (
            df["first_ord_amount"] + df["first_ord_benefit"]
        ) / df["first_ord_tenor"]
        df["first_ord_dbr"] = (
            df["first_ord_monthly_collect"]
            + df["net_burden_first"]
            + df["OpenAccounts_InstallmentAmount_sum"]
        ) / df["net_income_first"]
        df["first_ord_dbr"] = round(df["first_ord_dbr"], 2)
        return df

    @log_method_call
    def select_features(self, df):
        selected_features = [
            "client_id",
            "ssn",
            "phone_number_1",
            "phone_number_2",
            "flag_is_mc_customer",
            # "flag_is_prv_cash_trx",
            "scoring_scenario",
            "contract_date",
            "job_name_map",
            # "job_type",
            "insurance_type",
            "marital_status",
            "children_count",
            "address_governorate",
            "address_city",
            "address_area",
            "house_type",
            "car_type_id",
            "car_model_year",
            "club_level",
            "mobile_os_type",
        ]
        df = df.loc[:, selected_features].copy()
        return df

    @log_method_call
    def tranform_features(self, df, data_date):
        data_date = datetime.strptime(data_date, "%Y%m%d")
        current_year = data_date.year
        df["contract_date"] = df["contract_date"].astype(str)
        df["contract_date"] = df["contract_date"].str.slice(0, 10)
        df["contract_date"] = pd.to_datetime(df["contract_date"], format="%Y-%m-%d")
        contract_year = df["contract_date"].dt.year
        df["days_since_contract"] = (data_date - df["contract_date"]).dt.days
        df = df.drop(columns=["contract_date"]).copy()

        df["car_type_id"] = pd.to_numeric(df["car_type_id"], errors="coerce")
        df["have_car"] = np.where(df["car_type_id"].fillna(0) > 0, 1, 0)
        df = df.drop(columns=["car_type_id"]).copy()

        df["car_model_year"] = pd.to_datetime(
            df["car_model_year"], format="%Y", errors="coerce"
        ).dt.year
        df["car_age"] = contract_year - df["car_model_year"]

        @log_method_call
        def categorize_year(age):
            if pd.isnull(age):
                return np.nan
            elif age > 23:
                return "Antique"
            elif 7 < age <= 23:
                return "Mid"
            elif age <= 7:
                return "Modern"

        df["car_model_category"] = df["car_age"].apply(categorize_year)
        df = df.drop(columns=["car_model_year", "car_age"]).copy()

        df["club_level"] = pd.to_numeric(df["club_level"], errors="coerce")
        df["have_club_id"] = np.where(df["club_level"].fillna(0) > 0, 1, 0)
        df = df.drop(columns=["club_level"]).copy()

        return df

    @log_method_call
    def process_income_data(self, df, ssn_df, data_date, inflation_rate=0.20):
        """
        Processes income data by adjusting income data, applying inflation, and adding social security data.
        """
        df = self.adj_income_data(df, ssn_df)
        df = self.apply_inflation(df, data_date, inflation_rate)
        df = self.add_ss_data(df)
        df = df[
            [
                "client_id",
                "net_income_first",
                "net_income",
                "net_burden",
                # 'last_income_up_date','age_at_contract',
                "net_income_inflated",
                "net_burden_inflated",
                # 'is_net_income_inflated_in_range','ss_min_income', 'ss_max_income',
                "job_map_min_salary",
                "job_map_max_salary",
            ]
        ]
        # df = df[df["job_map_max_salary"].notna()]
        return df

    @log_method_call
    def process_train_only_data(self, df, df_iscore):
        df = df[
            [
                "client_id",
                "first_ord_amount",
                "first_ord_benefit",
                "first_ord_tenor",
                "net_income_first",
                "net_burden_first",
                "fo_par90_flag",
            ]
        ].copy()
        df_iscore = df_iscore[
            ["client_id", "OpenAccounts_InstallmentAmount_sum"]
        ].copy()
        df = self.return_dbr(df, df_iscore)
        df = df[["client_id", "first_ord_dbr", "first_ord_tenor", "fo_par90_flag"]]
        return df

    @log_method_call
    def process_other_attr_data(self, df, data_date):
        df = self.select_features(df)
        df = self.tranform_features(df, data_date)
        return df

    @log_method_call
    def gove_s1_rca_others_df(self, rca_others_df):
        rca_others_df = rca_others_df.astype({"days_since_contract": "int64"})
        rca_others_df = rca_others_df.astype({"have_car": "int64"})
        rca_others_df = rca_others_df.astype({"have_club_id": "float64"})
        return rca_others_df

    @log_method_call
    def gove_s1_rca_ssn_df(self, rca_ssn_df):
        rca_ssn_df["age_at_contract"] = rca_ssn_df["age_at_contract"].fillna(30)
        rca_ssn_df["age_at_contract"] = np.where(
            (rca_ssn_df["age_at_contract"] < 15)
            | (rca_ssn_df["age_at_contract"] > 100),
            30,
            rca_ssn_df["age_at_contract"],
        )
        rca_ssn_df["age_at_contract"] = rca_ssn_df["age_at_contract"].astype("int64")
        return rca_ssn_df

    @log_method_call
    def gove_s1_rca_income_df(self, rca_income_df):
        rca_income_df = rca_income_df.astype({"net_income_inflated": "float64"})
        rca_income_df = rca_income_df.astype({"net_burden_inflated": "float64"})
        rca_income_df = rca_income_df.astype({"job_map_min_salary": "float64"})
        rca_income_df = rca_income_df.astype({"job_map_max_salary": "float64"})
        return rca_income_df

    @log_method_call
    def gove_s1_rca_iscore_df(self, rca_iscore_df):
        rca_iscore_df = rca_iscore_df.astype(
            {
                "iscore_score": "int64",
                # "is_iscore_new_format": "int64",
                "OpenAccounts_count": "int64",
                "ClosedAccounts_count": "int64",
                "OpenAccounts_MaxDaysDue_sum": "int64",
                "ClosedAccounts_MaxDaysDue_sum": "int64",
            }
        )
        rca_iscore_df = rca_iscore_df.astype(
            {
                "ClosedAccounts_InstallmentAmount_sum": "float64",
                "ClosedAccounts_ApprovalAmount_sum": "float64",
                "OpenAccounts_InstallmentAmount_sum": "float64",
                "OpenAccounts_BalanceAmount_sum": "float64",
                "OpenAccounts_ApprovalAmount_sum": "float64",
            }
        )
        return rca_iscore_df

    @log_method_call
    def gove_s1_rca_trx_df(self, rca_trx_df):
        columns_to_convert = {
            "net_sales_pos": "float64",
            "net_sales_neg": "float64",
            "days_from_first_trx": "int64",
            "days_from_last_trx": "int64",
            "n_trx_online": "int64",
            "n_trx_branch": "int64",
            "net_qty_pos": "int64",
            "net_qty_neg": "int64",
        }

        for column, dtype in columns_to_convert.items():
            if column in rca_trx_df.columns:
                if dtype == "int64":
                    rca_trx_df[column] = rca_trx_df[column].fillna(0).astype(dtype)
                else:
                    rca_trx_df[column] = rca_trx_df[column].astype(dtype)

        return rca_trx_df

    @log_method_call
    def gove_s1_rca_train_df(self, rca_train_df):
        rca_train_df = rca_train_df.astype({"first_ord_dbr": "float64"})
        return rca_train_df

    @log_method_call
    def merge_dataframes(self, dfs, merge_key="client_id"):
        if not all(merge_key in df for df in dfs):
            raise ValueError(f"All dataframes must contain the merge key: {merge_key}")

        merged_df = dfs[0].copy()
        merged_df["merge_00"] = "both"

        for i, df in enumerate(dfs[1:], 1):
            if df.columns.duplicated().any():
                raise ValueError(f"Dataframe {i} contains duplicate columns")
            merged_df = merged_df.merge(
                df.copy(), on=merge_key, how="left", indicator=f"merge_{i:02d}"
            )
        return merged_df

    @log_method_call
    def eod_transformation(self, df):
        df = df.copy()
        df = df.dropna(subset=["job_name_map", "net_income_inflated", "marital_status"])
        df = df.astype({"have_club_id": "int16", "ssn_is_male": "int16"})
        # df["flag_is_prv_cash_trx"] = np.where(df["merge_04"] == "both", 1, 0)
        df["flag_is_prv_cash_trx"] = 0
        columns_to_drop = df.filter(like="merge_").columns
        df = df.drop(columns=columns_to_drop)
        df = df.fillna({"is_iscore": 0})
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        df[numeric_cols] = df[numeric_cols].round(2)
        return df

    @log_method_call
    def normalize_columns(self, df, ref_col, cols_to_normalize, keep_original=True):
        for col in cols_to_normalize:
            normalized_col = df[col] / df[ref_col]
            normalized_col = normalized_col.round(2)
            df.insert(df.columns.get_loc(col) + 1, f"{col}_pofi", normalized_col)
        if not keep_original:
            df = df.drop(columns=cols_to_normalize)
        return df

    @log_method_call
    def convert_columns_to_slug(self, df, columns):
        def to_slug(value):
            if isinstance(value, str):
                # Convert to lowercase
                value = value.lower()
                # Replace any non-alphanumeric characters (excluding Arabic characters) with dashes
                value = re.sub(r'[^a-z0-9\u0600-\u06FF]+', '-', value)
                # Remove leading and trailing dashes
                value = value.strip('-')
                return value
            return value
        
        for column in columns:
            if (column in df.columns) and (df[column].dtype == 'object'):
                df[column] = df[column].apply(to_slug)
        
        return df

    @log_method_call
    def process(
        self,
        cust_attrib_df: pd.DataFrame,
        # cust_trx_df: pd.DataFrame,
        ssn_gov_map_df: pd.DataFrame,
        run_type: str,
    ) -> pd.DataFrame:
        # standrizing missing values
        cust_attrib_df = self.stnd_missing_values_type(cust_attrib_df)
        # cust_trx_df = self.stnd_missing_values_type(cust_trx_df)
        # process iscore data
        rca_iscore_df = self.process_iscore(cust_attrib_df, full_df=False)
        # process trx data
        # if run_type == "bullet_test":
        #     rca_trx_df = self.process_transactions_data(
        #         cust_trx_df, cust_attrib_df, df_engine="pandas"
        #     )
        # TODO: uncomment the following
        # elif run_type == 'base_test':
        #     rca_trx_df = self.process_transactions_data(cust_trx_df_sp, cust_attrib_df_sp, df_engine='spark')
        # process ssn data
        rca_ssn_df = self.process_ssn_data(
            cust_attrib_df, ssn_gov_map_df, self.data_date
        )
        # process income data
        rca_income_df = self.process_income_data(
            cust_attrib_df, rca_ssn_df, data_date=self.data_date, inflation_rate=0.20
        )
        # process train-only data
        # rca_train_df = self.process_train_only_data(cust_attrib_df, rca_iscore_df)
        # process other features
        rca_others_df = self.process_other_attr_data(
            cust_attrib_df, data_date=self.data_date
        )
        # data governance functions
        rca_others_df_s1 = self.gove_s1_rca_others_df(rca_others_df.copy())
        rca_ssn_df_s1 = self.gove_s1_rca_ssn_df(rca_ssn_df.copy())
        rca_income_df_s1 = self.gove_s1_rca_income_df(rca_income_df.copy())
        rca_iscore_df_s1 = self.gove_s1_rca_iscore_df(rca_iscore_df.copy())
        # rca_trx_df_s1 = self.gove_s1_rca_trx_df(rca_trx_df.copy())
        # rca_train_df_s1 = self.gove_s1_rca_train_df(rca_train_df.copy())
        # merge data frames
        dfs_to_merge = [
            rca_others_df_s1,
            rca_ssn_df_s1,
            rca_income_df_s1,
            rca_iscore_df_s1,
            # rca_trx_df_s1,
        ]
        rca_all_df_s1 = self.merge_dataframes(dfs=dfs_to_merge)
        # eod transformations
        rca_all_df_s2 = self.eod_transformation(rca_all_df_s1)
        # normalizing columns
        cols_to_normalize = [
            "OpenAccounts_ApprovalAmount_sum",
            "OpenAccounts_BalanceAmount_sum",
            "OpenAccounts_InstallmentAmount_sum",
            "ClosedAccounts_ApprovalAmount_sum",
            "ClosedAccounts_InstallmentAmount_sum",
            # "net_sales_pos",
            # "net_sales_neg",
        ]
        rca_all_df_s3 = self.normalize_columns(
            rca_all_df_s2.copy(), "net_income_first", cols_to_normalize
        )

        # converting to slug
        columns_to_convert = [
            "job_name_map",
            "mobile_os_type",
            "house_type",
            "marital_status",
            "insurance_type",
            "address_governorate",
            "address_city",
            "address_area",
            "ssn_governorate"
        ]
        rca_all_df_s3 = self.convert_columns_to_slug(
            rca_all_df_s3.copy(), columns_to_convert
        )

        # re-standrdizing missing values
        rca_all_df_s3 = self.stnd_missing_values_type(rca_all_df_s3)

        # default df
        def_df = rca_all_df_s3.reset_index(drop=True).copy()

        return def_df
