"use client";
import { List, ShowButton } from "@refinedev/antd";
import { Table, Tag } from "antd";
import { NextPage } from "next";
import partners from "@/data/partners.json";
import { useGo } from "@refinedev/core";


const PartnerList: NextPage = () => {
  const go = useGo()
  const mappedPartners = partners.map((partner) => {
    return {
      ...partner,
      primaryPhoneNumber: partner.phoneNumber[0].number,
      commercialRegistrationNumber: partner.legalIdentifiers.commercialRegistrationNumber,
      taxRegistrationNumber: partner.legalIdentifiers.taxRegistrationNumber,
    };
  });

  return (
    <List data-testid="partners-table">
      <Table dataSource={mappedPartners} rowKey="id">
        <Table.Column dataIndex="name" title="Name" />
        <Table.Column dataIndex="primaryPhoneNumber" title="Phone Number" />
        <Table.Column
          dataIndex="status"
          render={(_, { status }: { status: string }) => {
            const getColor = (status: string) => {
              if (status === "approved") return "green";
              if (status === "rejected") return "red";
              return "orange";
            };
            const color = getColor(status);
            return <Tag color={color}>{status.toUpperCase()}</Tag>;
          }}
          title="Status"
        />
        <Table.Column
          dataIndex="commercialRegistrationNumber"
          title="Commercial Registration Number"
        />
        <Table.Column
          dataIndex="taxRegistrationNumber"
          title="Tax Registration Number"
        />
        <Table.Column<typeof partners[number]>
          title="Action"
          render={(_, record) => {
            return <ShowButton size="small" resource="partners" onClick={() => { go({ to: `partners/show/${record.id}`, type: 'replace'})}} />
          }}
        />
      </Table>
    </List>
  );
};

export default PartnerList;
