import { FC } from 'react';

import BaseFormList from '@/app/[locale]/back-office/components/common/BaseFormList.tsx';
import {
  BankAccountCard,
  BankAccountCardProps,
} from './BankAccountCard.tsx';

const BankAccountsList: FC<{ formListName?: string; fieldsNames?: BankAccountCardProps['fieldsNames'] }> = ({
  formListName = 'bank_accounts',
  fieldsNames,
}) => {
  return (
    <BaseFormList
      formListName={formListName}
      cardComponent={(field, remove) => (
        <BankAccountCard
          key={field.key}
          parentField={field}
          remove={remove.bind(null, field.name)}
          showTitle
          isInList
          fieldsNames={fieldsNames}
        />
      )}
      buttonText='Bank Account'
      initialValue={[{}]}
      enableValidation
      dataTestId='bank-accounts-list'
    />
  );
};

export default BankAccountsList;
