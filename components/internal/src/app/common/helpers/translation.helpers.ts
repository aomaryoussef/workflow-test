import type ar from "@/../messages/ar.json";
import type en from "@/../messages/en.json";
import { Formats, NestedKeyOf, TranslationValues } from "next-intl";
import { getTranslations } from "next-intl/server";

import { IntersectingKeys, RemovePrefix } from "./types.helpers";

/**
 * Assuming all keys in 'en.json' are the same in 'ar.json'.
 * If a key is missing in one of the files, it will not be included in the resulting type.
 */
export type TranslationJson = IntersectingKeys<typeof en, typeof ar>;
export type TranslationKeys = NestedKeyOf<TranslationJson>;

/** Determines translation keys based on `Prefix` */
export type ExtractTranslationKeys<Prefix extends TranslationKeys | undefined> = Prefix extends undefined
  ? TranslationKeys
  : RemovePrefix<NonNullable<Prefix>, TranslationKeys>;

/**
 * A function to use translations with types from `.json` translation files.
 *
 * @example
 * import { getTypedTranslation } from '@common/helpers/translation.helpers';
 *
 * const t = await getTypedTranslation('consumer.labels');
 * t('nationalId');
 *
 * --------------------------------------------------------
 *
 * @example
 * // Or we can use it without providing the namespace:
 * import { getTypedTranslation } from '@common/helpers/translation.helpers';
 *
 * const t = await getTypedTranslation();
 * t('consumer.labels.nationalId');
 */
export async function getTypedTranslation<Prefix extends TranslationKeys | undefined = undefined>(namespace?: Prefix) {
  "use server";

  const _t = await getTranslations(namespace),
    t = (key: ExtractTranslationKeys<Prefix>, values?: TranslationValues, formats?: Partial<Formats>) =>
      _t(key as any, values, formats);

  return t;
}
