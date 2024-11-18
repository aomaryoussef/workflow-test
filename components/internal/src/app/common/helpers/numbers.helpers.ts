export const formatNumber = (number: number, locale: string) => new Intl.NumberFormat(`${locale}-EG`).format(number);
