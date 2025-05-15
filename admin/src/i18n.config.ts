/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
export const locales = ['en', 'pt-BR'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale = 'en' as const;

export function getTranslations(locale: Locale): Promise<Record<string, any>> {
  return import(`../messages/${locale}.json`).then((module) => module.default);
}

export const localeNames = {
  en: 'English',
  'pt-BR': 'Português (BR)',
}; 