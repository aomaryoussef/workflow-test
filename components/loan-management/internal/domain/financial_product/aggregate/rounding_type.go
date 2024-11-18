package aggregate

type RoundingType string

func (r RoundingType) String() string {
	return string(r)
}

const (
	RoundingTypeUp RoundingType = "round_up"
)
