"use client";
import { useNotificationHandler } from "@common/hooks/useNotificationHandler";
import { Button, Form, Input } from "antd";
import React, { useState } from "react";

import { checkConsumer, checkUpcomingInstallements } from "@/app/[locale]/back-office/private/repay/action";
import { LoanDetails, User } from "@/app/[locale]/back-office/private/repay/types";
import { useTypedTranslation } from "@/app/common/hooks/useTypedTranslation";

const CheckConsumer = ({
  onDataUpdate,
  upComingLoansData,
}: {
  onDataUpdate: (data: User[]) => void;
  upComingLoansData: (data: LoanDetails[] | { error: string }) => void;
}) => {
  const [form] = Form.useForm();
  const [checkConsumerData, setcheckConsumerData] = useState<User[]>([]);
  const [upcomingInstallments, setUpcomingInstallments] = useState<LoanDetails[] | { error: string }>([]);
  const t = useTypedTranslation();
  const { openNotification, notificationContextHolder } = useNotificationHandler();

  const onFinish = async (values: { phone_number: string }) => {
    try {
      const checkConsumerData = await checkConsumer(values.phone_number);
      if ("error" in checkConsumerData) {
        openNotification("topRight", checkConsumerData.error, "error");
      } else {
        setcheckConsumerData(checkConsumerData);
        if (checkConsumerData) {
          const upcomingInstallments = await checkUpcomingInstallements(checkConsumerData[0].id);
          setUpcomingInstallments(upcomingInstallments);
          upComingLoansData(upcomingInstallments);
          onDataUpdate(checkConsumerData);
        }
      }
    } catch (error) {
      openNotification("topRight", t("partner.phoneNotValid"), "error");
    }
  };

  return (
    <>
      {notificationContextHolder}
      <div
        className="titleWrapper"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "20vh",
          marginBottom: "30px",
        }}
      >
        <div className="title" style={{ fontWeight: "bold", fontSize: "24px" }}>
          {t("repay.searchForCustomer")}
        </div>
        <div className="subtitle" style={{ fontSize: "14px", color: "#6F6F6F" }}>
          {t("repay.enterCustomerNumber")}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Form form={form} layout="vertical" onFinish={onFinish} style={{ width: "60%" }}>
          <Form.Item
            name="phone_number"
            label={t("repay.consumerPhoneNumber")}
            rules={[{ required: true, message: "Please input the phone number!" }]}
          >
            <Input placeholder={t("consumer.labels.phoneNumber")} style={{ padding: "10px" }} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ fontSize: "16px", marginTop: "60px", width: "100%", padding: "20px", borderRadius: "30px" }}
            >
              {t("consumer.buttons.search")}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default CheckConsumer;
