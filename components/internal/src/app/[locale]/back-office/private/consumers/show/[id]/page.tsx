import ConsumerDetails from "@/app/[locale]/back-office/components/consumer-details/ConsumerDetails.tsx";
import createClient from "@/app/services/hasura-server-provider";
import { CONSUMER_QUERY } from "@/app/[locale]/back-office/graphql/queries.ts";
import { NextPage } from "next";
import { Suspense } from "react";
import { Show } from "@refinedev/antd";
import {
  ConsumerQuery,
  ConsumerQueryVariables,
} from "@/app/[locale]/back-office/graphql/types.ts";

const ConsumerShowPage: NextPage<{ params: { id: string } }> = async ({
  params,
}) => {
  const { consumer } = await getData(params.id);

  return (
    <Show isLoading={false} recordItemId={params.id}>
      <Suspense fallback={<div>Loading...</div>}>
        {consumer ? (
          <ConsumerDetails consumer={consumer} />
        ) : (
          <p>No consumer found.</p>
        )}
      </Suspense>
    </Show>
  );
};

export default ConsumerShowPage;

async function getData(id: string) {
  const client = createClient();
  try {
    const response = await client.request<
      ConsumerQuery,
      ConsumerQueryVariables
    >(CONSUMER_QUERY, { id: id });
    return {
      consumer: response.consumer[0],
    };
  } catch (error) {
    throw error;
  }
}