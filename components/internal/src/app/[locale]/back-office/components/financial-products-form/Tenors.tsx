import { Button, Card, Form, Input, Radio, Select, Space } from 'antd';
import { FC } from 'react';

import { CloseOutlined } from '@ant-design/icons';
import { tenorOptions } from '@common/constants/select.constants.ts';

const Tenors: FC = () => {
  return (
    <>
      <Form.List name='tenors'>
        {(fields, { add, remove }) => (
          <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}>
            {fields.map((field) => (
              <Card
                size='small'
                title={`Tenor ${field.name + 1}`}
                key={field.key}
                extra={
                  <CloseOutlined
                    onClick={() => {
                      remove(field.name);
                    }}
                  />
                }
              >
                <Space wrap>
                  <Form.Item label='Tenor Period' name={[field.name, 'key']}>
                    <Select options={tenorOptions} placeholder='Select tenor' />
                  </Form.Item>
                  <Form.Item label='Admin Fees' name={[field.name, 'adminFees']}>
                    <Radio.Group>
                      <Radio value='apple'> Formula </Radio>
                      <Radio value='pear'> Percentage </Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item
                    label='Admin Fees Value'
                    name={[field.name, 'adminFeesValue']}
                    rules={[{ required: true }]}
                  >
                    <Input placeholder='Admin Fees' />
                  </Form.Item>
                  <Form.Item label='Total Interest' name={[field.name, 'totalInterest']}>
                    <Input placeholder='Interest Points' />
                  </Form.Item>
                </Space>
              </Card>
            ))}

            <Button type='dashed' onClick={() => add()} block>
              + Add Tenor
            </Button>
          </div>
        )}
      </Form.List>
    </>
  );
};

export default Tenors;
