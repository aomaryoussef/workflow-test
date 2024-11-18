import { Card, CardProps } from 'antd';
import { FC, ReactNode } from 'react';

import { CloseOutlined } from '@ant-design/icons';

interface BaseCardProps {
  children: ReactNode;
  size: CardProps['size'];

  /** The function if provided should have the key already bound to it using `.bind` function */
  removeFn?: () => void;
  title?: string;
  dataTestId?: string;
}

const BaseCard: FC<BaseCardProps> = ({ children, size, removeFn, title, dataTestId }) => {
  return (
    <Card
      size={size}
      title={title}
      extra={removeFn ? <CloseOutlined onClick={() => removeFn()} /> : undefined}
      data-testid={dataTestId}
    >
      {children}
    </Card>
  );
};

export default BaseCard;
