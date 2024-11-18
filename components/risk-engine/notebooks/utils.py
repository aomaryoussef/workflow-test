import os
import warnings
from pathlib import Path

import matplotlib.pyplot as plt
import mysql.connector as sql
import numpy as np
import pandas as pd
import pandas_gbq
import plotly.figure_factory as ff
import plotly.graph_objects as go
import pymssql
import pyodbc
import scipy
import seaborn as sns
import shap
import yaml
from google.oauth2 import service_account
from IPython.display import display
from pandas.io import gbq
from pyspark.conf import SparkConf
from pyspark.sql import SparkSession
from scipy.stats import f_oneway, kendalltau, pearsonr, pointbiserialr, spearmanr
from sklearn.metrics import (
    auc,
    confusion_matrix,
    mean_absolute_error,
    mean_absolute_percentage_error,
    mean_squared_error,
    precision_recall_curve,
    precision_score,
    r2_score,
    recall_score,
    roc_auc_score,
    roc_curve,
)
from statsmodels.stats.outliers_influence import variance_inflation_factor
from tqdm import tqdm
import unittest
from typing import List
import category_encoders as ce
import numpy as np
import pandas as pd
from optbinning import ContinuousOptimalBinning, OptimalBinning
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.preprocessing import OneHotEncoder


##
def dataFetchingFunc(
    Query, SERVER, DATABASE, USERNAME=None, PASSWORD=None, returnFlag=True
):
    """
    Fetches data from a SQL database using a provided SQL query.
    """
    if USERNAME and PASSWORD:
        conn = pyodbc.connect(
            "DRIVER={ODBC Driver 17 for SQL Server};SERVER="
            + SERVER
            + ";DATABASE="
            + DATABASE
            + ";UID="
            + USERNAME
            + ";PWD="
            + PASSWORD
        )
    else:
        conn = pyodbc.connect(
            "DRIVER={ODBC Driver 17 for SQL Server};SERVER="
            + SERVER
            + ";DATABASE="
            + DATABASE
            + ";Trusted_Connection=yes;"
        )
    cursor = conn.cursor()
    cursor.execute(Query)
    rows = cursor.fetchall()
    names = [column[0] for column in cursor.description]
    data = pd.DataFrame.from_records(rows, columns=names)
    return data


##
def return_catalog():
    """
    This function reads the data and model catalogs from the configuration files and returns them as dictionaries.
    The data catalog is read from a file named 'data_catalog.yml' and the model catalog is read from a file named 'model_catalog.yml'. Both files are expected to be in the 'conf' directory.
    """
    script_dir = Path(__file__).resolve().parent
    conf_dir = script_dir / 'conf'
    
    data_catalog_path = conf_dir / 'data_catalog.yml'
    model_catalog_path = conf_dir / 'model_catalog.yml'
    
    with open(data_catalog_path) as data_catalog_handler:
        data_catalog = yaml.safe_load(data_catalog_handler)
    
    with open(model_catalog_path) as model_catalog_handler:
        model_catalog = yaml.safe_load(model_catalog_handler)
    
    return data_catalog, model_catalog


##
def strip_strings(df):
    """
    This function takes a DataFrame as input and returns a new DataFrame where all string values have been stripped of leading and trailing whitespace.
    """
    df = df.copy()
    return df.applymap(lambda x: x.strip() if isinstance(x, str) else x)


##
# def stnd_missing_values_type(df):
#     """
#     Standardizes missing values in a DataFrame.
#     """
#     # Save original data types
#     orig_dtypes = df.dtypes

#     # Convert to nullable data types and replace missing values
#     df = df.convert_dtypes()
#     for col in df.columns:
#         if df[col].dtype.kind in 'biufc':
#             df[col].replace([np.inf, -np.inf, 'None', '<NA>', np.nan], np.nan, inplace=True)
#         elif df[col].dtype.kind in 'O':
#             df[col].replace(['', ' ', 'NULL', 'NaN', 'None', '<NA>', np.nan], np.nan, inplace=True)
#         elif df[col].dtype.kind in 'M':
#             df[col].replace([pd.NaT, 'None', '<NA>', np.nan], pd.NaT, inplace=True)
#     df = df.replace({pd.NA: np.nan})

#     # Convert columns back to original data types
#     for col in df.columns:
#         df[col] = df[col].astype(orig_dtypes[col])

#     return df


def stnd_missing_values_type(df):
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
            df[col] = df[col].replace([np.inf, -np.inf, "None", "<NA>", np.nan], np.nan)
        elif df[col].dtype.kind in "O":
            df[col] = df[col].replace(
                ["", " ", "NULL", "NaN", "None", "<NA>", np.nan], np.nan
            )
        elif df[col].dtype.kind in "M":
            df[col] = df[col].replace([pd.NaT, "None", "<NA>", np.nan], pd.NaT)

    for col in df.columns:
        df[col] = df[col].astype(orig_dtypes[col])

    return df


##
def build_spark_session():
    conf = SparkConf()
    conf.set("spark.network.timeout", "1000s")
    conf.set("spark.dynamicAllocation.enabled", "true")
    conf.set("spark.executor.cores", 4)
    conf.set("spark.executor.instances", 4)
    conf.set("spark.executor.memory", "16g")
    conf.set("spark.dynamicAllocation.minExecutors", "1")
    conf.set("spark.dynamicAllocation.maxExecutors", "4")
    conf.set("spark.driver.memory", "16g")
    conf.set("spark.port.maxRetries", 200)
    conf.set("spark.sql.execution.arrow.enabled", "true")

    spark = (
        SparkSession.builder.master("local[8]")
        .appName("Spark Test")
        .config(conf=conf)
        .getOrCreate()
    )

    return spark


##
def get_sample_rows(df):
    top_10 = df.head(10)
    bottom_10 = df.tail(10)
    df_middle = df.iloc[10:-10]
    middle_20 = df_middle.sample(n=20, random_state=1)
    result = pd.concat([top_10, bottom_10, middle_20])

    return result


##
def get_cols_by_type(df, col_type):
    if col_type == "numerical":
        numerical_cols = df.select_dtypes(include=np.number).columns.tolist()
        return numerical_cols
    elif col_type == "categorical":
        categorical_cols = df.select_dtypes(exclude=np.number).columns.tolist()
        return categorical_cols
    else:
        print("Invalid column type. Choose either 'numerical' or 'categorical'.")
        return None


##
def convert_dtypes_std(df):
    for col in df.columns:
        if pd.api.types.is_integer_dtype(df[col]):
            df[col] = df[col].astype("int64")
        elif pd.api.types.is_float_dtype(df[col]):
            df[col] = df[col].astype("float64")
    return df


##
def safe_vif(X, feature_idx):
    try:
        vif = variance_inflation_factor(X, feature_idx)
        return vif
    except (np.linalg.LinAlgError, ValueError) as e:
        warnings.warn(f"VIF calculation failed for feature index {feature_idx}: {e}")
        return np.nan


##
def stat_analyze_features(data, target, features=None):
    if features is None:
        features = data.columns.drop(target).tolist()  # Convert to list

    results = []

    # Dropping rows with missing values in the features
    X = data[features].dropna()

    for feature in tqdm(features):
        feature_data = data[[target, feature]].copy()
        share_na = feature_data[feature].isna().mean()
        feature_data = feature_data.dropna()

        # Calculate correlations
        spearman_corr, _ = spearmanr(feature_data[target], feature_data[feature])
        pearson_corr, _ = pearsonr(feature_data[target], feature_data[feature])
        kendall_corr, _ = kendalltau(feature_data[target], feature_data[feature])

        # # Calculate VIF with a safety check
        # vif = safe_vif(X.values, features.index(feature))

        # # ANOVA F-test
        # if feature_data[feature].dtype in [np.float64, np.float32, np.int64, np.int32]:
        #     anova_f, _ = f_oneway(*(feature_data[feature][feature_data[target] == cls] for cls in feature_data[target].unique()))
        # else:
        #     anova_f = np.nan

        # Descriptive statistics
        desc_stats = feature_data[feature].describe().to_dict()
        del desc_stats["count"]

        # Compile results
        results_dict = {
            "feature": feature,
            "share_na": share_na,
            "spearman_corr": spearman_corr,
            "pearson_corr": pearson_corr,
            "kendall_corr": kendall_corr,
            # 'vif': vif,
            # 'anova_f': anova_f,
        }

        results_dict.update(desc_stats)
        results.append(results_dict)

    return pd.DataFrame(results).sort_values(by="spearman_corr", ascending=False)


##
def calculate_ts_metrics(
    df,
    actual_col,
    pred_col,
    start_date=None,
    end_date=None,
    title="",
    date_column=None,
    print_metrics=True,
    IQR_LIMIT=3,
):

    df = df.copy()
    if start_date and end_date:
        if date_column is not None:
            date_range = (df[date_column] >= start_date) & (df[date_column] <= end_date)
        else:
            date_range = (df.index >= start_date) & (df.index <= end_date)
        df = df[date_range]

    # Calculate the percentage error
    df["PercentageError"] = (df[pred_col] / df[actual_col] - 1) * 100

    # Calculate the IQR of the percentage error
    Q1 = df["PercentageError"].quantile(0.25)
    Q3 = df["PercentageError"].quantile(0.75)
    IQR = Q3 - Q1

    # Define the upper and lower bounds for outliers
    lower_bound = Q1 - (IQR_LIMIT * IQR)
    upper_bound = Q3 + (IQR_LIMIT * IQR)

    # Calculate the percentage of outliers
    outliers = df[
        (df["PercentageError"] < lower_bound) | (df["PercentageError"] > upper_bound)
    ]
    percentage_outliers = len(outliers) / len(df) * 100
    print(f"Percentage of outliers removed: {percentage_outliers:.2f}%")

    # Remove outliers
    df = df[
        (df["PercentageError"] >= lower_bound) & (df["PercentageError"] <= upper_bound)
    ]

    # Convert inputs to numpy arrays for calculations
    actual, pred = np.array(df[actual_col]), np.array(df[pred_col])

    # Calculate metrics
    mae = mean_absolute_error(actual, pred)
    mape = np.mean(np.abs((actual - pred) / actual)) * 100
    medape = np.median(np.abs((actual - pred) / actual)) * 100
    mse = mean_squared_error(actual, pred)
    rmse = np.sqrt(mse)
    mase = np.mean(
        np.abs((actual - pred) / (np.abs(np.diff(actual)).sum() / (len(actual) - 1)))
    )
    r2 = r2_score(actual, pred)  # Calculate R-squared score

    # Print metrics
    if print_metrics:
        if len(title) != 0:
            print("*" * len(title))  # print a line of asterisks
            print(f"{title}")
            print("*" * len(title))  # print a line of asterisks
        print(f"Mean Absolute Error (MAE): {format(mae, '.2f')} us")
        print(f"Mean Absolute Percentage Error (MAPE): {format(mape, '.2f')}%")
        print(f"Median Absolute Percentage Error (Med-APE): {format(medape, '.2f')}%")
        print(f"Mean Squared Error (MSE): {format(mse, '.2f')} us^2")
        print(f"Root Mean Squared Error (RMSE): {format(rmse, '.2f')} us")
        print(f"Mean Absolute Scaled Error (MASE): {format(mase, '.2f')}")
        print(f"R-squared (R2) Score: {format(r2, '.2f')}")  # Print R-squared score
        print("-" * 50)  # print a horizontal line

    # Return metrics as a dictionary
    # return {'MAPE': mape, 'MAE': mae, 'MSE': mse, 'RMSE': rmse, 'MASE': mase, 'R2': r2}
    return None


##
def get_reg_SHAP(
    model: object, X_train: pd.DataFrame, feature_no_disp: int = 30
) -> pd.DataFrame:
    # SHAP summary Plot
    X_train = X_train.copy()
    x_sample = X_train.sample(int(0.1 * len(X_train)))
    shap_values = shap.TreeExplainer(model).shap_values(x_sample)
    shap.summary_plot(shap_values, x_sample, max_display=feature_no_disp, show=False)
    # SHAP importance
    shap_df = pd.DataFrame(shap_values, columns=X_train.columns)
    vals = np.abs(shap_df.values).mean(0)
    shap_importance = pd.DataFrame(
        list(zip(X_train.columns, vals)), columns=["feature", "feature_importance_vals"]
    )
    shap_importance = shap_importance.sort_values(
        by=["feature_importance_vals"], ascending=False
    )
    display(shap_importance.head(feature_no_disp))


#
def mape(y_true, y_pred):
    return "mape", mean_absolute_percentage_error(y_true, y_pred), False


#
def plot_percdiff_hist(
    df, col1, col2, IQR_LIMIT=3, histbins=100, x_low=None, x_high=None
):

    df = df.copy()
    # Calculate the percentage error
    df["PercentageError"] = (df[col2] / df[col1] - 1) * 100

    if IQR_LIMIT != 0:
        # Calculate the IQR of the percentage error
        Q1 = df["PercentageError"].quantile(0.25)
        Q3 = df["PercentageError"].quantile(0.75)
        IQR = Q3 - Q1

        # Define the upper and lower bounds for outliers
        lower_bound = Q1 - IQR_LIMIT * IQR
        upper_bound = Q3 + IQR_LIMIT * IQR

        # Calculate the percentage of outliers
        outliers = df[
            (df["PercentageError"] < lower_bound)
            | (df["PercentageError"] > upper_bound)
        ]
        percentage_outliers = len(outliers) / len(df) * 100
        print(f"Percentage of outliers removed: {percentage_outliers:.2f}%")

        # Remove outliers
        df = df[
            (df["PercentageError"] >= lower_bound)
            & (df["PercentageError"] <= upper_bound)
        ]
    else:
        print(f"Not outliers were removed.")

    # Calculate the total count after removing outliers
    total_count_after_outliers_removed = len(df)

    # Calculate the Mean Absolute Percentage Error (MAPE)
    mape = np.mean(abs(df["PercentageError"]))

    ## Create a histogram of the percentage errors
    fig = go.Figure()
    fig.add_trace(
        go.Histogram(x=df["PercentageError"], nbinsx=histbins, name="Histogram")
    )
    # Add a KDE plot
    kde = sns.kdeplot(df["PercentageError"], bw_adjust=0.5).get_lines()[0].get_data()
    fig.add_trace(
        go.Scatter(
            x=kde[0],
            y=kde[1] * total_count_after_outliers_removed,
            mode="lines",
            name="KDE",
        )
    )
    plt.clf()

    # Define the zones
    zones = [(-np.inf, -50), (-50, 0), (0, 50), (50, np.inf)]

    # Add annotations for each zone
    for i in range(len(zones)):
        start, end = zones[i]
        count = len(
            df[(df["PercentageError"] > start) & (df["PercentageError"] <= end)]
        )
        percentage = count / total_count_after_outliers_removed * 100
        if i == 0:
            x_position = (-100 + -50) / 2
        elif i == len(zones) - 1:
            x_position = (50 + 100) / 2
        else:
            x_position = (start + end) / 2
        fig.add_annotation(
            x=x_position,
            y=1.018,
            text=f"{percentage:.1f}%",
            showarrow=False,
            xref="x",
            yref="paper",
            font=dict(size=14),
        )

    # Add vertical lines at -75%, -50%, 0%, 50%, and 75%
    for x in [-50, 0, 50]:
        fig.add_shape(
            type="line",
            x0=x,
            x1=x,
            y0=0,
            y1=1,
            yref="paper",
            line=dict(color="Gray" if x != 0 else "Black"),
        )

    # Add the MAPE to the graph
    fig.add_annotation(
        x=0.5,
        y=1.13,
        text=f"MAPE: {mape:.1f}%",
        showarrow=False,
        xref="paper",
        yref="paper",
        font=dict(size=14),
    )

    # Set the title and labels
    fig.update_layout(
        title=f"Histogram of Percentage Errors for ({col1})",
        xaxis_title="Error, %",
        yaxis_title="Frequency (customers, #)",
    )

    # Set the range of the x-axis
    fig.update_xaxes(range=[x_low, x_high])

    # Show the plot
    fig.show()
    plt.show()


#
def plot_single_hist(
    df, target, n_bins, IQR_LIMIT=3, x_low=None, x_high=None, main_plot="kde"
):
    df = df.copy()

    # Calculate the IQR of the target
    Q1 = df[target].quantile(0.25)
    Q3 = df[target].quantile(0.75)
    IQR = Q3 - Q1

    # Define the upper and lower bounds for outliers
    lower_bound = Q1 - IQR_LIMIT * IQR
    upper_bound = Q3 + IQR_LIMIT * IQR

    outliers = df[(df[target] < lower_bound) | (df[target] > upper_bound)]
    percentage_outliers = len(outliers) / len(df) * 100
    print(f"Percentage of outliers removed: {percentage_outliers:.2f}%")

    # Remove outliers
    df = df[(df[target] >= lower_bound) & (df[target] <= upper_bound)]

    fig = go.Figure()

    if main_plot == "hist":
        fig.add_trace(go.Histogram(x=df[target], nbinsx=n_bins, name="Histogram"))
        kde = sns.kdeplot(df[target], bw_adjust=0.5).get_lines()[0].get_data()
        total_count = len(df[target])
        fig.add_trace(
            go.Scatter(x=kde[0], y=kde[1] * total_count, mode="lines", name="KDE")
        )
        plt.clf()
        yaxis_title = "Count"

    elif main_plot == "kde":
        data_range = df[target].max() - df[target].min()
        bin_size = data_range / n_bins
        hist_data = [df[target]]
        group_labels = [target]
        fig = ff.create_distplot(
            hist_data, group_labels, bin_size=bin_size, show_hist=True, show_rug=False
        )
        yaxis_title = "Density"

    fig.update_layout(
        title_text=f"{target} distribution",
        xaxis_title_text=target,
        yaxis_title_text=yaxis_title,
        bargap=0.2,
        bargroupgap=0.1,
        autosize=False,
        width=900,
        height=500,
    )

    if x_low is not None and x_high is not None:
        fig.update_xaxes(range=[x_low, x_high])

    fig.show()


#
# def calculate_income_zones(df, income_col, forecast_col, blogic = 'all_verify', return_df=False):
#     # Calculate income ratio
#     income_ratio = df[income_col] / df[forecast_col]

#     # Define zones based on income ratio
#     df[income_col+'_zone'] = np.where(
#         income_ratio <= 1.1,
#         'Green Zone',
#         np.where(
#             income_ratio > 1.5,
#             'Red Zone',
#             'Yellow Zone'
#         )
#     )

#     if blogic == 'all_verify':
#         # Define 'income_tobe' based on zones
#         df[income_col+'_tobe_l1'] = np.where(
#             df[income_col+'_zone'] == 'Green Zone',
#             df[income_col],
#             np.where(
#                 df[income_col+'_zone'] == 'Red Zone',
#                 (df[income_col] + df[forecast_col]) / 2,
#                 df[income_col]
#             )
#         )
#     elif blogic == 'all_not_verify':
#         # Define 'income_tobe' based on zones
#         df[income_col+'_tobe_l2'] = np.where(
#             df[income_col+'_zone'] == 'Green Zone',
#             df[income_col],
#             np.where(
#                 df[income_col+'_zone'] == 'Red Zone',
#                 df[forecast_col],
#                 df[forecast_col]
#             )
#         )
#     else:
#         # Define 'income_tobe' based on zones
#         df[income_col+'_tobe_l1'] = np.where(
#             df[income_col+'_zone'] == 'Green Zone',
#             df[income_col],
#             np.where(
#                 df[income_col+'_zone'] == 'Red Zone',
#                 (df[income_col] + df[forecast_col]) / 2,
#                 df[income_col]
#             )
#         )
#         # Define 'income_tobe' based on zones
#         df[income_col+'_tobe_l2'] = np.where(
#             df[income_col+'_zone'] == 'Green Zone',
#             df[income_col],
#             np.where(
#                 df[income_col+'_zone'] == 'Red Zone',
#                 df[forecast_col],
#                 df[forecast_col]
#             )
#         )
#     # Return the value counts of the zones
#     zone_counts = df[income_col+'_zone'].value_counts(normalize=True)*100

#     if return_df:
#         return df, zone_counts
#     else:
#         return zone_counts


#
def plot_probability_distribution(
    y_test, predicted_probs, reject_threshold, accept_threshold
):
    """
    This function plots the density distributions of predicted probabilities for default and non-default classes.

    Parameters:
    y_test (array-like): True labels
    predicted_probs (array-like): Predicted probabilities
    reject_threshold (float): Threshold for rejecting applications
    accept_threshold (float): Threshold for accepting applications
    """

    # Convert to DataFrame
    full_test_ = pd.DataFrame({"predics": predicted_probs})

    # Separate probabilities for default (positive) and non-default (negative) classes
    positive_probs = full_test_["predics"][y_test == 1]
    negative_probs = full_test_["predics"][y_test == 0]

    # Plot the density distributions
    plt.figure(figsize=(10, 6))
    sns.kdeplot(positive_probs, fill=True, color="r", label="Default (Positive Class)")
    sns.kdeplot(
        negative_probs, fill=True, color="b", label="Non-default (Negative Class)"
    )

    # Determine zones
    plt.axvline(x=reject_threshold, color="g", linestyle="--", label="Reject Threshold")
    plt.axvline(
        x=accept_threshold, color="orange", linestyle="--", label="Accept Threshold"
    )

    plt.xlabel("Predicted Probability")
    plt.ylabel("Density")
    plt.title("Probability Distribution for Default and Non-default Classes")
    plt.legend()
    plt.show()


#
def calc_class_metrics_iv(y_train, y_predics_prob, score_cutoff, normalize=True):
    # Convert predicted probabilities to binary predictions using the score cutoff
    y_pred = (y_predics_prob >= score_cutoff).astype(int)

    # Compute confusion matrix
    cm = confusion_matrix(y_train, y_pred)

    # Normalize confusion matrix if requested
    if normalize:
        cm = cm.astype("float") / cm.sum(axis=1)[:, np.newaxis]

    # Create DataFrame for visualization
    cm_df = pd.DataFrame(cm, index=["Good", "Bad"], columns=["Good", "Bad"])

    # Plot confusion matrix
    plt.figure(figsize=(10, 7))
    sns.heatmap(cm_df, annot=True, fmt=".2f" if normalize else "d", cmap="Blues")
    plt.title("Confusion Matrix")
    plt.ylabel("Actual")
    plt.xlabel("Predicted")
    plt.show()

    # Calculate precision
    # Precision is the proportion of positive predictions that are actually positive
    precision = precision_score(y_train, y_pred)

    # Calculate recall
    # Recall is the proportion of actual positives that are correctly classified
    recall = recall_score(y_train, y_pred)

    # Calculate approval rate
    # Approval rate is the proportion of all predictions that are negative (approved)
    approval_rate = (y_pred == 0).mean()

    # Print the calculated metrics
    print(f"Precision: {precision * 100:.2f}%")
    print(f"Recall: {recall * 100:.2f}%")
    print(f"Approval rate: {approval_rate * 100:.2f}%")


#
def calc_class_metrics_iv_op(y_train, y_predics_prob, score_cutoff, normalize=True):
    # Convert predicted probabilities to binary predictions using the score cutoff
    y_pred = (y_predics_prob <= score_cutoff).astype(int)

    # Compute confusion matrix
    cm = confusion_matrix(y_train, y_pred)

    # Normalize confusion matrix if requested
    if normalize:
        cm = cm.astype("float") / cm.sum(axis=1)[:, np.newaxis]

    # Create DataFrame for visualization
    cm_df = pd.DataFrame(cm, index=["Good", "Bad"], columns=["Good", "Bad"])

    # Plot confusion matrix
    plt.figure(figsize=(10, 7))
    sns.heatmap(cm_df, annot=True, fmt=".2f" if normalize else "d", cmap="Blues")
    plt.title("Confusion Matrix")
    plt.ylabel("Actual")
    plt.xlabel("Predicted")
    plt.show()

    # Calculate precision
    # Precision is the proportion of positive predictions that are actually positive
    precision = precision_score(y_train, y_pred)

    # Calculate recall
    # Recall is the proportion of actual positives that are correctly classified
    recall = recall_score(y_train, y_pred)

    # Calculate approval rate
    # Approval rate is the proportion of all predictions that are negative (approved)
    approval_rate = (y_pred == 0).mean()

    # Print the calculated metrics
    print(f"Precision: {precision * 100:.2f}%")
    print(f"Recall: {recall * 100:.2f}%")
    print(f"Approval rate: {approval_rate * 100:.2f}%")


#
def get_class_SHAP(
    model: object, X_train: pd.DataFrame, feature_no_disp: int = 30
) -> pd.DataFrame:
    # SHAP summary Plot
    X_train = X_train.copy()
    x_sample = X_train.sample(int(0.1 * len(X_train)))
    shap_values = shap.TreeExplainer(model).shap_values(x_sample)
    # For binary classification, select the SHAP values for the positive class
    shap_values = shap_values[1]
    shap.summary_plot(shap_values, x_sample, max_display=feature_no_disp, show=False)
    # SHAP importance
    shap_df = pd.DataFrame(shap_values, columns=X_train.columns)
    vals = np.abs(shap_df.values).mean(0)
    shap_importance = pd.DataFrame(
        list(zip(X_train.columns, vals)), columns=["feature", "feature_importance_vals"]
    )
    shap_importance = shap_importance.sort_values(
        by=["feature_importance_vals"], ascending=False
    )
    display(shap_importance.head(feature_no_disp))


#
def get_roc(
    y_train: pd.Series,
    y_train_pred_prob: np.ndarray,
    y_test: pd.Series,
    y_test_pred_prob: np.ndarray,
) -> None:
    """
    Plots the receiver operating characteristic (ROC) curve for a binary classification model
    and calculates the area under the curve (AUC) for both training and testing.
    Args:
        y_train (pd.Series): Actual target values for train dataset.
        y_train_pred_prob (np.ndarray): Predicted probabilities for target values in train dataset.
        y_test (pd.Series): Actual target values for test dataset.
        y_test_pred_prob (np.ndarray): Predicted probabilities for target values in test dataset.

    Returns:
        None.
    """

    fpr_train, tpr_train, thresholds_train = roc_curve(y_train, y_train_pred_prob)
    fpr_test, tpr_test, thresholds_test = roc_curve(y_test, y_test_pred_prob)

    auc_train = auc(fpr_train, tpr_train)
    auc_test = auc(fpr_test, tpr_test)

    plt.plot(fpr_train, tpr_train, label="Train ROC curve (AUC = %0.2f)" % auc_train)
    plt.plot(fpr_test, tpr_test, label="Test ROC curve (AUC = %0.2f)" % auc_test)

    selected_records = np.append(
        np.quantile(thresholds_test, [0.05, 0.1, 0.25, 0.5, 0.75, 0.9, 0.95]),
        [np.min(thresholds_test), np.max(thresholds_test)],
    )
    for i in range(len(selected_records)):
        selected_records[i] = thresholds_test[
            np.abs(thresholds_test - selected_records[i]).argmin()
        ]

    for i, threshold in enumerate(thresholds_test):
        if np.in1d(threshold, selected_records):
            plt.annotate(
                "%.3f" % threshold,
                (fpr_test[i], tpr_test[i]),
                textcoords="offset points",
                xytext=(0, 10),
                ha="center",
            )

    plt.plot([0, 1], [0, 1], "k--")
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel("False Positive Rate")
    plt.ylabel("True Positive Rate")
    plt.title("Receiver Operating Characteristic")
    plt.legend(loc="lower right")
    plt.show()


#
def get_PR(
    y_train: pd.Series,
    y_train_pred_prob: np.ndarray,
    y_test: pd.Series,
    y_test_pred_prob: np.ndarray,
) -> None:
    """
    Plots the precision-recall (PR) curve for a binary classification model
    and calculates the area under the curve (AUC) for both training and testing.
    Args:
        y_train (pd.Series): Actual target values for train dataset.
        y_train_pred_prob (np.ndarray): Predicted probabilities for target values in train dataset.
        y_test (pd.Series): Actual target values for test dataset.
        y_test_pred_prob (np.ndarray): Predicted probabilities for target values in test dataset.

    Returns:
        None.
    """

    precision_train, recall_train, thresholds_train = precision_recall_curve(
        y_train, y_train_pred_prob
    )
    precision_test, recall_test, thresholds_test = precision_recall_curve(
        y_test, y_test_pred_prob
    )

    idx_train = np.argsort(thresholds_train)[::-1]
    thresholds_train = thresholds_train[idx_train]
    precision_train = precision_train[idx_train]
    recall_train = recall_train[idx_train]

    idx_test = np.argsort(thresholds_test)[::-1]
    thresholds_test = thresholds_test[idx_test]
    precision_test = precision_test[idx_test]
    recall_test = recall_test[idx_test]

    auc_train = auc(recall_train, precision_train)
    auc_test = auc(recall_test, precision_test)

    plt.plot(
        recall_train, precision_train, label="Train PR curve (AUC = %0.2f)" % auc_train
    )
    plt.plot(
        recall_test, precision_test, label="Test PR curve (AUC = %0.2f)" % auc_test
    )

    selected_records = np.append(
        np.quantile(thresholds_test, [0.05, 0.1, 0.25, 0.5, 0.75, 0.9, 0.95]),
        [np.min(thresholds_test), np.max(thresholds_test)],
    )
    for i in range(len(selected_records)):
        selected_records[i] = thresholds_test[
            np.abs(thresholds_test - selected_records[i]).argmin()
        ]

    for i, threshold in enumerate(thresholds_test):
        if np.in1d(threshold, selected_records):
            plt.annotate(
                "%.3f" % threshold,
                (recall_test[i], precision_test[i]),
                textcoords="offset points",
                xytext=(0, 10),
                ha="center",
            )

    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.0])
    plt.xlabel("Recall")
    plt.ylabel("Precision")
    plt.title("Precision-Recall")
    plt.legend()
    plt.show()


#
def calc_gini(y, y_pred):
    auc = roc_auc_score(y, y_pred)
    gini = 2 * auc - 1
    return gini


def calculate_income_zones(
    df,
    income_col,
    forecast_col,
    blogic="all_not_verify",
    GREEN_INCOME_ZONE_THRESHOLD=0.1,
    RED_INCOME_ZONE_THRESHOLD=0.5,
):
    df = df.copy()
    # Calculate income ratio
    income_ratio = df[income_col] / df[forecast_col]

    # Define zones based on income ratio
    df[income_col + "_zone"] = np.where(
        income_ratio <= 1 + GREEN_INCOME_ZONE_THRESHOLD,
        "Green Zone",
        np.where(
            income_ratio > 1 + RED_INCOME_ZONE_THRESHOLD, "Red Zone", "Yellow Zone"
        ),
    )

    if blogic == "all_verify":
        # Define 'income_tobe' based on zones
        df["final_income"] = np.where(
            df[income_col + "_zone"] == "Green Zone",
            df[income_col],
            np.where(
                df[income_col + "_zone"] == "Red Zone",
                (df[income_col] + df[forecast_col]) / 2,
                df[income_col],
            ),
        )
    elif blogic == "all_not_verify":
        # Define 'income_tobe' based on zones
        df["final_income"] = np.where(
            df[income_col + "_zone"] == "Green Zone",
            df[income_col],
            np.where(
                df[income_col + "_zone"] == "Red Zone",
                df[forecast_col],
                df[forecast_col],
            ),
        )

    # Return the final income and the income zone
    return df["final_income"], df[income_col + "_zone"]


def calculate_income_zones_x(
    df, income_col, forecast_col, blogic="all_verify", return_df=False
):
    # Calculate income ratio
    income_ratio = df[income_col] / df[forecast_col]

    # Define zones based on income ratio
    df[income_col + "_zone"] = np.where(
        income_ratio <= 1.1,
        "Green Zone",
        np.where(income_ratio > 1.5, "Red Zone", "Yellow Zone"),
    )

    if blogic == "all_verify":
        # Define 'income_tobe' based on zones
        df[income_col + "_tobe_l1"] = np.where(
            df[income_col + "_zone"] == "Green Zone",
            df[income_col],
            np.where(
                df[income_col + "_zone"] == "Red Zone",
                (df[income_col] + df[forecast_col]) / 2,
                df[income_col],
            ),
        )
    elif blogic == "all_not_verify":
        # Define 'income_tobe' based on zones
        df[income_col + "_tobe_l2"] = np.where(
            df[income_col + "_zone"] == "Green Zone",
            df[income_col],
            np.where(
                df[income_col + "_zone"] == "Red Zone",
                df[forecast_col],
                df[forecast_col],
            ),
        )
    else:
        # Define 'income_tobe' based on zones
        df[income_col + "_tobe_l1"] = np.where(
            df[income_col + "_zone"] == "Green Zone",
            df[income_col],
            np.where(
                df[income_col + "_zone"] == "Red Zone",
                (df[income_col] + df[forecast_col]) / 2,
                df[income_col],
            ),
        )
        # Define 'income_tobe' based on zones
        df[income_col + "_tobe_l2"] = np.where(
            df[income_col + "_zone"] == "Green Zone",
            df[income_col],
            np.where(
                df[income_col + "_zone"] == "Red Zone",
                df[forecast_col],
                df[forecast_col],
            ),
        )
    # Return the value counts of the zones
    zone_counts = df[income_col + "_zone"].value_counts(normalize=True) * 100

    if return_df:
        return df, zone_counts
    else:
        return zone_counts


class WoeTransformer(BaseEstimator, TransformerMixin):
    def __init__(self, target_type="binary", min_bin_size=0.01):
        self.target_type = target_type
        self.min_bin_size = min_bin_size
        self.transformers = {}

    def _woe_transform_one_feature(
        self, feature_col, target_col, feature_name, feature_type
    ):
        if self.target_type == "continuous":
            opt_b = ContinuousOptimalBinning(
                name=feature_name,
                dtype=feature_type,
                min_bin_size=self.min_bin_size,
                min_prebin_size=self.min_bin_size,
                monotonic_trend="auto_asc_desc",
            )
        elif self.target_type == "binary":
            opt_b = OptimalBinning(
                name=feature_name,
                dtype=feature_type,
                solver="cp",
                min_bin_size=self.min_bin_size,
                min_prebin_size=self.min_bin_size,
                monotonic_trend="auto_asc_desc",
            )

        opt_b.fit(feature_col, target_col)
        return opt_b

    def fit(self, X, y=None, **kwargs):
        target = kwargs.get("target")
        columns_categorical = kwargs.get("columns_categorical")
        for col in columns_categorical:
            self.transformers[col] = self._woe_transform_one_feature(
                X[col], X[target], col, feature_type="categorical"
            )
        return self

    def transform(self, X, ignore_na=False, remove_original=False, **kwargs):
        X_copy = X.copy()
        for col in self.transformers.keys():
            metric = "mean" if self.target_type == "continuous" else "woe"
            X_copy[col + "_woe"] = self.transformers[col].transform(
                X[col], metric=metric, metric_missing="empirical"
            )
            if ignore_na:
                idx = X_copy[col].isna()
                X_copy.loc[idx, col + "_woe"] = np.nan
            if remove_original:
                X_copy = X_copy.drop(columns=[col])
        return X_copy


#
class TestWoeTransformer(unittest.TestCase):
    def setUp(self):
        self.df = pd.DataFrame(
            {
                "feature1": ["a", "b", "a", "b", "a", "b", "a", "b"],
                "feature2": ["c", "c", "d", "d", "c", "c", "d", "d"],
                "target": [0, 1, 0, 1, 0, 1, 0, 1],
            }
        )
        self.features = ["feature1", "feature2"]
        self.target_col = "target"
        self.target_type = "binary"
        self.woe_transformer = WoeTransformer(
            target_type=self.target_type, min_bin_size=0.05
        )

    def test_fit(self):
        # Test that fit does not raise an exception
        try:
            self.woe_transformer.fit(
                self.df, target=self.target_col, columns_categorical=self.features
            )
        except Exception as e:
            self.fail(f"Fit method raised exception: {e}")

    def test_transform(self):
        # Test that transform does not raise an exception and returns a DataFrame
        self.woe_transformer.fit(
            self.df, target=self.target_col, columns_categorical=self.features
        )
        try:
            transformed_df = self.woe_transformer.transform(
                self.df, remove_original=True
            )
        except Exception as e:
            self.fail(f"Transform method raised exception: {e}")
        self.assertIsInstance(transformed_df, pd.DataFrame)

        # Check if the transformed dataframe has the correct columns
        expected_columns = ["target"] + [f + "_woe" for f in self.features]
        self.assertListEqual(list(transformed_df.columns), expected_columns)


#
class OneHotEncoderCustom(BaseEstimator, TransformerMixin):
    def __init__(self, handle_unknown="ignore", drop=None):
        self.handle_unknown = handle_unknown
        self.drop = drop
        self.encoders = {}

    def fit(self, X, y=None, **kwargs):
        columns_categorical = kwargs.get("columns_categorical")
        for col in columns_categorical:
            encoder = OneHotEncoder(handle_unknown=self.handle_unknown, drop=self.drop)
            encoder.fit(X[[col]])
            self.encoders[col] = encoder
        return self

    def transform(self, X, ignore_na=False, remove_original=False, **kwargs):
        X_copy = X.copy()
        for col in self.encoders.keys():
            transformed = self.encoders[col].transform(X_copy[[col]]).toarray()
            feature_names = self.encoders[col].get_feature_names_out([col])
            transformed_df = pd.DataFrame(
                transformed, columns=feature_names, index=X_copy.index
            )  # Set index
            X_copy = pd.concat([X_copy, transformed_df], axis=1)
            if ignore_na:
                X_copy[col + "_na"] = np.where(X_copy[col].isna(), 1, 0)
            if remove_original:
                X_copy = X_copy.drop(columns=[col])
        return X_copy


class TestOneHotEncoderCustom(unittest.TestCase):
    def setUp(self):
        self.encoder = OneHotEncoderCustom()
        self.data = pd.DataFrame(
            {
                "category": ["cat", "dog", "dog", "cat", np.nan],
                "number": [1, 2, 3, 4, 5],
            }
        )

    def test_transform(self):
        self.encoder.fit(self.data, columns_categorical=["category"])
        transformed = self.encoder.transform(
            self.data, ignore_na=True, remove_original=True
        )

        expected_columns = [
            "number",
            "category_cat",
            "category_dog",
            "category_nan",
            "category_na",
        ]
        self.assertListEqual(list(transformed.columns), expected_columns)

        expected_values = np.array(
            [
                [1, 1, 0, 0, 0],
                [2, 0, 1, 0, 0],
                [3, 0, 1, 0, 0],
                [4, 1, 0, 0, 0],
                [5, 0, 0, 1, 1],
            ]
        )
        np.testing.assert_array_equal(transformed.values, expected_values)


if __name__ == "__main__":
    unittest.main(argv=["first-arg-is-ignored"], exit=False)


#
class LogTransformer:
    def __init__(self, target):
        self.target = target

    def fit(self, df):
        # No fitting necessary for log transformation, but we'll keep this for compatibility with sklearn's Transformer API
        return self

    def transform(self, df):
        df_transformed = df.copy()
        df_transformed[self.target] = np.log1p(df_transformed[self.target])
        return df_transformed

    def inverse_transform(self, df):
        df_reverted = df.copy()
        df_reverted[self.target] = np.expm1(df_reverted[self.target])
        return df_reverted


class TestLogTransformer(unittest.TestCase):
    def setUp(self):
        self.df = pd.DataFrame({"target": [1, 2, 3, 4, 5]})
        self.transformer = LogTransformer("target")

    def test_transform(self):
        transformed_df = self.transformer.transform(self.df)
        expected_df = pd.DataFrame({"target_log": np.log1p(self.df["target"])})
        pd.testing.assert_frame_equal(transformed_df, expected_df)

        # Check if the transformed dataframe has the correct column
        self.assertListEqual(list(transformed_df.columns), ["target_log"])

    def test_inverse_transform(self):
        transformed_df = self.transformer.transform(self.df)
        reverted_df = self.transformer.inverse_transform(transformed_df)
        pd.testing.assert_frame_equal(reverted_df, self.df)

        # Check if the reverted dataframe has the correct column
        self.assertListEqual(list(reverted_df.columns), ["target"])


def get_cwf_and_segment(pd_series, ar_series, pd_bins_to_cwf):
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