import { Direction } from "@common/helpers/bidirectional.helpers";
import { useLocale } from "next-intl";

export type { Direction };

/** Custom hook for getting the direction based on the current locale. */
export const useDirection = (): Direction => {
  const lang = useLocale();
  const dir = lang === "ar" ? "rtl" : "ltr";
  return dir;
};
