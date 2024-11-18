package dto

type BookInvoicesRequest struct {
	DateRangeStart string `json:"date_range_start" mapstructure:"date_range_start"`
	DateRangeEnd   string `json:"date_range_end" mapstructure:"date_range_end"`
}
