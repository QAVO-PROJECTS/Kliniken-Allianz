import './index.scss';
import { useState } from "react";
import earthIcon from "/src/assets/earthIcon.svg";
import aze from "/src/assets/azerbaijan.svg";
import rus from "/src/assets/russia.svg";
import ger from '/src/assets/germany.svg'
import usa from '/src/assets/unitedstates.svg';
import arb from '/src/assets/unitedarabemirates.svg'
function LanguageDiv({ selected, onChange }) {
    const [open, setOpen] = useState(false);
    const languages = [
        { code: 'AZ', label: 'Azərbaycan', flag: aze },
        { code: 'EN', label: 'English', flag: usa },
        { code: 'RU', label: 'Русский', flag: rus },
        // { code: 'DE', label: 'Deutsch', flag: ger },
        // { code: 'AR', label: 'العربية', flag: arb },
    ];

    const handleSelect = (lang) => {
        onChange(lang.code); // parent state-ni dəyiş
        setOpen(false);
    };

    return (
        <div className="languageDropdown">
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

export default LanguageDiv;
