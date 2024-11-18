import { Button, Form, FormListFieldData } from 'antd';
import { FC, ReactNode } from 'react';

import { red } from '@ant-design/colors';

interface BaseFormListProps {
  formListName: string | (number | string)[]; // Support both string and array for nested names
  cardComponent: (field: FormListFieldData, remove: (index: number) => void) => ReactNode;
  /** Text to be used in add button and error message */
  buttonText: string;

  initialValue?: any[];
  /** Whether to show errors or not if the form list is empty */
  enableValidation?: boolean;
  /** Only applicable if enableValidation is true */
  validationConfig?: {
    /** defaults to `red[4]` from '@ant-design/colors' */
    errorTextColor?: string;
  };
  /** Styles to be applied to `div` that wraps all the form list fields */
  wrapperDivStyle?: React.CSSProperties;
  dataTestId?: string;
}

const BaseFormList: FC<BaseFormListProps> = ({
  formListName,
  cardComponent,
  buttonText,

  initialValue,
  enableValidation,
  validationConfig,
  wrapperDivStyle,
  dataTestId,
}) => {
  return (
    <Form.List
      name={formListName}
      initialValue={initialValue}
      rules={
        enableValidation
          ? [
              {
                validator: (_, value) =>
                  !value || !value.length
                    ? Promise.reject(new Error(`At least one ${buttonText} is required`))
                    : Promise.resolve(),
              },
            ]
          : undefined
      }
      data-testid={dataTestId}
    >
      {(fields, { add, remove }, { errors }) => (
        <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column', ...wrapperDivStyle }}>
          {fields.map((field) => cardComponent(field, remove))}

          <Button type='dashed' onClick={() => add()} block>
            + Add {fields.length ? 'Another' : 'a'} {buttonText}
          </Button>

          {enableValidation && (
            <Form.ErrorList
              errors={errors.map((err, i) => (
                <span key={i} style={{ color: validationConfig?.errorTextColor ?? red[4] }}>
                  {err}
                </span>
              ))}
            />
          )}
        </div>
      )}
    </Form.List>
  );
};

export default BaseFormList;
