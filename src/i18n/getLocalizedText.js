import i18n from 'i18next';

const countryTranslations = {
    az: {
        "Azərbaycan": "Azərbaycan",
        "Almaniya": "Almaniya",
        "Rusiya": "Rusiya",
        "Türkiyə": "Türkiyə",
        "Gürcüstan": "Gürcüstan",
        "Ukrayna": "Ukrayna",
        "BƏƏ": "BƏƏ",
        "Qətər": "Qətər",
        "Səudiyyə Ərəbistanı": "Səudiyyə Ərəbistanı"
    },
    en: {
        "Azərbaycan": "Azerbaijan",
        "Almaniya": "Germany",
        "Rusiya": "Russia",
        "Türkiyə": "Turkey",
        "Gürcüstan": "Georgia",
        "Ukrayna": "Ukraine",
        "BƏƏ": "UAE",
        "Qətər": "Qatar",
        "Səudiyyə Ərəbistanı": "Saudi Arabia"
    },
    ru: {
        "Azərbaycan": "Азербайджан",
        "Almaniya": "Германия",
        "Rusiya": "Россия",
        "Türkiyə": "Турция",
        "Gürcüstan": "Грузия",
        "Ukrayna": "Украина",
        "BƏƏ": "ОАЭ",
        "Qətər": "Катар",
        "Səudiyyə Ərəbistanı": "Саудовская Аравия"
    },
    de: {
        "Azərbaycan": "Aserbaidschan",
        "Almaniya": "Deutschland",
        "Rusiya": "Russland",
        "Türkiyə": "Türkei",
        "Gürcüstan": "Georgien",
        "Ukrayna": "Ukraine",
        "BƏƏ": "VAE",
        "Qətər": "Katar",
        "Səudiyyə Ərəbistanı": "Saudi-Arabien"
    },
    ar: {
        "Azərbaycan": "أذربيجان",
        "Almaniya": "ألمانيا",
        "Rusiya": "روسيا",
        "Türkiyə": "تركيا",
        "Gürcüstan": "جورجيا",
        "Ukrayna": "أوكرانيا",
        "BƏƏ": "الإمارات العربية المتحدة",
        "Qətər": "قطر",
        "Səudiyyə Ərəbistanı": "المملكة العربية السعودية"
    }
};

// Backend field suffixes per language, in order of preference:
// name (az) · nameEng · nameRu · nameAlm (de) · nameArab. A few legacy forms use EN/RU/AR.
const FIELD_SUFFIXES = {
    en: ['Eng', 'EN', 'En'],
    ru: ['Ru', 'RU'],
    de: ['Alm', 'AL', 'De'],
    ar: ['Arab', 'AR', 'Ar'],
};

const LANGUAGE_ALIASES = {arb: 'ar', arab: 'ar', alm: 'de', eng: 'en'};

/** 'ar-SA' → 'ar', 'en_US' → 'en', 'arb' → 'ar', undefined → 'az'. */
export const normalizeLanguage = (lng) => {
    const base = String(lng || '').toLowerCase().split(/[-_]/)[0];
    return LANGUAGE_ALIASES[base] || base || 'az';
};

const hasValue = (value) =>
    value !== undefined && value !== null && !(typeof value === 'string' && value.trim() === '');

const pick = (item, field, lang) => {
    if (lang === 'az') return hasValue(item[field]) ? item[field] : undefined;
    for (const suffix of FIELD_SUFFIXES[lang] || []) {
        const value = item[`${field}${suffix}`];
        if (hasValue(value)) return value;
    }
    return undefined;
};

const translateCountry = (value, lang) => {
    if (!value) return '';
    const map = countryTranslations[lang] || countryTranslations.az;
    return map[value] || countryTranslations.en[value] || value;
};

/**
 * Extracts localized text from an API object for the current (or given) language.
 * Falls back: requested language → English → Azerbaijani (base field).
 *
 * @param {Object} item - API object with fields like `name`, `nameEng`, `nameRu`, `nameAlm`, `nameArab`.
 * @param {string} field - Base field name, e.g. 'name', 'description', 'location', 'surName'.
 * @param {string} [lng] - Language override; defaults to the active i18next language.
 * @returns {string} The localized value or an empty string.
 */
export const getLocalizedText = (item, field, lng) => {
    if (!item || !field) return '';
    const lang = normalizeLanguage(lng || i18n.resolvedLanguage || i18n.language);

    if (field === 'country') return translateCountry(item.country, lang);

    return pick(item, field, lang) ?? (lang !== 'en' ? pick(item, field, 'en') : undefined) ?? pick(item, field, 'az') ?? '';
};

export default getLocalizedText;
