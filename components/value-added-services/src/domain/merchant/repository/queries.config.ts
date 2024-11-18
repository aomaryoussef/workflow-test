import {InvoicingTransaction} from "../models/invoicing-transaction.entity";
import {MerchantPayment} from "../models/merchant-payment.entity";

export const aggregateMerchantPaymentQuery =
    "SELECT IT.PAYMENT_ACCOUNT_ID              AS PAYMENT_ACCOUNT_ID, " +
    "       IT.PAYABLE_CURRENCY                AS PAYABLE_CURRENCY, " +
    "       IT.PAYMENT_CONNECTOR_TYPE             PAYMENT_CONNECTOR_TYPE, " +
    "       COALESCE(SUM(IT.PAYABLE_UNITS), 0) AS TOTAL_PAYMENT, " +
    "       ARRAY_AGG(IT.ID)                   AS TRANSACTION_IDS " +
    "       FROM PUBLIC." + InvoicingTransaction.TABLE_NAME + " IT " +
    "           LEFT OUTER JOIN PUBLIC." + MerchantPayment.TRANSACTIONS_JOIN_TABLE_NAME +  " MPIT ON " +
    "               IT.ID = MPIT.INVOICING_TRANSACTION_ID " +
    "           LEFT OUTER JOIN PUBLIC." + MerchantPayment.TABLE_NAME +  " MP ON MPIT.MERCHANT_PAYMENT_ID = MP.ID " +
    "           WHERE IT.TRANSACTION_DATE BETWEEN $1 AND $2 " +
    "           AND MP.ID IS NULL " +
    "GROUP BY IT.PAYMENT_ACCOUNT_ID, IT.PAYABLE_CURRENCY, IT.PAYMENT_CONNECTOR_TYPE"