import { useEffect, useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { Send } from "lucide-react";
import showToast from "../../../utils/toast.js";
import "./enquiryForm.scss";

const EMPTY = { name: "", surname: "", email: "", phoneNumber: "", description: "" };

/**
 * Contact / enquiry form shared by Contact and the travel detail pages.
 *
 * @param {(values: typeof EMPTY) => Promise<unknown>} onSubmit  must reject on failure
 * @param {string} [presetMessage]  pre-fills the message field whenever it changes
 * @param {string} [title]
 * @param {string} [subtitle]
 */
function EnquiryForm({ onSubmit, presetMessage = "", title, subtitle, className = "" }) {
    const { t } = useTranslation();
    const uid = useId();
    const [values, setValues] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (presetMessage) setValues((v) => ({ ...v, description: presetMessage }));
    }, [presetMessage]);

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
        if (Object.keys(found).length) return;
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
        } catch {
            showToast(t("contact.errorToast"), "error");
        } finally {
            setSubmitting(false);
        }
    };

    const field = (name, { type = "text", autoComplete, maxLength, wide = false, textarea = false } = {}) => {
        const id = `${uid}-${name}`;
        const labelKey = name === "phoneNumber" ? "phone" : name;
        const error = errors[name];
        const common = {
            id,
            name,
            value: values[name],
            onChange: set(name),
            placeholder: t(`contact.form.placeholders.${labelKey}`) || undefined,
            "aria-invalid": error ? true : undefined,
            "aria-describedby": error ? `${id}-error` : undefined,
            maxLength,
        };
        return (
            <div className={`enquiry-form__field${wide ? " enquiry-form__field--wide" : ""}`}>
                <label htmlFor={id}>{t(`contact.form.labels.${labelKey}`)}</label>
                {textarea ? (
                    <textarea rows={5} {...common} />
                ) : (
                    <input type={type} autoComplete={autoComplete} {...common} />
                )}
                {error && (
                    <span className="enquiry-form__error" id={`${id}-error`} role="alert">
                        {error}
                    </span>
                )}
            </div>
        );
    };

    return (
        <form className={`enquiry-form ${className}`.trim()} onSubmit={handleSubmit} noValidate>
            {(title || subtitle) && (
                <div className="enquiry-form__head">
                    {title && <h2>{title}</h2>}
                    {subtitle && <p>{subtitle}</p>}
                </div>
            )}
            <div className="enquiry-form__grid">
                {field("name", { autoComplete: "given-name", maxLength: 50 })}
                {field("surname", { autoComplete: "family-name", maxLength: 50 })}
                {field("email", { type: "email", autoComplete: "email", maxLength: 100 })}
                {field("phoneNumber", { type: "tel", autoComplete: "tel", maxLength: 20 })}
                {field("description", { wide: true, textarea: true, maxLength: 700 })}
            </div>
            <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={submitting}>
                <Send size={18} strokeWidth={2} aria-hidden="true" />
                {t("contact.form.button")}
            </button>
            <p className="enquiry-form__note">
                {t("enquiryForm.privacyNote", "Your details are only used to answer your request.")}
            </p>
        </form>
    );
}

export default EnquiryForm;
