export enum Language {
  AR = 'ar',
  EN = 'en',
}

export function getLanguageCode(language: Language): string {
  switch (language) {
    case Language.EN:
      return 'English'; // You can return a string representing the language name or code
    case Language.AR:
      return 'Arabic'; // You can return a string representing the language name or code
    default:
      return 'Unknown'; // Handle unexpected cases
  }
}
