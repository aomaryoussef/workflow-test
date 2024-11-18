import { arabicHindiDigits, arabicNumbersText } from "@common/constants/arabic.constants";

export const toArabicNumerals = (num: number | string): string => {
  if (!num) return "";
  return num
    .toString()
    .split("")
    .map((digit) => arabicHindiDigits.charAt(Number(digit)))
    .join("");
};

export const generateArabicDate = () => {
  const date = new Date();

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    numberingSystem: "arab",
  };
  const formattedDateParts = date.toLocaleDateString("ar-EG", options).replace(/-/g, " / ").split("/");
  return `${formattedDateParts[0]} / ${formattedDateParts[1]} / ${formattedDateParts[2]}`;
};

export const getTodayInArabic = () => {
  const daysOfWeek = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  const today = new Date();
  const dayIndex = today.getDay();
  return daysOfWeek[dayIndex];
};

function handleUnits(currentDigit: number, result: string[]): void {
  if (currentDigit > 0) result.push(arabicNumbersText.unis[currentDigit]);
}

function handleTens(currentDigit: number, previousDigit: number, result: string[], placeValue: number): void {
  if (currentDigit === 1) {
    result[0] = arabicNumbersText.xtens[previousDigit];
  } else if (currentDigit > 1) {
    if (placeValue > 0) result.unshift(arabicNumbersText.and);
    result.unshift(arabicNumbersText.tens[currentDigit]);
  }
}

function handleHundreds(currentDigit: number, result: string[], placeValue: number): void {
  if (placeValue > 0 && currentDigit > 0) result.push(arabicNumbersText.and);
  if (currentDigit > 0) result.push(arabicNumbersText.huns[currentDigit]);
}

function handleThousands(currentDigit: number, nextDigit: number | null, result: string[], placeValue: number): void {
  if (placeValue > 0 && currentDigit > 0 && !nextDigit) result.push(arabicNumbersText.and);
  if (currentDigit > 0 && !nextDigit) result.push(arabicNumbersText.thos[currentDigit]);
}

function handleTenThousands(
  currentDigit: number,
  previousDigit: number,
  result: string[],
  placeValue: number,
  number: number
): void {
  if (placeValue > 0 && currentDigit > 0 && number - currentDigit * 1e4 - previousDigit * 1e3 > 0)
    result.push(arabicNumbersText.and);
  if (currentDigit === 1) {
    result.push(arabicNumbersText.xthos[previousDigit]);
  } else if (currentDigit > 1) {
    result.push(arabicNumbersText.l[1]);
    result.push(arabicNumbersText.tens[currentDigit]);
    if (previousDigit > 0) {
      result.push(arabicNumbersText.and);
      result.push(arabicNumbersText.unis[previousDigit]);
    }
  }
}

function handleHundredThousands(
  currentDigit: number,
  previousDigit: number,
  result: string[],
  placeValue: number
): void {
  if (placeValue > 0 && currentDigit > 0) result.push(arabicNumbersText.and);
  if (currentDigit > 0) {
    if (!previousDigit) result.push(arabicNumbersText.l[1]);
    result.push(arabicNumbersText.huns[currentDigit]);
  }
}

function handleMillions(currentDigit: number, result: string[]): void {
  if (currentDigit === 1) {
    result.push(arabicNumbersText.mil[0]);
  } else if (currentDigit === 2) {
    result.push(arabicNumbersText.mil[1]);
  } else if (currentDigit > 2) {
    result.push(arabicNumbersText.mil[2]);
    result.push(arabicNumbersText.unis[currentDigit]);
  }
}

export function numberToArabicText(numberInput: string | number): string | false {
  const cleanStr = numberInput.toString().replace(/[,\s]/g, "");
  const number = isNaN(parseFloat(cleanStr)) ? null : parseFloat(cleanStr);

  if (number === null || number < 0 || number >= 1e7) return "";

  const parts = Math.floor(number).toString().split("").reverse();
  let result: string[] = [];
  let placeValue = 0;

  parts.forEach((digitStr, i) => {
    const currentDigit = parseInt(digitStr, 10);
    const previousDigit = parseInt(parts[i - 1], 10) || 0;
    const nextDigit = parseInt(parts[i + 1], 10) || null;

    switch (i) {
      case 0:
        handleUnits(currentDigit, result);
        break;
      case 1:
        handleTens(currentDigit, previousDigit, result, placeValue);
        break;
      case 2:
        handleHundreds(currentDigit, result, placeValue);
        break;
      case 3:
        handleThousands(currentDigit, nextDigit, result, placeValue);
        break;
      case 4:
        handleTenThousands(currentDigit, previousDigit, result, placeValue, number);
        break;
      case 5:
        handleHundredThousands(currentDigit, previousDigit, result, placeValue);
        break;
      case 6:
        handleMillions(currentDigit, result);
        break;
    }

    placeValue += currentDigit * Math.pow(10, i);
  });
  result = result.reverse();
  return result.join(" ");
}
