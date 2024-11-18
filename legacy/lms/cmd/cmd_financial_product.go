package cmd

import (
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"
	
	"github.com/MakeNowJust/heredoc"
	"github.com/btechlabs/lms-lite/modules"
	financialProductModule "github.com/btechlabs/lms-lite/modules/financialproduct"
	"github.com/btechlabs/lms-lite/modules/financialproduct/dto"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/btechlabs/lms-lite/pkg/money"
	"github.com/spf13/cobra"
)

var (
	productKey           string
	productVersion       string
	tenorKey             string
	fees                 uint64
	principalAmountUnits uint64
)
var financialProductCmd = &cobra.Command{
	Use:   "financial-product <command> [flags]",
	Short: "Interact with the LMS Financial Products",
	
	SilenceUsage:  true,
	SilenceErrors: true,
	
	Example: heredoc.Doc(`
		$ lms financial-product list --all`),
	Annotations: map[string]string{
		"help:feedback": heredoc.Doc(`
			Open an issue at https://github.com/btechlabs/lms-lite`),
	},
	Version: version,
	Run:     func(cmd *cobra.Command, args []string) {},
}

var financialProductListCmd = &cobra.Command{
	Use:   "list [flags]",
	Short: "List all financial products",
	
	SilenceUsage:  true,
	SilenceErrors: true,
	
	Example: heredoc.Doc(`
		$ lms financial-product list --all`),
	Annotations: map[string]string{
		"help:feedback": heredoc.Doc(`
			Open an issue at https://github.com/btechlabs/lms-lite`),
	},
	Version: version,
	Run:     handleFinancialProductListCmd,
}

var financialProductDetailsCmd = &cobra.Command{
	Use:   "show",
	Short: "Show details of a financial product",
	
	SilenceUsage:  true,
	SilenceErrors: true,
	
	Example: heredoc.Doc(`
		$ lms financial-product show --key=abc --version=1`),
	Annotations: map[string]string{
		"help:feedback": heredoc.Doc(`
			Open an issue at https://github.com/btechlabs/lms-lite`),
	},
	Version: version,
	Run:     handleFinancialProductDetailsCmd,
}

var financialProductAmmortisationCmd = &cobra.Command{
	Use:   "ammortization [flags]",
	Short: "Display the loan ammortization for a principal and tenor",
	
	SilenceUsage:  true,
	SilenceErrors: true,
	
	Example: heredoc.Doc(`
		$ lms financial-product ammortization --principal=10089 --tenor=12_Months --key=test-financial-product --ver=1`),
	Annotations: map[string]string{
		"help:feedback": heredoc.Doc(`
			Open an issue at https://github.com/btechlabs/lms-lite`),
	},
	Version: version,
	Run:     handleFinancialProductAmmortisationCmd,
}

var financialProductAnnualPercentageRateCmd = &cobra.Command{
	Use:   "annual-percentage-rate [flags]",
	Short: "Display the annual percentage rate for a principal and tenor",
	
	SilenceUsage:  true,
	SilenceErrors: true,
	
	Example: heredoc.Doc(`
		$ lms financial-product annual-percentage-rate --tenor=12_Months --key=test-financial-product --ver=1 --principal=10089 --fees=200`),
	Annotations: map[string]string{
		"help:feedback": heredoc.Doc(`
			Open an issue at https://github.com/btechlabs/lms-lite`),
	},
	Version: version,
	Run:     handleFinancialProductAnnualPercentagerateCmd,
}

var financialProductMonthlyEffectiveRateCmd = &cobra.Command{
	Use:   "monthly-rate [flags]",
	Short: "Display the monthly effective rate for a principal and tenor",
	
	SilenceUsage:  true,
	SilenceErrors: true,
	
	Example: heredoc.Doc(`
		$ lms financial-product monthly-rate --tenor=12_Months --key=test-financial-product --ver=1`),
	Annotations: map[string]string{
		"help:feedback": heredoc.Doc(`
			Open an issue at https://github.com/btechlabs/lms-lite`),
	},
	Version: version,
	Run:     handleFinancialProductMonthlyEffectiveRateCmd,
}

func init() {
	rootCmd.AddCommand(financialProductCmd)
	financialProductCmd.AddCommand(financialProductListCmd)
	financialProductCmd.AddCommand(financialProductDetailsCmd)
	financialProductCmd.AddCommand(financialProductAmmortisationCmd)
	financialProductCmd.AddCommand(financialProductAnnualPercentageRateCmd)
	financialProductCmd.AddCommand(financialProductMonthlyEffectiveRateCmd)
	
	financialProductDetailsCmd.Flags().StringVarP(&productKey, "key", "k", "", "product key")
	_ = financialProductDetailsCmd.MarkFlagRequired("key")
	financialProductDetailsCmd.Flags().StringVarP(&productVersion, "ver", "v", "1", "product version")
	_ = financialProductDetailsCmd.MarkFlagRequired("ver")
	
	financialProductAmmortisationCmd.Flags().StringVarP(&productKey, "key", "k", "", "product key")
	_ = financialProductAmmortisationCmd.MarkFlagRequired("key")
	financialProductAmmortisationCmd.Flags().StringVarP(&productVersion, "ver", "v", "1", "product version")
	_ = financialProductAmmortisationCmd.MarkFlagRequired("ver")
	financialProductAmmortisationCmd.Flags().StringVarP(&tenorKey, "tenor", "t", "1", "tenor key")
	_ = financialProductAmmortisationCmd.MarkFlagRequired("tenor")
	financialProductAmmortisationCmd.Flags().Uint64VarP(&principalAmountUnits, "principal", "p", 100000, "principal value in cents")
	_ = financialProductAmmortisationCmd.MarkFlagRequired("principal")
	financialProductAmmortisationCmd.SetFlagErrorFunc(handleFlagErrors)
	
	financialProductMonthlyEffectiveRateCmd.Flags().StringVarP(&productKey, "key", "k", "", "product key")
	_ = financialProductMonthlyEffectiveRateCmd.MarkFlagRequired("key")
	financialProductMonthlyEffectiveRateCmd.Flags().StringVarP(&productVersion, "ver", "v", "1", "product version")
	_ = financialProductMonthlyEffectiveRateCmd.MarkFlagRequired("ver")
	financialProductMonthlyEffectiveRateCmd.Flags().StringVarP(&tenorKey, "tenor", "t", "1", "tenor key")
	_ = financialProductMonthlyEffectiveRateCmd.MarkFlagRequired("tenor")
	financialProductMonthlyEffectiveRateCmd.Flags().Uint64VarP(&principalAmountUnits, "principal", "p", 100000, "principal value in cents")
	_ = financialProductMonthlyEffectiveRateCmd.MarkFlagRequired("principal")
	financialProductMonthlyEffectiveRateCmd.SetFlagErrorFunc(handleFlagErrors)
	
	financialProductAnnualPercentageRateCmd.Flags().StringVarP(&productKey, "key", "k", "", "product key")
	_ = financialProductAnnualPercentageRateCmd.MarkFlagRequired("key")
	financialProductAnnualPercentageRateCmd.Flags().StringVarP(&productVersion, "ver", "v", "1", "product version")
	_ = financialProductAnnualPercentageRateCmd.MarkFlagRequired("ver")
	financialProductAnnualPercentageRateCmd.Flags().StringVarP(&tenorKey, "tenor", "t", "1", "tenor key")
	_ = financialProductAnnualPercentageRateCmd.MarkFlagRequired("tenor")
	financialProductAnnualPercentageRateCmd.Flags().Uint64VarP(&principalAmountUnits, "principal", "p", 100000, "principal value in cents")
	_ = financialProductAnnualPercentageRateCmd.MarkFlagRequired("principal")
	financialProductAnnualPercentageRateCmd.Flags().Uint64VarP(&fees, "fees", "f", 200, "fees")
	_ = financialProductAnnualPercentageRateCmd.MarkFlagRequired("fees")
	financialProductAnnualPercentageRateCmd.SetFlagErrorFunc(handleFlagErrors)
}

func handleFlagErrors(cmd *cobra.Command, err error) error {
	if strings.Contains(err.Error(), "--principal") {
		log.Fatal("Invalid format of number provided as principal, please check. Decimal values are not supported, all monetary values in integers and cents. Error: ", err)
	}
	log.Fatal(err)
	return err
}

func handleFinancialProductListCmd(cmd *cobra.Command, args []string) {
	ctx := cmd.Context()
	envConfig := loadEnvConfig()
	err := logging.InitLogger(envConfig.DebugLevel, envConfig.AppName, envConfig.Environment)
	if err != nil {
		log.Fatal("failed to init logger")
	}
	application := modules.NewApplication(envConfig)
	
	m, err := application.GetModule(financialProductModule.FinancialProductModuleName)
	if err != nil {
		panic(err)
	}
	financialProduct := m.(*financialProductModule.FinancialProductModule)
	financialProducts := financialProduct.GetUseCase().RetrieveAllActiveProducts(ctx)
	
	headers := []string{"ID", "Key", "Version", "Name", "Description", "Active Since", "Active Until", "Is Currently Active"}
	rows := make([][]string, 0)
	for _, fp := range financialProducts {
		row := make([]string, 8)
		row[0] = fp.Id()
		row[1] = fp.Key()
		row[2] = fp.Version()
		row[3] = fp.Name()
		row[4] = fp.Description()
		row[5] = fp.ActiveSince().String()
		row[6] = fp.ActiveUntil().String()
		row[7] = strconv.FormatBool(fp.IsActive())
		rows = append(rows, row)
	}
	
	printTable(headers, rows)
}

func handleFinancialProductDetailsCmd(cmd *cobra.Command, args []string) {
	ctx := cmd.Context()
	envConfig := loadEnvConfig()
	err := logging.InitLogger(envConfig.DebugLevel, envConfig.AppName, envConfig.Environment)
	if err != nil {
		log.Fatal("failed to init logger")
	}
	application := modules.NewApplication(envConfig)
	
	m, err := application.GetModule(financialProductModule.FinancialProductModuleName)
	if err != nil {
		panic(err)
	}
	financialProduct := m.(*financialProductModule.FinancialProductModule)
	fp, err := financialProduct.GetUseCase().GetProduct(ctx, productKey, productVersion, true)
	if err != nil {
		fmt.Println("No financial product found with the given request")
		return
	}
	
	fmt.Println(fp)
}

func handleFinancialProductAmmortisationCmd(cmd *cobra.Command, args []string) {
	ctx := cmd.Context()
	envConfig := loadEnvConfig()
	err := logging.InitLogger(envConfig.DebugLevel, envConfig.AppName, envConfig.Environment)
	if err != nil {
		log.Fatal("failed to init logger")
	}
	application := modules.NewApplication(envConfig)
	
	nowUtc := time.Now().UTC()
	asr := dto.AmmortizationScheduleRequest{
		TenorKey:                tenorKey,
		FinancialProductKey:     productKey,
		FinancialProductVersion: productVersion,
		NetPrincipalAmount:      *money.NewMoney(principalAmountUnits),
		LoanBookingTimeUTC:      nowUtc,
	}
	
	m, err := application.GetModule(financialProductModule.FinancialProductModuleName)
	if err != nil {
		panic(err)
	}
	financialProduct := m.(*financialProductModule.FinancialProductModule)
	
	as, err := financialProduct.GetUseCase().CalculateAmmortizationSchedule(ctx, asr)
	if err != nil {
		fmt.Println("No financial product found with the given request")
		return
	}
	
	headers := []string{"Installment", "Installment Date", "Loan Balance", "Principal Due", "Interest Due", "TotalInstalmentDue"}
	rows := make([][]string, 0)
	rowNum := 1
	for _, s := range as.PaymentSchedule {
		row := make([]string, 6)
		row[0] = fmt.Sprintf("%d", rowNum)
		row[1] = s.InstalmentDueDateUTC.Format(time.DateOnly)
		row[2] = s.LoanBalance.ReadableNotation()
		row[3] = s.PrincipalDue.ReadableNotation()
		row[4] = s.InterestDue.ReadableNotation()
		row[5] = s.TotalInstalmentDue.ReadableNotation()
		rows = append(rows, row)
		rowNum++
	}
	
	printTable(headers, rows)
	
}

func handleFinancialProductAnnualPercentagerateCmd(cmd *cobra.Command, args []string) {
	ctx := cmd.Context()
	envConfig := loadEnvConfig()
	err := logging.InitLogger(envConfig.DebugLevel, envConfig.AppName, envConfig.Environment)
	if err != nil {
		log.Fatal("failed to init logger")
	}
	application := modules.NewApplication(envConfig)
	
	m, err := application.GetModule(financialProductModule.FinancialProductModuleName)
	if err != nil {
		panic(err)
	}
	financialProductModule := m.(*financialProductModule.FinancialProductModule)
	
	fp, err := financialProductModule.GetUseCase().GetProduct(ctx, productKey, productVersion, true)
	
	if err != nil {
		fmt.Println("No financial product found with the given request")
		return
	}
	
	percentageRate, err := fp.AnnualPercentageRate(money.NewMoney(principalAmountUnits), money.NewMoney(fees), tenorKey)
	
	if err != nil {
		fmt.Println("No financial product found with the given request")
		return
	}
	
	fmt.Printf("%.5f%%\n", percentageRate*100)
}

func handleFinancialProductMonthlyEffectiveRateCmd(cmd *cobra.Command, args []string) {
	ctx := cmd.Context()
	envConfig := loadEnvConfig()
	err := logging.InitLogger(envConfig.DebugLevel, envConfig.AppName, envConfig.Environment)
	if err != nil {
		log.Fatal("failed to init logger")
	}
	application := modules.NewApplication(envConfig)
	
	m, err := application.GetModule(financialProductModule.FinancialProductModuleName)
	if err != nil {
		panic(err)
	}
	financialProductModule := m.(*financialProductModule.FinancialProductModule)
	
	fp, err := financialProductModule.GetUseCase().GetProduct(ctx, productKey, productVersion, true)
	
	if err != nil {
		fmt.Println("No financial product found with the given request")
		return
	}
	
	interestRate, err := fp.MonthlyEffectiveRate(tenorKey, money.NewMoney(principalAmountUnits))
	
	if err != nil {
		fmt.Println("No financial product found with the given request")
		return
	}
	
	fmt.Printf("%.5f%%\n", interestRate*100)
}
