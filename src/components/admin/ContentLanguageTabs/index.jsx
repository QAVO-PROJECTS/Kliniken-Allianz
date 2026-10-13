import { useAdminT } from "../shared/adminStrings.js";

const LANGUAGES = [
    { code: "AZ", label: "Azərbaycanca" },
    { code: "EN", label: "English" },
    { code: "RU", label: "Русский" },
];

/**
 * Segmented control that picks which content language the table shows.
 * Values are upper-case codes: "AZ" | "EN" | "RU".
 */
function LanguageDiv({ selected, onChange }) {
    const at = useAdminT();
    const current = String(selected || "AZ").toUpperCase();
    return (
        <div className="adm-segmented" role="group" aria-label={at("contentLanguage")}>
            {LANGUAGES.map((lang) => (
                <button
                    key={lang.code}
                    type="button"
                    className="adm-segmented__btn"
                    aria-pressed={current === lang.code}
                    title={lang.label}
                    onClick={() => onChange(lang.code)}
                >
                    {lang.code}
                </button>
            ))}
        </div>
    );
}

export default LanguageDiv;
