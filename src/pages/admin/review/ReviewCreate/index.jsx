import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePostCustomerViewMutation } from "../../../../api/userApi.js";
import showToast from "../../../../utils/toast.js";
import AdminPageHeader from "../../../../components/admin/AdminPageHeader/index.jsx";
import { Field, FormFooter, FormSection, LangField } from "../../../../components/admin/FormKit/index.jsx";
import { Dropzone, FilePreview } from "../../../../components/admin/Dropzone/index.jsx";
import { useAdminT, useOptionalT } from "../../../../components/admin/shared/adminStrings.js";

// state key → LangField language code
const COMMENT_LANGS = [
    ["az", "az"],
    ["ru", "ru"],
    ["en", "en"],
    ["alm", "de"],
    ["arab", "ar"],
];

function SerhAdd() {
    const { t } = useTranslation();
    const at = useAdminT();
    const ot = useOptionalT();
    const navigate = useNavigate();
    const [postSerh, { isLoading }] = usePostCustomerViewMutation();
    const [selectedFile, setSelectedFile] = useState(null);
    const [names, setNames] = useState({ az: "" });
    const [comments, setComments] = useState({ az: "", ru: "", en: "", alm: "", arab: "" });
    const [countries, setCountries] = useState({ az: "" });

    const handleInputChange = (setter, lang, value) => {
        setter((prev) => ({ ...prev, [lang]: value }));
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();
        if (!names.az.trim() || !comments.az.trim() || !countries.az.trim()) {
            showToast(t("adminPanel.commentAdd.toast.warning"), "warning");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("customerName", names.az);

            formData.append("reviewText", comments.az);
            formData.append("reviewTextRu", comments.ru);
            formData.append("reviewTextEng", comments.en);
            formData.append("reviewTextAlm", comments.alm);
            formData.append("reviewTextArab", comments.arab);

            formData.append("country", countries.az);

            if (selectedFile) {
                formData.append("profilImage", selectedFile);
            }

            // Rating is fixed at 5 for reviews created from the admin panel.
            formData.append("rating", 5);

            await postSerh(formData).unwrap();
            showToast(t("adminPanel.commentAdd.toast.success"), "success");
            navigate("/admin/serh");
        } catch {
            showToast(t("adminPanel.commentAdd.toast.error"), "error");
        }
    };

    return (
        <form className="adm-form" onSubmit={handleSubmit} noValidate>
            <AdminPageHeader
                crumbs={[
                    { label: t("adminPanel.commentAdd.breadcrumb.root"), to: "/admin/serh" },
                    { label: t("adminPanel.commentAdd.breadcrumb.current") },
                ]}
                title={t("adminPanel.commentAdd.title")}
                description={t("adminPanel.commentAdd.description")}
            />
            <div className="adm-form-grid">
                <FormSection
                    title={t("adminPanel.commentAdd.sections.author.title")}
                    description={t("adminPanel.commentAdd.sections.author.desc")}
                >
                    <Field label={t("adminPanel.commentAdd.sections.author.title")} required>
                        {(id) => (
                            <input
                                id={id}
                                className="adm-input"
                                autoComplete="off"
                                value={names.az}
                                onChange={(e) => handleInputChange(setNames, "az", e.target.value)}
                                placeholder={t("adminPanel.commentAdd.sections.author.placeholder")}
                            />
                        )}
                    </Field>
                    <Field label={t("adminPanel.commentAdd.sections.country.title")} hint={t("adminPanel.commentAdd.sections.country.desc")} required>
                        {(id) => (
                            <input
                                id={id}
                                className="adm-input"
                                autoComplete="off"
                                value={countries.az}
                                onChange={(e) => handleInputChange(setCountries, "az", e.target.value)}
                                placeholder={t("adminPanel.commentAdd.sections.country.placeholder")}
                            />
                        )}
                    </Field>
                </FormSection>

                <FormSection
                    title={t("adminPanel.commentAdd.sections.image.title")}
                    description={t("adminPanel.commentAdd.sections.image.desc")}
                >
                    {selectedFile && (
                        <FilePreview
                            single
                            file={selectedFile}
                            badge={at("newFile")}
                            onRemove={() => setSelectedFile(null)}
                        />
                    )}
                    <Dropzone
                        compact={Boolean(selectedFile)}
                        onFiles={([file]) => setSelectedFile(file)}
                        title={t("adminPanel.commentAdd.sections.image.uploadText")}
                    />
                </FormSection>

                <FormSection
                    wide
                    title={t("adminPanel.commentAdd.sections.description.title")}
                    description={t("adminPanel.commentAdd.sections.description.desc")}
                >
                    <div className="adm-grid">
                        {COMMENT_LANGS.map(([key, lang]) => (
                            <LangField
                                key={key}
                                lang={lang}
                                multiline
                                rows={4}
                                wide={lang === "ar"}
                                required={lang === "az"}
                                value={comments[key]}
                                onChange={(e) => handleInputChange(setComments, key, e.target.value)}
                                placeholder={ot(`adminPanel.commentAdd.sections.description.placeholders.${key}`)}
                            />
                        ))}
                    </div>
                </FormSection>
            </div>
            <FormFooter
                cancelTo="/admin/serh"
                saving={isLoading}
                saveLabel={t("adminPanel.commentAdd.buttons.save")}
                savingLabel={t("adminPanel.commentAdd.buttons.saving")}
            />
        </form>
    );
}

export default SerhAdd;
