import "./index.scss";
import { useTranslation } from "react-i18next";
import { ChevronDown, Plus, X } from "lucide-react";
import { LangField } from "../../../../components/admin/FormKit/index.jsx";
import IconButton from "../../../../components/admin/IconButton/index.jsx";
import { useOptionalT } from "../../../../components/admin/shared/adminStrings.js";

/** Order of the 5 inputs of an offer (matches name/nameRU/nameEN/nameAL/nameAR). */
const OFFER_LANGS = ["az", "ru", "en", "de", "ar"];

/**
 * Repeatable "offer" groups of a tour (one input per content language).
 * `sections` = [{id, expanded, inputs: string[5]}]; `prefix` = translation namespace
 * (e.g. "adminPanel.toursAdd").
 */
function TourOffers({ sections, prefix, onChange, onToggle, onRemove, onAdd }) {
    const { t } = useTranslation();
    const ot = useOptionalT();

    return (
        <div className="tour-offers">
            {sections.map((section, position) => {
                const title = `${t(`${prefix}.sections.offers.sectionTitle`)}${position + 1}`;
                const summary = section.inputs.find((v) => v.trim() !== "");
                return (
                    <div key={section.id} className="tour-offer">
                        <div className="tour-offer__head">
                            <button
                                type="button"
                                className="adm-collapse-toggle"
                                aria-expanded={section.expanded}
                                onClick={() => onToggle(section.id)}
                            >
                                <span className="tour-offer__title">
                                    <strong>{title}</strong>
                                    {!section.expanded && summary && <span>{summary}</span>}
                                </span>
                                <ChevronDown size={18} aria-hidden="true" />
                            </button>
                            {sections.length > 1 && (
                                <IconButton
                                    icon={X}
                                    label={`${t(`${prefix}.sections.offers.removeBtn`)}: ${title}`}
                                    onClick={() => onRemove(section.id)}
                                    variant="danger"
                                />
                            )}
                        </div>
                        {section.expanded && (
                            <div className="tour-offer__body adm-grid">
                                {OFFER_LANGS.map((lang, index) => (
                                    <LangField
                                        key={lang}
                                        lang={lang}
                                        value={section.inputs[index]}
                                        onChange={(e) => onChange(section.id, index, e.target.value)}
                                        placeholder={ot(`${prefix}.sections.offers.placeholders.${lang}`)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
            <button type="button" className="btn btn--secondary btn--sm tour-offers__add" onClick={onAdd}>
                <Plus size={16} aria-hidden="true" />
                {t(`${prefix}.sections.offers.addBtn`)}
            </button>
        </div>
    );
}

export default TourOffers;
