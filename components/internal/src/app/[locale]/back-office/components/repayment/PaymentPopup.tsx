"use client";
import React, { useState, useEffect } from "react";
import { FormOutlined } from "@ant-design/icons";
import { Button, Divider, Modal, Row, Col, Avatar, Typography } from "antd";

const { Text } = Typography;

const PaymentPopup = ({ showModalProp, onClose, paymentType }) => {
  const [open, setOpen] = useState(showModalProp);

  useEffect(() => {
    if (showModalProp) {
      setOpen(true);
    }
  }, [showModalProp]);

  const hideModal = () => {
    setOpen(false);
    onClose();
  };

  return (
    <>
      {paymentType === "Monthly" ? (
        <Modal title={<FormOutlined style={{ fontSize: "46px", textAlign: "center", display: "block" }} />} open={open} footer={null}>
          <Divider></Divider>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Avatar src="logo1.png" />
              <Text>Item 1</Text>
            </Col>
            <Col span={12}>
              <Text style={{ fontWeight: "bold" }}>$30.00</Text>
            </Col>
          </Row>
          <Divider style={{ margin: "10px", padding: "10px" }}></Divider>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Avatar src="logo2.png" />
              <Text>Item 2</Text>
            </Col>
            <Col span={12}>
              <Text style={{ fontWeight: "bold" }}>$30.00</Text>
            </Col>
          </Row>
          <Divider style={{ margin: "10px", padding: "10px" }}></Divider>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Text style={{ fontWeight: "bold" }}>Item 3</Text>
            </Col>
            <Col span={12}>
              <Text style={{ fontWeight: "bold" }}>٧,٩٧٥ جنيه</Text>
            </Col>
          </Row>
          <Divider style={{ margin: "10px", padding: "10px" }}></Divider>

          <Row gutter={[16, 16]}>
            <Col>
              <Text style={{ fontWeight: "bold" }}>بالضغط على &quot;تأكيد الدفع&quot;، فإنك تقر وتؤكد استلامك للمبالغ المذكورة بالأعلى من العميل.</Text>
            </Col>
          </Row>
          <Row gutter={[16, 16]} style={{ marginTop: "30px" }} justify="center">
            <Col>
              <Button type="primary" style={{ backgroundColor: "green", borderColor: "green" }} onClick={hideModal}>
                تأكيد الدفع
              </Button>
            </Col>
            <Col>
              <Button onClick={hideModal}>رجوع</Button>
            </Col>
          </Row>
        </Modal>
      ) : (
        <Modal title={<FormOutlined style={{ fontSize: "46px", textAlign: "center", display: "block" }} />} open={open} footer={null}>
          <Divider></Divider>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Text>Item 1</Text>
            </Col>
            <Col span={12}>
              <Text style={{ fontWeight: "bold" }}>$30.00</Text>
            </Col>
          </Row>
          <Divider style={{ margin: "10px", padding: "10px" }}></Divider>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Text>Item 2</Text>
            </Col>
            <Col span={12}>
              <Text style={{ fontWeight: "bold" }}>$30.00</Text>
            </Col>
          </Row>
          <Divider style={{ margin: "10px", padding: "10px" }}></Divider>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Text style={{ fontWeight: "bold" }}>Item 3</Text>
            </Col>
            <Col span={12}>
              <Text style={{ fontWeight: "bold" }}>٧,٩٧٥ جنيه</Text>
            </Col>
          </Row>
          <Divider style={{ margin: "10px", padding: "10px" }}></Divider>

          <Row gutter={[16, 16]}>
            <Col>
              <Text style={{ fontWeight: "bold" }}>بالضغط على &quot;تأكيد الدفع&quot;، فإنك تقر وتؤكد استلامك للمبالغ المذكورة بالأعلى من العميل.</Text>
            </Col>
          </Row>
          <Row gutter={[16, 16]} style={{ marginTop: "30px" }} justify="center">
            <Col>
              <Button type="primary" style={{ backgroundColor: "green", borderColor: "green" }} onClick={hideModal}>
                تأكيد الدفع
              </Button>
            </Col>
            <Col>
              <Button onClick={hideModal}>رجوع</Button>
            </Col>
          </Row>
        </Modal>
      )}
    </>
  );
};
export default PaymentPopup;
