package aggregate

type CalculationType string

func (c CalculationType) String() string {
	return string(c)
}

const (
	CalculationTypeFixedMonetary CalculationType = "fixed_monetary"
	CalculationTypeFixedPercent  CalculationType = "fixed_percent"
)
