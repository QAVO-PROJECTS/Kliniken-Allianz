import './index.scss';
import { useState, useEffect } from "react";
import earthIcon from "/src/assets/earthIcon.svg";
import aze from "/src/assets/azerbaijan.svg";
import rus from "/src/assets/russia.svg";
import i18n from "../../../i18n.js";

function LanguageDiv2() {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState('AZ');

    const languages = [
        { code: 'az', label: 'Azərbaycan', flag: aze },
        { code: 'ru', label: 'Русский', flag: rus }
    ];

    // 🧩 Səhifə açıldıqda localStorage-dan dili oxu
    useEffect(() => {
        const savedLang = localStorage.getItem("i18nextLng");
        if (savedLang) {
            setSelected(savedLang);
            // istəsən burada i18next.changeLanguage(savedLang) da çağırıla bilər
        }
    }, []);

    // 🔄 Dil seçiləndə localStorage-a yaz
    const handleSelect = (lang) => {
        setSelected(lang.code);
        i18n.changeLanguage(lang.code.toLowerCase()); // 🔥 dərhal UI dəyişir
        localStorage.setItem('i18nextLng', lang.code.toLowerCase());
        setOpen(false);
    };

    return (
        <div className="languageDropdown2">
            <div className="languageTrigger" onClick={() => setOpen(!open)}>
                <img src={earthIcon} alt="earth" className="profileSvg" />

            </div>

            {open && (
                <div className="languageMenu">
                    {languages.map(lang => (
                        <div
                            key={lang.code}
                            className={`languageOption ${selected === lang.code ? "active" : ""}`}
                            onClick={() => handleSelect(lang)}
                        >
                            <img src={lang.flag} alt={lang.label} className="flag" />
                            <span>{lang.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default LanguageDiv2;
