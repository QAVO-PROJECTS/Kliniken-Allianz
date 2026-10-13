import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Plus, Video, X } from "lucide-react";
import { usePostCarMutation } from "../../../../api/userApi.js";
import showToast from "../../../../utils/toast.js";
import AdminPageHeader from "../../../../components/admin/AdminPageHeader/index.jsx";
import { Field, FormFooter, FormSection, LangField } from "../../../../components/admin/FormKit/index.jsx";
import { Dropzone, FilePreview, PreviewGrid } from "../../../../components/admin/Dropzone/index.jsx";
import IconButton from "../../../../components/admin/IconButton/index.jsx";
import { useAdminT, useOptionalT } from "../../../../components/admin/shared/adminStrings.js";

const P = "adminPanel.carAdd";

function CarAdd() {
    const { t } = useTranslation();
    const at = useAdminT();
    const ot = useOptionalT();
    const navigate = useNavigate();
    const [postCar, { isLoading }] = usePostCarMutation();

    const uid = useRef(0);

    const [nameAz, setNameAz] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [nameRu, setNameRu] = useState("");
    const [nameAlm, setNameAlm] = useState("");
    const [nameArab, setNameArab] = useState("");

    const [type, setType] = useState("");
    const [price, setPrice] = useState("");

    const [descAz, setDescAz] = useState("");
    const [descEn, setDescEn] = useState("");
    const [descRu, setDescRu] = useState("");
    const [descAlm, setDescAlm] = useState("");
    const [descArab, setDescArab] = useState("");

    // Plain File objects; FilePreview creates and revokes the preview URLs.
    const [cardImage, setCardImage] = useState(null);
    const [carImages, setCarImages] = useState([]);

    const [carVideos, setCarVideos] = useState([]);
    const [videoInput, setVideoInput] = useState("");

    const addImages = (files) => {
        const added = files.map((file) => {
            uid.current += 1;
            return { id: uid.current, file };
        });
        setCarImages((prev) => [...prev, ...added]);
    };

    const removeImage = (imageId) => {
        setCarImages((prev) => prev.filter((img) => img.id !== imageId));
    };

    const addVideo = () => {
        const trimmed = videoInput.trim();
        if (!trimmed) return;
        setCarVideos((prev) => [...prev, trimmed]);
        setVideoInput("");
    };

    const removeVideo = (index) => {
        setCarVideos((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();
        if (!nameAz.trim()) {
            showToast(t(`${P}.toast.warnNameAz`), "warning");
            return;
        }

        const formData = new FormData();

        formData.append("Name", nameAz);
        formData.append("NameEng", nameEn);
        formData.append("NameRu", nameRu);
        formData.append("NameAlm", nameAlm);
        formData.append("NameArab", nameArab);

        formData.append("Type", type);
        formData.append("Price", price);

        formData.append("Description", descAz);
        formData.append("DescriptionEng", descEn);
        formData.append("DescriptionRu", descRu);
        formData.append("DescriptionAlm", descAlm);
        formData.append("DescriptionArab", descArab);

        if (cardImage) {
            formData.append("CardImage", cardImage);
        }

        carImages.forEach((img) => formData.append("CarImages", img.file));
        carVideos.forEach((url) => formData.append("CarVideos", url));

        try {
            await postCar(formData).unwrap();
            showToast(t(`${P}.toast.success`), "success");

            setNameAz(""); setNameEn(""); setNameRu(""); setNameAlm(""); setNameArab("");
            setType(""); setPrice("");
            setDescAz(""); setDescEn(""); setDescRu(""); setDescAlm(""); setDescArab("");
            setCardImage(null);
            setCarImages([]);
            setCarVideos([]);
            setVideoInput("");
            navigate("/admin/car");
        } catch {
            showToast(t(`${P}.toast.error`), "error");
        }
    };

    const names = [
        { lang: "az", value: nameAz, set: setNameAz },
        { lang: "ru", value: nameRu, set: setNameRu },
        { lang: "en", value: nameEn, set: setNameEn },
        { lang: "de", value: nameAlm, set: setNameAlm },
        { lang: "ar", value: nameArab, set: setNameArab },
    ];
    const descriptions = [
        { lang: "az", value: descAz, set: setDescAz },
        { lang: "ru", value: descRu, set: setDescRu },
        { lang: "en", value: descEn, set: setDescEn },
        { lang: "de", value: descAlm, set: setDescAlm },
        { lang: "ar", value: descArab, set: setDescArab },
    ];

    return (
        <form className="adm-form" onSubmit={handleSubmit} noValidate>
            <AdminPageHeader
                crumbs={[
                    { label: t(`${P}.breadcrumb.root`), to: "/admin/car" },
                    { label: t(`${P}.breadcrumb.current`) },
                ]}
                title={t(`${P}.title`)}
                description={t(`${P}.description`)}
            />
            <div className="adm-form-grid">
                <FormSection title={t(`${P}.sections.name.title`)} description={t(`${P}.sections.name.desc`)}>
                    {names.map(({ lang, value, set }) => (
                        <LangField
                            key={lang}
                            lang={lang}
                            required={lang === "az"}
                            value={value}
                            onChange={(e) => set(e.target.value)}
                            placeholder={ot(`${P}.sections.name.placeholders.${lang}`)}
                        />
                    ))}
                </FormSection>

                <FormSection title={t(`${P}.sections.cardImage.title`)} description={t(`${P}.sections.cardImage.desc`)}>
                    <Dropzone onFiles={([file]) => setCardImage(file)} title={t(`${P}.uploadHint`)} />
                    {cardImage && (
                        <FilePreview file={cardImage} single badge={at("newFile")} onRemove={() => setCardImage(null)} />
                    )}
                </FormSection>

                <FormSection title={t(`${P}.sections.typePrice.title`)} description={t(`${P}.sections.typePrice.desc`)}>
                    <div className="adm-grid">
                        <Field label={t("adminPanel.carTable.headers.type")}>
                            {(fieldId) => (
                                <input
                                    id={fieldId}
                                    className="adm-input"
                                    placeholder={t(`${P}.sections.typePrice.placeholders.type`)}
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                />
                            )}
                        </Field>
                        <Field label={t("adminPanel.carTable.headers.price")}>
                            {(fieldId) => (
                                <input
                                    id={fieldId}
                                    className="adm-input"
                                    placeholder={t(`${P}.sections.typePrice.placeholders.price`)}
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            )}
                        </Field>
                    </div>
                </FormSection>

                <FormSection title={t(`${P}.sections.videos.title`)} description={t(`${P}.sections.videos.desc`)}>
                    <div className="adm-inline">
                        <input
                            type="url"
                            className="adm-input"
                            aria-label={t(`${P}.sections.videos.title`)}
                            placeholder={t(`${P}.sections.videos.placeholder`)}
                            value={videoInput}
                            onChange={(e) => setVideoInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addVideo();
                                }
                            }}
                        />
                        <button type="button" className="btn btn--secondary" onClick={addVideo}>
                            <Plus size={16} aria-hidden="true" />
                            {t(`${P}.sections.videos.addBtn`)}
                        </button>
                    </div>
                    {carVideos.length > 0 && (
                        <ul className="adm-list">
                            {carVideos.map((url, index) => (
                                <li key={`${url}-${index}`} className="adm-list__item">
                                    <Video size={16} aria-hidden="true" />
                                    <span title={url}>{url}</span>
                                    <IconButton icon={X} label={at("remove")} onClick={() => removeVideo(index)} variant="danger" />
                                </li>
                            ))}
                        </ul>
                    )}
                </FormSection>

                <FormSection wide title={t(`${P}.sections.description.title`)} description={t(`${P}.sections.description.desc`)}>
                    <div className="adm-grid">
                        {descriptions.map(({ lang, value, set }) => (
                            <LangField
                                key={lang}
                                lang={lang}
                                multiline
                                rows={5}
                                value={value}
                                onChange={(e) => set(e.target.value)}
                                placeholder={ot(`${P}.sections.description.placeholders.${lang}`)}
                            />
                        ))}
                    </div>
                </FormSection>

                <FormSection
                    wide
                    title={`${t(`${P}.sections.images.title`)}${carImages.length ? ` (${carImages.length})` : ""}`}
                    description={t(`${P}.sections.images.desc`)}
                >
                    <Dropzone multiple compact onFiles={addImages} title={t(`${P}.uploadHint`)} />
                    {carImages.length > 0 && (
                        <PreviewGrid>
                            {carImages.map((img) => (
                                <FilePreview key={img.id} file={img.file} onRemove={() => removeImage(img.id)} />
                            ))}
                        </PreviewGrid>
                    )}
                </FormSection>
            </div>
            <FormFooter
                cancelTo="/admin/car"
                saving={isLoading}
                saveLabel={t(`${P}.buttons.save`)}
                savingLabel={t(`${P}.buttons.saving`)}
            />
        </form>
    );
}

export default CarAdd;
