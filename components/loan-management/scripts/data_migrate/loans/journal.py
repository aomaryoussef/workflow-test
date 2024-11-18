from . import storage
import util.logger as logger
import pandas as pd

def verify_journals_post_activation_only():
    journal_v1_df: pd.DataFrame = storage.load_all_journal_v1(filters="""
        (
        (
        type IN ('PURCHASING_FROM_MERCHANT', 'LOAN_ACTIVATION', 'ADMIN_FEE')
        ) AND (
        (account = 'MurabhaPurchase' AND direction = 'DEBIT') OR
        (account = 'MerchantDue' AND direction = 'CREDIT') OR
        (account = 'MurabhaPrincipalReceivable' AND direction = 'DEBIT') OR
        (account = 'MurabhaPurchase' AND direction = 'CREDIT') OR
        (account = 'MurabhaInterestReceivable' AND direction = 'DEBIT') OR
        (account = 'MurabhaUnearnedRevenue' AND direction = 'CREDIT') OR
        (account = 'MerchantDue' AND direction = 'DEBIT') OR
        (account = 'AdminFeeReceivable' AND direction = 'CREDIT') OR
        (account = 'TaxDue' AND direction = 'CREDIT') OR
        (account = 'Doubtful' AND direction = 'DEBIT') OR
        (account = 'DoubtfulReceivable' AND direction = 'CREDIT')
        )
        )
        """)
    logger.info(f"pulled journal v1 after loan activation with total rows: {len(journal_v1_df)}")
    journal_v2_df: pd.DataFrame = storage.load_all_journal_v2(filters="""
        (event_type = 'LOAN_ACCOUNT_ACTIVATED')
    """)
    logger.info(f"pulled journal v2 after loan activation with total rows: {len(journal_v2_df)}")

    # Ensure both DataFrames have the same columns
    journal_v1_df = journal_v1_df.reindex(columns=journal_v2_df.columns)
    logger.info("re-indexed columns for ensuring both dataframes have the same columns")

    if len(journal_v1_df) != len(journal_v2_df):
        raise Exception(f"journal entries do not match with length, v1: {len(journal_v1_df)} v2: {len(journal_v2_df)}")

    loan_ids = journal_v1_df['loan_id'].unique()
    for loan_id in loan_ids:
        v1_group = journal_v1_df[journal_v1_df['loan_id'] == loan_id].reset_index(drop=True)
        v2_group = journal_v2_df[journal_v2_df['loan_id'] == loan_id].reset_index(drop=True)

        if v1_group.shape != v2_group.shape:
            print(f"for loanID: {loan_id} -  different shapes \n{v1_group}\n\n{v2_group}")
            raise Exception("journal entries do not match")

        for i in range(len(v1_group)):
            row_v1 = v1_group.iloc[i]
            row_v2 = v2_group.iloc[i]
            if not row_v1.equals(row_v2):
                diff = row_v1.compare(row_v2)
                print(f"for loanID: {loan_id} -  different row[{i+1}] comparison {diff}")
                raise Exception("journal entries do not match")

def verify_journals_post_cancellation_only():
    journal_v1_df: pd.DataFrame = storage.load_all_journal_v1(filters="""
        (
        (
        type IN ('LOAN_CANCELLATION', 'REVERSE_ADMIN_FEE', 'SELLING_TO_MERCHANT')
        ) AND (
        (account = 'MurabhaPurchase' AND direction = 'CREDIT') OR
        (account = 'MerchantDue' AND direction = 'DEBIT') OR
        (account = 'MurabhaPrincipalReceivable' AND direction = 'CREDIT') OR
        (account = 'MurabhaPurchase' AND direction = 'DEBIT') OR
        (account = 'MurabhaInterestReceivable' AND direction = 'CREDIT') OR
        (account = 'MurabhaUnearnedRevenue' AND direction = 'DEBIT') OR
        (account = 'MerchantDue' AND direction = 'CREDIT') OR
        (account = 'AdminFeeReceivable' AND direction = 'DEBIT') OR
        (account = 'TaxDue' AND direction = 'DEBIT') OR
        (account = 'Doubtful' AND direction = 'CREDIT') OR
        (account = 'DoubtfulReceivable' AND direction = 'DEBIT')
        )
        )
        """)
    logger.info(f"pulled journal v1 after loan cancellation with total rows: {len(journal_v1_df)}")
    journal_v2_df: pd.DataFrame = storage.load_all_journal_v2(filters="""
        (event_type = 'LOAN_ACCOUNT_CANCELED')
    """)
    logger.info(f"pulled journal v2 after loan cancellation with total rows: {len(journal_v2_df)}")

    # Ensure both DataFrames have the same columns
    journal_v1_df = journal_v1_df.reindex(columns=journal_v2_df.columns)
    logger.info("re-indexed columns for ensuring both dataframes have the same columns")

    if len(journal_v1_df) != len(journal_v2_df):
        raise Exception(f"journal entries do not match with length, v1: {len(journal_v1_df)} v2: {len(journal_v2_df)}")

    loan_ids = journal_v1_df['loan_id'].unique()
    for loan_id in loan_ids:
        v1_group = journal_v1_df[journal_v1_df['loan_id'] == loan_id].reset_index(drop=True)
        v2_group = journal_v2_df[journal_v2_df['loan_id'] == loan_id].reset_index(drop=True)

        if v1_group.shape != v2_group.shape:
            print(f"for loanID: {loan_id} -  different shapes \n{v1_group}\n\n{v2_group}")
            raise Exception("journal entries do not match")

        for i in range(len(v1_group)):
            row_v1 = v1_group.iloc[i]
            row_v2 = v2_group.iloc[i]
            if not row_v1.equals(row_v2):
                diff = row_v1.compare(row_v2)
                print(f"for loanID: {loan_id} -  different row[{i+1}] comparison {diff}")
                raise Exception("journal entries do not match")

def verify_journals_post_revenue_recognition_only():
    journal_v1_df: pd.DataFrame = storage.load_all_journal_v1(filters="type='INTEREST_EARNED'")
    logger.info(f"pulled journal v1 after revenue recognition with total rows: {len(journal_v1_df)}")
    journal_v2_df: pd.DataFrame = storage.load_all_journal_v2(filters="event_type='LOAN_ACCOUNT_INTEREST_REVENUE_RECOGNIZED'")
    logger.info(f"pulled journal v2 after revenue recognition with total rows: {len(journal_v2_df)}")

    journal_v1_df = journal_v1_df.drop(columns=['booked_at'])
    journal_v2_df = journal_v2_df.drop(columns=['booked_at'])
    # Ensure both DataFrames have the same columns
    journal_v1_df = journal_v1_df.reindex(columns=journal_v2_df.columns)
    logger.info("re-indexed columns for ensuring both dataframes have the same columns")

    # if len(journal_v1_df) != len(journal_v2_df):
    #     raise Exception(f"journal entries do not match with length, v1: {len(journal_v1_df)} v2: {len(journal_v2_df)}")

    loan_ids = journal_v1_df['loan_id'].unique()
    for loan_id in loan_ids:
        v1_group = journal_v1_df[journal_v1_df['loan_id'] == loan_id].reset_index(drop=True)
        v2_group = journal_v2_df[journal_v2_df['loan_id'] == loan_id].reset_index(drop=True)

        if v1_group.shape != v2_group.shape:
            print(f"for loanID: {loan_id} -  different shapes \n{v1_group}\n\n{v2_group}")
            raise Exception("journal entries do not match")

        for i in range(len(v1_group)):
            row_v1 = v1_group.iloc[i]
            row_v2 = v2_group.iloc[i]
            if not row_v1.equals(row_v2):
                diff = row_v1.compare(row_v2)
                print(f"for loanID: {loan_id} -  different row[{i+1}] comparison {diff}")
                raise Exception("journal entries do not match")