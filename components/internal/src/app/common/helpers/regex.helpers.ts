/**
 * `/^(\+2)? ?01[0-2,5]\d{8}$/`
 *
 * - `^`: Start of the string.
 * - `(\+2)?`: Matches the country code +20, which is optional (The `?` symbol makes the preceding group optional).
 * We use +2 instead of +20 because the leading 0 will be matched by the next part of the regex.
 * - `?`: Matches an optional space after the country code.
 * - `01`: Matches the starting 01 of Egyptian mobile numbers.
 * - `[0-2,5]{1}`: Matches the second digit, which can be 0, 1, 2, or 5 (for the different telecom operators in Egypt).
 * - `\d{8}`: Matches the remaining 8 digits of the phone number.
 * - `$`: End of the string.
 */
export const egyptMobileRegex = /^(\+2)? ?01[0-2,5]\d{8}$/;

/**
 * `/(\+20\s?)?(0\d{1,2})?\d{8}$/`
 *
 * - `^` and `$`: Match the start and end of the string.
 * - `(\+20\s?)?`: Matches the optional country code +20 followed by an optional space (`\s?`).
 * - `(0\d{1,2})?`: Matches the optional leading zero (0) and the area code (1 to 2 digits).
 * - `\d{8}`: Matches the 8-digit landline number.
 */
export const egyptLandlineRegex = /^(\+20\s?)?(0\d{1,2})?\d{8}$/;

/**  The regular expression **@(-?\d+\.\d+),(-?\d+\.\d+)** captures latitude and longitude values that follow the @ symbol in the URL. */
export const latLngInGoogleMapsLinkRegex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
