import { FC } from 'react';

import BaseFormList from '@/app/[locale]/back-office/components/common/BaseFormList.tsx';

import { ContactCard, ContactCardProps } from './ContactCard.tsx';

const ContactsList: FC<{ formListName?: string; fieldsNames?: ContactCardProps['fieldsNames'] }> = ({
  formListName = 'admin_user_profiles',
  fieldsNames,
}) => {
  return (
    <BaseFormList
      formListName={formListName}
      cardComponent={(field, remove) => (
        <ContactCard
          key={field.key}
          parentField={field}
          remove={remove.bind(null, field.name)}
          showTitle
          isInList
          fieldsNames={fieldsNames}
        />
      )}
      buttonText='Contact'
      initialValue={[{}]}
      enableValidation
      dataTestId='contacts-list'
    />
  );
};
export default ContactsList;
