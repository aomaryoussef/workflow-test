"use client";

import React from "react";
import { Card, Tabs, TabsProps, Table, Tag } from "antd";
import partners from "@/data/partners.json";
interface PartnerDetailsProps {
  partner: (typeof partners)[number];
}

const PartnerDetails: React.FC<PartnerDetailsProps> = ({ partner }) => {
  return (
    <Card title="Partner Details">
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Partner Details" key="1">
          <div className="grid grid-cols-3">
            <div>
              <p>
                <strong>ID:</strong>
              </p>
              <p>
                <strong>Name:</strong>
              </p>
              <p>
                <strong>Status:</strong>
              </p>
              <p>
                <strong>Commercial Registration Number:</strong>
              </p>
              <p>
                <strong>Tax Registration Number:</strong>
              </p>
              <p>
                <strong>Phone Number:</strong>
              </p>
              <p>
                <strong>Root Admin:</strong>
              </p>
              <p>
                <strong>Bank Name:</strong>
              </p>
              <p>
                <strong>Branch:</strong>
              </p>
              <p>
                <strong>Beneficiary Name:</strong>
              </p>
              <p>
                <strong>IBAN:</strong>
              </p>
              <p>
                <strong>Swift Code:</strong>
              </p>
              <p>
                <strong>Account Number:</strong>
              </p>
            </div>
            <div>
              <p>{partner.id || "N/A"}</p>
              <p>{partner.name || "N/A"}</p>
              <p>{partner.status || "N/A"}</p>
              <p>
                {partner.legalIdentifiers.commercialRegistrationNumber || "N/A"}
              </p>
              <p>{partner.legalIdentifiers.taxRegistrationNumber || "N/A"}</p>
              <p>{partner.phoneNumber[0].number || "N/A"}</p>
              <p>
                {partner.linkedIdentities[0].firstName}{" "}
                {partner.linkedIdentities[0].lastName}
              </p>
              <p>{partner.bankInfo.bankName || "N/A"}</p>
              <p>{partner.bankInfo.branch || "N/A"}</p>
              <p>{partner.bankInfo.beneficiaryName || "N/A"}</p>
              <p>{partner.bankInfo.iban || "N/A"}</p>
              <p>{partner.bankInfo.swiftCode || "N/A"}</p>
              <p>{partner.bankInfo.accountNumber || "N/A"}</p>
            </div>
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Stores" key="2">
          {partner?.stores.map((store) => (
            <div key={store.id}>
              <Card title={`${store.name}`} className="mt-8">
                <div className="grid grid-cols-3" key={store.id}>
                  <div>
                    <p>
                      <strong>Store Name:</strong>
                    </p>
                    <p>
                      <strong>Governorate:</strong>
                    </p>
                    <p>
                      <strong>City:</strong>
                    </p>
                    <p>
                      <strong>Address:</strong>
                    </p>
                    <p>
                      <strong>Bank Name:</strong>
                    </p>
                    <p>
                      <strong>Commercial Activity:</strong>
                    </p>
                    <p>
                      <strong>Store Admin:</strong>
                    </p>
                    <p>
                      <strong>Store identities: </strong>
                    </p>
                  </div>
                  <div>
                    <p>{store.name || "N/A"}</p>
                    <p>{store.address.governorate || "N/A"}</p>
                    <p>{store.address.city || "N/A"}</p>
                    <p>
                      {`${store.address.street}, ${store.address.city}, ${store.address.governorate}`}
                    </p>
                    <p>{store.bankInfo?.bankName || "N/A"}</p>
                    <p>
                      {store.commercialActivity
                        ?.map((activity) => activity.name)
                        .join(", ") || "N/A"}
                    </p>
                    <p>
                      {store.linkedIdentities[0].firstName}{" "}
                      {store.linkedIdentities[0].lastName}
                    </p>
                    <p>
                      {store.linkedIdentities
                        ?.map(
                          (identity, idx) =>
                            `${identity.firstName} ${identity.lastName} (${identity.role})`
                        )
                        .join(", ") || "N/A"}
                    </p>
                  </div>
                </div>
              </Card>
              <br />
            </div>
          ))}
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default PartnerDetails;
