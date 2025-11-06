import './index.scss';
import { useState } from "react";
import earthIcon from "/src/assets/earthIcon.svg";
import aze from "/src/assets/azerbaijan.svg";
import rus from "/src/assets/russia.svg";

function LanguageDiv2() {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState('AZ');

    const languages = [
        { code: 'AZ', label: 'Azərbaycan', flag: aze },
        { code: 'RU', label: 'Русский', flag: rus }
    ];

    const handleSelect = (lang) => {
        setSelected(lang.code);
        setOpen(false);
        // burada i18next və ya başqa bir dil dəyişmə funksiyası çağırmaq olar
    };

    return (
        <div className="languageDropdown2">
            <div className="languageTrigger" onClick={() => setOpen(!open)}>
                <img src={earthIcon} alt="earth" className="profileSvg"/>
            </div>

            {open && (
                <div className="languageMenu">
                    {languages.map(lang => (
                        <div
                            key={lang.code}
                            className={`languageOption ${selected === lang.code ? "active" : ""}`}
                            onClick={() => handleSelect(lang)}
                        >
                            <img src={lang.flag} alt={lang.label} className="flag"/>
                            <span>{lang.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default LanguageDiv2;
