import util.logger as logger
import config.db_pool_lms_v2 as db_lms_v2

def overwrite_journal_admin_fee_post_loan_activations():
    """
    This function overwrites the journal admin fee post loan activations
    for a very specific loan. See details of why: https://github.com/btechlabs/mylo/pull/427
    """
    lms_v2_conn = db_lms_v2.get_connection()
    lms_v2_cursor = lms_v2_conn.cursor()
    try:
        # Fetch loans
        lms_v2_cursor.execute("""
        UPDATE journal 
        SET amount = 1293
        WHERE sub_account = 'admin_fee_receivable' 
        AND account = 'treasury'
        AND cost_center = 'mylo'
        AND linked_entity_id = '2eeee0dd-0a2f-4ab5-a846-1df497911ffe'
        AND direction = 'CREDIT';
        
        UPDATE journal 
        SET amount = 1474
        WHERE sub_account = 'merchant_due' 
        AND cost_center = 'merchant'
        AND linked_entity_id = '2eeee0dd-0a2f-4ab5-a846-1df497911ffe'
        AND direction = 'DEBIT';
        
        
        UPDATE journal 
        SET amount = 7647
        WHERE sub_account = 'vat_receivable' 
        AND account = 'treasury'
        AND cost_center = 'mylo'
        AND linked_entity_id = 'c1d6e7b0-2541-4791-8b4b-b9411745916a'
        AND direction = 'CREDIT';
        
        UPDATE journal 
        SET amount = 62272
        WHERE sub_account = 'merchant_due' 
        AND cost_center = 'merchant'
        AND linked_entity_id = 'c1d6e7b0-2541-4791-8b4b-b9411745916a'
        AND direction = 'DEBIT';
        """)

        # Commit the changes
        lms_v2_conn.commit()
        logger.info("journal entries updated successfully for loan: '2eeee0dd-0a2f-4ab5-a846-1df497911ffe'")
    except Exception as e:
        lms_v2_conn.rollback()
        logger.error(f"error updating journal entries: {e}")
        raise
    finally:
        lms_v2_cursor.close()
        db_lms_v2.release_connection(lms_v2_conn)