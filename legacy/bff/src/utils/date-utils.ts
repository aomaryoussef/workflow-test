export const getDateString = (date: Date) => {
  return date.toLocaleDateString("ar-EG-u-nu-latn", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Africa/Cairo",
  });
};

export const getTimeString = (date: Date) => {
  return date.toLocaleTimeString("ar-EG-u-nu-latn", {
    timeZone: "Africa/Cairo",
  });
};
