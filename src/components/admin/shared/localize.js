// Picks the localized value of an API field for the admin "content language"
// selector (codes: AZ | EN | RU | DE | AR). Falls back to the base (AZ) field
// when the translation is missing or blank.
const SUFFIXES = {
    EN: ["Eng", "EN", "En"],
    RU: ["Ru", "RU"],
    DE: ["Alm", "AL", "De"],
    AR: ["Arab", "AR", "Ar"],
};

export const pickLocalized = (item, field, language = "AZ") => {
    if (!item) return "";
    const lang = String(language).toUpperCase();
    for (const suffix of SUFFIXES[lang] || []) {
        const value = item[`${field}${suffix}`];
        if (typeof value === "string" ? value.trim() : value) return value;
    }
    return item[field] ?? "";
};
