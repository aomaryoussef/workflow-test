import { CONSUMERS_LIST_QUERY } from "@/app/[locale]/back-office/graphql/queries.ts";

import { List } from "@refinedev/antd";
import dataProvider, { GetFieldsFromList } from "@refinedev/hasura";
import { NextPage } from "next";
import ConsumerTable from "@/app/[locale]/back-office/components/consumer-table/ConsumerTable.tsx";
import { Suspense } from "react";

import createClient from "@/app/services/hasura-server-provider";
import { ConsumerListQuery } from "@/app/[locale]/back-office/graphql/types.ts";
import { Consumer } from "@/app/[locale]/back-office/graphql/schema.types.ts";

const ConsumersList: NextPage = async () => {
  const { consumers, error } = await getData();
  const users:({ id: string; phone: string } & Omit<Partial<Consumer>, 'consumer_user_mappings'>)[] = consumers?.map((consumer) => {
    return {
      ...consumer,
      ...consumer.consumer_user_mappings[0].user_detail,
      id: consumer.id,
      phone: consumer.consumer_user_mappings?.[0]?.user_detail?.phones?.[0]?.phone_number_e164 ?? 'No phone number',
    };
  })
  return (
    <List data-testid="partners-table">
      <Suspense>
        {consumers && !error ? (<ConsumerTable data={users} />) : <p>{error}</p>}
      </Suspense>
    </List>
  );
};

export default ConsumersList;

async function getData() {
  const client = createClient();
  try {
    const response = await dataProvider(client).getList<
      GetFieldsFromList<ConsumerListQuery>
    >({
      resource: "consumers",
      meta: {
        gqlQuery: CONSUMERS_LIST_QUERY,
        operation: "consumer",
      },
      dataProviderName: "hasura",
      pagination: { current: 1, pageSize: 10 },
    });
    return {
      consumers: response.data,
      total: response.total,
      error: null,
    };
  } catch (error) {
    let errorMessage = "Failed to fetch consumers ";
    if(error instanceof Error) {
      errorMessage += error.message;
    }
    return {
      consumers: [],
      total: 0,
      error: errorMessage,
    }
  }
}
