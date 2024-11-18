import { getLocale } from 'next-intl/server';
import PartnerStoreForm from './_components/partner-store/PartnerStoreForm.tsx';
import { getGovernorates } from './action.ts';

export default async function PartnerCreate() {
  const locale = await getLocale();
  const { data: governorates } = await getGovernorates(1, 30, locale );
  return <PartnerStoreForm governorates={governorates} />;
}
