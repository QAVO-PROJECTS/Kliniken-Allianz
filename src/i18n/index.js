import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

export const SUPPORTED_LANGUAGES = ['az', 'en', 'ru', 'ar'];
export const DEFAULT_LANGUAGE = 'az';

/** Normalises any language tag ('ar-SA', 'en_US', legacy 'arb') to one of SUPPORTED_LANGUAGES. */
export const toBaseLanguage = (lng) => {
    const base = String(lng || '').toLowerCase().split(/[-_]/)[0];
    if (base === 'arb' || base === 'arab') return 'ar';
    return SUPPORTED_LANGUAGES.includes(base) ? base : DEFAULT_LANGUAGE;
};

export const isRtlLanguage = (lng) => String(lng || '').toLowerCase().startsWith('ar');

// Translation JSON files live in /public and are cached by the browser; the build id
// (set in vite.config.js) busts that cache on every deploy.
const BUILD_ID = import.meta.env.VITE_BUILD_ID || 'dev';

const applyDocumentDirection = (lng) => {
    if (typeof document === 'undefined' || !lng) return;
    const html = document.documentElement;
    html.setAttribute('dir', isRtlLanguage(lng) ? 'rtl' : 'ltr');
    html.setAttribute('lang', toBaseLanguage(lng));
};

i18n.on('languageChanged', applyDocumentDirection);

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: DEFAULT_LANGUAGE,
        supportedLngs: SUPPORTED_LANGUAGES,
        nonExplicitSupportedLngs: true,
        load: 'languageOnly',
        debug: import.meta.env.DEV && import.meta.env.VITE_I18N_DEBUG === 'true',
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage'],
            // Older builds stored Arabic as 'arb'.
            convertDetectedLanguage: (lng) => (/^arb/i.test(lng) ? 'ar' : lng),
        },
        backend: {
            loadPath: `/locales/{{lng}}/translation.json?v=${BUILD_ID}`,
        },
    });

export default i18n;
