import './index.scss'
import {NavLink, useNavigate} from "react-router-dom";
import rootIcon from '/src/assets/rootIcon.svg'
import aze from '/src/assets/azerbaijan.svg'
import rus from '/src/assets/russia.svg'
import usa from '/src/assets/unitedstates.svg'
import ger from '/src/assets/germany.svg'
import arb from '/src/assets/unitedarabemirates.svg'
import uploadIcon from '/src/assets/uploadIcon.svg'
import {useState} from "react";
import openIcon from '/src/assets/accordionOpen.svg'
import closeIcon from '/src/assets/accordionClose.svg'
import {usePostNewspaperMutation} from "../../../services/userApi.jsx";
import showToast from "../../../components/ToastMessage.js";
import {useTranslation} from "react-i18next";

function NewspaperAdd() {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [postNewspaper, {isLoading}] = usePostNewspaperMutation();

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

    const [newspaperImages, setNewspaperImages] = useState([]);
    const [imagesOpen, setImagesOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const [videos, setVideos] = useState([]);
    const [videoInput, setVideoInput] = useState("");

    const handleImagesChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const withPreview = newFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setNewspaperImages((prev) => [...prev, ...withPreview]);
    };

    const removeImage = (index) => {
        setNewspaperImages((prev) => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[index].preview);
            updated.splice(index, 1);
            return updated;
        });
    };

    const addVideo = () => {
        const trimmed = videoInput.trim();
        if (!trimmed) return;
        setVideos((prev) => [...prev, trimmed]);
        setVideoInput("");
    };

    const removeVideo = (index) => {
        setVideos((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
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

        // According to endpoint, array is NewsPaperImages
        newspaperImages.forEach((item) => {
            formData.append("NewsPaperImages", item.file);
        });

        // Add videos
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
            navigate('/admin/newspaper');
        } catch (err) {
            console.error("Xəta:", err);
            showToast(t("adminPanel.newspaperAdd.toast.error"), "error");
        }
    };

    return (
        <div id={'Newspaper-add'} className={'Newspaper-add'}>
            <div className={'Newspaper-add'}>
                <div className={"root"}>
                    <h2>
                        <NavLink className="link" to="/admin/newspaper">{t("adminPanel.newspaperAdd.breadcrumb.root")}</NavLink>
                        <img src={rootIcon} alt=""/>
                        {t("adminPanel.newspaperAdd.breadcrumb.current")}
                    </h2>
                </div>

                <div className={'Newspaper-add-head'}>
                    <h1>{t("adminPanel.newspaperAdd.title")}</h1>
                    <p>{t("adminPanel.newspaperAdd.description")}</p>
                </div>

                <div className={'Newspaper-add-main'}>
                    <div className={'Newspaper-add-data'}>
                        {/* Başlıq */}
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>{t("adminPanel.newspaperAdd.sections.title.title")}</h3>
                                <p>{t("adminPanel.newspaperAdd.sections.title.desc")}</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input placeholder={t("adminPanel.newspaperAdd.sections.title.placeholders.az")} value={titleAz} onChange={(e) => setTitleAz(e.target.value)}/>
                                    </div>
                                    <img src={aze} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input placeholder={t("adminPanel.newspaperAdd.sections.title.placeholders.ru")} value={titleRu} onChange={(e) => setTitleRu(e.target.value)}/>
                                    </div>
                                    <img src={rus} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input placeholder={t("adminPanel.newspaperAdd.sections.title.placeholders.en")} value={titleEn} onChange={(e) => setTitleEn(e.target.value)}/>
                                    </div>
                                    <img src={usa} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input placeholder={t("adminPanel.newspaperAdd.sections.title.placeholders.de")} value={titleAlm} onChange={(e) => setTitleAlm(e.target.value)}/>
                                    </div>
                                    <img src={ger} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input placeholder={t("adminPanel.newspaperAdd.sections.title.placeholders.ar")} value={titleArab} onChange={(e) => setTitleArab(e.target.value)}/>
                                    </div>
                                    <img src={arb} alt=""/>
                                </div>
                            </div>
                        </div>

                        {/* Şəkillər */}
                        <div className="dataDiv images multi">
                            <div className="header">
                                <h3>{t("adminPanel.newspaperAdd.sections.images.title")}</h3>
                                <p>{t("adminPanel.newspaperAdd.sections.images.desc")}</p>
                            </div>
                            <div
                                className={`uploadBox ${isDragging ? "dragging" : ""}`}
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                            >
                                <input
                                    type="file"
                                    id="newspaperImages"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImagesChange}
                                    style={{display: "none"}}
                                />
                                <label htmlFor="newspaperImages" className="uploadArea">
                                    <img src={uploadIcon} alt="upload"/>
                                    <p>{t("adminPanel.newspaperAdd.uploadHint")}</p>
                                </label>
                            </div>
                            <div className="uploadedHeader" onClick={() => setImagesOpen((p) => !p)}>
                                <span>{t("adminPanel.newspaperAdd.sections.images.uploadedLength")} ({newspaperImages.length})</span>
                                <img src={imagesOpen ? openIcon : closeIcon} alt="toggle"/>
                            </div>
                            {imagesOpen && newspaperImages.length > 0 && (
                                <div className="uploadedList">
                                    {newspaperImages.map((item, index) => (
                                        <div key={index} className="uploadedItem">
                                            <div className="fileLeft">
                                                <img src={item.preview} alt="preview" className="filePreview"/>
                                                <span>{item.file.name}</span>
                                            </div>
                                            <button onClick={() => removeImage(index)}>✕</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Videolar */}
                        <div className="dataDiv images multi">
                            <div className="header">
                                <h3>{t("adminPanel.newspaperAdd.sections.videos.title", "YouTube Videolar")}</h3>
                                <p>{t("adminPanel.newspaperAdd.sections.videos.desc", "Xəbərə aid YouTube video linklərini əlavə edin")}</p>
                            </div>

                            <div className="video-input-row">
                                <div className="add-input">
                                    <input
                                        placeholder={t("adminPanel.newspaperAdd.placeholders.videoUrl", "https://youtube.com/...")}
                                        value={videoInput}
                                        onChange={(e) => setVideoInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && addVideo()}
                                    />
                                </div>
                                <button type="button" className="video-add-btn" onClick={addVideo}>
                                    {t("adminPanel.newspaperAdd.buttons.addVideo", "Əlavə et")}
                                </button>
                            </div>

                            {videos.length > 0 && (
                                <div className="uploadedList">
                                    {videos.map((url, index) => (
                                        <div key={index} className="uploadedItem">
                                            <div className="fileLeft">
                                                <span className="video-icon">▶</span>
                                                <span>{url}</span>
                                            </div>
                                            <button onClick={() => removeVideo(index)}>✕</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Alt Başlıq */}
                    <div className={'tours-desc'}>
                        <div className={'header'}>
                            <h3>{t("adminPanel.newspaperAdd.sections.subtitle.title")}</h3>
                            <p>{t("adminPanel.newspaperAdd.sections.subtitle.desc")}</p>
                        </div>
                        <div className={'tours-desc-data'}>
                            <div className={'tours-desc-texts'}>
                                <textarea placeholder={t("adminPanel.newspaperAdd.sections.subtitle.placeholders.az")} value={subtitleAz} onChange={(e) => setSubtitleAz(e.target.value)}/>
                                <div className={'langCountry'}><img src={aze} alt=""/></div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea placeholder={t("adminPanel.newspaperAdd.sections.subtitle.placeholders.ru")} value={subtitleRu} onChange={(e) => setSubtitleRu(e.target.value)}/>
                                <div className={'langCountry'}><img src={rus} alt=""/></div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea placeholder={t("adminPanel.newspaperAdd.sections.subtitle.placeholders.en")} value={subtitleEn} onChange={(e) => setSubtitleEn(e.target.value)}/>
                                <div className={'langCountry'}><img src={usa} alt=""/></div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea placeholder={t("adminPanel.newspaperAdd.sections.subtitle.placeholders.de")} value={subtitleAlm} onChange={(e) => setSubtitleAlm(e.target.value)}/>
                                <div className={'langCountry'}><img src={ger} alt=""/></div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea placeholder={t("adminPanel.newspaperAdd.sections.subtitle.placeholders.ar")} value={subtitleArab} onChange={(e) => setSubtitleArab(e.target.value)}/>
                                <div className={'langCountry'}><img src={arb} alt=""/></div>
                            </div>
                        </div>
                    </div>

                    <button className="submitButton" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? t("adminPanel.newspaperAdd.buttons.saving") : t("adminPanel.newspaperAdd.buttons.save")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NewspaperAdd;
