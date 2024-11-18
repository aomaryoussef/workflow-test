package domain

import "time"

type PartyAccountStatus string

const (
	PartyAccountStatusActive   PartyAccountStatus = "ACTIVE"
	PartyAccountStatusInactive PartyAccountStatus = "INACTIVE"
)

type PartyAccountType string

const (
	PartyAccountTypeIndividual PartyAccountType = "INDIVIDUAL_ACCOUNT"
	PartyAccountTypeMerchant   PartyAccountType = "MERCHANT_ACCOUNT"
)

type PartyAccount struct {
	Id                int
	GlobalReferenceId string
	GeneralAccountId  string
	Status            PartyAccountStatus
	Type              PartyAccountType
	CreatedAt         time.Time
	UpdatedAt         time.Time
}

func NewPartyAccount(globalReferenceId string, status PartyAccountStatus, accountType PartyAccountType) *PartyAccount {
	return &PartyAccount{
		GlobalReferenceId: globalReferenceId,
		Type:              accountType,
		Status:            status,
		CreatedAt:         time.Now(),
		UpdatedAt:         time.Now(),
	}
}

func (ma *PartyAccount) IsActive() bool {
	return ma.Status == PartyAccountStatusActive
}
