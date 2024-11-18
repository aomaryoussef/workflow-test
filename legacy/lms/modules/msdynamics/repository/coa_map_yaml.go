package repository

type ChartOfAccountsMap struct {
	Journals []ChartOfAccountsJournal `yaml:"journals"`
}

type ChartOfAccountsJournal struct {
	Name                         string                       `yaml:"name"`
	GeneralLedgerTransactionType string                       `yaml:"gl_transaction_type"`
	LMSTransactionType           string                       `yaml:"lms_transaction_type"`
	JournalLines                 []ChartOfAccountsJournalLine `yaml:"journal_lines"`
}

type ChartOfAccountsJournalLine struct {
	GeneralLedgerAccountId          string `yaml:"gl_account_id"`
	GeneralLedgerAccountDescription string `yaml:"gl_account_description"`
	LMSAccountName                  string `yaml:"lms_account_name"`
	SubAccountFormat                string `yaml:"sub_account_format"`
	Only                            string `yaml:"only"`
}
