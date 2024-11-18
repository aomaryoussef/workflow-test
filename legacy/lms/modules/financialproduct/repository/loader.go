package repository

import (
	"errors"
	"fmt"
	"log"
	"os"
	"path"
	"strings"

	"github.com/btechlabs/lms-lite/modules/financialproduct/domain"
	"github.com/btechlabs/lms-lite/pkg/yml"
)

// loadAllFinancialProductDefinitions reads financial product yml files
// and returns a list of map containing the financial product definitions.
//
// If any yml is not parsed correctly, then an error will be thrown.
// This will ensure that either all are successfully read or none works.
// Ensure the caller on receiving the error, the app startup is interrupted.
func loadAllFinancialProductDefinitions(assetsPath string) (fps []*FinancialProductYaml, err error) {
	fpDir := path.Join(assetsPath, "financial_products")
	log.Printf("Loading product definitions from %s/financial_products", assetsPath)
	files, err := os.ReadDir(fpDir)
	if err != nil {
		err = errors.Join(fmt.Errorf("cannot read financial_products dir: %s\n", fpDir), err)
		return nil, err
	}

	financialProductDefs := make([]*FinancialProductYaml, 0)

	for _, file := range files {
		if file.IsDir() || !_validFileExtensionFinancialProduct(file.Name()) {
			continue
		}
		filePath := path.Join(fpDir, file.Name())
		financialProductYml := &FinancialProductYaml{}
		if err = yml.ReadYaml(filePath, financialProductYml); err != nil {
			err = errors.Join(fmt.Errorf("cannot read financial product file: %s\n", filePath), err)
			return nil, err
		}

		financialProductDefs = append(financialProductDefs, financialProductYml)
	}

	log.Printf("Loaded %d financial products", len(financialProductDefs))
	return financialProductDefs, nil
}

// constructFinancialProductFromMap constructs a domain.FinancialProduct from the
// map.
func constructFinancialProductFromMap(fpYml *FinancialProductYaml) (fp *domain.FinancialProduct, err error) {

	fpBuilder := domain.NewFinancialProductBuilder().
		SetId(fpYml.Id).
		SetKey(fpYml.Key).
		SetVersion(fpYml.Version).
		SetPreviousVersion(fpYml.PreviousVersion).
		SetName(fpYml.Name).
		SetDescription(fpYml.Description).
		SetActiveSince(fpYml.ActiveSince).
		SetActiveUntil(fpYml.ActiveUntil).
		/********** Config params ****************/
		SetRoundUpMonthlyToNearest(fpYml.Configuration.Interest.RoundingUpMonthlyToNearest).
		/********** Global Attributes ************/
		// Admin Fee
		SetGlobalAdminFeeBuilder(
			domain.NewFinancialProductAdminFeeBuilder().
				SetFeeValue(fpYml.GlobalAttributes.AdminFee.Value).
				SetFeeType(fpYml.GlobalAttributes.AdminFee.Type),
		).
		// Bad Debt
		SetGlobalBadDebtBuilder(
			domain.NewFinancialProductBadDebtBuilder().
				SetBadDebtType(fpYml.GlobalAttributes.BadDebt.Type).
				SetBadDebtValue(fpYml.GlobalAttributes.BadDebt.Value),
		).
		// Grace Period
		SetGlobalGracePeriod(fpYml.GlobalAttributes.GracePeriod.InDays).
		// Allowed Principal Range
		SetGlobalMinPrincipal(fpYml.GlobalAttributes.AllowedPrincipalRange.Min).
		SetGlobalMaxPrincipal(fpYml.GlobalAttributes.AllowedPrincipalRange.Max).
		// Repayment in days
		SetGlobalRepaymentDays(fpYml.GlobalAttributes.RepaymentDaysInMonth)

	/********** Tenor Variants ************/
	for _, tenorVariant := range fpYml.TenorVariants {
		tenorVariantBuilder := domain.NewFinancialProductTenorVariantBuilder().
			SetDurationInDays(tenorVariant.DurationInDays).
			SetKey(tenorVariant.Key).
			SetMaximumDownpayment(domain.NewFinancialProductDownpaymentBuilder().SetType(tenorVariant.MaximumDownpayment.Type).SetValue(tenorVariant.MaximumDownpayment.Value)).
			SetMinimumDownpayment(domain.NewFinancialProductDownpaymentBuilder().SetType(tenorVariant.MinimumDownpayment.Type).SetValue(tenorVariant.MinimumDownpayment.Value))
		// if admin fee is set on the tenor level
		if tenorVariant.AdminFee != nil {
			tenorVariantBuilder.SetAdminFee(domain.NewFinancialProductAdminFeeBuilder().SetFeeType(tenorVariant.AdminFee.Type).SetFeeValue(tenorVariant.AdminFee.Value))
		}
		for _, phase := range tenorVariant.Phases {
			phaseBuilder := domain.NewFinancialProductTenorPhaseBuilder().
				SetInterestBuilder(domain.NewFinancialProductInterestBuilder().SetInterest(phase.Interest.Value)).
				SetLateFeeBuilder(domain.NewFinancialProductLateFeeBuilder().SetLateFeeType(phase.LateFee.Type).SetLateFeeValue(phase.LateFee.Value)).
				SetDurationInDays(phase.DurationInDays)
			tenorVariantBuilder.AddTenorPhaseBuilder(phaseBuilder)
		}

		fpBuilder.AddTenorVariantBuilder(tenorVariantBuilder)
	}

	fp, err = fpBuilder.Build()
	if err != nil {
		return nil, err
	}

	return fp, nil
}

func _validFileExtensionFinancialProduct(file string) bool {
	return strings.HasSuffix(file, "yml") || strings.HasSuffix(file, "yaml")
}
