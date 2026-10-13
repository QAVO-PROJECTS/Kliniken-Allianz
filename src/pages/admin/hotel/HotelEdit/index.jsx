import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Link2, Loader2, X } from "lucide-react";
import { useGetOtelsByIdQuery, usePutOtelsMutation } from "../../../../api/userApi.js";
import { OTEL_CARD_IMAGES } from "../../../../config/mediaUrls.js";
import showToast from "../../../../utils/toast.js";
import AdminPageHeader from "../../../../components/admin/AdminPageHeader/index.jsx";
import IconButton from "../../../../components/admin/IconButton/index.jsx";
import RatingPicker from "../../../../components/admin/RatingPicker/index.jsx";
import { Field, FormFooter, FormSection, LangField } from "../../../../components/admin/FormKit/index.jsx";
import { Dropzone, FilePreview, PreviewGrid } from "../../../../components/admin/Dropzone/index.jsx";
import { useAdminT, useOptionalT } from "../../../../components/admin/shared/adminStrings.js";
import { EMPTY_LANG_VALUES, HOTEL_LANGS } from "../hotelFields.js";

function OtelEdit() {
    const { t } = useTranslation();
    const at = useAdminT();
    const ot = useOptionalT();
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: getOtelsById, isLoading, refetch } = useGetOtelsByIdQuery(id);
    const otel = getOtelsById?.data;
    const [editOtel, { isLoading: isUpdating }] = usePutOtelsMutation();

    const [selectedFile, setSelectedFile] = useState(null);
    const [raiting, setRaiting] = useState(0);
    const [hotelLink, setHotelLink] = useState("");
    const [names, setNames] = useState(EMPTY_LANG_VALUES);
    const [locations, setLocations] = useState(EMPTY_LANG_VALUES);

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        if (otel) {
            setNames({
                az: otel.name || "",
                ru: otel.nameRu || "",
                en: otel.nameEng || "",
                alm: otel.nameAlm || "",
                arab: otel.nameArab || "",
            });
            setLocations({
                az: otel.location || "",
                ru: otel.locationRu || "",
                en: otel.locationEng || "",
                alm: otel.locationAlm || "",
                arab: otel.locationArab || "",
            });
            setHotelLink(otel.otelLink || "");
            setRaiting(otel.raiting || 0);
        }
    }, [otel]);

    const handleSubmit = async (e) => {
        e?.preventDefault();
        if (!names.az.trim() || !locations.az.trim()) {
            showToast(t("adminPanel.hotelEdit.toast.warning"), "warning");
            return;
        }

        const formData = new FormData();
        formData.append("id", id);
        formData.append("name", names.az);
        formData.append("nameRu", names.ru);
        formData.append("nameEng", names.en);
        formData.append("nameAlm", names.alm);
        formData.append("nameArab", names.arab);
        formData.append("location", locations.az);
        formData.append("locationRu", locations.ru);
        formData.append("locationEng", locations.en);
        formData.append("locationAlm", locations.alm);
        formData.append("locationArab", locations.arab);
        // Unchanged rating → send the stored value.
        const raitingToSend = raiting && raiting > 0 ? raiting : otel?.raiting || 0;
        formData.append("raiting", Number(raitingToSend));
        formData.append("otelLink", hotelLink);
        // Only a new image is sent; otherwise the backend keeps the current one.
        if (selectedFile) formData.append("cardImage", selectedFile);

        try {
            await editOtel(formData).unwrap();
            showToast(t("adminPanel.hotelEdit.toast.success"), "success");
            navigate("/admin/otel");
        } catch {
            showToast(t("adminPanel.hotelEdit.toast.error"), "error");
        }
    };

    if (isLoading) {
        return (
            <div className="adm-loading" role="status">
                <Loader2 size={20} aria-hidden="true" />
                {at("loading")}
            </div>
        );
    }

    return (
        <form className="adm-form" onSubmit={handleSubmit} noValidate>
            <AdminPageHeader
                crumbs={[
                    { label: t("adminPanel.hotelEdit.breadcrumb.root"), to: "/admin/otel" },
                    { label: t("adminPanel.hotelEdit.breadcrumb.current") },
                ]}
                title={t("adminPanel.hotelEdit.title")}
                description={t("adminPanel.hotelEdit.description")}
            />
            <div className="adm-form-grid">
                <FormSection title={t("adminPanel.hotelEdit.sections.name.title")} description={t("adminPanel.hotelEdit.sections.name.desc")}>
                    {HOTEL_LANGS.map(([key, lang]) => (
                        <LangField
                            key={key}
                            lang={lang}
                            required={key === "az"}
                            value={names[key]}
                            placeholder={ot(`adminPanel.hotelEdit.sections.name.placeholders.${key}`)}
                            onChange={(e) => setNames((prev) => ({ ...prev, [key]: e.target.value }))}
                        />
                    ))}
                </FormSection>

                <FormSection title={t("adminPanel.hotelEdit.sections.image.title")} description={t("adminPanel.hotelEdit.sections.image.desc")}>
                    {(selectedFile || otel?.cardImage) && (
                        <PreviewGrid>
                            {otel?.cardImage && (
                                <FilePreview src={OTEL_CARD_IMAGES + otel.cardImage} name={otel.cardImage} badge={at("current")} />
                            )}
                            {selectedFile && (
                                <FilePreview file={selectedFile} badge={at("newFile")} onRemove={() => setSelectedFile(null)} />
                            )}
                        </PreviewGrid>
                    )}
                    <Dropzone compact onFiles={([file]) => setSelectedFile(file)} title={t("adminPanel.hotelEdit.sections.image.uploadText")} />
                </FormSection>

                <FormSection title={t("adminPanel.hotelEdit.sections.country.title")} description={t("adminPanel.hotelEdit.sections.country.desc")}>
                    {HOTEL_LANGS.map(([key, lang]) => (
                        <LangField
                            key={key}
                            lang={lang}
                            required={key === "az"}
                            value={locations[key]}
                            maxLength={50}
                            placeholder={ot(`adminPanel.hotelEdit.sections.country.placeholders.${key}`)}
                            onChange={(e) => setLocations((prev) => ({ ...prev, [key]: e.target.value }))}
                        />
                    ))}
                </FormSection>

                <FormSection title={t("adminPanel.hotelEdit.sections.rating.title")} description={t("adminPanel.hotelEdit.sections.rating.desc")}>
                    <RatingPicker value={raiting || null} onChange={setRaiting} label={t("adminPanel.hotelEdit.sections.rating.title")} />
                    <Field label={t("adminPanel.hotelEdit.sections.link.title")} hint={t("adminPanel.hotelEdit.sections.link.desc")}>
                        {(fieldId) => (
                            <div className="adm-input-icon">
                                <Link2 size={18} aria-hidden="true" />
                                <input
                                    id={fieldId}
                                    className="adm-input"
                                    type="url"
                                    inputMode="url"
                                    placeholder={ot("adminPanel.hotelEdit.sections.link.placeholder") || "https://"}
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
                saving={isUpdating}
                saveLabel={t("adminPanel.hotelEdit.buttons.save")}
                savingLabel={t("adminPanel.hotelEdit.buttons.saving")}
            />
        </form>
    );
}

export default OtelEdit;
