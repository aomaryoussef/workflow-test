package domain

import "errors"

func (fp *FinancialProduct) validate() (err error) {
	if fp.id == "" {
		return errors.New("no id defined for financial product")
	}
	if fp.key == "" {
		return errors.New("no key defined for financial product")
	}
	if fp.version == "" {
		return errors.New("no version defined for financial product")
	}
	if fp.previousVersion == "" {
		return errors.New("no previous version or default previous version defined for financial product")
	}
	if fp.name == "" {
		return errors.New("no name defined for financial product")
	}
	if fp.description == "" {
		return errors.New("no description defined for financial product")
	}
	if fp.activeSince == nil {
		return errors.New("no active since defined for financial product")
	}
	
	for _, v := range fp.tenorVariants {
		minDownpaymentFixed := v.minimumDownpayment.fixed
		maxDownpaymentFixed := v.maximumDownpayment.fixed
		if minDownpaymentFixed.Gt(maxDownpaymentFixed) {
			return errors.New("minimum downpayment cannot be greater than maximum downpayment")
		}
		if v.minimumDownpayment.percentage > v.maximumDownpayment.percentage {
			return errors.New("minimum downpayment cannot be greater than maximum downpayment")
		}
	}
	
	return
}
