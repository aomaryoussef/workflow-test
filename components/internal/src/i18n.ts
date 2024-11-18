import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { type AbstractIntlMessages } from "next-intl";

// Can be imported from a shared config
const locales = ["en", "ar"] as const
type Locale = (typeof locales)[number];

const messageImports = {
  en: () => import("../messages/en.json"),
  ar: () => import("../messages/ar.json"),
} as const satisfies Record<
  Locale,
  () => Promise<{ default: AbstractIntlMessages }>
>;

export function isValidLocale(locale: unknown): locale is Locale {
  return locales.some((l) => l === locale);
}

export default getRequestConfig(async ({ locale }) => {
  const baseLocal = new Intl.Locale(locale).baseName;
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(baseLocal as Locale)) notFound();
  const messages = (await messageImports[baseLocal as Locale]()).default;
  return {
    messages,
  };
});
