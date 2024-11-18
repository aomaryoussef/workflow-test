import { Flex, Form, FormListFieldData, Input } from 'antd';
import { FC } from 'react';

import BaseCard from '@/app/[locale]/back-office/components/common/BaseCard';
import { validateMobile } from '@common/helpers/form.helpers';
import { useTypedTranslation } from '@common/hooks/useTypedTranslation';

interface ContactFieldsNames {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
}

export interface ContactCardProps {
  parentField: FormListFieldData | { name: string };

    remove?: () => void;
    showTitle?: boolean;
    isInList?: boolean;
    fieldsNames?: ContactFieldsNames;
}

export const ContactCard: FC<ContactCardProps> = ({ parentField, remove, showTitle, isInList, fieldsNames = {} }) => {
  const title = showTitle
    ? `Account${isInList && typeof parentField.name === "number" ? ` ${parentField.name + 1}` : ""}`
    : undefined;
  const t = useTypedTranslation("partner");

  return (
    <BaseCard size="small" title={title} removeFn={remove} dataTestId="contact-card">
      <Flex gap="small" wrap="wrap">
        <Form.Item
          label={t("firstName")}
          name={[parentField.name, fieldsNames.firstName ?? "first_name"]}
          rules={[{ required: true, min: 3, message: t("minLength", { min: 3 }) }]}
          data-testid="contact-first-name-form-item"
        >
          <Input placeholder={t("firstName")} data-testid="contact-first-name-input" />
        </Form.Item>
        <Form.Item
          label={t("lastName")}
          name={[parentField.name, fieldsNames.lastName ?? "last_name"]}
          rules={[{ required: true, min: 3, message: t("minLength", { min: 3 }) }]}
          data-testid="contact-last-name-form-item"
        >
          <Input placeholder={t("lastName")} data-testid="contact-last-name-input" />
        </Form.Item>
        <Form.Item
          label={t("phoneNumber")}
          name={[parentField.name, fieldsNames.phoneNumber ?? "phone_number"]}
          rules={[
            { required: true },
            {
              validator: (_, value) => validateMobile(value),
              message: t("phoneNotValid", { label: t("phoneNumber") }),
            },
          ]}
          data-testid="contact-phone-number-form-item"
        >
          <Input placeholder={t("phoneNumber")} data-testid="contact-phone-number-input" />
        </Form.Item>
        <Form.Item
          label={t("email")}
          name={[parentField.name, fieldsNames.email ?? "email"]}
          rules={[{ required: true, type: "email", message: t("errors.invalidEmail") }]}
          data-testid="contact-email-form-item"
        >
          <Input placeholder={t("email")} type="email" data-testid="contact-email-input" />
        </Form.Item>
      </Flex>
    </BaseCard>
  );
};
