import { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CircleCheck, LoaderCircle, Send } from "lucide-react";
import showToast from "../../../utils/toast.js";
import "./enquiryForm.scss";

// Field names, order and the submitted payload are part of the API contract
// (and of autofill / analytics): keep them unchanged.
const EMPTY = { name: "", surname: "", email: "", phoneNumber: "", description: "" };
const ORDER = ["name", "surname", "email", "phoneNumber", "description"];

const FIELDS = {
    name: { autoComplete: "given-name", maxLength: 50 },
    surname: { autoComplete: "family-name", maxLength: 50 },
    email: { type: "email", inputMode: "email", autoComplete: "email", maxLength: 100, spellCheck: false },
    phoneNumber: { type: "tel", inputMode: "tel", autoComplete: "tel", maxLength: 20 },
    description: { textarea: true, wide: true, autoComplete: "off", maxLength: 700 },
};

/**
 * Contact / enquiry form shared by Contact and the travel detail pages.
 * Labels sit above the inputs; each field has a polite live message slot below
 * it for its error. On a failed submit the first invalid field gets focus.
 *
 * @param {(values: typeof EMPTY) => Promise<unknown>} onSubmit  must reject on failure
 * @param {string} [presetMessage]  pre-fills the message field whenever it changes
 * @param {string} [title]
 * @param {string} [subtitle]
 */
function EnquiryForm({ onSubmit, presetMessage = "", title, subtitle, className = "" }) {
    const { t } = useTranslation();
    const uid = useId();
    const formRef = useRef(null);
    const [values, setValues] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [sent, setSent] = useState(false);

    useEffect(() => {
        if (presetMessage) setValues((v) => ({ ...v, description: presetMessage }));
    }, [presetMessage]);

    const set = (field) => (e) => {
        const value = e.target.value;
        setValues((v) => ({ ...v, [field]: value }));
        if (sent) setSent(false);
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
        const firstInvalid = ORDER.find((f) => found[f]);
        if (firstInvalid) {
            formRef.current?.elements.namedItem(firstInvalid)?.focus();
            return;
        }
        setSubmitting(true);
        try {
            await onSubmit({
                name: values.name.trim(),
                surname: values.surname.trim(),
                email: values.email.trim(),
                phoneNumber: values.phoneNumber.trim(),
                description: values.description.trim(),
            });
            showToast(t("contact.succesToast"), "success");
            setValues(EMPTY);
            setErrors({});
            setSent(true);
        } catch {
            showToast(t("contact.errorToast"), "error");
        } finally {
            setSubmitting(false);
        }
    };

    const field = (name) => {
        const { textarea, wide, type = "text", ...attrs } = FIELDS[name];
        const id = `${uid}-${name}`;
        const msgId = `${id}-msg`;
        const labelKey = name === "phoneNumber" ? "phone" : name;
        const error = errors[name];
        const common = {
            id,
            name,
            value: values[name],
            onChange: set(name),
            placeholder: t(`contact.form.placeholders.${labelKey}`) || undefined,
            "aria-invalid": error ? true : undefined,
            "aria-describedby": msgId,
            required: true,
            ...attrs,
        };
        return (
            <div className={`enquiry-form__field${wide ? " enquiry-form__field--wide" : ""}`} key={name}>
                <label htmlFor={id}>{t(`contact.form.labels.${labelKey}`)}</label>
                {textarea ? <textarea rows={5} {...common} /> : <input type={type} {...common} />}
                <p className="enquiry-form__msg" id={msgId} aria-live="polite">
                    {error}
                </p>
            </div>
        );
    };

    return (
        <form
            ref={formRef}
            className={`enquiry-form ${className}`.trim()}
            onSubmit={handleSubmit}
            noValidate
            aria-busy={submitting || undefined}
        >
            {(title || subtitle) && (
                <div className="enquiry-form__head">
                    {title && <h2>{title}</h2>}
                    {subtitle && <p>{subtitle}</p>}
                </div>
            )}
            <div className="enquiry-form__grid">{ORDER.map(field)}</div>
            <button type="submit" className="btn btn--primary btn--lg btn--block enquiry-form__submit" disabled={submitting}>
                {submitting ? (
                    <LoaderCircle size={18} strokeWidth={1.75} className="enquiry-form__spinner" aria-hidden="true" />
                ) : (
                    <Send size={18} strokeWidth={1.75} className="flip-rtl" aria-hidden="true" />
                )}
                {t("contact.form.button")}
            </button>
            <p className="enquiry-form__status" role="status">
                {sent && (
                    <>
                        <CircleCheck size={18} strokeWidth={1.75} aria-hidden="true" />
                        {t("contact.succesToast")}
                    </>
                )}
            </p>
            <p className="enquiry-form__note">
                {t("enquiryForm.privacyNote", "Your details are only used to answer your request.")}
            </p>
        </form>
    );
}

export default EnquiryForm;
