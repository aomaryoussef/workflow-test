import { supportedLocales } from '@common/constants/locale.constants';

/** Sorts an array of objects by the label property, using the `supportedLocales`. */
export const sortLabelsFn = (a: { label: string }, b: { label: string }) =>
  a.label.localeCompare(b.label, supportedLocales);
