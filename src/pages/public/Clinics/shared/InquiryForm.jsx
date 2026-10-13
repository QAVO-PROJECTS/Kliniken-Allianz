import { useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Send } from "lucide-react";
import showToast from "../../../../utils/toast.js";
import { tx } from "./texts.js";
import "./shared.scss";

// Field names, order and the submitted payload are part of the API contract: keep them as is.
const EMPTY = { name: "", surname: "", email: "", phoneNumber: "", description: "" };
const ORDER = ["name", "surname", "email", "phoneNumber", "description"];

/**
 * Contact / inquiry form. `submit` is an RTK Query mutation trigger; `extra`
 * is merged into the JSON body (e.g. { clinicId } or { serviceId }).
 */
function InquiryForm({ submit, extra = {}, stacked = false }) {
    const { t } = useTranslation();
    const uid = useId();
    const formRef = useRef(null);
    const [values, setValues] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [sending, setSending] = useState(false);

    const set = (field) => (e) => {
        const value = e.target.value;
        setValues((v) => ({ ...v, [field]: value }));
        if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
    };

    const validate = () => {
        const e = {};
        if (!values.name.trim()) e.name = t("contact.form.errors.firstNameRequired");
        if (!values.surname.trim()) e.surname = t("contact.form.errors.lastNameRequired");
        if (!values.email.trim()) e.email = t("contact.form.errors.emailRequired");
        else if (!/\S+@\S+\.\S+/.test(values.email)) e.email = t("contact.form.errors.emailInvalid");
        if (!values.phoneNumber.trim()) e.phoneNumber = t("contact.form.errors.phoneRequired");
        if (!values.description.trim()) e.description = t("contact.form.errors.descriptionRequired");
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const found = validate();
        setErrors(found);
        const firstInvalid = ORDER.find((k) => found[k]);
        if (firstInvalid) {
            formRef.current?.elements.namedItem(firstInvalid)?.focus();
            return;
        }
        setSending(true);
        try {
            await submit({ ...values, ...extra }).unwrap();
            showToast(t("contact.succesToast"), "success");
            setValues(EMPTY);
        } catch {
            showToast(t("contact.errorToast"), "error");
        } finally {
            setSending(false);
        }
    };

    const field = (name, { type = "text", max = 50, autoComplete = "off", inputMode, full = false, textarea = false, extraProps = {} } = {}) => {
        const id = `${uid}-${name}`;
        const errId = `${id}-err`;
        const hintId = `${id}-hint`;
        const err = errors[name];
        const key = name === "phoneNumber" ? "phone" : name;
        const placeholder = t(`contact.form.placeholders.${key}`);
        const describedBy = [err ? errId : null, textarea ? hintId : null].filter(Boolean).join(" ") || undefined;
        const common = {
            id,
            name,
            value: values[name],
            onChange: set(name),
            maxLength: max,
            autoComplete,
            placeholder: placeholder || undefined,
            "aria-required": true,
            "aria-invalid": err ? true : undefined,
            "aria-describedby": describedBy,
            ...extraProps,
        };
        return (
            <div className={`md-field${full ? " md-field--full" : ""}`}>
                <label htmlFor={id}>{t(`contact.form.labels.${key}`)}</label>
                {textarea ? (
                    <textarea rows={stacked ? 3 : 4} {...common} />
                ) : (
                    <input type={type} inputMode={inputMode} {...common} />
                )}
                <div className="md-field__meta">
                    <p className="md-field__error" id={errId} aria-live="polite">{err || ""}</p>
                    {textarea && (
                        <span className="md-field__hint" id={hintId}>
                            {tx(t, "medicalPages.charCount", { n: values[name].length, max })}
                        </span>
                    )}
                </div>
            </div>
        );
    };

    return (
        <form ref={formRef} className={`md-form${stacked ? " md-form--stacked" : ""}`} onSubmit={handleSubmit} noValidate>
            {field("name", { autoComplete: "given-name", extraProps: { autoCapitalize: "words" } })}
            {field("surname", { autoComplete: "family-name", extraProps: { autoCapitalize: "words" } })}
            {field("email", {
                type: "email",
                max: 100,
                autoComplete: "email",
                inputMode: "email",
                full: true,
                extraProps: { spellCheck: false, autoCapitalize: "none" },
            })}
            {field("phoneNumber", { type: "tel", max: 20, autoComplete: "tel", inputMode: "tel", full: true })}
            {field("description", { max: 700, full: true, textarea: true })}
            <div className="md-field md-field--full">
                <button type="submit" className="btn btn--primary btn--block" disabled={sending} aria-busy={sending || undefined}>
                    {sending ? (
                        <>
                            <Loader2 size={18} strokeWidth={1.75} className="md-spin" aria-hidden="true" />
                            {tx(t, "medicalPages.sending")}
                        </>
                    ) : (
                        <>
                            {t("contact.form.button")}
                            <Send size={18} strokeWidth={1.75} aria-hidden="true" className="md-flip-rtl" />
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}

export default InquiryForm;
