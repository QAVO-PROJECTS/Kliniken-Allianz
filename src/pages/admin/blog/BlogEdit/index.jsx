import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2, Plus, Video, X } from "lucide-react";
import { useGetNewspaperByIdQuery, usePutNewspaperMutation } from "../../../../api/userApi.js";
import { NEWSPAPER_IMAGES } from "../../../../config/mediaUrls.js";
import showToast from "../../../../utils/toast.js";
import AdminPageHeader from "../../../../components/admin/AdminPageHeader/index.jsx";
import IconButton from "../../../../components/admin/IconButton/index.jsx";
import { FormFooter, FormSection, LangField } from "../../../../components/admin/FormKit/index.jsx";
import { Dropzone, FilePreview, PreviewGrid } from "../../../../components/admin/Dropzone/index.jsx";
import { useAdminT } from "../../../../components/admin/shared/adminStrings.js";

const fileKey = (file, index) => `${file.name}-${file.size}-${file.lastModified}-${index}`;

function NewspaperEdit() {
    const { t } = useTranslation();
    const at = useAdminT();
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, isLoading: isFetching, refetch } = useGetNewspaperByIdQuery(id);
    const newspaper = data?.data;

    const [editNewspaper, { isLoading }] = usePutNewspaperMutation();
    const [isLoaded, setIsLoaded] = useState(false);

    const [titleAz, setTitleAz] = useState("");
    const [titleEn, setTitleEn] = useState("");
    const [titleRu, setTitleRu] = useState("");
    const [titleAlm, setTitleAlm] = useState("");
    const [titleArab, setTitleArab] = useState("");

    const [subtitleAz, setSubtitleAz] = useState("");
    const [subtitleEn, setSubtitleEn] = useState("");
    const [subtitleRu, setSubtitleRu] = useState("");
    const [subtitleAlm, setSubtitleAlm] = useState("");
    const [subtitleArab, setSubtitleArab] = useState("");

    // New uploads are plain File objects; <FilePreview> manages their object URLs.
    const [newImages, setNewImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [deleteImages, setDeleteImages] = useState([]);

    const [videos, setVideos] = useState([]);
    const [videoInput, setVideoInput] = useState("");
    const [addedVideos, setAddedVideos] = useState([]);
    const [deleteVideos, setDeleteVideos] = useState([]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        if (newspaper && !isLoaded) {
            setTitleAz(newspaper.title || "");
            setTitleEn(newspaper.titleEng || "");
            setTitleRu(newspaper.titleRu || "");
            setTitleAlm(newspaper.titleAlm || "");
            setTitleArab(newspaper.titleArab || "");

            setSubtitleAz(newspaper.subtitle || "");
            setSubtitleEn(newspaper.subtitleEng || "");
            setSubtitleRu(newspaper.subtitleRu || "");
            setSubtitleAlm(newspaper.subtitleAlm || "");
            setSubtitleArab(newspaper.subtitleArab || "");

            setOldImages(newspaper.newspaperImages || newspaper.newsPaperImages || []);
            setVideos(newspaper.newspaperVideos || newspaper.newsPaperVideos || []);
            setIsLoaded(true);
        }
    }, [newspaper, isLoaded]);

    const handleImagesChange = (files) => setNewImages((prev) => [...prev, ...files]);

    const removeNewImage = (index) => setNewImages((prev) => prev.filter((_, i) => i !== index));

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
        } else {
            setDeleteVideos((prev) => [...prev, url]);
        }
        setVideos((prev) => prev.filter((_, i) => i !== index));
    };

    const handleEdit = async (e) => {
        e?.preventDefault();
        if (!newspaper) return;

        const formData = new FormData();
        formData.append("Id", id);

        formData.append("Title", titleAz);
        formData.append("TitleEng", titleEn);
        formData.append("TitleRu", titleRu);
        formData.append("TitleAlm", titleAlm);
        formData.append("TitleArab", titleArab);

        formData.append("Subtitle", subtitleAz);
        formData.append("SubtitleEng", subtitleEn);
        formData.append("SubtitleRu", subtitleRu);
        formData.append("SubtitleAlm", subtitleAlm);
        formData.append("SubtitleArab", subtitleArab);

        newImages.forEach((file) => formData.append("NewsPaperImages", file));
        deleteImages.forEach((f) => formData.append("DeleteNewsPaperImages", f));
        addedVideos.forEach((url) => formData.append("NewspaperVideos", url));
        deleteVideos.forEach((url) => formData.append("DeleteNewspaperVideos", url));

        try {
            await editNewspaper(formData).unwrap();
            showToast(t("adminPanel.newspaperEdit.toast.success"), "success");
            refetch();
            navigate("/admin/newspaper");
        } catch {
            showToast(t("adminPanel.newspaperEdit.toast.error"), "error");
        }
    };

    if (isFetching && !newspaper) {
        return (
            <div className="adm-loading" role="status">
                <Loader2 size={20} aria-hidden="true" />
                {at("loading")}
            </div>
        );
    }

    const titleFields = [
        { lang: "az", value: titleAz, set: setTitleAz },
        { lang: "ru", value: titleRu, set: setTitleRu },
        { lang: "en", value: titleEn, set: setTitleEn },
        { lang: "de", value: titleAlm, set: setTitleAlm },
        { lang: "ar", value: titleArab, set: setTitleArab },
    ];
    const subtitleFields = [
        { lang: "az", value: subtitleAz, set: setSubtitleAz },
        { lang: "ru", value: subtitleRu, set: setSubtitleRu },
        { lang: "en", value: subtitleEn, set: setSubtitleEn },
        { lang: "de", value: subtitleAlm, set: setSubtitleAlm },
        { lang: "ar", value: subtitleArab, set: setSubtitleArab },
    ];
    const imageCount = oldImages.length + newImages.length;

    return (
        <form className="adm-form" onSubmit={handleEdit} noValidate>
            <AdminPageHeader
                crumbs={[
                    { label: t("adminPanel.newspaperEdit.breadcrumb.root"), to: "/admin/newspaper" },
                    { label: t("adminPanel.newspaperEdit.breadcrumb.current") },
                ]}
                title={t("adminPanel.newspaperEdit.title")}
                description={t("adminPanel.newspaperEdit.description")}
            />
            <div className="adm-form-grid">
                <FormSection
                    title={t("adminPanel.newspaperEdit.sections.title.title")}
                    description={t("adminPanel.newspaperEdit.sections.title.desc")}
                >
                    {titleFields.map(({ lang, value, set }) => (
                        <LangField
                            key={lang}
                            lang={lang}
                            value={value}
                            onChange={(e) => set(e.target.value)}
                            placeholder={t(`adminPanel.newspaperEdit.sections.title.placeholders.${lang}`)}
                        />
                    ))}
                </FormSection>

                <FormSection
                    title={t("adminPanel.newspaperEdit.sections.images.title")}
                    description={t("adminPanel.newspaperEdit.sections.images.desc")}
                >
                    <Dropzone multiple onFiles={handleImagesChange} title={t("adminPanel.newspaperEdit.uploadHint")} />
                    {imageCount > 0 && (
                        <>
                            <span className="adm-hint">
                                {t("adminPanel.newspaperEdit.sections.images.uploadedLength")} ({imageCount})
                            </span>
                            <PreviewGrid>
                                {oldImages.map((f) => (
                                    <FilePreview
                                        key={`old-${f}`}
                                        src={NEWSPAPER_IMAGES + f}
                                        name={f}
                                        badge={at("current")}
                                        onRemove={() => removeOldImage(f)}
                                    />
                                ))}
                                {newImages.map((file, index) => (
                                    <FilePreview
                                        key={fileKey(file, index)}
                                        file={file}
                                        badge={at("newFile")}
                                        onRemove={() => removeNewImage(index)}
                                    />
                                ))}
                            </PreviewGrid>
                        </>
                    )}
                </FormSection>

                <FormSection
                    wide
                    title={t("adminPanel.newspaperEdit.sections.subtitle.title")}
                    description={t("adminPanel.newspaperEdit.sections.subtitle.desc")}
                >
                    <div className="adm-grid">
                        {subtitleFields.map(({ lang, value, set }) => (
                            <LangField
                                key={lang}
                                lang={lang}
                                multiline
                                rows={8}
                                wide={lang === "ar"}
                                value={value}
                                onChange={(e) => set(e.target.value)}
                                placeholder={t(`adminPanel.newspaperEdit.sections.subtitle.placeholders.${lang}`)}
                            />
                        ))}
                    </div>
                </FormSection>

                <FormSection
                    wide
                    title={t("adminPanel.newspaperEdit.sections.videos.title", "YouTube Videolar")}
                    description={t("adminPanel.newspaperEdit.sections.videos.desc", "Xəbərə aid YouTube video linklərini əlavə edin")}
                >
                    <div className="adm-inline">
                        <input
                            type="url"
                            className="adm-input"
                            aria-label={t("adminPanel.newspaperEdit.sections.videos.title", "YouTube Videolar")}
                            placeholder={t("adminPanel.newspaperEdit.placeholders.videoUrl", "https://youtube.com/...")}
                            value={videoInput}
                            onChange={(e) => setVideoInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addVideo();
                                }
                            }}
                        />
                        <button type="button" className="btn btn--secondary" onClick={addVideo} disabled={!videoInput.trim()}>
                            <Plus size={16} aria-hidden="true" />
                            {t("adminPanel.newspaperEdit.buttons.addVideo", "Əlavə et")}
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
            </div>
            <FormFooter
                cancelTo="/admin/newspaper"
                saving={isLoading}
                saveLabel={t("adminPanel.newspaperEdit.buttons.save")}
                savingLabel={t("adminPanel.newspaperEdit.buttons.saving")}
            />
        </form>
    );
}

export default NewspaperEdit;
