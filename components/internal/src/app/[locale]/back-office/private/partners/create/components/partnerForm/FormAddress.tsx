import { Form, Input, Space } from 'antd';
import { FormListFieldData } from 'antd/lib/form/FormList';
import React, { FC } from 'react';

import { CustomSelect } from '@/app/[locale]/back-office/components/common/CustomSelect.tsx';
import { governorateOptions } from '@common/constants/select.constants.ts';

const Address: FC<{ field?: FormListFieldData; name?: string }> = ({ field, name }) => {
  const streetName = field ? [field.name, `${name}Street`] : 'street';
  const cityName = field ? [field.name, `${name}City`] : 'city';
  const governorateName = field ? [field.name, `${name}Governorate`] : 'governorate';
  const latName = field ? [field.name, `${name}Lat`] : 'lat';
  const lngName = field ? [field.name, `${name}Lng`] : 'lng';
  const googleMapsLinkName = field ? [field.name, `${name}GoogleMapsLink`] : 'googleMapsLink';
  const areaName = field ? [field.name, `${name}Area`] : 'area';
  return (
    <Space wrap>
      <Form.Item label='Governorate' name={governorateName}>
        <CustomSelect options={[{ value: 'assyuit', label: 'اسيوط' }]} placeholder='Governorate' />
      </Form.Item>
      <Form.Item label='City' name={cityName}>
        <CustomSelect options={governorateOptions[0].cities} placeholder='City' />
      </Form.Item>
      <Form.Item label='Area' name={areaName}>
        <Input placeholder='Area' />
      </Form.Item>
      <Form.Item label='Street' name={streetName}>
        <Input placeholder='Street Name' />
      </Form.Item>
      <Form.Item label='Latitude' name={latName}>
        <Input placeholder='Latitude' />
      </Form.Item>
      <Form.Item label='Longitude' name={lngName}>
        <Input placeholder='Longitude' />
      </Form.Item>
      <Form.Item label='Google Maps Link' name={googleMapsLinkName}>
        <Input placeholder='Link' />
      </Form.Item>
    </Space>
  );
};

export default Address;
