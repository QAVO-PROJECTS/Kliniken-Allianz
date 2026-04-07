import './index.scss'
import {NavLink, useNavigate, useParams} from "react-router-dom";
import rootIcon from '/src/assets/rootIcon.svg'
import aze from '/src/assets/azerbaijan.svg'
import rus from '/src/assets/russia.svg'
import usa from '/src/assets/unitedstates.svg'
import ger from '/src/assets/germany.svg'
import arb from '/src/assets/unitedarabemirates.svg'
import uploadIcon from '/src/assets/uploadIcon.svg'
import {useEffect, useState} from "react";
import openIcon from '/src/assets/accordionOpen.svg'
import closeIcon from '/src/assets/accordionClose.svg'
import {useGetNewspaperByIdQuery, usePutNewspaperMutation} from "../../../services/userApi.jsx";
import {NEWSPAPER_IMAGES} from "../../../contants.js";
import showToast from "../../../components/ToastMessage.js";
import {useTranslation} from "react-i18next";

function NewspaperEdit() {
    const {t} = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, refetch } = useGetNewspaperByIdQuery(id);
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

    const [newImages, setNewImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [deleteImages, setDeleteImages] = useState([]);
    const [imagesOpen, setImagesOpen] = useState(false);

    useEffect(() => { refetch(); }, []);

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
            setIsLoaded(true);
        }
    }, [newspaper, isLoaded]);

    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);
        const withPreview = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setNewImages((prev) => [...prev, ...withPreview]);
    };

    const removeNewImage = (index) => {
        setNewImages((prev) => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[index].preview);
            updated.splice(index, 1);
            return updated;
        });
    };

    const removeOldImage = (fileName) => {
        setOldImages((prev) => prev.filter(f => f !== fileName));
        setDeleteImages((prev) => [...prev, fileName]);
    };

    const appendIfChanged = (formData, key, newVal, oldVal) => {
        if (newVal !== oldVal && newVal !== undefined && newVal !== null && newVal !== "") {
            formData.append(key, newVal);
        }
    };

    const handleEdit = async () => {
        if (!newspaper) return;

        const formData = new FormData();
        formData.append("id", newspaper.id);

        appendIfChanged(formData, "Title", titleAz, newspaper.title);
        appendIfChanged(formData, "TitleEng", titleEn, newspaper.titleEng);
        appendIfChanged(formData, "TitleRu", titleRu, newspaper.titleRu);
        appendIfChanged(formData, "TitleAlm", titleAlm, newspaper.titleAlm);
        appendIfChanged(formData, "TitleArab", titleArab, newspaper.titleArab);

        appendIfChanged(formData, "Subtitle", subtitleAz, newspaper.subtitle);
        appendIfChanged(formData, "SubtitleEng", subtitleEn, newspaper.subtitleEng);
        appendIfChanged(formData, "SubtitleRu", subtitleRu, newspaper.subtitleRu);
        appendIfChanged(formData, "SubtitleAlm", subtitleAlm, newspaper.subtitleAlm);
        appendIfChanged(formData, "SubtitleArab", subtitleArab, newspaper.subtitleArab);

        if (newImages.length > 0)
            newImages.forEach(f => formData.append("NewsPaperImages", f.file));

        if (deleteImages.length > 0)
            deleteImages.forEach(f => formData.append("DeleteNewsPaperImages", f));

        try {
            await editNewspaper(formData).unwrap();
            showToast(t("adminPanel.newspaperEdit.toast.success"), "success");
            refetch();
            navigate('/admin/newspaper');
        } catch (err) {
            console.error("Xəta:", err);
            showToast(t("adminPanel.newspaperEdit.toast.error"), "error");
        }
    };

    return (
        <div id={'Newspaper-edit'} className={'Newspaper-edit'}>
            <div className={'Newspaper-edit'}>
                <div className={"root"}>
                    <h2>
                        <NavLink className="link" to="/admin/newspaper">{t("adminPanel.newspaperEdit.breadcrumb.root")}</NavLink>
                        <img src={rootIcon} alt=""/>
                        {t("adminPanel.newspaperEdit.breadcrumb.current")}
                    </h2>
                </div>

                <div className={'Newspaper-edit-head'}>
                    <h1>{t("adminPanel.newspaperEdit.title")}</h1>
                    <p>{t("adminPanel.newspaperEdit.description")}</p>
                </div>

                <div className={'Newspaper-edit-main'}>

                    <div className={'Newspaper-edit-data'}>
                        {/* Başlıq */}
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>{t("adminPanel.newspaperEdit.sections.title.title")}</h3>
                                <p>{t("adminPanel.newspaperEdit.sections.title.desc")}</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input value={titleAz} onChange={(e) => setTitleAz(e.target.value)} placeholder={t("adminPanel.newspaperEdit.sections.title.placeholders.az")}/>
                                    </div>
                                    <img src={aze} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input value={titleRu} onChange={(e) => setTitleRu(e.target.value)} placeholder={t("adminPanel.newspaperEdit.sections.title.placeholders.ru")}/>
                                    </div>
                                    <img src={rus} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} placeholder={t("adminPanel.newspaperEdit.sections.title.placeholders.en")}/>
                                    </div>
                                    <img src={usa} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input value={titleAlm} onChange={(e) => setTitleAlm(e.target.value)} placeholder={t("adminPanel.newspaperEdit.sections.title.placeholders.de")}/>
                                    </div>
                                    <img src={ger} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input value={titleArab} onChange={(e) => setTitleArab(e.target.value)} placeholder={t("adminPanel.newspaperEdit.sections.title.placeholders.ar")}/>
                                    </div>
                                    <img src={arb} alt=""/>
                                </div>
                            </div>
                        </div>

                        {/* Şəkillər */}
                        <div className="dataDiv images multi">
                            <div className="header">
                                <h3>{t("adminPanel.newspaperEdit.sections.images.title")}</h3>
                                <p>{t("adminPanel.newspaperEdit.sections.images.desc")}</p>
                            </div>
                            <div className="uploadBox">
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
                                    <p>{t("adminPanel.newspaperEdit.uploadHint")}</p>
                                </label>
                            </div>
                            <div className="uploadedHeader" onClick={() => setImagesOpen((p) => !p)}>
                                <span>{t("adminPanel.newspaperEdit.sections.images.uploadedLength")} ({oldImages.length + newImages.length})</span>
                                <img src={imagesOpen ? openIcon : closeIcon} alt="toggle"/>
                            </div>
                            {imagesOpen && (
                                <div className="uploadedList">
                                    {oldImages.map((f, i) => (
                                        <div key={`old-${i}`} className="uploadedItem">
                                            <div className="fileLeft">
                                                <img src={`${NEWSPAPER_IMAGES}${f}`} alt="old" className="filePreview"/>
                                                <span>{f}</span>
                                            </div>
                                            <button onClick={() => removeOldImage(f)}>✕</button>
                                        </div>
                                    ))}
                                    {newImages.length > 0 && (
                                        <hr style={{margin: "10px 0", borderTop: "1px dashed #eee"}}/>
                                    )}
                                    {newImages.map((item, index) => (
                                        <div key={`new-${index}`} className="uploadedItem">
                                            <div className="fileLeft">
                                                <img src={item.preview} alt="preview" className="filePreview"/>
                                                <span>{item.file.name}</span>
                                            </div>
                                            <button onClick={() => removeNewImage(index)}>✕</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Alt Başlıq */}
                    <div className={'tours-desc'}>
                        <div className={'header'}>
                            <h3>{t("adminPanel.newspaperEdit.sections.subtitle.title")}</h3>
                            <p>{t("adminPanel.newspaperEdit.sections.subtitle.desc")}</p>
                        </div>
                        <div className={'tours-desc-data'}>
                            <div className={'tours-desc-texts'}>
                                <textarea placeholder={t("adminPanel.newspaperEdit.sections.subtitle.placeholders.az")} value={subtitleAz} onChange={(e) => setSubtitleAz(e.target.value)}/>
                                <div className={'langCountry'}><img src={aze} alt=""/></div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea placeholder={t("adminPanel.newspaperEdit.sections.subtitle.placeholders.ru")} value={subtitleRu} onChange={(e) => setSubtitleRu(e.target.value)}/>
                                <div className={'langCountry'}><img src={rus} alt=""/></div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea placeholder={t("adminPanel.newspaperEdit.sections.subtitle.placeholders.en")} value={subtitleEn} onChange={(e) => setSubtitleEn(e.target.value)}/>
                                <div className={'langCountry'}><img src={usa} alt=""/></div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea placeholder={t("adminPanel.newspaperEdit.sections.subtitle.placeholders.de")} value={subtitleAlm} onChange={(e) => setSubtitleAlm(e.target.value)}/>
                                <div className={'langCountry'}><img src={ger} alt=""/></div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea placeholder={t("adminPanel.newspaperEdit.sections.subtitle.placeholders.ar")} value={subtitleArab} onChange={(e) => setSubtitleArab(e.target.value)}/>
                                <div className={'langCountry'}><img src={arb} alt=""/></div>
                            </div>
                        </div>
                    </div>

                    <button className="submitButton" onClick={handleEdit} disabled={isLoading}>
                        {isLoading ? t("adminPanel.newspaperEdit.buttons.saving") : t("adminPanel.newspaperEdit.buttons.save")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NewspaperEdit;
