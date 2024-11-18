export function makeArabicTextSearchable(text: string): string {
    if (!text) return text;
    return text
        // Normalize common variations of "ا"
        .replace(/[إأآا]/g, 'ا')
        // Normalize "ة" to "ه"
        .replace(/ة/g, 'ه')
        // Normalize "ى" to "ي"
        .replace(/ى/g, 'ي')
        // Normalize "ؤ" to "و"
        .replace(/ؤ/g, 'و')
        // Normalize "ئ" to "ي"
        .replace(/ئ/g, 'ي')
        // Normalize "لا" and its variations
        .replace(/لآ|لإ|لأ|لا/g, 'لا')
        // Remove any non-alphanumeric characters (optional, adjust as needed)
        .replace(/[^a-zA-Z0-9ء-ي]/g, '')
        // Remove all spaces
        .replace(/\s+/g, '')
        // Trim any leading or trailing spaces (just in case)
        .trim();
}