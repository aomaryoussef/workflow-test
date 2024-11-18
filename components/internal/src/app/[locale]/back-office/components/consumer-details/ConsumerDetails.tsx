"use client";

import React, { FC } from "react";
import { Card, Tabs, TabsProps, Table, Tag } from "antd";
import { ConsumerQuery } from "@/app/[locale]/back-office/graphql/types.ts";
import applications from "@/data/applications.json";

interface GeneralInfoProps {
  consumer: ConsumerQuery["consumer"][number];
}

type Address =
  ConsumerQuery["consumer"][number]["consumer_user_mappings"][number]["user_detail"]["addresses"][number];
const handleTabsChange = (key: string) => {};

const ConsumerDetails: React.FC<GeneralInfoProps> = ({ consumer }) => {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "General info",
      children: <GeneralInfo consumer={consumer} />,
    },
    {
      key: "2",
      label: "Applications",
      children: <Applications data={applications}  />,
    },
    {
      key: "3",
      label: "Loans",
      children: "Loans section.",
    },
  ];
  return (
    <Tabs defaultActiveKey="1" items={items} onChange={handleTabsChange} />
  );
};

const GeneralInfo: FC<GeneralInfoProps> = ({ consumer }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <PersonalInfo consumer={consumer} />
      <AddressInfo consumer={consumer} />
      <ConsumerKYC consumer={consumer} />
    </div>
  );
};
interface PersonalInfoProps {
  consumer: ConsumerQuery["consumer"][number];
}

const PersonalInfo: FC<PersonalInfoProps> = ({ consumer }) => {
  return (
    <Card title="Personal info" bordered={false}>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p>
            <strong>First Name:</strong>
          </p>
          <p>
            <strong>Middle Name:</strong>
          </p>
          <p>
            <strong>Last Name:</strong>
          </p>
          <p>
            <strong>Date of Birth:</strong>
          </p>
          <p>
            <strong>Gender:</strong>
          </p>
          <p>
            <strong>Phone:</strong>
          </p>
          <p>
            <strong>Marital Status:</strong>
          </p>
        </div>
        <div>
          <p>
            {consumer.consumer_user_mappings?.[0]?.user_detail?.first_name ||
              "N/A"}
          </p>
          <p>
            {consumer.consumer_user_mappings?.[0]?.user_detail?.middle_name ||
              "N/A"}
          </p>
          <p>
            {consumer.consumer_user_mappings?.[0]?.user_detail?.last_name ||
              "N/A"}
          </p>
          <p>
            {consumer.consumer_user_mappings?.[0]?.user_detail?.date_of_birth ||
              "N/A"}
          </p>
          <p>
            {consumer.consumer_user_mappings?.[0]?.user_detail?.gender || "N/A"}
          </p>
          <p>
            {consumer.consumer_user_mappings?.[0]?.user_detail?.phones?.[0]
              ?.phone_number_e164 || "N/A"}
          </p>
          <p>
            {consumer.consumer_user_mappings?.[0]?.user_detail
              ?.marital_status || "N/A"}
          </p>
        </div>
      </div>
    </Card>
  );
};

interface AddressInfoProps {
  consumer: ConsumerQuery["consumer"][number];
}

const AddressInfo: FC<AddressInfoProps> = ({ consumer }) => {
  const addresses =
    consumer?.consumer_user_mappings?.[0]?.user_detail?.addresses;
  return (
    <Card title="Address info" bordered={false}>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p>
            <strong>Addresses:</strong>
          </p>
        </div>
        {addresses?.map(
          ({ line_1, line_2, line_3, city, state, zip }: Partial<Address>) => {
            return (
              <div key={line_1}>
                {constructAddress({ line_1, line_2, line_3, city, state, zip })}
              </div>
            );
          }
        )}
      </div>
    </Card>
  );
};
export default ConsumerDetails;

function constructAddress({
  line_1,
  line_2,
  line_3,
  zip,
  state,
  city,
}: Partial<Address>) {
  return `${line_1}${line_2 ? ` ${line_3}` : ""}${
    line_3 ? ` ${line_3}` : ""
  }, ${city}${state ? `, ${state}` : ""}${zip ? `, ${zip}` : ""}`;
}

interface ConsumerKYCProps {
  consumer: ConsumerQuery["consumer"][number];
}
const ConsumerKYC: FC<ConsumerKYCProps> = ({ consumer }) => {
  return (
    <Card title="Consumer KYC" bordered={false}>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p>
            <strong>Primary Income:</strong>
          </p>
          <p>
            <strong>Additional Income:</strong>
          </p>
          <p>
            <strong>Car Type:</strong>
          </p>
          <p>
            <strong>Company:</strong>
          </p>
          <p>
            <strong>Job Title:</strong>
          </p>
          <p>
            <strong>Work Type:</strong>
          </p>
          <p>
            <strong>Insurance Type:</strong>
          </p>
        </div>
        <div>
          <p>{consumer.consumer_kycs?.[0]?.primary_income_units || "N/A"}</p>
          <p>{consumer.consumer_kycs?.[0]?.additional_income_units || "N/A"}</p>
          <p>{consumer.consumer_kycs?.[0]?.car_type || "N/A"}</p>
          <p>{consumer.consumer_kycs?.[0]?.company?.name || "N/A"}</p>
          <p>{consumer.consumer_kycs?.[0]?.job_title || "N/A"}</p>
          <p>{consumer.consumer_kycs?.[0]?.work_type || "N/A"}</p>
          <p>{consumer.consumer_kycs?.[0]?.insurance_type || "N/A"}</p>
        </div>
      </div>
    </Card>
  );
};

interface Application {
  id: number;
  requestedAt: string;
  number: string;
  status: string;
  requestedLoanAmount: number;
  requestedLoanTerm: number;
  approvedLoanAmount: number;
  approvedLoanTerm: number;
}
const Applications: FC<{ data: Application[] }> = ({ data }) => {
  return (
    <Table dataSource={data} bordered rowKey="id">
      <Table.Column
        className="text-xs whitespace-nowrap"
        dataIndex="requestedAt"
        title="Requested at"
      />
      <Table.Column className="text-xs whitespace-nowrap" dataIndex="number" title="Number" />
      <Table.Column
        className="text-xs whitespace-nowrap"
        dataIndex="status"
        key="status"
        title="Status"
        render={(_, { status }: { status: string }) => {
          const color = status === "approved" ? "green" : "orange"
          return <Tag color={color}>{status.toUpperCase()}</Tag>
}}
      />
      <Table.Column
        className="text-xs"
        dataIndex="requestedLoanAmount"
        title="Requested loan amount"
        key="requestedLoanAmount"
        sorter={(a: Application, b: Application) => a.requestedLoanAmount - b.requestedLoanAmount}
      />
      <Table.Column
        className="text-xs"
        dataIndex="requestedLoanTerm"
        title="Requested loan term"
      />
      <Table.Column
        className="text-xs"
        dataIndex="approvedLoanAmount"
        title="Approved loan amount"
      />
      <Table.Column
        className="text-xs"
        dataIndex="approvedLoanTerm"
        title="Approved loan term"
      />
    </Table>
  );
};
