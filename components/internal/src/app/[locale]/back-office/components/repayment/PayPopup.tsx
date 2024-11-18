import { Button, Card, Form, Input, Modal, Typography } from "antd";
import React, { useState } from "react";

import { useTypedTranslation } from "@/app/common/hooks/useTypedTranslation";
import { LoanDetails } from "../../private/repay/types";
import { useLocale } from "next-intl";

const { Text } = Typography;

interface PaymentData {
  paymentMethod: string;
  cardLast4Digits: string;
  referenceNumber: string;
}

const PayPopup = ({
  visible,
  onClose,
  loan,
  totalPrincipal,
}: {
  visible: boolean;
  onClose: () => void;
  loan: LoanDetails[];
  totalPrincipal: string;
}) => {
  const t = useTypedTranslation();
  const [form] = Form.useForm();
  const [paymentMethod, setPaymentMethod] = useState("");

  const onFinish = (values: PaymentData) => {
    console.log("Form values:", values);
    console.log("Loan object:", loan);
  };

  const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentMethod(event.target.value);
  };
  const lang = useLocale();

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width="60%"
      style={{ padding: 20, background: "#f5f5f5", borderRadius: 8 }}
    >
      <Card
        title={<div style={{ textAlign: "center" }}>{t("repay.payPopup.reviewPaymentRequest")}</div>}
        bordered={false}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: 1 }}>
              <Form.Item
                name="paymentMethod"
                label={<Text>{t("repay.payPopup.selectPaymentMethod")}</Text>}
                rules={[{ required: true, message: t("repay.payPopup.selectPaymentMethod") }]}
              >
                <select
                  name="payment-method"
                  id="paymentMethod"
                  className="form-select"
                  style={{ width: "100%", marginTop: 8, backgroundColor: "#eee", padding: "8px", borderRadius: "6px" }}
                  onChange={handlePaymentMethodChange}
                >
                  <option value="" disabled selected style={{ fontStyle: "italic" }}>
                    {t("repay.payPopup.clickHere")}
                  </option>
                  <option value="BTECH_STORE_CASH">كاش</option>
                  <option value="BTECH_STORE_POS_BANK_MISR">Card - Bank Misr | الدفع بكارت بنك مصر</option>
                  <option value="BTECH_STORE_POS_CIB">Card - CIB | الدفع بكارت سي اي بي</option>
                  <option value="BTECH_STORE_POS_NBE">NBE Smart Wallet | المحفظة الذكية بنك الاهلي</option>
                </select>
              </Form.Item>

              <Form.Item
                name="cardLast4Digits"
                label={<Text>{t("repay.payPopup.last4DigitsOfCard")}</Text>}
                rules={[{ required: true, message: t("repay.payPopup.last4DigitsOfCard") }]}
              >
                <Input
                  placeholder="XXXX XXXX XXXX"
                  maxLength={4}
                  style={{ width: "100%", marginTop: 8 }}
                  disabled={paymentMethod === "BTECH_STORE_CASH" || paymentMethod == ""}
                />
              </Form.Item>

              <Form.Item
                name="referenceNumber"
                label={<Text>{t("repay.payPopup.referenceNumber")}</Text>}
                rules={[{ required: true, message: t("repay.payPopup.referenceNumber") }]}
              >
                <Input placeholder={t("repay.payPopup.referenceNumber")} style={{ width: "100%", marginTop: 8 }} />
              </Form.Item>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <Text>{t("repay.payPopup.amountDueViaMaylo")}</Text>
                <Text>
                  {totalPrincipal} {lang == "en" ? "EGP" : "جنيه"}
                </Text>
              </div>

              <div style={{ backgroundColor: "#e6f7ff", padding: 8, borderRadius: 4, marginBottom: 16 }}>
                <Text>{t("repay.payPopup.totalAmount")}</Text>
                <Text style={{ float: "right" }}>
                  {totalPrincipal} {lang == "en" ? "EGP" : "جنيه"}
                </Text>
              </div>

              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                  {t("repay.payPopup.confirmPayment")}
                </Button>
              </Form.Item>
            </div>
          </div>
        </Form>
      </Card>
    </Modal>
  );
};

export default PayPopup;
