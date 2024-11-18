package cqrs

type CommandType string

func (c CommandType) String() string {
	return string(c)
}

const (
	/* Financial Product Commands */

	CmdTypeFinancialProductCreate    CommandType = "financial_product:create"
	CmdTypeFinancialProductUpdate    CommandType = "financial_product:update"
	CmdTypeFinancialProductApprove   CommandType = "financial_product:approve"
	CmdTypeFinancialProductPublish   CommandType = "financial_product:publish"
	CmdTypeFinancialProductUnpublish CommandType = "financial_product:unpublish"
	CmdTypeFinancialProductDelete    CommandType = "financial_product:delete"

	/* Loan Account Commands */

	CmdTypeLoanAccountCreate             CommandType = "loan_account:create"
	CmdTypeLoanAccountActivate           CommandType = "loan_account:activate"
	CmdTypeLoanAccountCancel             CommandType = "loan_account:cancel"
	CmdTypeLoanAccountEarlySettle        CommandType = "loan_account:early_settle"
	CmdTypeLoanAccountRevenueRecognition CommandType = "loan_account:revenue_recognition"
	CmdTypeLoanAccountPaymentProcess     CommandType = "loan_account:payment_process"

	/* Payment Commands */
	CmdTypePaymentProcess CommandType = "payment:process"
)
