import i18n from "i18next";

const TEMPLATES = {
    az: (car) => `Mən "${car}" avtomobili üçün müraciət etmək istəyirəm.`,
    en: (car) => `I would like to apply for the car "${car}".`,
    ru: (car) => `Я хотел бы подать заявку на автомобиль "${car}".`,
    ar: (car) => `أود التقدم بطلب للحصول على السيارة "${car}".`,
};

/** Pre-filled enquiry text for a car, in the current UI language. */
export const carEnquiryMessage = (carName) => {
    const lang = i18n.language === "arb" ? "ar" : i18n.language;
    return (TEMPLATES[lang] || TEMPLATES.az)(carName);
};

/** Paragraphs from API text that uses blank lines / CRLF as separators. */
export const toParagraphs = (text = "") =>
    String(text)
        .split(/\r?\n\s*\r?\n|\r?\n/)
        .map((p) => p.trim())
        .filter(Boolean);
