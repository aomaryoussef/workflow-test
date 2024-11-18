"use client";

import { Divider, Form, FormInstance, FormListFieldData, Input, Space } from 'antd';
import { useLocale } from 'next-intl';
import { FC, useCallback, useMemo, useRef, useState } from 'react';

import BaseCard from '@/app/[locale]/back-office/components/common/BaseCard';
import { CustomSelect } from '@/app/[locale]/back-office/components/common/CustomSelect';
import { getAreas, getCities } from '@/app/[locale]/back-office/private/partners/stores/create/action';
import { validateNumber } from '@common/helpers/form.helpers';
import { getLatLongFromUrl } from '@common/helpers/location.helpers';
import { useTypedTranslation } from '@common/hooks/useTypedTranslation';

import styles from './StoreCard.module.css';

export interface StoreCardProps {
    form: FormInstance;
    parentField: FormListFieldData | { name: string };
    remove?: () => void;
    showTitle?: boolean;
    isInList?: boolean;
    fieldsNames?: {
        name?: string;
        phoneNumbers?: string;
        governorate?: string;
        city?: string;
        area?: string;
        street?: string;
        googleMapsLink?: string;
        latitude?: string;
        longitude?: string;
    };
    governorates?: any[];
}

export const StoreCard: FC<StoreCardProps> = ({
  form,
  parentField,
  remove,
  showTitle,
  governorates,
  isInList,
  fieldsNames = {},
}) => {
  const [selectedGovernorate, setSelectedGovernorate] = useState<string | undefined>();
  const [selectedCity, setSelectedCity] = useState<string | undefined>();
  const [cities, setCities] = useState<{ label: string; value: string }[]>([]);
  const [areas, setAreas] = useState<{ label: string; value: string }[]>([]);
  const t = useTypedTranslation("partner");
  const locale = useLocale();

  const governorateOptions = governorates?.map((governorate) => {
    return {
      value: governorate.id,
      label: governorate.name,
    };
  });

  const title = useMemo(
    () =>
      showTitle
        ? `Account${isInList && typeof parentField.name === "number" ? ` ${parentField.name + 1}` : ""}`
        : undefined,

    [isInList, parentField.name, showTitle]
  );

  //#region Governorate and City Selects
  const onGovernorateChange = async (value: string) => {
    form.resetFields([
      [parentField.name, fieldsNames.city ?? "city"],
      [parentField.name, fieldsNames.area ?? "area"],
      [parentField.name, fieldsNames.street ?? "street"],
    ]);
    const { data: myCities } = await getCities(1, 30, locale, value);
    const cityOptions = myCities.map((city) => {
      return {
        value: city.id,
        label: city.name,
      };
    });
    setCities(cityOptions);
    setSelectedGovernorate(value);
  };

  const onCityChange = async (value: string) => {
    form.resetFields([
      [parentField.name, fieldsNames.area ?? "area"],
      [parentField.name, fieldsNames.street ?? "street"],
    ]);
    const { data: myAreas } = await getAreas(1, 30, locale, selectedGovernorate, value);
    const areaOptions = myAreas.map((area) => {
      return {
        value: area.id,
        label: area.name,
      };
    });
    setAreas(areaOptions);
    setSelectedCity(value);
  };

  //#endregion

  //#region Google Maps Link
  const isMapsLinkChanged = useRef(false);

  const onGoogleMapsLinkChange = () => (isMapsLinkChanged.current = true);
  const onGoogleMapsLinkBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (!isMapsLinkChanged.current) return;

      const link = e.target.value;
      const newLatLng = getLatLongFromUrl(link);
      if (newLatLng) {
        form.setFieldsValue({
          [parentField.name]: { location: { latitude: newLatLng.latitude, longitude: newLatLng.longitude } },
        });
      } else {
        form.setFieldsValue({ [parentField.name]: { location: { latitude: "0", longitude: "0" } } });
      }

      isMapsLinkChanged.current = false;
    },
    [parentField.name, form]
  );
  //#endregion

  return (
    <BaseCard size="small" title={title} removeFn={remove}>
      <Form.Item
        label={t("branchName")}
        name={[parentField.name, fieldsNames.name ?? "name"]}
        rules={[{ required: true, min: 2, message: t("minLength", { min: 2 }) }]}
        data-testid="store-name-form-item"
      >
        <Input placeholder={t("branchName")} data-testid="store-name-input" />
      </Form.Item>

      {/* Store Phone Numbers Section */}

      <Divider>{t("address")}</Divider>
      <Space wrap>
        <Form.Item
          label={t("governorate")}
          name={[parentField.name, fieldsNames.governorate ?? "governorate"]}
          rules={[{ required: true }]}
          data-testid="store-governorate-form-item"
        >
          <CustomSelect
            options={governorateOptions}
            placeholder={t("selectGovernorate")}
            onChange={onGovernorateChange}
            data-testid="store-governorate-select"
          />
        </Form.Item>
        <Form.Item
          label={t("city")}
          name={[parentField.name, fieldsNames.city ?? "city"]}
          rules={[{ required: true }]}
          data-testid="store-city-form-item"
        >
          <CustomSelect
            options={cities}
            placeholder={t("selectCity")}
            disabled={!selectedGovernorate}
            onChange={onCityChange}
            data-testid="store-city-select"
          />
        </Form.Item>
        <Form.Item
          label={t("area")}
          name={[parentField.name, fieldsNames.area ?? "area"]}
          rules={[{ required: true }]}
          data-testid="store-area-form-item"
        >
          <CustomSelect
            options={areas}
            placeholder={t("area")}
            disabled={!selectedCity || !selectedGovernorate}
            data-testid="store-area-select"
          />
        </Form.Item>
        <Form.Item
          label={t("street")}
          name={[parentField.name, fieldsNames.street ?? "street"]}
          rules={[{ required: true }]}
          data-testid="store-street-form-item"
        >
          <Input placeholder={t("street")} data-testid="store-street-input" />
        </Form.Item>
      </Space>

      {/* Location Section */}
      <Space wrap align="end">
        <Form.Item
          label={t("googleMapsLink")}
          name={[parentField.name, fieldsNames.googleMapsLink ?? "google_maps_link"]}
          rules={[{ required: true, type: "url", message: t("invalidLink") }]}
          data-testid="store-google-maps-link-form-item"
        >
          <Input
            type="url"
            className={styles["url-input"]}
            placeholder={t("googleMapsLink")}
            onChange={onGoogleMapsLinkChange}
            onBlur={onGoogleMapsLinkBlur}
            data-testid="store-google-maps-link-input"
          />
        </Form.Item>
        <Form.Item
          id="latitude"
          name={[parentField.name, fieldsNames.latitude ?? "location", "latitude"]}
          preserve
          initialValue="0"
          data-testid="store-latitude-form-item"
          rules={[
            {
              type: "number",
              validator: (_, value) => validateNumber(value),
              message: t("notValidNumber", { label: "Latitude" }),
            },
          ]}
        >
          <Input addonAfter={t("latitude")} disabled data-testid="store-latitude-input" />
        </Form.Item>
        <Form.Item
          id="longitude"
          name={[parentField.name, fieldsNames.longitude ?? "location", "longitude"]}
          preserve
          initialValue="0"
          data-testid="store-longitude-form-item"
          rules={[
            {
              type: "number",
              validator: (_, value) => validateNumber(value),
              message: t("notValidNumber", { label: "Longitude" }),
            },
          ]}
        >
          <Input addonAfter={t("longitude")} disabled data-testid="store-longitude-input" />
        </Form.Item>
      </Space>
    </BaseCard>
  );
};
