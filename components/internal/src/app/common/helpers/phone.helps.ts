export const removeCountryCode = (phone: string): string => {
  if (phone.startsWith('+2')) phone = phone.slice(2); // Remove +2 from phone number
  return phone;
};
