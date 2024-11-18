'use client'
import React from "react";
import { Table, Tag, List } from "antd";
import { ShowButton } from "@refinedev/antd";
import { useGo } from "@refinedev/core";

const IdentitiesTable = ({ identities }: { identities: any[] }) => {
  const go = useGo();
  const mappedIdentities = identities.map((identity) => {
    return {
      ...identity,
      state: identity.state.toUpperCase(),
      firstName: identity?.metadata_admin?.name ?? '__',
      phone: identity.traits?.phone ?? '__',
    };
  });
  return (
    <List data-testid="identities-table">
      <Table dataSource={mappedIdentities} rowKey="id">
        <Table.Column dataIndex="firstName" title="Name" />
        <Table.Column dataIndex="phone" title="Phone Number" />
        <Table.Column
          dataIndex="state"
          render={(_, { state }: { state: string }) => {
            const getColor = (state: string) => {
              if (state === "approved") return "green";
              if (state === "rejected") return "red";
              return "orange";
            };
            const color = getColor(state);
            return <Tag color={color}>{state.toUpperCase()}</Tag>;
          }}
          title="Status"
        />
        <Table.Column<typeof identities[number]>
          title="Action"
          render={(_, record) => {
            return (
              <ShowButton
                size="small"
                resource="identities"
                onClick={() => {
                  go({ to: `identities/show/${record.id}`, type: "replace" });
                }}
              />
            );
          }}
        />
      </Table>
    </List>
  );
};

export default IdentitiesTable;