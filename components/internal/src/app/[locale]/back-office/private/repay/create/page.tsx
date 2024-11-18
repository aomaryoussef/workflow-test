"use client";
import { Tabs } from "antd";
import React, { useState } from "react";

import CheckConsumer from "@/app/[locale]/back-office/components/repayment/CheckConsumer";
import ConsumerInfo from "@/app/[locale]/back-office/components/repayment/ConsumerInfo";
import LoanDetails from "@/app/[locale]/back-office/components/repayment/MonthlyInstallments";
import { useTypedTranslation } from "@/app/common/hooks/useTypedTranslation";

import { LoanDetails as Loans, User } from "../types";

const LoanListing = () => {
  const [consumerData, setConsumerData] = useState<User[]>([]);
  const [upComingLoans, setUpComingLoans] = useState<Loans[]>([]);
  const t = useTypedTranslation();

  const handleDataUpdate = (data: User[]) => {
    setConsumerData(data);
  };
  const handleUpcomingLoans = (data: Loans[] | { error: string }) => {
    if ("error" in data) {
      return;
    }
    setUpComingLoans(data);
  };

  const items = [
    {
      key: "1",
      label: (
        <div style={{ marginLeft: "20px", marginRight: "20px", fontWeight: "bold", fontSize: "18px" }}>
          {t("repay.monthlyInstallements")}
        </div>
      ),
      children: <LoanDetails data={upComingLoans} />,
    },
    // {
    //   key: "2",
    //   label: (
    //     <div style={{ marginLeft: "20px", marginRight: "20px", fontWeight: "bold", fontSize: "18px" }}>
    //       {t("repay.paymentHistory")}
    //     </div>
    //   ),
    //   children: <PaymentHistory />,
    // },
    // {
    //   key: "3",
    //   label: (
    //     <div style={{ marginLeft: "20px", marginRight: "20px", fontWeight: "bold", fontSize: "18px" }}>
    //       {t("repay.earlySettlement")}
    //     </div>
    //   ),
    //   children: <EarlySettlement data={consumerData} />,
    // },
  ];
  return (
    <div>
      {consumerData.length == 0 && (
        <CheckConsumer onDataUpdate={handleDataUpdate} upComingLoansData={handleUpcomingLoans}></CheckConsumer>
      )}
      {consumerData.length > 0 && (
        <>
          <ConsumerInfo data={consumerData}></ConsumerInfo> <Tabs items={items} />
        </>
      )}
    </div>
  );
};

export default LoanListing;
