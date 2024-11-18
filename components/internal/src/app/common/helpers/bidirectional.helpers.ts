import { getLocale } from 'next-intl/server';

export type Direction = 'rtl' | 'ltr';

export const getDirection = async (): Promise<Direction> => {
  const lang = await getLocale();
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  return dir;
};
