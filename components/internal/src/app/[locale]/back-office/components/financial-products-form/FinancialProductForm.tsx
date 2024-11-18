"use client";
import { Create, useForm } from "@refinedev/antd";
import { useState } from "react";
import {
  Form,
  Button,
  Tabs,
  TabsProps,
} from "antd";
import {
  ArrowRightOutlined,
} from "@ant-design/icons";
import GeneralInfo from "@/app/[locale]/back-office/components/financial-products-form/GeneralInfo.tsx";
import Tenors from "@/app/[locale]/back-office/components/financial-products-form/Tenors.tsx";

export default function FinancialProductForm() {
  const [step, setStep] = useState<string>("1");
  const { formProps, saveButtonProps, form } = useForm({
    onMutationSuccess: (data, variables, context, isAutoSave) => {
      console.log(data, variables, context, isAutoSave);
    },
  });

  const footerActions = ({
    defaultButtons,
  }: {
    defaultButtons: React.ReactNode;
  }) =>
    step === "2" ? (
      defaultButtons
    ) : (
      <Button
        type="primary"
        htmlType="submit"
        icon={<ArrowRightOutlined />}
        size="large"
        onClick={() => {
          form
            .validateFields()
            .then(() => {
              setStep("2");
            })
            .catch((err) => {
              console.error("error", err);
            });
        }}
      >
        Next
      </Button>
    );
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "General info",
      children: <GeneralInfo />,
      disabled: step !== "1",
      forceRender: true,
    },
    {
      key: "2",
      label: "Tenors",
      children: <Tenors />,
    },
  ];
  return (
    <Create saveButtonProps={saveButtonProps} footerButtons={footerActions}>
      <Form {...formProps} layout="vertical">
        <Tabs activeKey={String(step)} items={items} />
      </Form>
    </Create>
  );
}
