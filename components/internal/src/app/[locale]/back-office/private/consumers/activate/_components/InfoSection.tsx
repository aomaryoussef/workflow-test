import { validateMobileOrLandline, validateNumber, validateNumberNotLessThan } from "@common/helpers/form.helpers";
import { useDirection } from "@common/hooks/useDirection";
import { useTypedTranslation } from "@common/hooks/useTypedTranslation";
import { Col, Divider, Form, Input, Row, Space } from "antd";
import React from "react";

const showCount = ({ count, maxLength }: { count: number; maxLength?: number }) =>
  maxLength && maxLength - count < 10 ? `${count} / ${maxLength}` : false;

export const InfoSection: React.FC = () => {
  const t = useTypedTranslation("consumer");
  const dir = useDirection();

  return (
    <>
      <Divider orientation="left">{t("labels.personalInfo")}</Divider>
      <Row gutter={16} wrap>
        <Col xs={24} md={12} lg={8}>
          <Form.Item name="fullName" label={t("labels.fullName")} rules={[{ required: true }, { max: 50 }]}>
            <Input count={{ show: showCount, max: 50 }} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Form.Item name="address" label={t("labels.address")} rules={[{ required: true }, { max: 100 }]}>
            <Input count={{ show: showCount, max: 100 }} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Form.Item
            name="nationalIdAddress"
            label={t("labels.nationalIdAddress")}
            rules={[{ required: true }, { max: 100 }]}
          >
            <Input count={{ show: showCount, max: 100 }} />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            name="homePhoneNumber"
            label={t("labels.homePhoneNumber")}
            rules={[
              {
                validator: (_, value) => validateMobileOrLandline(value),
                message: t("errors.form.notValidNumber", { label: t("labels.homePhoneNumber") }),
              },
            ]}
          >
            <Input type="tel" className={dir === "rtl" ? "text-end" : undefined} />
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left" className="!mt-0">
        {t("labels.jobInfo")}
      </Divider>
      <Row gutter={16} wrap>
        <Col>
          <Form.Item name="jobName" label={t("labels.jobName")} rules={[{ required: true }, { max: 30 }]}>
            <Input count={{ show: showCount, max: 30 }} />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name="company" label={t("labels.company")} rules={[{ required: true }, { max: 30 }]}>
            <Input count={{ show: showCount, max: 30 }} />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            name="workPhoneNumber"
            label={t("labels.workPhoneNumber")}
            rules={[
              {
                validator: (_, value) => validateMobileOrLandline(value),
                message: t("errors.form.notValidNumber", { label: t("labels.workPhoneNumber") }),
              },
            ]}
          >
            <Input type="tel" className={dir === "rtl" ? "text-end" : undefined} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Form.Item name="companyAddress" label={t("labels.companyAddress")} rules={[{ max: 100 }]}>
            <Input count={{ show: showCount, max: 100 }} />
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left" className="!mt-0">
        {t("labels.incomeInfo")}
      </Divider>
      <Space wrap>
        <Form.Item
          name="salary"
          label={t("labels.salary")}
          rules={[
            { required: true },
            {
              type: "number",
              validator: (_, value) => validateNumber(value),
              message: t("errors.form.notValidNumber", { label: t("labels.salary") }),
            },
            {
              validator: (_, value) => validateNumberNotLessThan(value, 0),
              message: t("errors.form.cantBeLessThan", { label: t("labels.salary"), num: 0 }),
            },
          ]}
        >
          <Input type="number" min={0} step={100} />
        </Form.Item>
        <Form.Item
          name="additionalSalary"
          label={t("labels.additionalSalary")}
          rules={[
            {
              type: "number",
              validator: (_, value) => validateNumber(value),
              message: t("errors.form.notValidNumber", { label: t("labels.additionalSalary") }),
            },
            {
              validator: (_, value) => validateNumberNotLessThan(value, 0),
              message: t("errors.form.cantBeLessThan", { label: t("labels.additionalSalary"), num: 0 }),
            },
          ]}
        >
          <Input type="number" min={0} step={100} />
        </Form.Item>
        <Form.Item name="additionalSalarySource" label={t("labels.additionalSalarySource")} rules={[{ max: 100 }]}>
          <Input count={{ show: showCount, max: 100 }} />
        </Form.Item>
      </Space>
    </>
  );
};
