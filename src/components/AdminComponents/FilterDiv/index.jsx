import './index.scss';
import { useState } from "react";
import filterIcon from '/src/assets/filterIcon.svg';
import { useTranslation } from "react-i18next";

function FilterDropdown({ selected, onChange }) {
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();

    const filters = [
        { key: "all", label: t("adminPanel.filterDropdown.options.all") },
        { key: "clinic", label: t("adminPanel.filterDropdown.options.clinic") },
        { key: "service", label: t("adminPanel.filterDropdown.options.service") },
        { key: "tour", label: t("adminPanel.filterDropdown.options.tour") },
    ];

    const handleSelect = (filterKey) => {
        onChange(filterKey);
        setOpen(false);
    };

    return (
        <div className="filterDropdown">
            <div className="filterTrigger" onClick={() => setOpen(!open)}>
                <img src={filterIcon} alt="filter" />
                <span>{t("adminPanel.filterDropdown.label")}</span>
            </div>

            {open && (
                <div className="filterMenu">
                    {filters.map(({ key, label }) => (
                        <div
                            key={key}
                            className={`filterOption ${selected === key ? "active" : ""}`}
                            onClick={() => handleSelect(key)}
                        >
                            {label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default FilterDropdown;
