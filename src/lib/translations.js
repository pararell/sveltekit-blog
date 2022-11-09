import i18n from 'sveltekit-i18n';

/** @type {import('sveltekit-i18n').Config} */
const config = ({
  loaders: [
    {
      locale: 'en',
      key: 'common',
      loader: async () => (
        await import('./translations/en.json')
      ).default,
    },
    {
      locale: 'sk',
      key: 'common',
      loader: async () => (
        await import('./translations/sk.json')
      ).default,
    }
  ],
});

export const { t, locale, locales, loading, loadTranslations, setLocale } = new i18n(config);