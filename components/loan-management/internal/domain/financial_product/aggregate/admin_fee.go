package aggregate

import "strconv"

const (
	DefaultAdminFeeCalculationType = CalculationTypeFixedPercent
)

type AdminFee struct {
	Value    int32
	CalcType CalculationType
}

func NewDefaultAdminFeeFromString(percentBasisPoints string) *AdminFee {
	i, err := strconv.Atoi(percentBasisPoints)
	if err != nil {
		panic(err)
	}
	return &AdminFee{
		Value:    int32(i),
		CalcType: DefaultAdminFeeCalculationType,
	}
}
