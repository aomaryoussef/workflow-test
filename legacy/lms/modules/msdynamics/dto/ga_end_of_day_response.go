package dto

type GeneralJournalEndOfDayAggregatesResponse struct {
	RequestNumber    string   `json:"correlation_id" mapstructure:"correlation_id"`
	ReferenceNumbers []string `json:"reference_numbers" mapstructure:"reference_numbers"`
}
