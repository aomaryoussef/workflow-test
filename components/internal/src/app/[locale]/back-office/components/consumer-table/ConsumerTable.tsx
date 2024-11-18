'use client';
import { Table } from 'antd';
import React, { useEffect, useState } from 'react';

import { Consumer } from '@/app/[locale]/back-office/graphql/schema.types.ts';
import { ShowButton } from '@refinedev/antd';
import { useGo } from '@refinedev/core';

interface ConsumerTableProps {
  data: (Partial<Consumer> & { id: string; phone: string })[];
}
const ConsumerTable: React.FC<ConsumerTableProps> = ({ data = [] }) => {
  const [loading, setLoading] = useState(true);
  const go = useGo();

  useEffect(() => {
    if (data) {
      setLoading(false);
    }
  }, [data]);

  return (
    <>
      {loading ? (
        <p>loading</p>
      ) : (
        <Table dataSource={data} rowKey='id'>
          <Table.Column dataIndex='first_name' title='First Name' />
          <Table.Column dataIndex='last_name' title='Last Name' />
          <Table.Column dataIndex='date_of_birth' title='Date of Birth' />
          <Table.Column dataIndex='phone' title='Phone Number' />
          <Table.Column<Consumer>
            title='Action'
            render={(_, record) => {
              return (
                <ShowButton
                  size='small'
                  resource='consumers'
                  onClick={() => {
                    go({ to: `consumers/show/${record.id}`, type: 'replace' });
                  }}
                  recordItemId={record.id}
                />
              );
            }}
          />
        </Table>
      )}
    </>
  );
};

export default ConsumerTable;
