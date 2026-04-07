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
import {useGetCarByIdQuery, usePutCarMutation} from "../../../services/userApi.jsx";
import {CAR_CARD_IMAGES, CAR_IMAGES} from "../../../contants.js";
import showToast from "../../../components/ToastMessage.js";
import {useTranslation} from "react-i18next";

function CarEdit() {
    const {t} = useTranslation();
    const {id} = useParams();
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);
    const [editCar, {isLoading}] = usePutCarMutation();
    const {data: getCarById, refetch} = useGetCarByIdQuery(id);
    const car = getCarById?.data;

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

    const [newImages, setNewImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [deleteImages, setDeleteImages] = useState([]);
    const [imagesOpen, setImagesOpen] = useState(false);

    const [newCardImage, setNewCardImage] = useState(null);
    const [oldCardImage, setOldCardImage] = useState(null);
    const [cardImagePreview, setCardImagePreview] = useState(null);

    const [videos, setVideos] = useState([]);
    const [videoInput, setVideoInput] = useState("");
    const [addedVideos, setAddedVideos] = useState([]);
    const [deleteVideos, setDeleteVideos] = useState([]);

    useEffect(() => { refetch(); }, []);

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
            setAddedVideos((prev) => prev.filter(v => v !== url));
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

    const handleEdit = async () => {
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

        if (newImages.length > 0)
            newImages.forEach(f => formData.append("CarImages", f.file));

        if (deleteImages.length > 0)
            deleteImages.forEach(f => formData.append("DeleteCarImages", f));

        if (addedVideos.length > 0)
            addedVideos.forEach(url => formData.append("CarVideos", url));

        if (deleteVideos.length > 0)
            deleteVideos.forEach(url => formData.append("DeleteCarVideos", url));

        try {
            await editCar(formData).unwrap();
            showToast(t("adminPanel.carEdit.toast.success"), "success");
            refetch();
            navigate('/admin/car');
        } catch (err) {
            console.error("Xəta:", err);
            showToast(t("adminPanel.carEdit.toast.error"), "error");
        }
    };

    return (
        <div id={'Car-edit'}>
            <div className={'Car-edit'}>
                <div className={"root"}>
                    <h2>
                        <NavLink className="link" to="/admin/car">{t("adminPanel.carEdit.breadcrumb.root")}</NavLink>
                        <img src={rootIcon} alt=""/>
                        {t("adminPanel.carEdit.breadcrumb.current")}
                    </h2>
                </div>

                <div className={'Car-edit-head'}>
                    <h1>{t("adminPanel.carEdit.title")}</h1>
                    <p>{t("adminPanel.carEdit.description")}</p>
                </div>

                <div className={'Car-edit-main'}>

                    <div className={'Car-edit-data'}>
                        {/* Ad */}
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>{t("adminPanel.carEdit.sections.name.title")}</h3>
                                <p>{t("adminPanel.carEdit.sections.name.desc")}</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input value={nameAz} onChange={(e) => setNameAz(e.target.value)} placeholder={t("adminPanel.carEdit.sections.name.placeholders.az")}/>
                                    </div>
                                    <img src={aze} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input value={nameRu} onChange={(e) => setNameRu(e.target.value)} placeholder={t("adminPanel.carEdit.sections.name.placeholders.ru")}/>
                                    </div>
                                    <img src={rus} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder={t("adminPanel.carEdit.sections.name.placeholders.en")}/>
                                    </div>
                                    <img src={usa} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input value={nameAlm} onChange={(e) => setNameAlm(e.target.value)} placeholder={t("adminPanel.carEdit.sections.name.placeholders.de")}/>
                                    </div>
                                    <img src={ger} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input value={nameArab} onChange={(e) => setNameArab(e.target.value)} placeholder={t("adminPanel.carEdit.sections.name.placeholders.ar")}/>
                                    </div>
                                    <img src={arb} alt=""/>
                                </div>
                            </div>
                        </div>

                        {/* Tip + Qiymət */}
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>{t("adminPanel.carEdit.sections.typePrice.title")}</h3>
                                <p>{t("adminPanel.carEdit.sections.typePrice.desc")}</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className="add-data full">
                                    <div className={'add-input'}>
                                        <input value={type} onChange={(e) => setType(e.target.value)} placeholder={t("adminPanel.carEdit.sections.typePrice.placeholders.type")}/>
                                    </div>
                                </div>
                                <div className="add-data full">
                                    <div className={'add-input'}>
                                        <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder={t("adminPanel.carEdit.sections.typePrice.placeholders.price")}/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Əsas Şəkil (Card Image) */}
                        <div className="dataDiv images">
                            <div className="header">
                                <h3>{t("adminPanel.carEdit.sections.cardImage.title")}</h3>
                                <p>{t("adminPanel.carEdit.sections.cardImage.desc")}</p>
                            </div>
                            <div className="uploadBox">
                                <input
                                    type="file"
                                    id="cardImage"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setNewCardImage(file);
                                            setCardImagePreview(URL.createObjectURL(file));
                                            setOldCardImage(null);
                                        }
                                    }}
                                    style={{display: "none"}}
                                />
                                <label htmlFor="cardImage" className="uploadArea">
                                    <img src={uploadIcon} alt="upload"/>
                                    <p>{t("adminPanel.carEdit.uploadHint")}</p>
                                </label>
                            </div>
                            {(cardImagePreview || oldCardImage) && (
                                <div className="uploadedList">
                                    <div className="uploadedItem">
                                        <div className="fileLeft">
                                            <img src={cardImagePreview ? cardImagePreview : `${CAR_CARD_IMAGES}${oldCardImage}`} alt="preview" className="filePreview" />
                                            <span>{newCardImage ? newCardImage.name : oldCardImage}</span>
                                        </div>
                                        <button onClick={() => { 
                                            setNewCardImage(null); 
                                            setCardImagePreview(null); 
                                            setOldCardImage(null); 
                                        }}>✕</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Şəkillər */}
                        <div className="dataDiv images multi">
                            <div className="header">
                                <h3>{t("adminPanel.carEdit.sections.images.title")}</h3>
                                <p>{t("adminPanel.carEdit.sections.images.desc")}</p>
                            </div>
                            <div className="uploadBox">
                                <input
                                    type="file"
                                    id="carImages"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImagesChange}
                                    style={{display: "none"}}
                                />
                                <label htmlFor="carImages" className="uploadArea">
                                    <img src={uploadIcon} alt="upload"/>
                                    <p>{t("adminPanel.carEdit.uploadHint")}</p>
                                </label>
                            </div>
                            <div className="uploadedHeader" onClick={() => setImagesOpen((p) => !p)}>
                                <span>{t("adminPanel.carEdit.sections.images.uploadedLength")} ({oldImages.length + newImages.length})</span>
                                <img src={imagesOpen ? openIcon : closeIcon} alt="toggle"/>
                            </div>
                            {imagesOpen && (
                                <div className="uploadedList">
                                    {oldImages.map((f, i) => (
                                        <div key={`old-${i}`} className="uploadedItem">
                                            <div className="fileLeft">
                                                <img src={`${CAR_IMAGES}${f}`} alt="old" className="filePreview"/>
                                                <span>{f}</span>
                                            </div>
                                            <button onClick={() => removeOldImage(f)}>✕</button>
                                        </div>
                                    ))}
                                    {newImages.length > 0 && (
                                        <>
                                            <p style={{padding: '4px 12px', fontSize: '11px', color: '#999', margin: 0}}>Yeni şəkillər</p>
                                            {newImages.map((item, i) => (
                                                <div key={`new-${i}`} className="uploadedItem">
                                                    <div className="fileLeft">
                                                        <img src={item.preview} alt="preview" className="filePreview"/>
                                                        <span>{item.file.name}</span>
                                                    </div>
                                                    <button onClick={() => removeNewImage(i)}>✕</button>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Videolar */}
                        <div className="dataDiv images multi">
                            <div className="header">
                                <h3>{t("adminPanel.carEdit.sections.videos.title")}</h3>
                                <p>{t("adminPanel.carEdit.sections.videos.desc")}</p>
                            </div>
                            <div className="video-input-row">
                                <div className="add-input">
                                    <input
                                        placeholder={t("adminPanel.carEdit.sections.videos.placeholder")}
                                        value={videoInput}
                                        onChange={(e) => setVideoInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && addVideo()}
                                    />
                                </div>
                                <button type="button" className="video-add-btn" onClick={addVideo}>{t("adminPanel.carEdit.sections.videos.addBtn")}</button>
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

                    {/* Təsvir */}
                    <div className={'tours-desc'}>
                        <div className={'header'}>
                            <h3>{t("adminPanel.carEdit.sections.description.title")}</h3>
                            <p>{t("adminPanel.carEdit.sections.description.desc")}</p>
                        </div>
                        <div className={'tours-desc-data'}>
                            <div className={'tours-desc-texts'}>
                                <textarea value={descAz} onChange={(e) => setDescAz(e.target.value)} placeholder={t("adminPanel.carEdit.sections.description.placeholders.az")}/>
                                <div className={'langCountry'}><img src={aze} alt=""/></div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea value={descRu} onChange={(e) => setDescRu(e.target.value)} placeholder={t("adminPanel.carEdit.sections.description.placeholders.ru")}/>
                                <div className={'langCountry'}><img src={rus} alt=""/></div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea value={descEn} onChange={(e) => setDescEn(e.target.value)} placeholder={t("adminPanel.carEdit.sections.description.placeholders.en")}/>
                                <div className={'langCountry'}><img src={usa} alt=""/></div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea value={descAlm} onChange={(e) => setDescAlm(e.target.value)} placeholder={t("adminPanel.carEdit.sections.description.placeholders.de")}/>
                                <div className={'langCountry'}><img src={ger} alt=""/></div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea value={descArab} onChange={(e) => setDescArab(e.target.value)} placeholder={t("adminPanel.carEdit.sections.description.placeholders.ar")}/>
                                <div className={'langCountry'}><img src={arb} alt=""/></div>
                            </div>
                        </div>
                    </div>

                    <button className="submitButton" onClick={handleEdit} disabled={isLoading}>
                        {isLoading ? t("adminPanel.carEdit.buttons.saving") : t("adminPanel.carEdit.buttons.save")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CarEdit;