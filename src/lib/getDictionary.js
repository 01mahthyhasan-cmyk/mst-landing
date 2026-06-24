import 'server-only';

const dictionaries = {
  en: () => import('../../messages/en.json').then((m) => m.default),
  ta: () => import('../../messages/ta.json').then((m) => m.default),
};

/**
 * Load the translation dictionary for a given locale.
 * Falls back to Tamil (default) if locale is unsupported.
 *
 * @param {string} locale - 'en' or 'ta'
 * @returns {Promise<object>} - The full translation dictionary
 */
export async function getDictionary(locale) {
  return (dictionaries[locale] ?? dictionaries.ta)();
}

/**
 * Supported locales.
 */
export const locales = ['ta', 'en'];

/**
 * Default locale.
 */
export const defaultLocale = 'ta';

/**
 * Check whether a locale string is a supported locale.
 * @param {string} locale
 * @returns {boolean}
 */
export function hasLocale(locale) {
  return locale in dictionaries;
}
