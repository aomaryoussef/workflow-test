package repository

type FinancialProductYaml struct {
	Id              string `yaml:"id"`
	Key             string `yaml:"key"`
	Version         string `yaml:"version"`
	PreviousVersion string `yaml:"previous_version"`
	Name            string `yaml:"name"`
	Description     string `yaml:"description"`
	ActiveSince     string `yaml:"active_since"`
	ActiveUntil     string `yaml:"active_until"`
	Approvers       map[string]struct {
		Name    string `yaml:"name"`
		Email   string `yaml:"email"`
		Date    string `yaml:"date"`
		Comment string `yaml:"comment"`
	} `yaml:"approvers"`
	Creator struct {
		Name    string `yaml:"name"`
		Email   string `yaml:"email"`
		Date    string `yaml:"date"`
		Comment string `yaml:"comment"`
	} `yaml:"creator"`

	Configuration struct {
		Interest struct {
			Type                       string `yaml:"type"`
			Methodology                string `yaml:"methodology"`
			CompoundingFrequency       string `yaml:"compounding_frequency"`
			RoundingUpMonthlyToNearest bool   `yaml:"rounding_up_monthly_to_nearest"`
		} `yaml:"interest"`
	} `yaml:"configuration"`

	GlobalAttributes struct {
		AdminFee struct {
			Type  string `yaml:"type"`
			Value string `yaml:"value"`
		} `yaml:"admin_fee"`
		BadDebt struct {
			Type  string `yaml:"type"`
			Value string `yaml:"value"`
		} `yaml:"bad_debt"`
		GracePeriod struct {
			InDays uint8 `yaml:"in_days"`
		} `yaml:"grace_period"`
		AllowedPrincipalRange struct {
			Min string `yaml:"min"`
			Max string `yaml:"max"`
		} `yaml:"allowed_principal_range"`
		RepaymentDaysInMonth string `yaml:"repayment_days_in_month"`
	} `yaml:"global_attributes"`

	TenorVariants []struct {
		Key                string `yaml:"key"`
		DurationInDays     uint16 `yaml:"duration_in_days"`
		MinimumDownpayment struct {
			Type  string `yaml:"type"`
			Value string `yaml:"value"`
		} `yaml:"minimum_downpayment"`
		MaximumDownpayment struct {
			Type  string `yaml:"type"`
			Value string `yaml:"value"`
		} `yaml:"maximum_downpayment"`
		AdminFee *struct {
			Type  string `yaml:"type"`
			Value string `yaml:"value"`
		} `yaml:"admin_fee"`
		Phases []struct {
			DurationInDays     uint16 `yaml:"duration_in_days"`
			MinimumDownpayment struct {
				Type  string `yaml:"type"`
				Value string `yaml:"value"`
			} `yaml:"minimum_downpayment"`
			MaximumDownpayment struct {
				Type  string `yaml:"type"`
				Value string `yaml:"value"`
			} `yaml:"maximum_downpayment"`
			Interest struct {
				Type  string `yaml:"type"`
				Value string `yaml:"value"`
			} `yaml:"interest"`
			LateFee struct {
				Type  string `yaml:"type"`
				Value string `yaml:"value"`
			} `yaml:"late_fee"`
		} `yaml:"phases"`
	} `yaml:"tenor_variants"`
}
