import { useId } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAdminT } from "../shared/adminStrings.js";
import { LANGS } from "../shared/langs.js";


/** Card with a title/description header and a body. `wide` spans both columns of .adm-form-grid. */
export function FormSection({ title, description, children, wide = false, className = "" }) {
    return (
        <section className={`adm-section${wide ? " is-wide" : ""}${className ? ` ${className}` : ""}`}>
            {(title || description) && (
                <header className="adm-section__head">
                    {title && <h2>{title}</h2>}
                    {description && <p>{description}</p>}
                </header>
            )}
            <div className="adm-section__body">{children}</div>
        </section>
    );
}

/**
 * Label above a control. Pass `children` as a render function to receive the
 * generated id: `<Field label="Price">{(id) => <input id={id} className="adm-input" />}</Field>`.
 */
export function Field({ label, hint, required = false, wide = false, children, className = "" }) {
    const id = useId();
    return (
        <div className={`adm-field${wide ? " is-wide" : ""}${className ? ` ${className}` : ""}`}>
            {label && (
                <label className="adm-label" htmlFor={id}>
                    {label}
                    {required && <span className="adm-required" aria-hidden="true">*</span>}
                </label>
            )}
            {typeof children === "function" ? children(id) : children}
            {hint && <span className="adm-hint">{hint}</span>}
        </div>
    );
}

/**
 * Text input / textarea for one content language, labelled with its flag.
 *
 * @param {'az'|'ru'|'en'|'de'|'ar'} lang
 * @param {boolean} [multiline] render a textarea
 * @param {string} [label] overrides the language name
 */
export function LangField({ lang, value, onChange, placeholder, multiline = false, label, wide = false, rows, type = "text", required = false, ...rest }) {
    const id = useId();
    const meta = LANGS[lang] || LANGS.az;
    const props = {
        id,
        value: value ?? "",
        onChange,
        placeholder: placeholder || undefined,
        dir: meta.dir,
        lang: lang === "ar" ? "ar" : undefined,
        ...rest,
    };
    return (
        <div className={`adm-field${wide ? " is-wide" : ""}`}>
            <label className="adm-label" htmlFor={id}>
                <img src={meta.flag} alt="" aria-hidden="true" />
                {label || meta.label}
                {required && <span className="adm-required" aria-hidden="true">*</span>}
                <span className="adm-lang-code">{meta.code}</span>
            </label>
            {multiline ? (
                <textarea className="adm-textarea" rows={rows} {...props} />
            ) : (
                <input className="adm-input" type={type} {...props} />
            )}
        </div>
    );
}

/** Grid of checkbox cards. `items` = [{id, label}] */
export function CheckList({ items, selected, onToggle, type = "checkbox", name }) {
    return (
        <div className="adm-checklist" role="group">
            {items?.map((item) => (
                <label key={item.id} className="adm-check">
                    <input
                        type={type}
                        name={name}
                        checked={type === "radio" ? selected === item.id : selected.includes(item.id)}
                        onChange={() => onToggle(item.id)}
                    />
                    <span title={typeof item.label === "string" ? item.label : undefined}>{item.label}</span>
                </label>
            ))}
        </div>
    );
}

/**
 * Sticky bottom action bar with Cancel and Save.
 * `cancelTo` navigates there; otherwise goes back in history.
 */
export function FormFooter({ onSave, saving = false, saveLabel, savingLabel, cancelTo, onCancel, note, disabled = false }) {
    const at = useAdminT();
    const navigate = useNavigate();
    const handleCancel = () => {
        if (onCancel) onCancel();
        else if (cancelTo) navigate(cancelTo);
        else navigate(-1);
    };
    return (
        <div className="adm-form-footer">
            {note && <span className="adm-form-footer__note">{note}</span>}
            <button type="button" className="btn btn--secondary" onClick={handleCancel} disabled={saving}>
                {at("cancel")}
            </button>
            <button
                type={onSave ? "button" : "submit"}
                className="btn btn--primary"
                onClick={onSave}
                disabled={saving || disabled}
                aria-busy={saving || undefined}
            >
                {saving && <Loader2 size={16} className="adm-spin" aria-hidden="true" />}
                {saving ? (savingLabel || at("saving")) : (saveLabel || at("save"))}
            </button>
        </div>
    );
}
