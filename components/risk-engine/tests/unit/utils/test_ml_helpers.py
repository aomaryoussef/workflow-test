import pytest
import pandas as pd

from src.utils.ml_helpers import apply_final_income_rules, enforce_dtype_constraints


def test_enforce_dtype_constraints():
    data = {
        'col1': [1, 2, 3],
        'col2': ['1.1', '2.2', '3.3'],
        'col3': ['a', 'b', 'c']
    }
    df = pd.DataFrame(data)
    dtypes = {
        'col1': 'float',
        'col2': 'float',
        'col3': 'category'
    }

    result = enforce_dtype_constraints(df, dtypes)

    assert result['col1'].dtype == 'float64'
    assert result['col2'].dtype == 'float64'
    assert result['col3'].dtype == 'category'

    # Check if values are correctly converted
    assert result['col1'].iloc[0] == 1.0
    assert result['col2'].iloc[1] == 2.2
    assert result['col3'].iloc[2] == 'c'


# Testing the apply_final_income_rules function
# need to be detailed
data = {
    'net_income_inflated': [1000, 2200, 5000, 10000, 60000],
    'income_predics': [1200, 2000, 4000, 6000, 6000],
    'scoring_scenario': ['SCORING', 'VERIFIED_SCORE', 'VERIFIED_SCORE_INCOME', 'VERIFIED_SCORE_INCOME', 'VERIFIED_SCORE_INCOME']
}
df = pd.DataFrame(data)
parameters = {
    'GREEN_INCOME_ZONE_THRESHOLD': 0.1,
    'RED_INCOME_ZONE_THRESHOLD': 0.5,
    'FIN_TO_PRED_INCOME_CAP': 1.5
}

def test_zone_calculation():
    _, _, income_zone, _ = apply_final_income_rules(
        df,
        stated_income='net_income_inflated',
        predicted_income='income_predics',
        verlogic='SCORING',
        green_zone_threshold=parameters['GREEN_INCOME_ZONE_THRESHOLD'],
        red_zone_threshold=parameters['RED_INCOME_ZONE_THRESHOLD']
    )
    expected_income_zone = pd.Series(['Green Zone', 'Yellow Zone', 'Red Zone', 'Red Zone', 'Red Zone'])
    pd.testing.assert_series_equal(income_zone, expected_income_zone, check_names=False)

def test_scoring_logic_without_cap():
    _, final_income, _, rule_applied = apply_final_income_rules(
        df,
        stated_income='net_income_inflated',
        predicted_income='income_predics',
        verlogic='SCORING',
        green_zone_threshold=parameters['GREEN_INCOME_ZONE_THRESHOLD'],
        red_zone_threshold=parameters['RED_INCOME_ZONE_THRESHOLD']
    )
    expected_final_income = pd.Series([1200, 2200, 4000, 6000, 6000])
    assert all(final_income == expected_final_income)
    assert all(rule == "SCORING applied" for rule in rule_applied)

def test_verified_score_logic_with_cap():
    _, final_income, _, rule_applied = apply_final_income_rules(
        df,
        stated_income='net_income_inflated',
        predicted_income='income_predics',
        verlogic='VERIFIED_SCORE',
        green_zone_threshold=parameters['GREEN_INCOME_ZONE_THRESHOLD'],
        red_zone_threshold=parameters['RED_INCOME_ZONE_THRESHOLD'],
        income_ratio_cap=parameters['FIN_TO_PRED_INCOME_CAP']
    )
    expected_final_income = pd.Series([1200, 2200, 4000, 6000, 9000])
    expected_rule_applied = ["VERIFIED_SCORE applied"] * 4 + ["VERIFIED_SCORE applied + cap applied"]
    assert all(final_income == expected_final_income)
    assert list(rule_applied) == expected_rule_applied

def test_verified_score_income_logic_with_cap():
    _, final_income, _, rule_applied = apply_final_income_rules(
        df,
        stated_income='net_income_inflated',
        predicted_income='income_predics',
        verlogic='VERIFIED_SCORE_INCOME',
        green_zone_threshold=parameters['GREEN_INCOME_ZONE_THRESHOLD'],
        red_zone_threshold=parameters['RED_INCOME_ZONE_THRESHOLD'],
        income_ratio_cap=parameters['FIN_TO_PRED_INCOME_CAP']
    )
    expected_final_income = pd.Series([1000, 2200, 4500, 8000, 9000])
    expected_rule_applied = ["VERIFIED_SCORE_INCOME applied"] * 4 + ["VERIFIED_SCORE_INCOME applied + cap applied"]
    assert all(final_income == expected_final_income)
    assert list(rule_applied) == expected_rule_applied
