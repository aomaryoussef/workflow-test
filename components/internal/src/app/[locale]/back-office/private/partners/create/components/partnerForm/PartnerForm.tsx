"use client";

import { Divider, Form, Input, Space } from "antd";

import { CustomSelect } from "@/app/[locale]/back-office/components/common/CustomSelect";
import { IPartner } from "@/app/[locale]/back-office/graphql/types";
import { createPartner } from "@/app/[locale]/back-office/private/partners/create/action";
import { activityOptions } from "@common/constants/select.constants";
import { useFormSubmission } from "@common/hooks/useFormSubmission";
import { useTypedTranslation } from "@common/hooks/useTypedTranslation";
import { Create } from "@refinedev/antd";

import { BankAccountCard } from "./lists/BankAccountsList/BankAccountCard";
import { ContactCard } from "./lists/ContactsList/ContactCard";

export default function PartnerForm() {
  const [form] = Form.useForm<IPartner>();
  const t = useTypedTranslation("partner");

  const {
    handleSubmit,
    isSubmitting,
    notificationContextHolder: formSubmissionNotificationContext,
  } = useFormSubmission(form, createPartner);
  return (
    <>
      {formSubmissionNotificationContext}

      <Form form={form} layout="vertical" onFinish={handleSubmit} validateMessages={{ required: t("required") }}>
        <Create isLoading={isSubmitting} saveButtonProps={{ children: t("savePartner") }} title={t("create")}>
          <Space wrap>
            <Form.Item
              label={t("merchantName")}
              name="name"
              rules={[{ required: true, min: 2, message: t("minLength", { min: 2 }) }]}
              data-testid="merchant-name-form-item"
            >
              <Input placeholder={t("merchantName")} data-testid="merchant-name-input" />
            </Form.Item>
            <Form.Item
              label={t("commercialRegistrationNumber")}
              name="commercial_registration_number"
              rules={[{ required: true, min: 4, message: t("minLength", { min: 4 }) }]}
              data-testid="commercial-registration-number-form-item"
            >
              <Input
                placeholder={t("commercialRegistrationNumber")}
                data-testid="commercial-registration-number-input"
              />
            </Form.Item>
            <Form.Item
              label={t("taxRegistrationNumber")}
              name="tax_registration_number"
              rules={[{ required: true, len: 9, message: t("length", { min: 9, max: 9 }) }]}
              data-testid="tax-registration-number-form-item"
            >
              <Input
                placeholder={t("taxRegistrationNumber")}
                count={{ show: true, max: 9 }}
                data-testid="tax-registration-number-input"
              />
            </Form.Item>
            <Form.Item
              label={t("commercialActivityCategory")}
              name="categories"
              rules={[{ required: true }]}
              data-testid="commercial-activity-category-form-item"
            >
              <CustomSelect
                mode="multiple"
                options={activityOptions}
                allowClear
                placeholder={t("commercialActivityCategory")}
                data-testid="commercial-activity-category-select"
              />
            </Form.Item>
          </Space>

          {/* Bank Accounts Section */}
          <Divider>
            <span className="required-star">*</span>
            <span>{t("bankInformation")}</span>
          </Divider>
          <BankAccountCard parentField={{ name: "bank_account" }} />

          {/* Extra Separator, for UI purposes */}
          <Divider className="opacity-0 !my-5"></Divider>

          {/* Contacts Section */}
          <Divider>
            <span className="required-star">*</span>
            <span>{t("contactPerson")}</span>
          </Divider>
          <ContactCard parentField={{ name: "admin_user_profile" }} />
        </Create>
      </Form>
    </>
  );
}
