"use client";

import { numberToArabicText } from "@common/helpers/arabic-text.helpers";
import { formatNumber } from "@common/helpers/numbers.helpers";
import { useTypedTranslation } from "@common/hooks/useTypedTranslation";
import { Alert } from "antd";
import { useLocale } from "next-intl";
import { forwardRef, useMemo } from "react";

const CreditLimitSection = forwardRef<HTMLDivElement, { creditLimit: number; type: "info" | "success" }>(
  function CreditLimitSection({ creditLimit, type }, ref) {
    const t = useTypedTranslation("consumer");
    const locale = useLocale();

    const formattedCreditLimit = useMemo(() => formatNumber(creditLimit, locale), [creditLimit, locale]);
    const creditLimitArabicText = useMemo(() => {
      const parsedVal = numberToArabicText(creditLimit.toString());
      return parsedVal ? `${parsedVal} جنيهًا مصريًا فقط لا غير` : "";
    }, [creditLimit]);

    return (
      <div ref={ref}>
        <Alert
          className="!border-2 text-center text-lg font-bold"
          message={t("creditLimitCard.title")}
          description={
            <div className="text-xl">
              {formattedCreditLimit}
              <br />
              {creditLimitArabicText}
            </div>
          }
          type={type}
        />
      </div>
    );
  }
);

export default CreditLimitSection;
