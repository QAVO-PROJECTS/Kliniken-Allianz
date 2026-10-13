// Helpers shared by DoctorCreate and DoctorEdit.

/** Display order of the content-language fields. */
export const LANG_ORDER = ["az", "ru", "en", "de", "ar"];

/** API field suffix per content language (`name`, `nameEng`, `nameRu`, ...). */
const API_SUFFIX = { az: "", en: "Eng", ru: "Ru", de: "Alm", ar: "Arab" };

/** Order the localized fields are appended to FormData (unchanged from the old pages). */
const APPEND_ORDER = ["az", "en", "ru", "de", "ar"];

/** Suffix of the `adminPanel.doctorAdd.placeholders.<field><Suffix>` translation keys. */
export const PLACEHOLDER_SUFFIX = { az: "Az", ru: "Ru", en: "En", de: "Alm", ar: "Arab" };

/**
 * Index of each language inside a bio section's `inputs` array:
 * [name, nameEng, nameRu, nameAlm, nameArab].
 */
export const BIO_INDEX = { az: 0, en: 1, ru: 2, de: 3, ar: 4 };

export const emptyLangs = () => ({ az: "", ru: "", en: "", de: "", ar: "" });

/** `{az, ru, en, de, ar}` from an API object's `<field>`, `<field>Eng`, ... values. */
export const langsFromApi = (item, field) =>
    Object.fromEntries(LANG_ORDER.map((lang) => [lang, item?.[`${field}${API_SUFFIX[lang]}`] || ""]));

/** Appends `<field>`, `<field>Eng`, `<field>Ru`, `<field>Alm`, `<field>Arab` to a FormData. */
export const appendLangs = (formData, field, values) => {
    APPEND_ORDER.forEach((lang) => formData.append(`${field}${API_SUFFIX[lang]}`, values[lang]));
};

let localId = 0;
/** Stable local id for list items that have no server id (new files, new bio sections). */
export const nextLocalId = () => `local-${++localId}`;

export const newBioSection = () => ({ id: nextLocalId(), expanded: true, inputs: Array(5).fill("") });
