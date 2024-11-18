package dto

import (
	"github.com/btechlabs/lms-lite/modules/financialproduct/dto"
	"github.com/btechlabs/lms-lite/pkg/money"
)

type CreateCommercialOfferRequest struct {
	ConsumerId                string                                    `mapstructure:"consumer_id" json:"consumer_id"`
	BasketId                  string                                    `mapstructure:"basket_id" json:"basket_id"`
	PrincipalAmount           *money.SerializableMoney                  `mapstructure:"principal_amount" json:"principal_amount"`
	CreditLimit               *money.SerializableMoney                  `mapstructure:"credit_limit" json:"credit_limit"`
	SelectedFinancialProducts []dto.SelectFinancialProductResponseItems `mapstructure:"selected_financial_products" json:"selected_financial_products"`
}
