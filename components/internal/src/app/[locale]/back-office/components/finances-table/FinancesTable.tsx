"use client";
import React from "react";
import { Table, Tag } from "antd";
import financialOffers from "@/data/FinancialOffers.json";
import { ShowButton } from "@refinedev/antd";
import { useGo } from "@refinedev/core";
const FinancesTable = () => {
  const go = useGo();
  return (
    <Table dataSource={financialOffers} rowKey="id">
      <Table.Column dataIndex="name" title="Name" />
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
      <Table.Column dataIndex="description" title="Description" />
      <Table.Column dataIndex="adminFeeBasisPoints" title="Admin Fees" />
      <Table.Column<(typeof financialOffers)[number]>
        title="Action"
        render={(_, record) => {
          return (
            <ShowButton
              size="small"
              resource="finances"
              onClick={() => {
                go({ to: `finances/show/${record.id}`, type: "replace" });
              }}
            />
          );
        }}
      />
    </Table>
  );
};

export default FinancesTable;
