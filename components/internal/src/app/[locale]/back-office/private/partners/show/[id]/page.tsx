import PartnerDetails from "@/app/[locale]/back-office/components/partner-details/PartnerDetails.tsx";
import { Show } from "@refinedev/antd";
import { NextPage } from "next";
import { Suspense } from "react";
import partners from '@/data/partners.json'

const PartnerShowPage: NextPage<{ params: { id: string } }> = async ({
  params,
}) => {
  const { partner } = await getData(params.id);

  return (
    <Show isLoading={false} recordItemId={params.id}>
      <Suspense fallback={<div>Loading...</div>}>
        {partner ? (
          <PartnerDetails partner={partner} />
        ) : (
          <p>No partner found.</p>
        )}
      </Suspense>
    </Show>
  );
};

function getData(id: string): Promise<{ partner: typeof partners[number]; }> {
    const partner = partners.find(partner => partner.id === id);
    if (partner) {
        return Promise.resolve({ partner });
    } else {
        return Promise.reject(new Error('Could not find partner'));
    }
}

export default PartnerShowPage