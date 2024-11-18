"use client";
import { Button, Table } from "antd";
import { useLocale } from "next-intl";
import React from "react";

import { useTypedTranslation } from "@/app/common/hooks/useTypedTranslation";

const ConsumerInfo: React.FC<{ data: { id: string; fullName: string }[] }> = ({ data }) => {
  const t = useTypedTranslation();
  const dataSource = data.map((consumer) => ({
    key: consumer.id,
    name: <span style={{ fontSize: "18px", fontWeight: "bold" }}>{consumer.fullName}</span>,
  }));
  const lang = useLocale();
  const handleChangeConsumer = () => {
    window.location.href = `/${lang}/back-office/private/repay/create`;
  };

  const columns = [
    {
      title: <span style={{ fontSize: "16px", fontWeight: "bold" }}>{t("repay.consumerName")}</span>,
      dataIndex: "name",
      key: "name",
      width: "50%",
    },
    {
      title: "",
      key: "action",
      width: "50%",
      render: () => (
        <Button type="primary" onClick={() => handleChangeConsumer()}>
          {t("repay.changeConsumerName")}
        </Button>
      ),
    },
  ];

  return <Table dataSource={dataSource} columns={columns} pagination={false} style={{ marginBottom: "40px" }} />;
};

export default ConsumerInfo;
