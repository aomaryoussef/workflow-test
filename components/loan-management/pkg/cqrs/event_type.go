package cqrs

import (
	"fmt"
	pbcommon "github.com/btechlabs/lms/gen/pb/common"
	pbEvent "github.com/btechlabs/lms/gen/pb/event"
	"google.golang.org/protobuf/proto"
)

func unmarshalPayload(et pbcommon.EventType, b []byte) (proto.Message, error) {
	var payload proto.Message
	switch et {
	case pbcommon.EventType_FINANCIAL_PRODUCT_CREATED:
		payload = &pbEvent.FinancialProductCreatedEventPayload{}
	case pbcommon.EventType_FINANCIAL_PRODUCT_UPDATED:
		payload = &pbEvent.FinancialProductUpdatedEventPayload{}
	case pbcommon.EventType_FINANCIAL_PRODUCT_APPROVED:
		payload = &pbEvent.FinancialProductApprovedEventPayload{}
	case pbcommon.EventType_FINANCIAL_PRODUCT_PUBLISHED:
		payload = &pbEvent.FinancialProductPublishedEventPayload{}
	case pbcommon.EventType_FINANCIAL_PRODUCT_UNPUBLISHED:
		payload = &pbEvent.FinancialProductUnpublishedEventPayload{}
	case pbcommon.EventType_FINANCIAL_PRODUCT_DELETED:
		payload = &pbEvent.FinancialProductDeletedEventPayload{}

	case pbcommon.EventType_LOAN_ACCOUNT_CREATED:
		payload = &pbEvent.LoanAccountCreatedEventPayload{}
	case pbcommon.EventType_LOAN_ACCOUNT_ACTIVATED:
		payload = &pbEvent.LoanAccountActivatedEventPayload{}
	case pbcommon.EventType_LOAN_ACCOUNT_CANCELED:
		payload = &pbEvent.LoanAccountCanceledEventPayload{}
	case pbcommon.EventType_LOAN_ACCOUNT_EARLY_SETTLEMENT:
		payload = &pbEvent.LoanAccountEarlySettledEventPayload{}
	case pbcommon.EventType_LOAN_ACCOUNT_PAYMENT_BOOKED:
		payload = &pbEvent.LoanAccountPaymentAppliedEventPayload{}
	case pbcommon.EventType_LOAN_ACCOUNT_INTEREST_REVENUE_RECOGNIZED:
		payload = &pbEvent.LoanAccountRevenueRecognisedEventPayload{}

	case pbcommon.EventType_PAYMENT_BOOKED:
		payload = &pbEvent.PaymentBookedEventPayload{}
	default:
		return nil, fmt.Errorf("eventsource type not supported for unmarshal payload: %s", et.String())
	}

	err := UnmarshalPayload(b, payload)
	return payload, err
}

// MarshalPayload converts the Payload into a byte array
// representation for efficient storage.
// The Payload is defined using Protocol Buffers.
func MarshalPayload(payload proto.Message) ([]byte, error) {
	return proto.Marshal(payload)
}

// UnmarshalPayload converts the byte array representation
// of the Payload back into the original Payload type.
func UnmarshalPayload(b []byte, t proto.Message) error {
	return proto.Unmarshal(b, t)
}
