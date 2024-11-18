export const LANGUAGES = {
    AR: 'ar',
    EN: 'en'
} as const;

export type Language  = typeof LANGUAGES[keyof typeof LANGUAGES];