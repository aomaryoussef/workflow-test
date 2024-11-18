import "./styles.css";

import { validateMobile } from "@common/helpers/form.helpers";
import { useDirection } from "@common/hooks/useDirection";
import { useTypedTranslation } from "@common/hooks/useTypedTranslation";
import { Alert, AlertProps, Card, Col, Divider, Form, Input, Row, Statistic, StatisticProps } from "antd";
import dayjs from "dayjs";
import { useLocale } from "next-intl";
import { ReactElement } from "react";

import { formatNumber } from "@/app/common/helpers/numbers.helpers";

import { ConsumerStatus } from "../../enums";
import styles from "./styles.module.css";

export const SearchSection: React.FC<{ disabled?: boolean; canShowStatus?: boolean }> = ({
  disabled,
  canShowStatus,
}) => {
  const t = useTypedTranslation("consumer");
  const lang = useLocale();
  const dir = useDirection();

  return (
    <Card>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            label={t("labels.nationalId")}
            name="nationalId"
            rules={[
              {
                required: true,
                len: 14,
                validator: (_, value) =>
                  !value || value.length !== 14 || !value.match(/^[0-9]+$/)
                    ? Promise.reject(t("errors.form.nationalIdNotValid"))
                    : Promise.resolve(),
              },
            ]}
          >
            <Input count={{ show: true, max: 14 }} disabled={disabled} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label={t("labels.phoneNumber")}
            name="phoneNumber"
            rules={[
              { required: true },
              {
                validator: (_, value) => validateMobile(value),
                message: t("errors.form.notValidNumber", { label: t("labels.phoneNumber") }),
              },
            ]}
          >
            <Input
              type="tel"
              disabled={disabled}
              // When an input's type is 'tel', the browser will set the direction to 'ltr' by default.
              // Instead of changing the direction, we can adjust the text alignment instead.
              // We do need the direction to be 'ltr' because it's a number after all, and numbers are written from left to right.
              className={dir === "rtl" ? "text-end" : undefined}
            />
          </Form.Item>
        </Col>
      </Row>

      {canShowStatus && (
        <>
          <Divider />

          <Row gutter={[16, 16]} justify="center">
            <Col xs={24} sm={11} md={{ flex: "auto" }} className="items-center justify-center sm:!flex">
              <Form.Item
                className="!mb-0"
                name="status"
                label={t("labels.status")}
                labelCol={{ className: "sm:!flex justify-center" }}
              >
                <Statistic
                  className="justify-center sm:flex"
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  formatter={(value) => t(`statusOptions.${value}`)}
                  valueRender={(node) => {
                    const props = (node as ReactElement).props as StatisticProps,
                      value = props.value as ConsumerStatus;

                    let type: AlertProps["type"];
                    switch (value) {
                      case ConsumerStatus.ACTIVE:
                        type = "success";
                        break;
                      case ConsumerStatus.AWAITING_ACTIVATION:
                        type = "info";
                        break;
                      case ConsumerStatus.WAITING_LIST:
                        type = "warning";
                        break;
                      case ConsumerStatus.BLOCKED:
                        type = "error";
                        break;
                    }

                    return (
                      <Alert
                        description={node}
                        type={type}
                        showIcon
                        style={{
                          background: "unset",
                          border: "none",
                          padding: "0",
                          fontSize: "medium",
                          alignItems: "center",
                        }}
                      />
                    );
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={0} sm={{ flex: "auto" }} className="justify-center sm:!flex">
              <Divider type="vertical" className={styles["vertical-divider"]} />
            </Col>
            <Col xs={24} sm={11} md={{ flex: "auto" }} className="items-center justify-center sm:!flex">
              <Form.Item
                className="!mb-0"
                name="activatedAt"
                label={t("labels.activatedAt")}
                labelCol={{ className: "sm:!flex justify-center" }}
              >
                <Statistic
                  className="justify-center sm:flex"
                  valueStyle={{ fontSize: "medium" }}
                  formatter={(value) => {
                    if (value) {
                      // The date is in UTC, so we need to convert it to the user's timezone.
                      // We can do that by adding the timezone offset to the date.
                      // `getTimezoneOffset` returns the offset in minutes,
                      // where positive values indicate that the local time is behind UTC,
                      // and negative values indicate the local time is ahead of UTC.
                      // So we need to multiply it by -1 to correctly adjust the UTC time
                      const timezoneOffsetInMinutes = new Date().getTimezoneOffset() * -1;
                      return dayjs(value).add(timezoneOffsetInMinutes, "minutes").format("YYYY-MM-DD HH:mm");
                    }

                    return "—";
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={0} md={{ flex: "auto" }} className="justify-center md:!flex">
              <Divider type="vertical" className={styles["vertical-divider"]} />
            </Col>
            <Col xs={24} sm={11} md={{ flex: "auto" }} className="items-center justify-center sm:!flex">
              <Form.Item
                className="!mb-0"
                name="singlePaymentDay"
                label={t("labels.singlePaymentDay")}
                labelCol={{ className: "sm:!flex justify-center" }}
              >
                <Statistic
                  className="justify-center sm:flex"
                  valueStyle={{ fontSize: "medium" }}
                  formatter={(value) => (value ? t("paymentDayValue", { day: formatNumber(+value, lang) }) : "—")}
                />
              </Form.Item>
            </Col>
          </Row>
        </>
      )}
    </Card>
  );
};
