package main

import (
	"encoding/csv"
	"io"
	"log"
	"strings"
)

func main() {
	in := `key,name,description,active_since,active_until,config_instalment_rounding_type,global_grace_period_days,global_min_principal,global_max_principal,global_available_repayment_days,global_vat_percent,tenor_3_months,tenor_3_months_min_downpayment,tenor_3_months_max_downpayment,tenor_3_months_admin_fee_percent,tenor_3_months_interest_percent,tenor_6_months,tenor_6_months_min_downpayment,tenor_6_months_max_downpayment,tenor_6_months_admin_fee_percent,tenor_6_months_interest_percent,tenor_12_months,tenor_12_months_min_downpayment,tenor_12_months_max_downpayment,tenor_12_months_admin_fee_percent,tenor_12_months_interest_percent,tenor_24_months,tenor_24_months_min_downpayment,tenor_24_months_max_downpayment,tenor_24_months_admin_fee_percent,tenor_24_months_interest_percent,tenor_36_months,tenor_36_months_min_downpayment,tenor_36_months_max_downpayment,tenor_36_months_admin_fee_percent,tenor_36_months_interest_percent,tenor_48_months,tenor_48_months_min_downpayment,tenor_48_months_max_downpayment,tenor_48_months_admin_fee_percent,tenor_48_months_interest_percent
home-furnishing-01,Home Furnishing Loan,Financing for furniture and home decor,,,round_up,5,200,50000,1,20,Enabled,100,10000,5,10,Enabled,200,20000,6,12,Enabled,300,30000,7,14,Enabled,500,40000,8,16,Enabled,700,50000,9,18,Enabled,900,50000,10,20
travel-loan-02,Travel Loan,Loan for financing travel expenses,,,round_up,7,1000,20000,1,18,Enabled,200,3000,5,8,Enabled,400,6000,6,10,Enabled,600,9000,7,12,Enabled,800,12000,8,14,Enabled,1000,15000,9,16,Enabled,1200,18000,10,18
mini-loan-03,Mini Loan,Short-term loans for quick financial needs,,,round_up,2,50,1000,1,15,Enabled,5,100,1,2,Enabled,10,200,2,3,Enabled,15,300,3,4,Enabled,20,400,4,5,Enabled,25,500,5,6,Enabled,30,600,6,7
electronics-loan-04,Electronics Loan,Loan for purchasing electronic devices,,,round_up,3,500,100000,1,14,Enabled,1200,50000,10,20,Enabled,1500,75000,12,30,Enabled,2000,100000,15,35,Enabled,2500,100000,17,38,Enabled,3000,100000,18,40,Enabled,3500,100000,19,42
home-improvement-05,Home Improvement Loan,Loans for home renovations and improvements,,,round_up,10,1000,75000,1,17,Enabled,500,15000,7,13,Enabled,1000,30000,8,15,Enabled,1500,45000,9,17,Enabled,2000,60000,10,19,Enabled,2500,75000,11,21,Enabled,3000,75000,12,23
travel-loan-06,Travel Loan,Loan for financing travel expenses,,,round_up,7,1000,20000,1,18,Enabled,300,4000,6,9,Enabled,500,8000,8,12,Enabled,700,12000,10,15,Enabled,900,15000,12,18,Enabled,1100,18000,14,21,Enabled,1300,20000,16,24
personal-loan-07,Personal Loan,Loan for personal expenses,,,round_up,5,500,50000,1,20,Enabled,500,10000,5,10,Enabled,1000,20000,6,12,Enabled,1500,30000,7,14,Enabled,2000,40000,8,16,Enabled,2500,50000,9,18,Enabled,3000,50000,10,20
car-loan-08,Car Loan,Loan for purchasing a car,,,round_up,10,5000,100000,1,14,Enabled,3000,20000,10,20,Enabled,4000,40000,12,30,Enabled,5000,60000,15,35,Enabled,6000,80000,17,38,Enabled,7000,100000,18,40,Enabled,8000,100000,19,42
education-loan-09,Education Loan,Loan for financing education expenses,,,round_up,15,1000,50000,1,12,Enabled,1000,10000,5,10,Enabled,2000,20000,6,12,Enabled,3000,30000,7,14,Enabled,4000,40000,8,16,Enabled,5000,50000,9,18,Enabled,6000,50000,10,20
medical-loan-10,Medical Loan,Loan for financing medical expenses,,,round_up,3,1000,20000,1,15,Enabled,500,5000,5,10,Enabled,1000,10000,6,12,Enabled,1500,15000,7,14,Enabled,2000,20000,8,16,Enabled,2500,25000,9,18,Enabled,3000,30000,10,20
`
	// 0. Array of maps as result
	result := make([]map[string]interface{}, 0)
	// 1. Load CSV
	r := csv.NewReader(strings.NewReader(in))
	rows := make([][]string, 0)
	for {
		record, err := r.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Fatal(err)
		}
		rows = append(rows, record)
	}

	header := rows[0]
	for i := 1; i < len(rows); i++ {
		values := rows[i]
		record := make(map[string]interface{})
		for j := 0; j < len(values); j++ {
			record[header[j]] = values[j]
		}
		result = append(result, record)
	}

	for i := 0; i < len(result); i++ {
		println(result[i]["tenor_6_months_admin_fee_percent"])
	}
}
