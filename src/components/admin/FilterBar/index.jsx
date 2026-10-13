import { useId } from "react";
import { Filter } from "lucide-react";
import { useTranslation } from "react-i18next";

/** Contact-request type filter (all / clinic / service / tour). */
function FilterDropdown({ selected, onChange }) {
    const { t } = useTranslation();
    const id = useId();

    const filters = [
        { key: "all", label: t("adminPanel.filterDropdown.options.all") },
        { key: "clinic", label: t("adminPanel.filterDropdown.options.clinic") },
        { key: "service", label: t("adminPanel.filterDropdown.options.service") },
        { key: "tour", label: t("adminPanel.filterDropdown.options.tour") },
    ];

    return (
        <div className="adm-filter">
            <label htmlFor={id} className="adm-filter__label">
                <Filter size={16} aria-hidden="true" />
                <span className="visually-hidden">{t("adminPanel.filterDropdown.label")}</span>
            </label>
            <select id={id} className="adm-select adm-filter__select" value={selected} onChange={(e) => onChange(e.target.value)}>
                {filters.map(({ key, label }) => (
                    <option key={key} value={key}>{label}</option>
                ))}
            </select>
        </div>
    );
}

export default FilterDropdown;
