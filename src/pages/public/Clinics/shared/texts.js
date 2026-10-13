import i18n from "i18next";

// UI strings used by the medical listing/detail pages that have no key in
// public/locales yet. `t(key)` wins once the key is added to the locale files;
// until then the per-language default below is shown.
const FALLBACKS = {
    "medicalPages.noCertificates": {
        az: "Hələ sertifikat əlavə edilməyib",
        en: "No certificates have been added yet",
        ru: "Сертификаты пока не добавлены",
        ar: "لم تتم إضافة شهادات بعد",
    },
    "medicalPages.noBio": {
        az: "Bioqrafiya məlumatı hələ əlavə edilməyib",
        en: "Biography has not been added yet",
        ru: "Биография пока не добавлена",
        ar: "لم تتم إضافة السيرة الذاتية بعد",
    },
    "medicalPages.overview": {
        az: "Ümumi məlumat",
        en: "Overview",
        ru: "Обзор",
        ar: "نظرة عامة",
    },
    "medicalPages.clinicsOffering": {
        az: "Bu xidməti təqdim edən klinikalar",
        en: "Clinics offering this service",
        ru: "Клиники, предлагающие эту услугу",
        ar: "العيادات التي تقدم هذه الخدمة",
    },
    "medicalPages.servicesInCategory": {
        az: "Bu kateqoriyadakı xidmətlər",
        en: "Services in this category",
        ru: "Услуги в этой категории",
        ar: "الخدمات في هذه الفئة",
    },
    "medicalPages.consultTitle": {
        az: "Pulsuz konsultasiya alın",
        en: "Get a free consultation",
        ru: "Получите бесплатную консультацию",
        ar: "احصل على استشارة مجانية",
    },
    "medicalPages.consultText": {
        az: "Müraciətinizi göndərin, koordinatorumuz qısa zamanda sizinlə əlaqə saxlayacaq.",
        en: "Send a request and our coordinator will get back to you shortly.",
        ru: "Оставьте заявку, и наш координатор скоро свяжется с вами.",
        ar: "أرسل طلبك وسيتواصل معك منسقنا قريبًا.",
    },
    "medicalPages.showLess": {
        az: "Daha az göstər",
        en: "Show less",
        ru: "Свернуть",
        ar: "عرض أقل",
    },
    "medicalPages.noServices": {
        az: "Xidmət tapılmadı",
        en: "No services found",
        ru: "Услуги не найдены",
        ar: "لم يتم العثور على خدمات",
    },
    "medicalPages.noClinics": {
        az: "Bu xidmət üçün hələ klinika əlavə edilməyib",
        en: "No clinics have been added for this service yet",
        ru: "Для этой услуги пока не добавлены клиники",
        ar: "لم تتم إضافة عيادات لهذه الخدمة بعد",
    },
    "medicalPages.notFound": {
        az: "Məlumat tapılmadı",
        en: "Nothing was found",
        ru: "Ничего не найдено",
        ar: "لم يتم العثور على شيء",
    },
    "medicalPages.sending": {
        az: "Göndərilir…",
        en: "Sending…",
        ru: "Отправка…",
        ar: "جارٍ الإرسال…",
    },
    "medicalPages.servicesCount": {
        az: "{{n}} xidmət",
        en: "{{n}} services",
        ru: "Услуг: {{n}}",
        ar: "{{n}} خدمات",
    },
    "medicalPages.results": {
        az: "{{n}} nəticə",
        en: "{{n}} results",
        ru: "Найдено: {{n}}",
        ar: "{{n}} نتيجة",
    },
    "medicalPages.callUs": {
        az: "Zəng edin",
        en: "Call us",
        ru: "Позвонить",
        ar: "اتصل بنا",
    },
    "medicalPages.activeFilters": {
        az: "Seçilmiş filtrlər",
        en: "Active filters",
        ru: "Выбранные фильтры",
        ar: "عوامل التصفية النشطة",
    },
    "medicalPages.clinicsCount": {
        az: "{{n}} klinika",
        en: "{{n}} clinics",
        ru: "Клиник: {{n}}",
        ar: "{{n}} عيادات",
    },
    "medicalPages.otherServices": {
        az: "Digər xidmətlər",
        en: "Other services",
        ru: "Другие услуги",
        ar: "خدمات أخرى",
    },
    "medicalPages.pauseVideo": {
        az: "Videonu dayandır",
        en: "Pause video",
        ru: "Приостановить видео",
        ar: "إيقاف الفيديو مؤقتًا",
    },
    "medicalPages.playVideo": {
        az: "Videonu oynat",
        en: "Play video",
        ru: "Воспроизвести видео",
        ar: "تشغيل الفيديو",
    },
    "medicalPages.charCount": {
        az: "{{n}} / {{max}} simvol",
        en: "{{n}} / {{max}} characters",
        ru: "{{n}} / {{max}} символов",
        ar: "{{n}} / {{max}} حرفًا",
    },
};

/**
 * Translate `key`, falling back to the built-in per-language default.
 * @param {Function} t i18next `t`
 * @param {string} key
 * @param {object} [vars] interpolation values
 */
export function tx(t, key, vars = {}) {
    const lang = (i18n.language || "az").slice(0, 2);
    const map = FALLBACKS[key] || {};
    return t(key, { defaultValue: map[lang] ?? map.en ?? key, ...vars });
}
