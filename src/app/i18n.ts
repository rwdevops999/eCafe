import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationNL from '../../translations/translationNL.json'
import translationEN from '../../translations/translationEN.json'
import translationFR from '../../translations/translationFR.json'

i18n
.use(LanguageDetector)
.use(initReactI18next)
.init({
    fallbackLng: 'en',
    debug: true,
    interpolation: {
        escapeValue: false
    },
    resources: {
      'be-NL': {
        translation: translationNL
      },
      'nl': {
        translation: translationNL
      },
      'fr': {
        translation: translationFR
      },
      'en': {
          translation: translationEN
        },
      }
});

export default i18n;
