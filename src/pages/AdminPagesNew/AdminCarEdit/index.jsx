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
import {CAR_IMAGES} from "../../../contants.js";
import showToast from "../../../components/ToastMessage.js";

function CarEdit() {
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

        if (newImages.length > 0)
            newImages.forEach(f => formData.append("CarImages", f.file));

        if (deleteImages.length > 0)
            deleteImages.forEach(f => formData.append("DeleteImageIds", f));

        if (addedVideos.length > 0)
            addedVideos.forEach(url => formData.append("CarVideos", url));

        if (deleteVideos.length > 0)
            deleteVideos.forEach(url => formData.append("DeleteVideoIds", url));

        try {
            await editCar(formData).unwrap();
            showToast("Avtomobil uğurla yeniləndi", "success");
            refetch();
            navigate('/admin/car');
        } catch (err) {
            console.error("Xəta:", err);
            showToast("Xəta baş verdi", "error");
        }
    };

    return (
        <div id={'Car-edit'}>
            <div className={'Car-edit'}>
                <div className={"root"}>
                    <h2>
                        <NavLink className="link" to="/admin/car">Avtomobillər</NavLink>
                        <img src={rootIcon} alt=""/>
                        Avtomobili redaktə et
                    </h2>
                </div>

                <div className={'Car-edit-head'}>
                    <h1>Avtomobili redaktə et</h1>
                    <p>Avtomobil məlumatlarını yeniləyin</p>
                </div>

                <div className={'Car-edit-main'}>

                    <div className={'Car-edit-data'}>
                        {/* Ad */}
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>Avtomobilin adı</h3>
                                <p>Avtomobilin adını bütün dillərdə daxil edin</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input value={nameAz} onChange={(e) => setNameAz(e.target.value)} placeholder="Ad (AZ)"/>
                                    </div>
                                    <img src={aze} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input value={nameRu} onChange={(e) => setNameRu(e.target.value)} placeholder="Ad (RU)"/>
                                    </div>
                                    <img src={rus} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder="Ad (EN)"/>
                                    </div>
                                    <img src={usa} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input value={nameAlm} onChange={(e) => setNameAlm(e.target.value)} placeholder="Ad (DE)"/>
                                    </div>
                                    <img src={ger} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input value={nameArab} onChange={(e) => setNameArab(e.target.value)} placeholder="Ad (AR)"/>
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
                                        <input value={type} onChange={(e) => setType(e.target.value)} placeholder="Tip (məs: Sedan, SUV, Van...)"/>
                                    </div>
                                </div>
                                <div className="add-data full">
                                    <div className={'add-input'}>
                                        <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Qiymət (məs: 150 AZN/gün)"/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Şəkillər */}
                        <div className="dataDiv images multi">
                            <div className="header">
                                <h3>Şəkillər</h3>
                                <p>Yeni şəkil əlavə edin və ya mövcudları silin</p>
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
                                    <p>Şəkil seçin və ya sürükləyin</p>
                                </label>
                            </div>
                            <div className="uploadedHeader" onClick={() => setImagesOpen((p) => !p)}>
                                <span>Şəkillər ({oldImages.length + newImages.length})</span>
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
                                <h3>Videolar</h3>
                                <p>Video URL-lərini əlavə edin və ya silin</p>
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
                            <h3>Təsvir</h3>
                            <p>Avtomobilin təsvirini bütün dillərdə daxil edin</p>
                        </div>
                        <div className={'tours-desc-data'}>
                            <div className={'tours-desc-texts'}>
                                <textarea value={descAz} onChange={(e) => setDescAz(e.target.value)} placeholder="Təsvir (AZ)"/>
                                <div className={'langCountry'}><img src={aze} alt=""/></div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea value={descRu} onChange={(e) => setDescRu(e.target.value)} placeholder="Təsvir (RU)"/>
                                <div className={'langCountry'}><img src={rus} alt=""/></div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea value={descEn} onChange={(e) => setDescEn(e.target.value)} placeholder="Təsvir (EN)"/>
                                <div className={'langCountry'}><img src={usa} alt=""/></div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea value={descAlm} onChange={(e) => setDescAlm(e.target.value)} placeholder="Təsvir (DE)"/>
                                <div className={'langCountry'}><img src={ger} alt=""/></div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea value={descArab} onChange={(e) => setDescArab(e.target.value)} placeholder="Təsvir (AR)"/>
                                <div className={'langCountry'}><img src={arb} alt=""/></div>
                            </div>
                        </div>
                    </div>

                    <button className="submitButton" onClick={handleEdit} disabled={isLoading}>
                        {isLoading ? "Yüklənir..." : "Yadda saxla"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CarEdit;