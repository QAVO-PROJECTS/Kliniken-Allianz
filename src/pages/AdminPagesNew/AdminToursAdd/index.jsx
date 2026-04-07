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
import plusIcon from '/src/assets/plusIcon.svg'
import openIcon from '/src/assets/accordionOpen.svg'
import closeIcon from '/src/assets/accordionClose.svg'
import {usePostToursMutation, useGetAllCarQuery, useGetAllOtelsQuery} from "../../../services/userApi.jsx";
import showToast from "../../../components/ToastMessage.js";
import {useTranslation} from "react-i18next";

function ToursAdd() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [postTour, {isLoading}] = usePostToursMutation();
    
    const {data: getCars} = useGetAllCarQuery();
    const cars = getCars?.data || [];
    
    const {data: getOtels} = useGetAllOtelsQuery();
    const otels = getOtels?.data || [];

    // Form sahələri
    const [nameAz, setNameAz] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [nameRu, setNameRu] = useState("");
    const [nameAlm, setNameAlm] = useState("");
    const [nameArab, setNameArab] = useState("");

    const [descAz, setDescAz] = useState("");
    const [descEn, setDescEn] = useState("");
    const [descRu, setDescRu] = useState("");
    const [descAlm, setDescAlm] = useState("");
    const [descArab, setDescArab] = useState("");

    // Şəkillər və Videolar
    const [selectedFile, setSelectedFile] = useState(null); // CardImage
    const [isDragging, setIsDragging] = useState(false);
    
    const [tourImages, setTourImages] = useState([]);
    const [imagesOpen, setImagesOpen] = useState(false);
    
    // YouTube Video linkləri
    const [tourVideos, setTourVideos] = useState([""]);

    // Əlaqələr (Relations)
    const [selectedCars, setSelectedCars] = useState([]);
    const [selectedOtels, setSelectedOtels] = useState([]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setSelectedFile(file);
    };

    const handleTourImagesChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const withPreview = newFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setTourImages((prev) => [...prev, ...withPreview]);
    };
    
    const handleVideoChange = (index, value) => {
        const updated = [...tourVideos];
        updated[index] = value;
        setTourVideos(updated);
    };

    const addVideoInput = () => {
        if (tourVideos[tourVideos.length - 1].trim() !== "") {
            setTourVideos([...tourVideos, ""]);
        }
    };

    const removeVideoInput = (index) => {
        setTourVideos(tourVideos.filter((_, i) => i !== index));
    };

    const removeCardImage = () => setSelectedFile(null);

    const removeTourImage = (index) => {
        setTourImages((prev) => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[index].preview);
            updated.splice(index, 1);
            return updated;
        });
    };

    
    const toggleCarSelection = (id) => {
        setSelectedCars(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };
    
    const toggleOtelSelection = (id) => {
        setSelectedOtels(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const langs = [aze, rus, usa, ger, arb]; // 5 dilli Təkliflər
    const [sections, setSections] = useState([
        { id: 1, expanded: true, inputs: Array(5).fill("") },
    ]);

    const handleInputChange = (sectionId, index, value) => {
        setSections((prev) =>
            prev.map((s) =>
                s.id === sectionId
                    ? {
                        ...s,
                        inputs: s.inputs.map((v, i) => (i === index ? value : v)),
                    }
                    : s
            )
        );
    };

    const handleAddSection = () => {
        const allFilled = sections[sections.length - 1].inputs.every(
            (x, i) => x.trim() !== "" || i > 2 // Ən azı ilk 3 dil dolu olmalıdır
        );
        if (!allFilled) return;

        const newSection = {
            id: sections.length + 1,
            expanded: true,
            inputs: Array(5).fill(""),
        };

        setSections((prev) =>
            prev.map((s) => ({ ...s, expanded: false })).concat(newSection)
        );
    };

    const toggleSection = (id) => {
        setSections((prev) =>
            prev.map((s) => s.id === id ? { ...s, expanded: !s.expanded } : s)
        );
    };

    const handleRemoveSection = (id) => {
        setSections((prev) => prev.filter((s) => s.id !== id));
    };

    const allInputsFilled = sections[sections.length - 1].inputs.some((x) => x.trim() !== "");

    const handleSubmit = async () => {
        const formData = new FormData();

        formData.append("Name", nameAz);
        formData.append("NameEng", nameEn);
        formData.append("NameRu", nameRu);
        formData.append("NameAlm", nameAlm);
        formData.append("NameArab", nameArab);

        formData.append("Description", descAz);
        formData.append("DescriptionEng", descEn);
        formData.append("DescriptionRu", descRu);
        formData.append("DescriptionAlm", descAlm);
        formData.append("DescriptionArab", descArab);

        if (selectedFile) {
            formData.append("CardImage", selectedFile);
        }
        
        tourImages.forEach(img => formData.append("TourImages", img.file));
        tourVideos.filter(v => v.trim() !== "").forEach(item => formData.append("TourVideos", item));
        
        selectedCars.forEach(id => formData.append("CarTourIds", id));
        selectedOtels.forEach(id => formData.append("otelIds", id));

        const servicesArray = sections.map((section) => ({
            name: section.inputs[0],
            nameRU: section.inputs[1],
            nameEN: section.inputs[2],
            nameAL: section.inputs[3],
            nameAR: section.inputs[4],
        }));

        formData.append("servicesJson", JSON.stringify(servicesArray));

        try {
            await postTour(formData).unwrap();
            showToast(t("adminPanel.toursAdd.toast.success"), "success");
            navigate('/admin/tours');
        } catch (err) {
            console.error("❌ Xəta:", err);
            showToast("Xidmət paketi əlavə edilərkən xəta baş verdi!", "error");
        }
    };


    return (
        <div id={'tours-add'} className={'tours-add'}>
            <div className={'tours-add tours-wrapper'}>
                <div className={"root"}>
                    <h2>
                        <NavLink className="link" to="/admin/tours">{t("adminPanel.toursAdd.breadcrumb.root")}</NavLink>
                        <img src={rootIcon} alt="" />
                        {t("adminPanel.toursAdd.breadcrumb.current")}
                    </h2>
                </div>
                <div className={'tours-add-head'}>
                    <h1>{t("adminPanel.toursAdd.title")}</h1>
                    <p>{t("adminPanel.toursAdd.description")}</p>
                </div>
                <div className={'tours-add-main'}>
                    <div className={'tours-add-data'}>
                        {/* Başlıq (Name) */}
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>{t("adminPanel.toursAdd.sections.name.title")}</h3>
                                <p>{t("adminPanel.toursAdd.sections.name.desc")}</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={nameAz} onChange={(e)=>setNameAz(e.target.value)} placeholder={t(`adminPanel.toursAdd.sections.name.placeholders.az`)} />
                                    </div>
                                    <div className={'langCountry'}><img src={aze} alt="" /></div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={nameRu} onChange={(e)=>setNameRu(e.target.value)} placeholder={t(`adminPanel.toursAdd.sections.name.placeholders.ru`)} />
                                    </div>
                                    <div className={'langCountry'}><img src={rus} alt="" /></div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={nameEn} onChange={(e)=>setNameEn(e.target.value)} placeholder={t(`adminPanel.toursAdd.sections.name.placeholders.en`)} />
                                    </div>
                                    <div className={'langCountry'}><img src={usa} alt="" /></div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={nameAlm} onChange={(e)=>setNameAlm(e.target.value)} placeholder={"Ad (DE)"} />
                                    </div>
                                    <div className={'langCountry'}><img src={ger} alt="" /></div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={nameArab} onChange={(e)=>setNameArab(e.target.value)} placeholder={"Ad (AR)"} />
                                    </div>
                                    <div className={'langCountry'}><img src={arb} alt="" /></div>
                                </div>
                            </div>
                        </div>

                        {/* CardImage */}
                        <div className="dataDiv images">
                            <div className="header">
                                <h3>Cover {t("adminPanel.toursAdd.sections.image.title")} (CardImage)</h3>
                                <p>{t("adminPanel.toursAdd.sections.image.desc")}</p>
                            </div>
                            <div
                                className={`uploadBox ${isDragging ? "dragging" : ""}`}
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={(e) => {
                                    e.preventDefault(); setIsDragging(false);
                                    if(e.dataTransfer.files[0]) setSelectedFile(e.dataTransfer.files[0]);
                                }}
                            >
                                <input type="file" id="cardInput" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
                                <label htmlFor="cardInput" className="uploadArea">
                                    <img src={uploadIcon} alt="upload" />
                                    <p>{t("adminPanel.toursAdd.sections.image.uploadText")}</p>
                                </label>
                            </div>
                            {selectedFile && (
                                <div className="uploadedFile">
                                    <div className="fileInfo">
                                        <img src={URL.createObjectURL(selectedFile)} alt="preview" className="previewImg" />
                                        <span>{selectedFile.name}</span>
                                    </div>
                                    <button onClick={removeCardImage}>✕</button>
                                </div>
                            )}
                        </div>
                        
                        {/* TourImages Qalereyası */}
                         <div className="dataDiv images multi">
                            <div className="header">
                                <h3>Qalereya Şəkilləri (TourImages)</h3>
                                <p>Turun içərisində görünəcək çoxlu şəkillər əlavə edin</p>
                            </div>
                            <div className="uploadBox">
                                <input type="file" id="tourImages" accept="image/*" multiple onChange={handleTourImagesChange} style={{display: "none"}} />
                                <label htmlFor="tourImages" className="uploadArea">
                                    <img src={uploadIcon} alt="upload"/>
                                    <p>Şəkil seçin və ya sürükləyin</p>
                                </label>
                            </div>
                            {tourImages.length > 0 && (
                                <div className="uploadedHeader" onClick={() => setImagesOpen((p) => !p)}>
                                    <span>Yüklənmiş şəkillər ({tourImages.length})</span>
                                    <img src={imagesOpen ? openIcon : closeIcon} alt="toggle"/>
                                </div>
                            )}
                            {imagesOpen && tourImages.length > 0 && (
                                <div className="uploadedList">
                                    {tourImages.map((item, index) => (
                                        <div key={index} className="uploadedItem">
                                            <div className="fileLeft">
                                                <img src={item.preview} alt="preview" className="filePreview"/>
                                                <span>{item.file.name}</span>
                                            </div>
                                            <button onClick={() => removeTourImage(index)}>✕</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* TourVideos (YouTube links) */}
                        <div className="dataDiv inputs">
                           <div className="header">
                                <h3>Videolar (TourVideos)</h3>
                                <p>Tura aid YouTube video linklərini əlavə edin</p>
                            </div>
                            <div className="add-inputs" style={{maxHeight: "200px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px"}}>
                                {tourVideos.map((videoUrl, index) => (
                                    <div key={index} className="add-data" style={{marginBottom: "0", display: "flex", alignItems: "center"}}>
                                        <div className="add-input" style={{flex: 1}}>
                                            <input
                                                value={videoUrl}
                                                onChange={(e) => handleVideoChange(index, e.target.value)}
                                                placeholder="https://youtube.com/..."
                                            />
                                        </div>
                                        {tourVideos.length > 1 && (
                                            <button onClick={() => removeVideoInput(index)} style={{background: "none", border: "none", color: "red", cursor: "pointer", marginLeft: "10px", fontSize: "16px"}}>✕</button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button onClick={addVideoInput} style={{marginTop: "12px", background: "#f0f0f0", border: "1px solid #ddd", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "12px"}}>+ Video linki əlavə et</button>
                        </div>
                        
                        {/* Otellər və Maşınlar (Relations) */}
                        <div className="dataDiv inputs">
                           <div className="header">
                                <h3>Otellər və Avtomobillər (Zəruri deyil)</h3>
                                <p>Bu tura aid olan hotel və maşınları izafi olaraq təyin edə bilərsiniz</p>
                            </div>
                            <div style={{display: "flex", gap: "20px", marginTop: "10px"}}>
                                <div style={{flex: 1, border: "1px solid #eee", padding: "10px", borderRadius: "8px"}}>
                                    <h4 style={{marginBottom: "10px"}}>Otellər ({selectedOtels.length} seçilib)</h4>
                                    <div style={{maxHeight: "150px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "5px"}}>
                                        {otels.map(otel => (
                                            <label key={otel.id} style={{display: "flex", alignItems: "center", gap: "8px", cursor: "pointer"}}>
                                                <input type="checkbox" checked={selectedOtels.includes(otel.id)} onChange={() => toggleOtelSelection(otel.id)} />
                                                {otel.name || otel.title || `Otel ${otel.id}`}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div style={{flex: 1, border: "1px solid #eee", padding: "10px", borderRadius: "8px"}}>
                                    <h4 style={{marginBottom: "10px"}}>Avtomobillər ({selectedCars.length} seçilib)</h4>
                                    <div style={{maxHeight: "150px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "5px"}}>
                                        {cars.map(car => (
                                            <label key={car.id} style={{display: "flex", alignItems: "center", gap: "8px", cursor: "pointer"}}>
                                                <input type="checkbox" checked={selectedCars.includes(car.id)} onChange={() => toggleCarSelection(car.id)} />
                                                {car.name || car.title || `Maşın ${car.id}`}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className={'tours-desc'}>
                        <div className={'header'}>
                            <h3>{t("adminPanel.toursAdd.sections.description.title")}</h3>
                            <p>{t("adminPanel.toursAdd.sections.description.desc")}</p>
                        </div>
                        <div className={'tours-desc-data'}>
                            <div className={'tours-desc-texts'}>
                                <textarea value={descAz} onChange={(e)=>setDescAz(e.target.value)} placeholder={t(`adminPanel.toursAdd.sections.description.placeholders.az`)} />
                                <div className={'langCountry'}><img src={aze} alt=""/></div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea value={descRu} onChange={(e)=>setDescRu(e.target.value)} placeholder={t(`adminPanel.toursAdd.sections.description.placeholders.ru`)} />
                                <div className={'langCountry'}><img src={rus} alt=""/></div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea value={descEn} onChange={(e)=>setDescEn(e.target.value)} placeholder={t(`adminPanel.toursAdd.sections.description.placeholders.en`)} />
                                <div className={'langCountry'}><img src={usa} alt=""/></div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea value={descAlm} onChange={(e)=>setDescAlm(e.target.value)} placeholder={"Məzmun (DE)"}/>
                                <div className={'langCountry'}><img src={ger} alt=""/></div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea value={descArab} onChange={(e)=>setDescArab(e.target.value)} placeholder={"Məzmun (AR)"}/>
                                <div className={'langCountry'}><img src={arb} alt=""/></div>
                            </div>
                        </div>
                    </div>
                    <div className="dataDiv3 inputs">
                        <div className="header">
                            <h3>{t("adminPanel.toursAdd.sections.offers.title")}</h3>
                            <p>{t("adminPanel.toursAdd.sections.offers.desc")}</p>
                        </div>

                        <div className={'offer-scroll'}>
                            {sections.map((section) => (
                                <div key={section.id} className="offer-section">
                                    <div className="offer-header" onClick={() => toggleSection(section.id)}>
                                        <span>{`${t("adminPanel.toursAdd.sections.offers.sectionTitle")}${section.id}`}</span>
                                        <div className="header-actions">
                                            {sections.length > 1 && (
                                                <button
                                                    className="remove-btn"
                                                    onClick={(e) => { e.stopPropagation(); handleRemoveSection(section.id); }}
                                                >✕</button>
                                            )}
                                            <img src={section.expanded ? openIcon : closeIcon}/>
                                        </div>
                                    </div>

                                    {section.expanded && (
                                        <div className="add-inputs">
                                            {langs.map((lang, index) => {
                                                const pl = ["Təklif (AZ)", "Təklif (RU)", "Təklif (EN)", "Təklif (DE)", "Təklif (AR)"][index];
                                                return (
                                                    <div key={index} className="add-data">
                                                        <div className="add-input">
                                                            <input
                                                                placeholder={pl}
                                                                value={section.inputs[index]}
                                                                onChange={(e) => handleInputChange(section.id, index, e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="langCountry"><img src={lang} alt="lang" /></div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button className={`addButton`} onClick={handleAddSection}>
                            <img src={plusIcon} alt="plus" /> {t("adminPanel.toursAdd.sections.offers.addBtn")}
                        </button>
                    </div>
                    
                    <button className="submitButton" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? t("adminPanel.toursAdd.buttons.saving") : t("adminPanel.toursAdd.buttons.save")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ToursAdd;