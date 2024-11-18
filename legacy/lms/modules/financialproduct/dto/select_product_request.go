package dto

type SelectFinancialProductRequest struct {
	CheckoutBasket CheckoutBasket `json:"checkout_basket" mapstructure:"checkout_basket"`
}

type CheckoutBasket struct {
	ID                     string                 `json:"id" mapstructure:"id"`
	WorkflowID             *string                `json:"workflow_id" mapstructure:"workflow_id"`
	PartnerID              string                 `json:"partner_id" mapstructure:"partner_id"`
	CashierID              string                 `json:"cashier_id" mapstructure:"cashier_id"`
	BranchID               string                 `json:"branch_id" mapstructure:"branch_id"`
	ConsumerID             string                 `json:"consumer_id" mapstructure:"consumer_id"`
	SessionBasketID        string                 `json:"session_basket_id" mapstructure:"session_basket_id"`
	Status                 string                 `json:"status" mapstructure:"status"`
	Products               []Product              `json:"products" mapstructure:"products"`
	CommercialOffers       interface{}            `json:"commercial_offers" mapstructure:"commercial_offers"`
	ConsumerDeviceMetadata ConsumerDeviceMetadata `json:"consumer_device_metadata" mapstructure:"consumer_device_metadata"`
	GrossBasketValue       int                    `json:"gross_basket_value" mapstructure:"gross_basket_value"`
	CreatedAt              string              `json:"created_at" mapstructure:"created_at"`
	UpdatedAt              string              `json:"updated_at" mapstructure:"updated_at"`
}

type Product struct {
	Name     string `json:"name" mapstructure:"name"`
	Count    int    `json:"count" mapstructure:"count"`
	Price    int    `json:"price" mapstructure:"price"`
	Category string `json:"category" mapstructure:"category"`
}

type ConsumerDeviceMetadata struct {
	Brand      string `json:"brand" mapstructure:"brand"`
	Model      string `json:"model" mapstructure:"model"`
	OSVersion  string `json:"os_version" mapstructure:"os_version"`
	AppVersion string `json:"app_version" mapstructure:"app_version"`
}
