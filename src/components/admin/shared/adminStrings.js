import { useCallback } from "react";
import { useTranslation } from "react-i18next";

// Generic admin UI strings. Looked up as `adminPanel.common.<key>` in the
// locale files first; until those keys exist, these built-in defaults are used
// for the active language (falling back to Azerbaijani).
const DEFAULTS = {
    az: {
        groupCatalog: "Kataloq",
        groupTravel: "Səyahət və xidmətlər",
        groupEngagement: "Ünsiyyət",
        adminPanel: "İdarə paneli",
        administrator: "Administrator",
        openMenu: "Menyunu aç",
        closeMenu: "Menyunu bağla",
        search: "Axtar…",
        items: "nəticə",
        showing: "{{from}}-{{to}} / {{total}}",
        prevPage: "Əvvəlki səhifə",
        nextPage: "Növbəti səhifə",
        page: "Səhifə {{page}}",
        noResults: "Heç nə tapılmadı",
        noResultsHint: "Axtarış sözünü dəyişib yenidən cəhd edin.",
        noData: "Hələ heç bir qeyd yoxdur",
        noDataHint: "Yeni qeyd əlavə etdikdə burada görünəcək.",
        loading: "Yüklənir…",
        edit: "Redaktə et",
        delete: "Sil",
        deleting: "Silinir…",
        cancel: "Ləğv et",
        save: "Yadda saxla",
        saving: "Yadda saxlanılır…",
        deleteHint: "Bu əməliyyat geri qaytarıla bilməz.",
        expand: "Tam göstər",
        collapse: "Gizlət",
        uploadAction: "Fayl seçin",
        uploadRest: "və ya bura sürükləyin",
        uploadHint: "PNG, JPG, WEBP",
        remove: "Sil",
        current: "Mövcud",
        newFile: "Yeni",
        services: "Xidmətlər",
        language: "Dil",
        contentLanguage: "Məzmun dili",
        add: "Əlavə et",
    },
    en: {
        groupCatalog: "Catalog",
        groupTravel: "Travel & services",
        groupEngagement: "Engagement",
        adminPanel: "Admin panel",
        administrator: "Administrator",
        openMenu: "Open menu",
        closeMenu: "Close menu",
        search: "Search…",
        items: "items",
        showing: "{{from}}-{{to}} of {{total}}",
        prevPage: "Previous page",
        nextPage: "Next page",
        page: "Page {{page}}",
        noResults: "No results found",
        noResultsHint: "Try a different search term.",
        noData: "Nothing here yet",
        noDataHint: "New records will appear here once they are added.",
        loading: "Loading…",
        edit: "Edit",
        delete: "Delete",
        deleting: "Deleting…",
        cancel: "Cancel",
        save: "Save",
        saving: "Saving…",
        deleteHint: "This action cannot be undone.",
        expand: "Show more",
        collapse: "Show less",
        uploadAction: "Click to upload",
        uploadRest: "or drag and drop",
        uploadHint: "PNG, JPG, WEBP",
        remove: "Remove",
        current: "Current",
        newFile: "New",
        services: "Services",
        language: "Language",
        contentLanguage: "Content language",
        add: "Add",
    },
    ru: {
        groupCatalog: "Каталог",
        groupTravel: "Поездки и услуги",
        groupEngagement: "Коммуникации",
        adminPanel: "Панель управления",
        administrator: "Администратор",
        openMenu: "Открыть меню",
        closeMenu: "Закрыть меню",
        search: "Поиск…",
        items: "записей",
        showing: "{{from}}-{{to}} из {{total}}",
        prevPage: "Предыдущая страница",
        nextPage: "Следующая страница",
        page: "Страница {{page}}",
        noResults: "Ничего не найдено",
        noResultsHint: "Попробуйте изменить запрос.",
        noData: "Пока нет записей",
        noDataHint: "Новые записи появятся здесь после добавления.",
        loading: "Загрузка…",
        edit: "Редактировать",
        delete: "Удалить",
        deleting: "Удаление…",
        cancel: "Отмена",
        save: "Сохранить",
        saving: "Сохранение…",
        deleteHint: "Это действие нельзя отменить.",
        expand: "Показать полностью",
        collapse: "Свернуть",
        uploadAction: "Выберите файл",
        uploadRest: "или перетащите сюда",
        uploadHint: "PNG, JPG, WEBP",
        remove: "Удалить",
        current: "Текущее",
        newFile: "Новое",
        services: "Услуги",
        language: "Язык",
        contentLanguage: "Язык контента",
        add: "Добавить",
    },
    ar: {
        groupCatalog: "الكتالوج",
        groupTravel: "السفر والخدمات",
        groupEngagement: "التواصل",
        adminPanel: "لوحة التحكم",
        administrator: "المسؤول",
        openMenu: "فتح القائمة",
        closeMenu: "إغلاق القائمة",
        search: "بحث…",
        items: "عنصر",
        showing: "{{from}}-{{to}} من {{total}}",
        prevPage: "الصفحة السابقة",
        nextPage: "الصفحة التالية",
        page: "الصفحة {{page}}",
        noResults: "لا توجد نتائج",
        noResultsHint: "جرّب كلمة بحث أخرى.",
        noData: "لا توجد سجلات بعد",
        noDataHint: "ستظهر السجلات الجديدة هنا بعد إضافتها.",
        loading: "جارٍ التحميل…",
        edit: "تعديل",
        delete: "حذف",
        deleting: "جارٍ الحذف…",
        cancel: "إلغاء",
        save: "حفظ",
        saving: "جارٍ الحفظ…",
        deleteHint: "لا يمكن التراجع عن هذا الإجراء.",
        expand: "عرض المزيد",
        collapse: "عرض أقل",
        uploadAction: "اختر ملفًا",
        uploadRest: "أو اسحبه هنا",
        uploadHint: "PNG, JPG, WEBP",
        remove: "إزالة",
        current: "الحالي",
        newFile: "جديد",
        services: "الخدمات",
        language: "اللغة",
        contentLanguage: "لغة المحتوى",
        add: "إضافة",
    },
};

const normalizeLang = (lng = "az") => {
    const base = String(lng).toLowerCase().split("-")[0];
    if (base === "arb") return "ar";
    return DEFAULTS[base] ? base : "az";
};

/** `at('cancel')` → localized generic admin string (see DEFAULTS). */
export function useAdminT() {
    const { t, i18n } = useTranslation();
    const lang = normalizeLang(i18n.language);
    return useCallback(
        (key, vars) => t(`adminPanel.common.${key}`, {
            defaultValue: DEFAULTS[lang][key] ?? DEFAULTS.az[key] ?? key,
            ...vars,
        }),
        [t, lang],
    );
}

/**
 * Like `t(key)` but returns "" when the key is missing, so raw keys such as
 * "adminPanel.x.placeholders.de" never leak into placeholders.
 */
export function useOptionalT() {
    const { t } = useTranslation();
    return useCallback((key) => {
        const value = t(key, { defaultValue: "" });
        return value === key ? "" : value;
    }, [t]);
}
