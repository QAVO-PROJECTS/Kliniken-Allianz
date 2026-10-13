import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Plus, Video, X } from "lucide-react";
import { usePostNewspaperMutation } from "../../../../api/userApi.js";
import showToast from "../../../../utils/toast.js";
import AdminPageHeader from "../../../../components/admin/AdminPageHeader/index.jsx";
import IconButton from "../../../../components/admin/IconButton/index.jsx";
import { FormFooter, FormSection, LangField } from "../../../../components/admin/FormKit/index.jsx";
import { Dropzone, FilePreview, PreviewGrid } from "../../../../components/admin/Dropzone/index.jsx";
import { useAdminT } from "../../../../components/admin/shared/adminStrings.js";

const fileKey = (file, index) => `${file.name}-${file.size}-${file.lastModified}-${index}`;

function NewspaperAdd() {
    const { t } = useTranslation();
    const at = useAdminT();
    const navigate = useNavigate();
    const [postNewspaper, { isLoading }] = usePostNewspaperMutation();

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

    // Plain File objects; <FilePreview> creates and revokes the preview URLs.
    const [newspaperImages, setNewspaperImages] = useState([]);

    const [videos, setVideos] = useState([]);
    const [videoInput, setVideoInput] = useState("");

    const handleImagesChange = (files) => setNewspaperImages((prev) => [...prev, ...files]);

    const removeImage = (index) => setNewspaperImages((prev) => prev.filter((_, i) => i !== index));

    const addVideo = () => {
        const trimmed = videoInput.trim();
        if (!trimmed) return;
        setVideos((prev) => [...prev, trimmed]);
        setVideoInput("");
    };

    const removeVideo = (index) => {
        setVideos((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();
        if (!titleAz.trim()) {
            showToast(t("adminPanel.newspaperAdd.toast.warnTitleAz"), "warning");
            return;
        }

        const formData = new FormData();

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

        newspaperImages.forEach((file) => {
            formData.append("NewsPaperImages", file);
        });

        videos.forEach((url) => {
            formData.append("NewspaperVideos", url);
        });

        try {
            await postNewspaper(formData).unwrap();
            showToast(t("adminPanel.newspaperAdd.toast.success"), "success");

            setTitleAz(""); setTitleEn(""); setTitleRu(""); setTitleAlm(""); setTitleArab("");
            setSubtitleAz(""); setSubtitleEn(""); setSubtitleRu(""); setSubtitleAlm(""); setSubtitleArab("");
            setNewspaperImages([]);
            setVideos([]);
            navigate("/admin/newspaper");
        } catch {
            showToast(t("adminPanel.newspaperAdd.toast.error"), "error");
        }
    };

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

    return (
        <form className="adm-form" onSubmit={handleSubmit} noValidate>
            <AdminPageHeader
                crumbs={[
                    { label: t("adminPanel.newspaperAdd.breadcrumb.root"), to: "/admin/newspaper" },
                    { label: t("adminPanel.newspaperAdd.breadcrumb.current") },
                ]}
                title={t("adminPanel.newspaperAdd.title")}
                description={t("adminPanel.newspaperAdd.description")}
            />
            <div className="adm-form-grid">
                <FormSection
                    title={t("adminPanel.newspaperAdd.sections.title.title")}
                    description={t("adminPanel.newspaperAdd.sections.title.desc")}
                >
                    {titleFields.map(({ lang, value, set }) => (
                        <LangField
                            key={lang}
                            lang={lang}
                            required={lang === "az"}
                            value={value}
                            onChange={(e) => set(e.target.value)}
                            placeholder={t(`adminPanel.newspaperAdd.sections.title.placeholders.${lang}`)}
                        />
                    ))}
                </FormSection>

                <FormSection
                    title={t("adminPanel.newspaperAdd.sections.images.title")}
                    description={t("adminPanel.newspaperAdd.sections.images.desc")}
                >
                    <Dropzone multiple onFiles={handleImagesChange} title={t("adminPanel.newspaperAdd.uploadHint")} />
                    {newspaperImages.length > 0 && (
                        <>
                            <span className="adm-hint">
                                {t("adminPanel.newspaperAdd.sections.images.uploadedLength")} ({newspaperImages.length})
                            </span>
                            <PreviewGrid>
                                {newspaperImages.map((file, index) => (
                                    <FilePreview
                                        key={fileKey(file, index)}
                                        file={file}
                                        badge={at("newFile")}
                                        onRemove={() => removeImage(index)}
                                    />
                                ))}
                            </PreviewGrid>
                        </>
                    )}
                </FormSection>

                <FormSection
                    wide
                    title={t("adminPanel.newspaperAdd.sections.subtitle.title")}
                    description={t("adminPanel.newspaperAdd.sections.subtitle.desc")}
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
                                placeholder={t(`adminPanel.newspaperAdd.sections.subtitle.placeholders.${lang}`)}
                            />
                        ))}
                    </div>
                </FormSection>

                <FormSection
                    wide
                    title={t("adminPanel.newspaperAdd.sections.videos.title", "YouTube Videolar")}
                    description={t("adminPanel.newspaperAdd.sections.videos.desc", "Xəbərə aid YouTube video linklərini əlavə edin")}
                >
                    <div className="adm-inline">
                        <input
                            type="url"
                            className="adm-input"
                            aria-label={t("adminPanel.newspaperAdd.sections.videos.title", "YouTube Videolar")}
                            placeholder={t("adminPanel.newspaperAdd.placeholders.videoUrl", "https://youtube.com/...")}
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
                            {t("adminPanel.newspaperAdd.buttons.addVideo", "Əlavə et")}
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
                saveLabel={t("adminPanel.newspaperAdd.buttons.save")}
                savingLabel={t("adminPanel.newspaperAdd.buttons.saving")}
            />
        </form>
    );
}

export default NewspaperAdd;
