import { Divider, Flex, Form, Input, Select, Space } from "antd";
import { FC } from "react";
const ConsumerForm = () => {
  return (
    <Space wrap>
      <Form.Item
        label={"Merchant Name"}
        name="name"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input placeholder="Merchant Name" />
      </Form.Item>
      <Form.Item
        label={"Merchant ID/ سجل تجاري"}
        name="commercialRegistrationNumber"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input placeholder="Merchant ID" />
      </Form.Item>
    </Space>
  );
};

export default ConsumerForm;
