//src/i18n/index.js
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import i18nextXHRBackend from 'i18next-xhr-backend';

const i18n = i18next
  .use(LanguageDetector)
  .use(i18nextXHRBackend)
  .init({
    fallbackLng: 'en',
    lng: 'en',
    resources: {
      en: {
        translation: {
          "welcome_message": "Welcome to our application!"
        }
      },
      ar: {
        translation: {
          "welcome_message": "مرحبا بكم في تطبيقنا!"
        }
      }
    },
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    }
  });

export default i18n;