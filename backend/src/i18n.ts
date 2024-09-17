// i18n.ts
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import HttpMiddleware from 'i18next-http-middleware';

i18next
    .use(Backend)
    .use(HttpMiddleware.LanguageDetector)
    .init({
        fallbackLng: 'en',
        ns: ['translations'], // Namespace para las traducciones
        defaultNS: 'translations',
        backend: {
            loadPath: __dirname + '/locales/{{lng}}/{{ns}}.json'
        },
        detection: {
            order: ['header'], // Detectar idioma desde el header
            lookupHeader: 'x-application-lang', // Nombre del header
            caches: false // No cachear el idioma
        }
    });

export default i18next;
