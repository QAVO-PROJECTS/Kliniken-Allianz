import i18n from 'i18next';

/**
 * Extracts localized text from an API object based on the current language.
 *
 * @param {Object} item - The API object containing language-specific fields.
 * @param {string} field - The base field name (e.g., 'name', 'description', 'location').
 * @returns {string} - The localized string or an empty string if not found.
 */
export const getLocalizedText = (item, field) => {
    if (!item) return "";
    const lang = i18n.language;

    // Mapping of i18next language codes to backend field suffixes
    // The backend uses various suffixes like Eng, EN, Ru, RU, Alm, AL, Arab, AR, etc.
    const fieldMap = {
        en: ['Eng', 'EN', 'en'],
        ru: ['Ru', 'RU', 'ru'],
        de: ['Alm', 'AL', 'de'],
        alm: ['Alm', 'AL', 'de'], // Added 'alm'
        ar: ['Arab', 'AR', 'ar'],
        arb: ['Arab', 'AR', 'ar'], // Added 'arb'
    };

    if (lang === 'az') {
        return item[field] || "";
    }

    const suffixes = fieldMap[lang];
    if (suffixes) {
        for (const suffix of suffixes) {
            const key = `${field}${suffix}`;
            if (item[key]) return item[key];
        }
    }

    // Fallback to default (Azerbaijani) if localized version is missing
    return item[field] || "";
};
