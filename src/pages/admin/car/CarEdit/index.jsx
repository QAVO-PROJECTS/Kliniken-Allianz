import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2, Plus, Video, X } from "lucide-react";
import { useGetCarByIdQuery, usePutCarMutation } from "../../../../api/userApi.js";
import { CAR_CARD_IMAGES, CAR_IMAGES } from "../../../../config/mediaUrls.js";
import showToast from "../../../../utils/toast.js";
import AdminPageHeader from "../../../../components/admin/AdminPageHeader/index.jsx";
import { Field, FormFooter, FormSection, LangField } from "../../../../components/admin/FormKit/index.jsx";
import { Dropzone, FilePreview, PreviewGrid } from "../../../../components/admin/Dropzone/index.jsx";
import IconButton from "../../../../components/admin/IconButton/index.jsx";
import { useAdminT, useOptionalT } from "../../../../components/admin/shared/adminStrings.js";

const P = "adminPanel.carEdit";

function CarEdit() {
    const { t } = useTranslation();
    const at = useAdminT();
    const ot = useOptionalT();
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);
    const [editCar, { isLoading }] = usePutCarMutation();
    const { data: getCarById, isLoading: isFetching, refetch } = useGetCarByIdQuery(id);
    const car = getCarById?.data;

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

    // New files are plain File objects; FilePreview creates and revokes the preview URLs.
    const [newImages, setNewImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [deleteImages, setDeleteImages] = useState([]);

    const [newCardImage, setNewCardImage] = useState(null);
    const [oldCardImage, setOldCardImage] = useState(null);

    const [videos, setVideos] = useState([]);
    const [videoInput, setVideoInput] = useState("");
    const [addedVideos, setAddedVideos] = useState([]);
    const [deleteVideos, setDeleteVideos] = useState([]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        if (car && !isLoaded) {
            setNameAz(car.name || "");
            setNameEn(car.nameEng || "");
            setNameRu(car.nameRu || "");
            setNameAlm(car.nameAlm || "");
            setNameArab(car.nameArab || "");

            setType(car.type || "");
            setPrice(car.price || "");

            setDescAz(car.description || "");
            setDescEn(car.descriptionEng || "");
            setDescRu(car.descriptionRu || "");
            setDescAlm(car.descriptionAlm || "");
            setDescArab(car.descriptionArab || "");

            setOldImages(car.carImages || []);
            setOldCardImage(car.cardImage || null);
            setVideos(car.carVideos || []);
            setIsLoaded(true);
        }
    }, [car, isLoaded]);

    const addImages = (files) => {
        const added = files.map((file) => {
            uid.current += 1;
            return { id: uid.current, file };
        });
        setNewImages((prev) => [...prev, ...added]);
    };

    const removeNewImage = (imageId) => {
        setNewImages((prev) => prev.filter((img) => img.id !== imageId));
    };

    const removeOldImage = (fileName) => {
        setOldImages((prev) => prev.filter((f) => f !== fileName));
        setDeleteImages((prev) => [...prev, fileName]);
    };

    const addVideo = () => {
        const trimmed = videoInput.trim();
        if (!trimmed) return;
        setVideos((prev) => [...prev, trimmed]);
        setAddedVideos((prev) => [...prev, trimmed]);
        setVideoInput("");
    };

    const removeVideo = (index) => {
        const url = videos[index];
        if (addedVideos.includes(url)) {
            setAddedVideos((prev) => prev.filter((v) => v !== url));
        } else if (car?.carVideos?.includes(url)) {
            setDeleteVideos((prev) => [...prev, url]);
        }
        setVideos((prev) => prev.filter((_, i) => i !== index));
    };

    const appendIfChanged = (formData, key, newVal, oldVal) => {
        if (newVal !== oldVal && newVal !== undefined && newVal !== null && newVal !== "") {
            formData.append(key, newVal);
        }
    };

    const handleEdit = async (e) => {
        e?.preventDefault();
        if (!car) return;

        const formData = new FormData();
        formData.append("id", car.id);

        appendIfChanged(formData, "Name", nameAz, car.name);
        appendIfChanged(formData, "NameEng", nameEn, car.nameEng);
        appendIfChanged(formData, "NameRu", nameRu, car.nameRu);
        appendIfChanged(formData, "NameAlm", nameAlm, car.nameAlm);
        appendIfChanged(formData, "NameArab", nameArab, car.nameArab);

        appendIfChanged(formData, "Type", type, car.type);
        appendIfChanged(formData, "Price", price, car.price);

        appendIfChanged(formData, "Description", descAz, car.description);
        appendIfChanged(formData, "DescriptionEng", descEn, car.descriptionEng);
        appendIfChanged(formData, "DescriptionRu", descRu, car.descriptionRu);
        appendIfChanged(formData, "DescriptionAlm", descAlm, car.descriptionAlm);
        appendIfChanged(formData, "DescriptionArab", descArab, car.descriptionArab);

        if (newCardImage) {
            formData.append("CardImage", newCardImage);
        }

        newImages.forEach((img) => formData.append("CarImages", img.file));
        deleteImages.forEach((f) => formData.append("DeleteCarImages", f));
        addedVideos.forEach((url) => formData.append("CarVideos", url));
        deleteVideos.forEach((url) => formData.append("DeleteCarVideos", url));

        try {
            await editCar(formData).unwrap();
            showToast(t(`${P}.toast.success`), "success");
            refetch();
            navigate("/admin/car");
        } catch {
            showToast(t(`${P}.toast.error`), "error");
        }
    };

    if (isFetching) {
        return (
            <div className="adm-loading" role="status">
                <Loader2 size={20} aria-hidden="true" />
                {at("loading")}
            </div>
        );
    }

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
    const imageCount = oldImages.length + newImages.length;

    return (
        <form className="adm-form" onSubmit={handleEdit} noValidate>
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
                            value={value}
                            onChange={(e) => set(e.target.value)}
                            placeholder={ot(`${P}.sections.name.placeholders.${lang}`)}
                        />
                    ))}
                </FormSection>

                <FormSection title={t(`${P}.sections.cardImage.title`)} description={t(`${P}.sections.cardImage.desc`)}>
                    <Dropzone onFiles={([file]) => setNewCardImage(file)} title={t(`${P}.uploadHint`)} />
                    {newCardImage ? (
                        <FilePreview file={newCardImage} single badge={at("newFile")} onRemove={() => setNewCardImage(null)} />
                    ) : oldCardImage && (
                        <FilePreview
                            src={CAR_CARD_IMAGES + oldCardImage}
                            single
                            name={t(`${P}.sections.cardImage.oldImage`)}
                            badge={at("current")}
                        />
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
                    {videos.length > 0 && (
                        <ul className="adm-list">
                            {videos.map((url, index) => (
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
                    title={`${t(`${P}.sections.images.title`)}${imageCount ? ` (${imageCount})` : ""}`}
                    description={t(`${P}.sections.images.desc`)}
                >
                    <Dropzone multiple compact onFiles={addImages} title={t(`${P}.uploadHint`)} />
                    {imageCount > 0 && (
                        <PreviewGrid>
                            {oldImages.map((f) => (
                                <FilePreview
                                    key={f}
                                    src={CAR_IMAGES + f}
                                    name={f}
                                    badge={at("current")}
                                    onRemove={() => removeOldImage(f)}
                                />
                            ))}
                            {newImages.map((img) => (
                                <FilePreview key={img.id} file={img.file} badge={at("newFile")} onRemove={() => removeNewImage(img.id)} />
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

export default CarEdit;
