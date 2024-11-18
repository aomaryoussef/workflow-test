import { List } from "@refinedev/antd";
import React from "react";
import FinancesTable from "@/app/[locale]/back-office/components/finances-table/FinancesTable.tsx";

const FinancesPage = () => {
  return (
    <List data-testid="finances-table">
      <FinancesTable />
    </List>
  );
};

export default FinancesPage;
