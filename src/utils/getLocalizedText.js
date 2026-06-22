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
    alm: {
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
    },
    arab: {
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

/**
 * Extracts localized text from an API object based on the current language.
 *
 * @param {Object} item - The API object containing language-specific fields.
 * @param {string} field - The base field name (e.g., 'name', 'description', 'location').
 * @returns {string} - The localized string or an empty string if not found.
 */
export const getLocalizedText = (item, field) => {
    if (!item) return "";
    const lang = i18n.language || 'az';

    if (field === 'country') {
        const countryVal = item.country || "";
        const countryMap = countryTranslations[lang] || countryTranslations['az'];
        if (countryMap && countryMap[countryVal]) {
            return countryMap[countryVal];
        }
        if (lang !== 'en') {
            const enMap = countryTranslations['en'];
            if (enMap && enMap[countryVal]) {
                return enMap[countryVal];
            }
        }
        return countryVal;
    }

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

    // If active language is not english, try English first as a fallback
    if (lang !== 'en') {
        const enSuffixes = fieldMap['en'];
        for (const suffix of enSuffixes) {
            const key = `${field}${suffix}`;
            if (item[key]) return item[key];
        }
    }

    // Fallback to default (Azerbaijani) if localized version is missing
    return item[field] || "";
};
