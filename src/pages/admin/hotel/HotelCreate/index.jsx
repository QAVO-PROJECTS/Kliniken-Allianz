import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Link2, X } from "lucide-react";
import { usePostOtelsMutation } from "../../../../api/userApi.js";
import showToast from "../../../../utils/toast.js";
import AdminPageHeader from "../../../../components/admin/AdminPageHeader/index.jsx";
import IconButton from "../../../../components/admin/IconButton/index.jsx";
import RatingPicker from "../../../../components/admin/RatingPicker/index.jsx";
import { Field, FormFooter, FormSection, LangField } from "../../../../components/admin/FormKit/index.jsx";
import { Dropzone, FilePreview } from "../../../../components/admin/Dropzone/index.jsx";
import { useAdminT, useOptionalT } from "../../../../components/admin/shared/adminStrings.js";
import { EMPTY_LANG_VALUES, HOTEL_LANGS } from "../hotelFields.js";

function OtelAdd() {
    const { t } = useTranslation();
    const at = useAdminT();
    const ot = useOptionalT();
    const navigate = useNavigate();
    const [postOtel, { isLoading }] = usePostOtelsMutation();
    const [selectedFile, setSelectedFile] = useState(null);
    const [rating, setRating] = useState(null);
    const [hotelLink, setHotelLink] = useState("");
    const [hotelNames, setHotelNames] = useState(EMPTY_LANG_VALUES);
    const [countryNames, setCountryNames] = useState(EMPTY_LANG_VALUES);

    const handleSubmit = async (e) => {
        e?.preventDefault();
        const selectedStars = rating || 0;
        if (!selectedFile || selectedStars === 0 || !hotelNames.az.trim()) {
            showToast(t("adminPanel.hotelAdd.toast.warning"), "warning");
            return;
        }

        const formData = new FormData();
        formData.append("name", hotelNames.az);
        formData.append("nameRu", hotelNames.ru);
        formData.append("nameEng", hotelNames.en);
        formData.append("nameAlm", hotelNames.alm);
        formData.append("nameArab", hotelNames.arab);
        formData.append("location", countryNames.az);
        formData.append("locationRu", countryNames.ru);
        formData.append("locationEng", countryNames.en);
        formData.append("locationAlm", countryNames.alm);
        formData.append("locationArab", countryNames.arab);
        formData.append("raiting", Number(selectedStars));
        formData.append("otelLink", hotelLink);
        formData.append("cardImage", selectedFile);

        try {
            await postOtel(formData).unwrap();
            showToast(t("adminPanel.hotelAdd.toast.success"), "success");
            setHotelNames(EMPTY_LANG_VALUES);
            setCountryNames(EMPTY_LANG_VALUES);
            setHotelLink("");
            setRating(null);
            setSelectedFile(null);
            navigate("/admin/otel");
        } catch {
            showToast(t("adminPanel.hotelAdd.toast.error"), "error");
        }
    };

    return (
        <form className="adm-form" onSubmit={handleSubmit} noValidate>
            <AdminPageHeader
                crumbs={[
                    { label: t("adminPanel.hotelAdd.breadcrumb.root"), to: "/admin/otel" },
                    { label: t("adminPanel.hotelAdd.breadcrumb.current") },
                ]}
                title={t("adminPanel.hotelAdd.title")}
                description={t("adminPanel.hotelAdd.description")}
            />
            <div className="adm-form-grid">
                <FormSection title={t("adminPanel.hotelAdd.sections.name.title")} description={t("adminPanel.hotelAdd.sections.name.desc")}>
                    {HOTEL_LANGS.map(([key, lang]) => (
                        <LangField
                            key={key}
                            lang={lang}
                            required={key === "az"}
                            value={hotelNames[key]}
                            placeholder={ot(`adminPanel.hotelAdd.sections.name.placeholders.${key}`)}
                            onChange={(e) => setHotelNames((prev) => ({ ...prev, [key]: e.target.value }))}
                        />
                    ))}
                </FormSection>

                <FormSection title={t("adminPanel.hotelAdd.sections.image.title")} description={t("adminPanel.hotelAdd.sections.image.desc")}>
                    {selectedFile ? (
                        <FilePreview file={selectedFile} single onRemove={() => setSelectedFile(null)} />
                    ) : (
                        <Dropzone onFiles={([file]) => setSelectedFile(file)} title={t("adminPanel.hotelAdd.sections.image.uploadText")} />
                    )}
                </FormSection>

                <FormSection title={t("adminPanel.hotelAdd.sections.country.title")} description={t("adminPanel.hotelAdd.sections.country.desc")}>
                    {HOTEL_LANGS.map(([key, lang]) => (
                        <LangField
                            key={key}
                            lang={lang}
                            value={countryNames[key]}
                            maxLength={50}
                            placeholder={ot(`adminPanel.hotelAdd.sections.country.placeholders.${key}`)}
                            onChange={(e) => setCountryNames((prev) => ({ ...prev, [key]: e.target.value }))}
                        />
                    ))}
                </FormSection>

                <FormSection title={t("adminPanel.hotelAdd.sections.rating.title")} description={t("adminPanel.hotelAdd.sections.rating.desc")}>
                    <RatingPicker value={rating} onChange={setRating} label={t("adminPanel.hotelAdd.sections.rating.title")} />
                    <Field label={t("adminPanel.hotelAdd.sections.link.title")} hint={t("adminPanel.hotelAdd.sections.link.desc")}>
                        {(id) => (
                            <div className="adm-input-icon">
                                <Link2 size={18} aria-hidden="true" />
                                <input
                                    id={id}
                                    className="adm-input"
                                    type="url"
                                    inputMode="url"
                                    placeholder="https://www.fairmonthotels.com/baku/"
                                    value={hotelLink}
                                    onChange={(e) => setHotelLink(e.target.value)}
                                />
                                {hotelLink && (
                                    <IconButton icon={X} label={at("remove")} tooltip={false} size={16} onClick={() => setHotelLink("")} />
                                )}
                            </div>
                        )}
                    </Field>
                </FormSection>
            </div>
            <FormFooter
                cancelTo="/admin/otel"
                saving={isLoading}
                saveLabel={t("adminPanel.hotelAdd.buttons.save")}
                savingLabel={t("adminPanel.hotelAdd.buttons.saving")}
            />
        </form>
    );
}

export default OtelAdd;
