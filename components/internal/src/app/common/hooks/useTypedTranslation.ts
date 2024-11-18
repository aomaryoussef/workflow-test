import type { ExtractTranslationKeys, TranslationKeys } from "@common/helpers/translation.helpers";
import { Formats, TranslationValues, useTranslations } from "next-intl";
import { useCallback } from "react";

/**
 * A custom hook to use translations with types from `.json` translation files.
 *
 * @example
 * import { useTypedTranslation } from '@common/hooks/useTypedTranslation';
 *
 * const t = useTypedTranslation('consumer.labels');
 * t('nationalId');
 *
 * --------------------------------------------------------
 *
 * @example
 * // Or we can use it without providing the namespace:
 * import { useTypedTranslation } from '@common/hooks/useTypedTranslation';
 *
 * const t = useTypedTranslation();
 * t('consumer.labels.nationalId');
 */
export const useTypedTranslation = <Prefix extends TranslationKeys | undefined = undefined>(namespace?: Prefix) => {
  const _t = useTranslations(namespace),
    /**
     * `_t` is the one provided from "next-intl".
     * We created this one just for the nice types auto completion based on the translation keys from `en.json` file.
     */
    t = useCallback(
      (key: ExtractTranslationKeys<Prefix>, values?: TranslationValues, formats?: Partial<Formats>) =>
        _t(key as any, values, formats),
      [_t]
    );

  return t;
};
