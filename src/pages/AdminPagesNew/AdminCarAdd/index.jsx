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
import {usePostCarMutation} from "../../../services/userApi.jsx";
import showToast from "../../../components/ToastMessage.js";
import {useTranslation} from "react-i18next";

function CarAdd() {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [postCar, {isLoading}] = usePostCarMutation();

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

    const [carImages, setCarImages] = useState([]);
    const [imagesOpen, setImagesOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const [carVideos, setCarVideos] = useState([]);
    const [videoInput, setVideoInput] = useState("");
    const [cardImage, setCardImage] = useState(null);
    const [cardImagePreview, setCardImagePreview] = useState(null);

    const handleImagesChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const withPreview = newFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setCarImages((prev) => [...prev, ...withPreview]);
    };

    const removeImage = (index) => {
        setCarImages((prev) => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[index].preview);
            updated.splice(index, 1);
            return updated;
        });
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

    const handleSubmit = async () => {
        if (!nameAz.trim()) {
            showToast("Ad daxil edin (AZ)", "warning");
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

        carImages.forEach((item) => {
            formData.append("CarImages", item.file);
        });

        carVideos.forEach((url) => {
            formData.append("CarVideos", url);
        });

        try {
            await postCar(formData).unwrap();
            showToast("Avtomobil uğurla əlavə edildi", "success");

            setNameAz(""); setNameEn(""); setNameRu(""); setNameAlm(""); setNameArab("");
            setType(""); setPrice("");
            setDescAz(""); setDescEn(""); setDescRu(""); setDescAlm(""); setDescArab("");
            setCardImage(null); setCardImagePreview(null);
            setCarImages([]);
            setCarVideos([]);
            setVideoInput("");
            navigate('/admin/car');
        } catch (err) {
            console.error("Xəta:", err);
            showToast("Xəta baş verdi", "error");
        }
    };

    return (
        <div id={'Car-add'}>
            <div className={'Car-add'}>
                <div className={"root"}>
                    <h2>
                        <NavLink className="link" to="/admin/car">Avtomobillər</NavLink>
                        <img src={rootIcon} alt=""/>
                        Yeni avtomobil
                    </h2>
                </div>

                <div className={'Car-add-head'}>
                    <h1>Avtomobil əlavə et</h1>
                    <p>Yeni avtomobil məlumatlarını daxil edin</p>
                </div>

                <div className={'Car-add-main'}>

                    {/* Ad + Tip/Qiymət */}
                    <div className={'Car-add-data'}>
                        {/* Ad */}
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>Avtomobilin adı</h3>
                                <p>Avtomobilin adını bütün dillərdə daxil edin</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input placeholder="Ad (AZ)" value={nameAz} onChange={(e) => setNameAz(e.target.value)}/>
                                    </div>
                                    <img src={aze} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input placeholder="Ad (RU)" value={nameRu} onChange={(e) => setNameRu(e.target.value)}/>
                                    </div>
                                    <img src={rus} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input placeholder="Ad (EN)" value={nameEn} onChange={(e) => setNameEn(e.target.value)}/>
                                    </div>
                                    <img src={usa} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input placeholder="Ad (DE)" value={nameAlm} onChange={(e) => setNameAlm(e.target.value)}/>
                                    </div>
                                    <img src={ger} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input placeholder="Ad (AR)" value={nameArab} onChange={(e) => setNameArab(e.target.value)}/>
                                    </div>
                                    <img src={arb} alt=""/>
                                </div>
                            </div>
                        </div>

                        {/* Tip + Qiymət */}
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>Tip və Qiymət</h3>
                                <p>Avtomobilin növünü və qiymətini daxil edin</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className="add-data full">
                                    <div className={'add-input'}>
                                        <input placeholder="Tip (məs: Sedan, SUV, Van...)" value={type} onChange={(e) => setType(e.target.value)}/>
                                    </div>
                                </div>
                                <div className="add-data full">
                                    <div className={'add-input'}>
                                        <input placeholder="Qiymət (məs: 150 AZN/gün)" value={price} onChange={(e) => setPrice(e.target.value)}/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Əsas Şəkil (Card Image) */}
                        <div className="dataDiv images">
                            <div className="header">
                                <h3>Əsas Şəkil (Card Image)</h3>
                                <p>Avtomobilin əsas şəklini yükləyin</p>
                            </div>
                            <div className="uploadBox">
                                <input
                                    type="file"
                                    id="cardImage"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setCardImage(file);
                                            setCardImagePreview(URL.createObjectURL(file));
                                        }
                                    }}
                                    style={{display: "none"}}
                                />
                                <label htmlFor="cardImage" className="uploadArea">
                                    <img src={uploadIcon} alt="upload"/>
                                    <p>Şəkil seçin və ya sürükləyin</p>
                                </label>
                            </div>
                            {cardImagePreview && (
                                <div className="uploadedList">
                                    <div className="uploadedItem">
                                        <div className="fileLeft">
                                            <img src={cardImagePreview} alt="preview" className="filePreview" />
                                            <span>{cardImage.name}</span>
                                        </div>
                                        <button onClick={() => { setCardImage(null); setCardImagePreview(null); }}>✕</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Şəkillər */}
                        <div className="dataDiv images multi">
                            <div className="header">
                                <h3>Şəkillər</h3>
                                <p>Avtomobilin digər şəkillərini yükləyin</p>
                            </div>
                            <div
                                className={`uploadBox ${isDragging ? "dragging" : ""}`}
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                            >
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
                                    <p>Şəkil seçin və ya sürükləyin</p>
                                </label>
                            </div>
                            <div className="uploadedHeader" onClick={() => setImagesOpen((p) => !p)}>
                                <span>Yüklənmiş şəkillər ({carImages.length})</span>
                                <img src={imagesOpen ? openIcon : closeIcon} alt="toggle"/>
                            </div>
                            {imagesOpen && carImages.length > 0 && (
                                <div className="uploadedList">
                                    {carImages.map((item, index) => (
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
                                <h3>Videolar</h3>
                                <p>Video URL-lərini əlavə edin</p>
                            </div>
                            <div className="video-input-row">
                                <div className="add-input">
                                    <input
                                        placeholder="Video URL daxil edin"
                                        value={videoInput}
                                        onChange={(e) => setVideoInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && addVideo()}
                                    />
                                </div>
                                <button type="button" className="video-add-btn" onClick={addVideo}>Əlavə et</button>
                            </div>
                            {carVideos.length > 0 && (
                                <div className="uploadedList">
                                    {carVideos.map((url, index) => (
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
                            <h3>Təsvir</h3>
                            <p>Avtomobilin təsvirini bütün dillərdə daxil edin</p>
                        </div>
                        <div className={'tours-desc-data'}>
                            <div className={'tours-desc-texts'}>
                                <textarea placeholder="Təsvir (AZ)" value={descAz} onChange={(e) => setDescAz(e.target.value)}/>
                                <div className={'langCountry'}><img src={aze} alt=""/></div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea placeholder="Təsvir (RU)" value={descRu} onChange={(e) => setDescRu(e.target.value)}/>
                                <div className={'langCountry'}><img src={rus} alt=""/></div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea placeholder="Təsvir (EN)" value={descEn} onChange={(e) => setDescEn(e.target.value)}/>
                                <div className={'langCountry'}><img src={usa} alt=""/></div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea placeholder="Təsvir (DE)" value={descAlm} onChange={(e) => setDescAlm(e.target.value)}/>
                                <div className={'langCountry'}><img src={ger} alt=""/></div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea placeholder="Təsvir (AR)" value={descArab} onChange={(e) => setDescArab(e.target.value)}/>
                                <div className={'langCountry'}><img src={arb} alt=""/></div>
                            </div>
                        </div>
                    </div>

                    <button className="submitButton" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? "Yüklənir..." : "Yadda saxla"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CarAdd;