import { useId } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import IconButton from "../../../../components/admin/IconButton/index.jsx";
import { useAdminT } from "../../../../components/admin/shared/adminStrings.js";
import { LANGS } from "../../../../components/admin/shared/langs.js";
import { BIO_INDEX, LANG_ORDER } from "./doctorForm.js";
import "./bioEditor.scss";

/**
 * Repeatable bio blocks, each with one rich-text editor per content language.
 * Section shape: `{ id, expanded, inputs: [az, en, ru, de, ar] }`.
 */
function BioEditor({ sections, onChange, onToggle, onRemove, onAdd, canAdd, placeholder }) {
    const { t } = useTranslation();
    const at = useAdminT();
    const baseId = useId();
    const sectionLabel = t("adminPanel.doctorAdd.sections.bio.section").replace(/\s*[#№]\s*$/, "");

    return (
        <div className="doctor-bio-list">
            {sections.map((section, n) => {
                const bodyId = `${baseId}-bio-${n}`;
                const title = `${sectionLabel} #${n + 1}`;
                return (
                    <div key={section.id} className="doctor-bio">
                        <div className="doctor-bio__head">
                            <button
                                type="button"
                                className="adm-collapse-toggle"
                                aria-expanded={section.expanded}
                                aria-controls={bodyId}
                                onClick={() => onToggle(section.id)}
                            >
                                <span>{title}</span>
                                <ChevronDown size={18} aria-hidden="true" />
                            </button>
                            {sections.length > 1 && (
                                <IconButton
                                    icon={Trash2}
                                    label={`${at("remove")}: ${title}`}
                                    variant="danger"
                                    onClick={() => onRemove(section.id)}
                                />
                            )}
                        </div>
                        {section.expanded && (
                            <div className="doctor-bio__body adm-grid" id={bodyId}>
                                {LANG_ORDER.map((lang) => {
                                    const meta = LANGS[lang];
                                    const index = BIO_INDEX[lang];
                                    return (
                                        <div key={lang} className={`adm-field${lang === "az" ? " is-wide" : ""}`}>
                                            <span className="adm-label">
                                                <img src={meta.flag} alt="" aria-hidden="true" />
                                                {meta.label}
                                                <span className="adm-lang-code">{meta.code}</span>
                                            </span>
                                            <div className="adm-quill" dir={meta.dir}>
                                                <ReactQuill
                                                    theme="snow"
                                                    value={section.inputs[index]}
                                                    onChange={(val) => onChange(section.id, index, val)}
                                                    placeholder={placeholder}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
            <button type="button" className="btn btn--secondary doctor-bio-list__add" onClick={onAdd} disabled={!canAdd}>
                <Plus size={18} aria-hidden="true" />
                {t("adminPanel.doctorAdd.sections.bio.addButton")}
            </button>
        </div>
    );
}

export default BioEditor;
