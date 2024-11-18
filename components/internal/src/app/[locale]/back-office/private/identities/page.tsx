import React, { Suspense } from "react";
import { NextPage } from "next";
import { List } from "@refinedev/antd";
import IdentitiesTable from "@/app/[locale]/back-office/components/identities-table/IdentitiesTable.tsx";

const IdentitiesPage: NextPage = async () => {
  const { identities, error } = await getData();

  if (error) {
    return <div>{error}</div>;
  }

  return <List>
    <Suspense>
      {identities && (<IdentitiesTable identities={identities} />)}
    </Suspense>
  </List>
};

export default IdentitiesPage;

async function getData() {
  const API_URL = process.env.KRATOS_IDENTITIES ?? '';
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return {
      identities: data,
      total: 0,
      error: null,
    };
  } catch (error) {
    let errorMessage = "Failed to fetch identities";
    if(error instanceof Error) {
      errorMessage += error.message;
    }
    return {
      identities: [],
      total: 0,
      error: errorMessage,
    }
  }
}