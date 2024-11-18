
const arabicHindiDigits = '٠١٢٣٤٥٦٧٨٩';

export const toArabicNumerals = (num: number | string): string => {
  if (!num) return ''
  return num.toString().split('').map(digit => arabicHindiDigits.charAt(Number(digit))).join('');
}

export const generateArabicDate = () => {
  const date = new Date();

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    numberingSystem: 'arab'
  };
  const formattedDateParts = date.toLocaleDateString('ar-EG', options).replace(/-/g, ' / ').split('/');
  return `${formattedDateParts[0]} / ${formattedDateParts[1]} / ${formattedDateParts[2]}`;
}

export const getTodayInArabic = () => {
  const daysOfWeek = [
    'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'
  ];
  const today = new Date();
  const dayIndex = today.getDay();
  return daysOfWeek[dayIndex];
}