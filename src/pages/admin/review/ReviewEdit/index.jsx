import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { useGetCustomerViewByIdQuery, usePutCustomerViewMutation } from "../../../../api/userApi.js";
import { VIEW_CARD_IMAGES } from "../../../../config/mediaUrls.js";
import showToast from "../../../../utils/toast.js";
import AdminPageHeader from "../../../../components/admin/AdminPageHeader/index.jsx";
import { Field, FormFooter, FormSection, LangField } from "../../../../components/admin/FormKit/index.jsx";
import { Dropzone, FilePreview } from "../../../../components/admin/Dropzone/index.jsx";
import { useAdminT, useOptionalT } from "../../../../components/admin/shared/adminStrings.js";

function SerhEdit() {
    const { t } = useTranslation();
    const at = useAdminT();
    const ot = useOptionalT();
    const { id } = useParams();
    const { data: getCustomerViewById, isLoading } = useGetCustomerViewByIdQuery(id);
    const view = getCustomerViewById?.data;
    const navigate = useNavigate();
    const [editView, { isLoading: isUpdating }] = usePutCustomerViewMutation();
    const [name, setName] = useState("");
    const [country, setCountry] = useState("");
    const [descAz, setDescAz] = useState("");
    const [descRu, setDescRu] = useState("");
    const [descEn, setDescEn] = useState("");
    const [descAlm, setDescAlm] = useState("");
    const [descArab, setDescArab] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        if (view) {
            setName(view.customerName || "");
            setCountry(view.country || "");
            setDescAz(view.reviewText || "");
            setDescRu(view.reviewTextRu || "");
            setDescEn(view.reviewTextEng || "");
            setDescAlm(view.reviewTextAlm || "");
            setDescArab(view.reviewTextArab || "");
        }
    }, [view]);

    const handleSubmit = async (e) => {
        e?.preventDefault();
        if (!name.trim() || !country.trim() || !descAz.trim()) {
            showToast(t("adminPanel.commentEdit.toast.warning"), "warning");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("id", id);
            formData.append("customerName", name);
            formData.append("reviewText", descAz);
            formData.append("reviewTextRu", descRu);
            formData.append("reviewTextEng", descEn);
            formData.append("reviewTextAlm", descAlm);
            formData.append("reviewTextArab", descArab);
            formData.append("country", country);
            // Keep the stored rating (it used to be overwritten with 1 on every edit).
            formData.append("rating", view?.rating ?? 5);

            if (selectedFile) {
                formData.append("profilImage", selectedFile);
            }

            await editView(formData).unwrap();
            showToast(t("adminPanel.commentEdit.toast.success"), "success");
            navigate("/admin/serh");
        } catch {
            showToast(t("adminPanel.commentEdit.toast.error"), "error");
        }
    };

    if (isLoading) {
        return (
            <div className="adm-loading" role="status">
                <Loader2 size={20} aria-hidden="true" />
                {t("adminPanel.commentEdit.loading")}
            </div>
        );
    }

    const descFields = [
        { lang: "az", key: "az", value: descAz, set: setDescAz },
        { lang: "ru", key: "ru", value: descRu, set: setDescRu },
        { lang: "en", key: "en", value: descEn, set: setDescEn },
        { lang: "de", key: "alm", value: descAlm, set: setDescAlm },
        { lang: "ar", key: "arab", value: descArab, set: setDescArab },
    ];

    return (
        <form className="adm-form" onSubmit={handleSubmit} noValidate>
            <AdminPageHeader
                crumbs={[
                    { label: t("adminPanel.commentEdit.breadcrumb.root"), to: "/admin/serh" },
                    { label: t("adminPanel.commentEdit.breadcrumb.current") },
                ]}
                title={t("adminPanel.commentEdit.title")}
                description={t("adminPanel.commentEdit.description")}
            />
            <div className="adm-form-grid">
                <FormSection
                    title={t("adminPanel.commentEdit.sections.author.title")}
                    description={t("adminPanel.commentEdit.sections.author.desc")}
                >
                    <Field label={t("adminPanel.commentEdit.sections.author.title")} required>
                        {(fieldId) => (
                            <input
                                id={fieldId}
                                className="adm-input"
                                autoComplete="off"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t("adminPanel.commentEdit.sections.author.placeholder")}
                            />
                        )}
                    </Field>
                    <Field label={t("adminPanel.commentEdit.sections.country.title")} hint={t("adminPanel.commentEdit.sections.country.desc")} required>
                        {(fieldId) => (
                            <input
                                id={fieldId}
                                className="adm-input"
                                autoComplete="off"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                placeholder={t("adminPanel.commentEdit.sections.country.placeholder")}
                            />
                        )}
                    </Field>
                </FormSection>

                <FormSection
                    title={t("adminPanel.commentEdit.sections.image.title")}
                    description={t("adminPanel.commentEdit.sections.image.desc")}
                >
                    {selectedFile ? (
                        <FilePreview
                            single
                            file={selectedFile}
                            badge={at("newFile")}
                            onRemove={() => setSelectedFile(null)}
                        />
                    ) : view?.profilImage ? (
                        <FilePreview
                            single
                            src={VIEW_CARD_IMAGES + view.profilImage}
                            name={view.profilImage}
                            badge={at("current")}
                        />
                    ) : null}
                    <Dropzone
                        compact={Boolean(selectedFile || view?.profilImage)}
                        onFiles={([file]) => setSelectedFile(file)}
                        title={t("adminPanel.commentEdit.sections.image.uploadText")}
                    />
                </FormSection>

                <FormSection
                    wide
                    title={t("adminPanel.commentEdit.sections.description.title")}
                    description={t("adminPanel.commentEdit.sections.description.desc")}
                >
                    <div className="adm-grid">
                        {descFields.map(({ lang, key, value, set }) => (
                            <LangField
                                key={key}
                                lang={lang}
                                multiline
                                rows={4}
                                wide={lang === "ar"}
                                required={lang === "az"}
                                value={value}
                                onChange={(e) => set(e.target.value)}
                                placeholder={ot(`adminPanel.commentEdit.sections.description.placeholders.${key}`)}
                            />
                        ))}
                    </div>
                </FormSection>
            </div>
            <FormFooter
                cancelTo="/admin/serh"
                saving={isUpdating}
                saveLabel={t("adminPanel.commentEdit.buttons.save")}
                savingLabel={t("adminPanel.commentEdit.buttons.saving")}
            />
        </form>
    );
}

export default SerhEdit;
