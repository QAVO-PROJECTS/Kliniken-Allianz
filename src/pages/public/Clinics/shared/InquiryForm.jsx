import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { Send } from "lucide-react";
import showToast from "../../../../utils/toast.js";
import { tx } from "./texts.js";
import "./shared.scss";

const EMPTY = { name: "", surname: "", email: "", phoneNumber: "", description: "" };

/**
 * Contact / inquiry form. `submit` is an RTK Query mutation trigger; `extra`
 * is merged into the JSON body (e.g. { clinicId } or { serviceId }).
 */
function InquiryForm({ submit, extra = {}, stacked = false }) {
    const { t } = useTranslation();
    const uid = useId();
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
        if (Object.keys(found).length) return;
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

    const field = (name, { type = "text", max = 50, autoComplete, full = false, textarea = false } = {}) => {
        const id = `${uid}-${name}`;
        const err = errors[name];
        const common = {
            id,
            name,
            value: values[name],
            onChange: set(name),
            maxLength: max,
            placeholder: t(`contact.form.placeholders.${name === "phoneNumber" ? "phone" : name}`),
            "aria-invalid": err ? true : undefined,
            "aria-describedby": err ? `${id}-err` : undefined,
        };
        return (
            <div className={`md-field${full ? " md-field--full" : ""}`}>
                <label htmlFor={id}>{t(`contact.form.labels.${name === "phoneNumber" ? "phone" : name}`)}</label>
                {textarea ? (
                    <textarea rows={4} {...common} />
                ) : (
                    <input type={type} autoComplete={autoComplete} {...common} />
                )}
                {err && <span className="md-field__error" id={`${id}-err`}>{err}</span>}
            </div>
        );
    };

    return (
        <form className={`md-form${stacked ? " md-form--stacked" : ""}`} onSubmit={handleSubmit} noValidate>
            {field("name", { autoComplete: "given-name" })}
            {field("surname", { autoComplete: "family-name" })}
            {field("email", { type: "email", max: 100, autoComplete: "email", full: true })}
            {field("phoneNumber", { type: "tel", max: 20, autoComplete: "tel", full: true })}
            {field("description", { max: 700, full: true, textarea: true })}
            <div className="md-field md-field--full">
                <button type="submit" className="btn btn--primary btn--block" disabled={sending}>
                    {sending ? tx(t, "medicalPages.sending") : t("contact.form.button")}
                    {!sending && <Send size={18} aria-hidden="true" className="md-flip-rtl" />}
                </button>
            </div>
        </form>
    );
}

export default InquiryForm;
