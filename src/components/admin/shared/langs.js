import aze from "../../../assets/azerbaijan.svg";
import rus from "../../../assets/russia.svg";
import usa from "../../../assets/unitedstates.svg";
import ger from "../../../assets/germany.svg";
import arb from "../../../assets/unitedarabemirates.svg";

/** Content languages used by admin forms (flag + endonym). */
export const LANGS = {
    az: { flag: aze, label: "Azərbaycanca", code: "AZ" },
    ru: { flag: rus, label: "Русский", code: "RU" },
    en: { flag: usa, label: "English", code: "EN" },
    de: { flag: ger, label: "Deutsch", code: "DE" },
    ar: { flag: arb, label: "العربية", code: "AR", dir: "rtl" },
};
