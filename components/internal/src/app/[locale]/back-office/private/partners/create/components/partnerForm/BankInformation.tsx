import { Form, Input, Space } from 'antd';
import { FormListFieldData } from 'antd/lib/form/FormList';
import React, { FC } from 'react';

import { CustomSelect } from '@/app/[locale]/back-office/components/common/CustomSelect.tsx';
import { bankOptions } from '@common/constants/select.constants.ts';

const BankInformation: FC<{ field?: FormListFieldData; name?: string }> = ({ field, name }) => {
  const bankName = field ? [field.name, `${name}BankName`] : 'bankName';
  const branch = field ? [field.name, `${name}Branch`] : 'branch';
  const beneficiaryName = field ? [field.name, `${name}BeneficiaryName`] : 'beneficiaryName';
  const iban = field ? [field.name, `${name}Iban`] : 'iban';
  const swiftCode = field ? [field.name, `${name}SwiftCode`] : 'swiftCode';
  const accountNumber = field ? [field.name, `${name}AccountNumber`] : 'accountNumber';
  return (
    <Space wrap>
      <Form.Item label='Bank Name' name={bankName}>
        <CustomSelect options={bankOptions} placeholder='Bank Name' />
      </Form.Item>
      <Form.Item label='Branch' name={branch}>
        <Input placeholder='Branch Name' />
      </Form.Item>
      <Form.Item label='Beneficiary Name' name={beneficiaryName}>
        <Input placeholder='Beneficiary Name' />
      </Form.Item>
      <Form.Item label='IBAN' name={iban}>
        <Input placeholder='IBAN' />
      </Form.Item>
      <Form.Item label='Swift Code' name={swiftCode}>
        <Input placeholder='Swift Code' />
      </Form.Item>
      <Form.Item label='Account Number' name={accountNumber}>
        <Input placeholder='Account Number' />
      </Form.Item>
    </Space>
  );
};

export default BankInformation;
