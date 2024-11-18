package storage

type ListFinancialProductsQueryOption func(*listFinancialProductsQuery)
type listFinancialProductsQuery struct {
	limit  uint
	offset uint
}

func ListFinancialProductsWithLimit(limit uint) ListFinancialProductsQueryOption {
	return func(q *listFinancialProductsQuery) {
		q.limit = limit
	}
}
func ListFinancialProductsWithOffset(offset uint) ListFinancialProductsQueryOption {
	return func(q *listFinancialProductsQuery) {
		q.offset = offset
	}
}
