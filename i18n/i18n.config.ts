// import { mergeWithDefaultTranslations } from '@orion/i18n';
import i18nEn from './en/i18n';
import i18nFr from './fr/i18n';

export default defineI18nConfig(() => ({
  legacy: false,

  locale: 'fr',
  globalInjection: true,
  messages: {
    en: i18nEn,
    fr: i18nFr,
  },
  // messages: mergeWithDefaultTranslations({
  //   en: i18nEn,
  //   fr: i18nFr,
  // }),
}));
