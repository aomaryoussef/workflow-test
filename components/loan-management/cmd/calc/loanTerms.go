package calc

import (
	"fmt"
	"github.com/btechlabs/lms/config"
	"github.com/btechlabs/lms/internal/fincalc"
	"github.com/btechlabs/lms/internal/types"
	"github.com/btechlabs/lms/pkg/money"
	"github.com/btechlabs/lms/pkg/timex"
	"github.com/jedib0t/go-pretty/v6/table"
	"github.com/spf13/cobra"
	"math"
	"os"
	"time"
)

var flatInterestRate float64
var durationMonths int
var financedAmount float64
var bookingDate string
var repaymentDay int

var loanTermsCmd = &cobra.Command{
	Use:   "loan-terms",
	Short: "Calculate and show loan terms based on inputs",
	Run: func(cmd *cobra.Command, args []string) {
		flatRateBasisPoints := types.PercentBasisPoints(uint32(math.Round(flatInterestRate * 100)))
		durationInDays := uint32(durationMonths) * config.DaysInMonth
		financedAmountMoney := money.NewMoney(uint64(math.Round(financedAmount*100)), money.EgyptianPound)

		fmt.Println("\nCalculating loan terms based on following inputs...")
		printInputs(flatRateBasisPoints, durationInDays, financedAmountMoney)

		// Calculate and print loan terms
		monthlyInstalment := fincalc.MonthlyInstalment(*financedAmountMoney, durationInDays, flatRateBasisPoints.Primitive(), true)
		mer, err := fincalc.MonthlyEffectiveRate(*financedAmountMoney, durationInDays, monthlyInstalment)
		if err != nil {
			fmt.Printf("error calculating monthly effective rate: %s\n", err.Error())
			return
		}

		apr := fincalc.AnnualPercentageRate(*financedAmountMoney, monthlyInstalment, *money.NewMoney(0, money.EgyptianPound), durationInDays)

		ammortisations := make([]fincalc.AmmortisationLineItem, 0)
		if bookingDate != "" && repaymentDay > 0 && repaymentDay <= 31 {
			bookingDateTime, err := time.Parse("2006-01-02", bookingDate)
			if err != nil {
				fmt.Printf("error parsing booking date (please check the format): %s\n", err.Error())
				return
			}
			bookingDateUTC := timex.NewUtcTime(bookingDateTime)
			// Calculate and print loan terms with booking date and repayment day
			ammortisations, err = fincalc.AmmortizationSchedule(*financedAmountMoney, bookingDateUTC, durationInDays, monthlyInstalment, mer, repaymentDay, config.LoanAmmoritisationBookingCutOffDay, uint32(3))
			if err != nil {
				fmt.Printf("error calculating ammortisation schedule: %s\n", err.Error())
				return
			}
		}

		printLoanTerms(monthlyInstalment, mer, apr, ammortisations)
	},
}

func init() {
	loanTermsCmd.Flags().Float64VarP(&flatInterestRate, "flat-rate", "f", 0, "flat interest rate for the full term (as a percentage with 2 decimal places)")
	loanTermsCmd.Flags().IntVarP(&durationMonths, "duration", "d", 0, "duration of the loan in months")
	loanTermsCmd.Flags().Float64VarP(&financedAmount, "financed-amount", "a", 0, "amount financed for the loan (as a decimal number with 2 decimal places)")
	loanTermsCmd.Flags().StringVarP(&bookingDate, "booking-date", "b", "", "booking date for the loan (format: yyyy-mm-dd)")
	loanTermsCmd.Flags().IntVarP(&repaymentDay, "repayment-day", "r", 0, "repayment day of the month for the consumer")
}

func printInputs(flatRateBasisPoints types.PercentBasisPoints, durationInDays uint32, financedAmountMoney *money.Money) {
	t := table.NewWriter()
	t.SetOutputMirror(os.Stdout)
	t.SetTitle("Loan Terms Inputs")
	t.AppendRows([]table.Row{
		{"Flat Interest Rate:", flatRateBasisPoints.String()},
		{"Duration in Months and Days:", fmt.Sprintf("%d months/ %d days", durationMonths, durationInDays)},
		{"Financed Amount:", financedAmountMoney.String()},
	})
	t.AppendSeparator()
	t.Render()
}

func printLoanTerms(monthlyInstalment money.Money, mer float64, apr float64, ammortisations []fincalc.AmmortisationLineItem) {
	t := table.NewWriter()
	t.SetOutputMirror(os.Stdout)
	t.SetTitle("Loan Terms")
	t.AppendRows([]table.Row{
		{"Monthly Instalment:", monthlyInstalment.String()},
		{"Monthly Effective Rate:", fmt.Sprintf("%f / %.2f%%", mer, mer*100)},
		{"Annual Percentage Rate (%):", fmt.Sprintf("%.2f%%", apr*100)},
	})
	t.AppendSeparator()
	t.Render()

	if len(ammortisations) > 0 {
		t := table.NewWriter()
		t.SetOutputMirror(os.Stdout)
		t.SetTitle("Ammortisation Schedule")
		t.AppendHeader(table.Row{"#", "Instalment Date", "Instalment Amount", "Principal Due", "Interest Due", "Outstanding Principal"})

		totalInstalmentAmount := money.NewMoney(0, money.EgyptianPound)
		totalPrincipalDue := money.NewMoney(0, money.EgyptianPound)
		totalInterestDue := money.NewMoney(0, money.EgyptianPound)
		for i, ammortisation := range ammortisations {
			totalInstalmentAmount.MustMutateAdd(&ammortisation.TotalInstalmentDue)
			totalPrincipalDue.MustMutateAdd(&ammortisation.PrincipalDue)
			totalInterestDue.MustMutateAdd(&ammortisation.InterestDue)

			t.AppendRow(table.Row{
				i + 1,
				ammortisation.InstalmentDueDate.Format("2006-01-02"),
				ammortisation.TotalInstalmentDue.String(),
				ammortisation.PrincipalDue.String(),
				ammortisation.InterestDue.String(),
				ammortisation.LoanBalance.String(),
			})
		}

		t.AppendSeparator()

		t.AppendRow(table.Row{"-", "TOTAL", totalInstalmentAmount.String(), totalPrincipalDue.String(), totalInterestDue.String(), "-"})
		t.AppendSeparator()
		t.Render()
	}
}
