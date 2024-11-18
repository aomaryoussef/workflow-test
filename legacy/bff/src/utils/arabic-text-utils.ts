import { CustomLogger } from "../services/logger";

const logger = new CustomLogger("arabic-text-utils");

const arabicNumbersText = {
    l: ["صفر", "ألف"],
    unis: ["", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة"],
    tens: ["", "عشرة", "عشرون", "ثلاثون", "أربعون", "خمسون", "ستون", "سبعون", "ثمانون", "تسعون"],
    xtens: ["عشرة", "أحد عشر", "اثنا عشر", "ثلاثة عشر", "أربعة عشر", "خمسة عشر", "ستة عشر", "سبعة عشر", "ثمانية عشر", "تسعة عشر"],
    huns: ["", "مائة", "مئتان", "ثلاثمائة", "أربعمائة", "خمسمائة", "ستمائة", "سبعمائة", "ثمانمائة", "تسعمائة"],
    thos: ["", "ألف", "ألفان", "ثلاثة آلاف", "أربعة آلاف", "خمسة آلاف", "ستة آلاف", "سبعة آلاف", "ثمانية آلاف", "تسعة آلاف"],
    xthos: ["عشرة آلاف", "أحد عشر ألف", "اثنا عشر ألف", "ثلاثة عشر ألف", "أربعة عشر ألف", "خمسة عشر ألف", "ستة عشر ألف", "سبعة عشر ألف", "ثمانية عشر ألف", "تسعة عشر ألف"],
    mil: ["مليون", "مليونان", "ملايين"],
    and: "و",
    poundSingular: "جنيه",
    poundDual: "جنيهان",
    poundPlural: "جنيهات",
    poundAccusative: "جنيها",
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

function handleTenThousands(currentDigit: number, previousDigit: number, result: string[], placeValue: number, number: number): void {
    if (placeValue > 0 && currentDigit > 0 && number - currentDigit * 1e4 - previousDigit * 1e3 > 0) result.push(arabicNumbersText.and);
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

function handleHundredThousands(currentDigit: number, previousDigit: number, result: string[], placeValue: number): void {
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
    try {
        const cleanStr = numberInput.toString().replace(/[,\s]/g, "");
        const number = isNaN(parseFloat(cleanStr)) ? null : parseFloat(cleanStr);

        if (number === null || number < 0 || number >= 1e7) return false;

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
        result = result.reverse()
        return result.join(" ");
    } catch (e) {
        logger.error(`failed to convert number To Arabic Text number: ${numberInput} ${e}`);
        return ""
    }
}
