"use client";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import React, { useState } from "react";

import { useTypedTranslation } from "@/app/common/hooks/useTypedTranslation";

const ConfirmationPopup: React.FC<{ successProp?: boolean }> = ({ successProp }) => {
  const [open, setOpen] = useState(true);
  const t = useTypedTranslation();

  const hideModal = () => {
    setOpen(false);
  };

  return (
    <>
      {successProp ? (
        <Modal
          title={
            <CheckCircleOutlined
              style={{
                textAlign: "center",
                fontSize: "44px",
                fontWeight: "bold",
                justifyContent: "center",
                display: "flex",
                color: "green",
              }}
            />
          }
          open={open}
          onOk={hideModal}
          onCancel={hideModal}
          okText="الرئيسية"
          cancelText="طباعة إيصال الدفع"
        >
          <p style={{ fontSize: "30px" }}>{t("general.popups.paymentCompleted")}</p>
        </Modal>
      ) : (
        <Modal
          title={
            <CloseCircleOutlined
              style={{
                textAlign: "center",
                fontSize: "44px",
                fontWeight: "bold",
                justifyContent: "center",
                display: "flex",
                color: "red",
              }}
            />
          }
          open={open}
          onOk={hideModal}
          cancelButtonProps={{ style: { display: "none" } }}
          okText="الرئيسية"
        >
          <p style={{ fontSize: "30px" }}>{t("general.popups.problemHappened")}</p>
        </Modal>
      )}
    </>
  );
};

export default ConfirmationPopup;
