import { FC } from "react";
import { Space, Form, Input, Divider, DatePicker, Button } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const GeneralInfo: FC = () => {
  return (
    <>
      <Space wrap>
        <Form.Item label="key" name="key" rules={[{ required: true }]}>
          <Input placeholder="key" />
        </Form.Item>
        <Form.Item
          label="Product Name"
          name="name"
          rules={[{ required: true }]}
        >
          <Input placeholder="Product Name" />
        </Form.Item>
        <Form.Item
          label="Product Description"
          name="productDescription"
          rules={[{ required: true }]}
        >
          <Input placeholder="Product Description" />
        </Form.Item>
      </Space>
      <Divider>Global attirbutes</Divider>
      <Space wrap>
        <Form.Item
          label="Admin Fees"
          name="adminFees"
          rules={[{ required: true }]}
        >
          <Input placeholder="Admin Fees" />
        </Form.Item>
        <Form.Item
          label="Grace Period"
          name="gracePeriod"
          rules={[{ required: true }]}
        >
          <Input placeholder="Grace Period" />
        </Form.Item>
        <Form.Item
          label="Bad debt percentage"
          name="badDebtValue"
          rules={[{ required: true }]}
        >
          <Input placeholder="bad debt value" />
        </Form.Item>
        <Form.Item
          label="StartDate"
          name="startDate"
          rules={[{ required: true }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          label="End Date"
          name="endtDate"
          rules={[{ required: true }]}
        >
          <DatePicker />
        </Form.Item>
      </Space>
      <Divider>Princibal constraints</Divider>
      <Space wrap>
        <Form.Item
          label="Minimum amount in EGP"
          name="princibalMinimumAmount"
          rules={[{ required: true }]}
        >
          <Input placeholder="Minimum amount" />
        </Form.Item>
        <Form.Item
          label="Maximum amount in EGP"
          name="principalMaximumAmount"
          rules={[{ required: true }]}
        >
          <Input placeholder="Maximum amount" />
        </Form.Item>
      </Space>
      <Divider>Repayment Days of Month</Divider>
      <Space wrap>
        <Form.List
          name="names"
          rules={[
            {
              validator: async (_, names) => {
                if (!names || names.length < 2) {
                  return Promise.reject(new Error("At least 2 repayment days"));
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <Space wrap align="end">
              {fields.map((field, index) => (
                <Form.Item
                  label={index === 0 ? "Repayment days" : ""}
                  required={false}
                  key={field.key}
                >
                  <Form.Item
                    {...field}
                    validateTrigger={["onChange", "onBlur"]}
                    rules={[
                      {
                        pattern: new RegExp(/^(0?[1-9]|1[0-9]|2[0-9]|3[0-1])$/),
                        message: "Please input a number.",
                      },
                    ]}
                    noStyle
                  >
                    <Input placeholder="day" style={{ width: "60%" }} />
                  </Form.Item>
                  {fields.length > 1 ? (
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      onClick={() => remove(field.name)}
                    />
                  ) : null}
                </Form.Item>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                >
                  Add Repayment Day!
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </Space>
          )}
        </Form.List>
      </Space>
      <Divider>Downpayment constraints</Divider>
      <Space wrap>
        <Form.Item
          label="Minimum Percentage"
          name="minimumAmount"
          rules={[
            {
              required: true,
              pattern: new RegExp(/^([0-9]|[1-9][0-9]|100)$/),
              message: "Please input a number from 0 to 100",
            },
          ]}
        >
          <Input placeholder="Minimum amount" />
        </Form.Item>
        <Form.Item
          label="Maximum Percentage"
          name="maximumAmount"
          rules={[
            {
              required: true,
              pattern: new RegExp(/^([0-9]|[1-9][0-9]|100)$/),
              message: "Please input a number from 0 to 100",
            },
          ]}
        >
          <Input placeholder="Maximum amount" />
        </Form.Item>
      </Space>
    </>
  );
};

export default GeneralInfo;