// Shared field metadata for the sanatorium create/edit forms.

// Content language → LangField code, API/FormData field suffix and the
// suffix used by the existing `placeholders.*` translation keys.
export const SAN_LANGS = [
    { key: "az", lang: "az", suffix: "", ph: "Az" },
    { key: "ru", lang: "ru", suffix: "Ru", ph: "Ru" },
    { key: "en", lang: "en", suffix: "Eng", ph: "En" },
    { key: "de", lang: "de", suffix: "Alm", ph: "Alm" },
    { key: "ar", lang: "ar", suffix: "Arab", ph: "Arab" },
];

export const EMPTY_LANGS = { az: "", ru: "", en: "", de: "", ar: "" };

export const EMPTY_SERVICE = { name: "", nameEng: "", nameRu: "", nameAlm: "", nameArab: "" };

// Room types: state key, API field prefix (camelCase) and FormData prefix (PascalCase).
export const ROOM_TYPES = [
    { key: "standard", api: "standardRoomDescription", form: "StandardRoomDescription", label: "Standart" },
    { key: "comfort", api: "comfortRoomDescription", form: "ComfortRoomDescription", label: "Comfort" },
    { key: "vip", api: "vipRoomDescription", form: "VipRoomDescription", label: "VIP" },
];

export const EMPTY_ROOMS = {
    standard: { ...EMPTY_LANGS },
    comfort: { ...EMPTY_LANGS },
    vip: { ...EMPTY_LANGS },
};

/** Reads `<base><suffix>` for every content language from an API object. */
export const readLangs = (item, base) =>
    Object.fromEntries(SAN_LANGS.map(({ key, suffix }) => [key, item?.[`${base}${suffix}`] || ""]));

// Client-only keys for list rows that have no server id yet. Stripped before
// the services are serialised, so the request payload is unchanged.
let keySeq = 0;
export const withClientKey = (service) => ({ ...service, _key: `new-${++keySeq}` });
// eslint-disable-next-line no-unused-vars
export const stripClientKey = ({ _key, ...service }) => service;

// Stable React keys for File objects held in state.
const fileKeys = new WeakMap();
export const fileKey = (file) => {
    if (!fileKeys.has(file)) fileKeys.set(file, `file-${++keySeq}`);
    return fileKeys.get(file);
};
