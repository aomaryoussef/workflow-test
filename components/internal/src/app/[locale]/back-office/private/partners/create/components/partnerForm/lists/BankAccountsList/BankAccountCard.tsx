import { Form, FormListFieldData, Input, Space } from 'antd';
import { FC } from 'react';

import BaseCard from '@/app/[locale]/back-office/components/common/BaseCard';
import { CustomSelect } from '@/app/[locale]/back-office/components/common/CustomSelect';
import { bankOptions } from '@common/constants/select.constants';
import { useTypedTranslation } from '@common/hooks/useTypedTranslation';

export interface BankAccountCardProps {
  parentField: FormListFieldData | { name: string };

    remove?: () => void;
    showTitle?: boolean;
    isInList?: boolean;
    fieldsNames?: {
        bankName?: string;
        branchName?: string;
        beneficiaryName?: string;
        iban?: string;
        accountNumber?: string;
        swiftCode?: string;
    };
}

export const BankAccountCard: FC<BankAccountCardProps> = ({
  parentField,
  remove,
  showTitle,
  isInList,
  fieldsNames = {},
}) => {
  const title = showTitle
    ? `Account${isInList && typeof parentField.name === "number" ? ` ${parentField.name + 1}` : ""}`
    : undefined;
  const t = useTypedTranslation("partner");

  return (
    <BaseCard size="small" title={title} removeFn={remove} dataTestId="bank-account-card">
      <Space wrap>
        <Form.Item
          label={t("bank")}
          name={[parentField.name, fieldsNames.bankName ?? "bank_name"]}
          rules={[{ required: true }]}
          data-testid="bank-name-form-item"
        >
          <CustomSelect
            options={bankOptions}
            placeholder={t("bank")}
            showSearch
            optionFilterProp="label"
            data-testid="bank-name-select"
          />
        </Form.Item>
        <Form.Item
          label={t("branch")}
          name={[parentField.name, fieldsNames.branchName ?? "branch_name"]}
          rules={[{ required: true, min: 3, message: t("minLength", { min: 3 }) }]}
          data-testid="bank-branch-name-form-item"
        >
          <Input placeholder={t("branch")} data-testid="bank-branch-name-input" />
        </Form.Item>
        <Form.Item
          label={t("beneficiaryName")}
          name={[parentField.name, fieldsNames.beneficiaryName ?? "beneficiary_name"]}
          rules={[{ required: true, min: 3, message: t("minLength", { min: 3 }) }]}
          data-testid="bank-beneficiary-name-form-item"
        >
          <Input placeholder={t("beneficiaryName")} data-testid="bank-beneficiary-name-input" />
        </Form.Item>
        <Form.Item
          label={t("IBAN")}
          name={[parentField.name, fieldsNames.iban ?? "iban"]}
          rules={[{ required: true, min: 15, message: t("minLength", { min: 15 }) }]}
          data-testid="bank-iban-form-item"
        >
          <Input placeholder={t("IBAN")} data-testid="bank-iban-input" />
        </Form.Item>
        <Form.Item
          label={t("accountNumber")}
          name={[parentField.name, fieldsNames.accountNumber ?? "account_number"]}
          rules={[{ required: true, min: 3, message: t("minLength", { min: 3 }) }]}
          data-testid="bank-account-number-form-item"
        >
          <Input placeholder={t("accountNumber")} data-testid="bank-account-number-input" />
        </Form.Item>
        <Form.Item
          label={t("swiftCode")}
          name={[parentField.name, fieldsNames.swiftCode ?? "swift_code"]}
          data-testid="bank-swift-code-form-item"
        >
          <Input placeholder={t("swiftCode")} data-testid="bank-swift-code-input" />
        </Form.Item>
      </Space>
    </BaseCard>
  );
};
