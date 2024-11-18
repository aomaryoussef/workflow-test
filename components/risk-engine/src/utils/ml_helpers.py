import pandas as pd
import numpy as np
from src.config.logging import logger
import unicodedata

logger = logger.bind(
    service="ml_helpers", context="utils", action="ml_helpers"
)


def enforce_dtype_constraints(df, dtypes):
    """
    Enforces specific data type constraints on the given DataFrame.
    Converts columns to the specified data types and handles errors if 
    the conversion fails, substituting invalid entries with NaN for categorical data.
    
    Parameters:
    df (pd.DataFrame): The DataFrame to apply the data type conversions to.
    dtypes (dict): A dictionary where the keys are column names and the values 
                   are the target data types (e.g., 'int', 'float', or CategoricalDtype).
    
    Returns:
    pd.DataFrame: A copy of the original DataFrame with the specified data types enforced.
    
    Raises:
    ValueError: If a column cannot be converted to the specified data type.
    """
    for column, dtype in dtypes.items():
        if column in df.columns:
            try:
                df[column] = df[column].astype(dtype)
            except ValueError as e:
                raise ValueError(f"Internal error converting column '{column}' to type '{dtype}': {e}")
    return df

def apply_final_income_rules(
        df: pd.DataFrame,
        stated_income: str,
        predicted_income: str,
        verlogic: str = 'SCORING',
        green_zone_threshold: float = 0.1,
        red_zone_threshold: float = 0.5,
        income_ratio_cap: float = -1
) -> tuple[pd.Series, pd.Series, pd.Series, pd.Series]:
    """
    Apply rules for calculating income zones, setting final income, applying a maximum income ratio,
    and indicating which rule was applied.

    Parameters:
        df (pd.DataFrame): Input data containing income values.
        stated_income (str): Column name for the stated income.
        predicted_income (str): Column name for the predicted income.
        verlogic (str): Business logic to apply ('SCORING', 'VERIFIED_SCORE', 'VERIFIED_SCORE_INCOME').
        green_zone_threshold (float): Threshold for the Green Zone.
        red_zone_threshold (float): Threshold for the Red Zone.
        income_ratio_cap (float): Maximum multiplier for final income.

    Returns:
        pd.Series: Income ratios.
        pd.Series: Final adjusted income.
        pd.Series: Income zones (Green, Yellow, Red).
        pd.Series: Rules applied for each row.
    """
    
    # Convert "None" string to actual NoneType if passed
    if income_ratio_cap < 0:
        income_ratio_cap = None

    df = df.copy()

    # Helper function to assign income zones
    def assign_income_zone(ratio):
        if ratio <= 1 + green_zone_threshold:
            return 'Green Zone'
        elif ratio > 1 + red_zone_threshold:
            return 'Red Zone'
        return 'Yellow Zone'

    # Step 1: Calculate income ratio and assign zones
    df['income_ratio'] = df[stated_income] / df[predicted_income]
    df['income_zone'] = df['income_ratio'].apply(assign_income_zone)

    # Initialize rule_applied column
    df['rule_applied'] = f'{verlogic} applied'

    # Step 2: Determine initial final income based on zones and business logic
    if verlogic == 'VERIFIED_SCORE_INCOME':
        df['final_income'] = np.where(
            df['income_zone'] == 'Green Zone',
            df[stated_income],
            np.where(
                df['income_zone'] == 'Red Zone',
                (df[stated_income] + df[predicted_income]) / 2,
                df[stated_income]
            )
        )
    elif verlogic in ['SCORING', 'VERIFIED_SCORE']:
        df['final_income'] = np.where(
            df['income_zone'] == 'Red Zone',
            df[predicted_income],
            df[stated_income]
        )
    else:
        raise ValueError(f"Unknown verlogic value '{verlogic}' provided.")

    # Step 3: Apply maximum ratio constraint to final income, if specified
    if income_ratio_cap is not None:
        capped_final_income = df[predicted_income] * income_ratio_cap
        df['final_income'] = np.minimum(df['final_income'], capped_final_income)

        # Update rule_applied if cap was applied
        df['rule_applied'] = np.where(
            df['final_income'] == capped_final_income,
            df['rule_applied'] + ' + cap applied',
            df['rule_applied']
        )

    return df['income_ratio'], df['final_income'], df['income_zone'], df['rule_applied']



def validate_categorical_values(df, column_valid_categories, allow_nulls=True, exception_columns=None):
    """
    Validate the categorical values in the specified columns of a DataFrame, with an option to exclude certain columns from validation.

    Parameters:
    df (pd.DataFrame): The DataFrame to validate.
    column_valid_categories (dict): A dictionary where keys are column names and values are either 
                                    pd.CategoricalDtype or other data types. If the value is 
                                    pd.CategoricalDtype, the function will validate the column's 
                                    values against the categories defined in the CategoricalDtype.
    allow_nulls (bool): If True, null values (NaNs) are allowed in the columns. If False, null values 
                        are considered invalid. Default is True.
    exception_columns (list): A list of column names to exclude from validation. Default is None.

    Raises:
    ValueError: If any column contains invalid values.
    """
    if exception_columns is None:
        exception_columns = []

    for column, dtype in column_valid_categories.items():
        if column in df.columns and column not in exception_columns:
            # Extract the valid categories from CategoricalDtype if applicable
            if isinstance(dtype, pd.CategoricalDtype):
                valid_categories = dtype.categories
            else:
                valid_categories = None  # No validation needed for non-categorical columns
            
            if valid_categories is not None:
                if allow_nulls:
                    invalid_values = df[~df[column].isin(valid_categories) & df[column].notna()][column].unique()
                else:
                    invalid_values = df[~df[column].isin(valid_categories)][column].unique()
                
                if len(invalid_values) > 0:
                    raise ValueError(f"Internal ML error: '{column}' contains invalid values: {invalid_values}.")
