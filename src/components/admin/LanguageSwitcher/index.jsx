import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAdminT } from "../shared/adminStrings.js";

const LANGUAGES = [
    { code: "az", label: "Azərbaycanca" },
    { code: "en", label: "English" },
    { code: "ru", label: "Русский" },
];

/** Admin UI language switch (topbar). Persists the choice like the public site. */
function LanguageDiv2() {
    const { i18n } = useTranslation();
    const at = useAdminT();
    // i18n may hold "az", "AZ" or "ru-RU" — compare on the lower-case base code.
    const current = String(i18n.resolvedLanguage || i18n.language || "az").toLowerCase().split("-")[0];

    const select = (code) => {
        if (code === current) return;
        i18n.changeLanguage(code);
        try {
            localStorage.setItem("i18nextLng", code);
        } catch {
            /* storage unavailable — the in-memory switch still works */
        }
    };

    return (
        <div className="adm-lang" role="group" aria-label={at("language")}>
            <Globe size={16} aria-hidden="true" />
            {LANGUAGES.map((lang) => (
                <button
                    key={lang.code}
                    type="button"
                    className="adm-segmented__btn"
                    aria-pressed={current === lang.code}
                    title={lang.label}
                    onClick={() => select(lang.code)}
                >
                    {lang.code.toUpperCase()}
                </button>
            ))}
        </div>
    );
}

export default LanguageDiv2;
