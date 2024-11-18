package domain

import (
	"math"
	"time"
	
	"github.com/btechlabs/lms-lite/pkg/money"
)

func BookRepayment(scheduleItems *[]LoanPaymentScheduleLineItem, paidAmount money.Money, bookingTime time.Time) (remainingPaidAmountM *money.Money, totalLateFeePaidM *money.Money, totalInterestPaidM *money.Money, totalPrincipalPaidM *money.Money, err error) {
	remainingPaidAmount, totalLateFeePaid, totalInterestPaid, totalPrincipalPaid := paidAmount.Units(), uint64(0), uint64(0), uint64(0)
	
	// We prioritise repaying lateFee over interest+principal
	for i := 0; i < len((*scheduleItems)); i++ {
		if remainingPaidAmount == 0 || (*scheduleItems)[i].InstalmentDueDateUTC().After(bookingTime) {
			break
		}
		
		entryLateFeeDueMoney := (*scheduleItems)[i].LateFeeDue()
		entryLateFeeDue := entryLateFeeDueMoney.Units()
		entryLateFeePaid := (*scheduleItems)[i].PaidLateFee().UnitsOrZero()
		if entryLateFeeDue-entryLateFeePaid > 0 {
			if remainingPaidAmount >= entryLateFeeDue-entryLateFeePaid {
				// customer can pay off all the lateFee for given schedule entry
				remainingPaidAmount -= entryLateFeeDue - entryLateFeePaid
				(*scheduleItems)[i].paidLateFee = money.NewMoney(entryLateFeeDue)
				totalLateFeePaid += entryLateFeeDue - entryLateFeePaid
			} else {
				// customer can only partially pay off lateFees
				(*scheduleItems)[i].paidLateFee = money.NewMoney(entryLateFeePaid + remainingPaidAmount)
				totalLateFeePaid += remainingPaidAmount
				remainingPaidAmount -= remainingPaidAmount
			}
		}
	}
	
	for i := 0; i < len((*scheduleItems)); i++ {
		if remainingPaidAmount == 0 || (*scheduleItems)[i].InstalmentDueDateUTC().After(bookingTime) {
			break
		}
		
		entryInterestDueMoney := (*scheduleItems)[i].InterestDue()
		entryPrincipalDueMoney := (*scheduleItems)[i].PrincipalDue()
		entryPaidPrincipal := (*scheduleItems)[i].PaidPrincipal().UnitsOrZero()
		entryPaidInterest := (*scheduleItems)[i].PaidInterest().UnitsOrZero()
		entryInterestDue := entryInterestDueMoney.UnitsOrZero()
		entryPrincipalDue := entryPrincipalDueMoney.UnitsOrZero()
		
		if entryInterestDue > entryPaidInterest || entryPrincipalDue > entryPaidPrincipal {
			
			toBePaidForEntry := entryInterestDue + entryPrincipalDue - entryPaidInterest - entryPaidPrincipal
			if remainingPaidAmount >= toBePaidForEntry {
				remainingPaidAmount -= toBePaidForEntry
				totalInterestPaid += entryInterestDue - entryPaidInterest
				totalPrincipalPaid += entryPrincipalDue - entryPaidPrincipal
				(*scheduleItems)[i].paidInterest = money.NewMoney(entryInterestDue)
				(*scheduleItems)[i].paidPrincipal = money.NewMoney(entryPrincipalDue)
			} else {
				interestRatio := float64(entryInterestDue) / float64(entryPrincipalDue+entryInterestDue)
				principalRatio := 1 - interestRatio
				
				// if customer can not make a full payment, the money is divided between interest and principal,
				// the ratio being the same as the ratio between interest and principal due
				newPaidInterest := entryPaidInterest + uint64(math.Round(float64(remainingPaidAmount)*interestRatio)) // TODO: if both paid*interest and paid*principal end in .5, we get an extra cent because of rounding
				newPaidPrincipal := entryPaidPrincipal + uint64(math.Round(float64(remainingPaidAmount)*principalRatio))
				(*scheduleItems)[i].paidInterest = money.NewMoney(newPaidInterest)
				(*scheduleItems)[i].paidPrincipal = money.NewMoney(newPaidPrincipal)
				remainingPaidAmount -= remainingPaidAmount
				totalInterestPaid += newPaidInterest - entryPaidInterest
				totalPrincipalPaid += newPaidPrincipal - entryPaidPrincipal
			}
		}
	}
	
	return money.NewMoney(remainingPaidAmount), money.NewMoney(totalLateFeePaid), money.NewMoney(totalInterestPaid), money.NewMoney(totalPrincipalPaid), nil
}
