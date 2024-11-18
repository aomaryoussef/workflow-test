package types

type JobType string

func (j JobType) String() string {
	return string(j)
}

const (
	JobTypeWriteFinancialProduct        JobType = "wm:financial_product:write"
	JobTypeUpdateFinancialProductState  JobType = "wm:financial_product:state_update"
	JobTypeCreateLoanAccount            JobType = "wm:loan_account:create"
	JobTypeActivateLoanAccount          JobType = "wm:loan_account:activate"
	JobTypeCancelLoanAccount            JobType = "wm:loan_account:cancel"
	JobTypeEarlySettleLoanAccount       JobType = "wm:loan_account:early_settle"
	JobTypeUpdateEarlySettlementDetails JobType = "wm:loan_account:update_early_settlement_details"
	JobTypeBookLoanDuesFromPayment      JobType = "wm:loan_account:book_dues_from_payment"

	JobTypeRevenueRecognitionTrigger      JobType = "trigger:loan_account:revenue_recognition"
	JobTypeBookLoanDuesFromPaymentTrigger JobType = "trigger:loan_account:book_dues_from_payment"

	JobTypeGLPostLoanActivation   JobType = "gl:loan_account:create_posting"
	JobTypeSLPostLoanActivation   JobType = "sl:loan_account:create_posting"
	JobTypeGLRevenueRecognition   JobType = "gl:loan_account:revenue_recognition"
	JobTypeSLRevenueRecognition   JobType = "sl:loan_account:revenue_recognition"
	JobTypeGLPostLoanCancellation JobType = "gl:loan_account:cancel_posting"
	JobTypeSLPostLoanCancellation JobType = "sl:loan_account:cancel_posting"
	JobTypeGlLoanBookPayment      JobType = "gl:loan_account:book_payment"
	JobTypeSlLoanBookPayment      JobType = "sl:loan_account:book_payment"

	JobTypeBookPayment   JobType = "wm:payment:book"
	JobTypeSLBookPayment JobType = "sl:payment:book"
	JobTypeGLBookPayment JobType = "gl:payment:book"
)
