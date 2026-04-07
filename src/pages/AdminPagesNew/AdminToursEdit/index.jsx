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
import plusIcon from '/src/assets/plusIcon.svg'
import openIcon from '/src/assets/accordionOpen.svg'
import closeIcon from '/src/assets/accordionClose.svg'
import {useGetToursByIdQuery, usePutToursMutation, useGetAllCarQuery, useGetAllOtelsQuery} from "../../../services/userApi.jsx";
import showToast from "../../../components/ToastMessage.js";
import {TOUR_CARD_IMG,TOUR_IMAGES} from "/src/contants.js";
import {useTranslation} from "react-i18next";

function ToursEdit() {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: getToursById, refetch } = useGetToursByIdQuery(id);
    const tour = getToursById?.data;

    const [editTour, { isLoading }] = usePutToursMutation();
    
    // Asılılıqlar
    const {data: getCars} = useGetAllCarQuery();
    const cars = getCars?.data || [];
    
    const {data: getOtels} = useGetAllOtelsQuery();
    const otels = getOtels?.data || [];

    const [isLoaded, setIsLoaded] = useState(false);

    // Formsahələri
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

    // Şəkillər
    const [selectedFile, setSelectedFile] = useState(null); // yeni CardImage
    const [oldImage, setOldImage] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    
    // Qalereya
    const [newTourImages, setNewTourImages] = useState([]);
    const [oldTourImages, setOldTourImages] = useState([]);
    const [deleteTourImageIds, setDeleteTourImageIds] = useState([]);
    const [imagesOpen, setImagesOpen] = useState(false);
    
    // Videolar (YouTube links)
    const [tourVideos, setTourVideos] = useState([]);
    const [videoInput, setVideoInput] = useState("");
    const [addedTourVideos, setAddedTourVideos] = useState([]);
    const [deleteTourVideos, setDeleteTourVideos] = useState([]);
    
    // Əlaqələr
    const [selectedCars, setSelectedCars] = useState([]);
    const [selectedOtels, setSelectedOtels] = useState([]);

    const langs = [aze, rus, usa, ger, arb];
    const [sections, setSections] = useState([
        { id: 1, expanded: true, serviceId: null, inputs: Array(5).fill("") },
    ]);
    const [deletedServiceIds, setDeletedServiceIds] = useState([]);

    useEffect(() => { refetch(); }, []);

    useEffect(() => {
        if (tour && !isLoaded) {
            setNameAz(tour.name || "");
            setNameEn(tour.nameEng || "");
            setNameRu(tour.nameRu || "");
            setNameAlm(tour.nameAlm || "");
            setNameArab(tour.nameArab || "");

            setDescAz(tour.description || "");
            setDescEn(tour.descriptionEng || "");
            setDescRu(tour.descriptionRu || "");
            setDescAlm(tour.descriptionAlm || "");
            setDescArab(tour.descriptionArab || "");

            setOldImage(tour.cardImage ? `${TOUR_CARD_IMG}${tour.cardImage.split("/").pop()}` : null);
            
            // Assuming array of objects or strings
            setOldTourImages(tour.tourImages || []); 
            setTourVideos(tour.tourVideos || []);
            
            // Ids arrays mapped
            setSelectedCars(tour.carTourIds || tour.cars?.map(c => c.id) || []);
            setSelectedOtels(tour.otelIds || tour.otels?.map(o => o.id) || []);

            const mappedServices = tour.services?.map((s, i) => ({
                id: s.id || i + 1,
                expanded: true,
                serviceId: s.id || null,
                inputs: [
                    s.name || "",
                    s.nameRU || "",
                    s.nameEN || "",
                    s.nameAL || "",
                    s.nameAR || "",
                ],
            })) || [];

            setSections(
                mappedServices.length > 0
                    ? mappedServices
                    : [{ id: 1, expanded: true, serviceId: null, inputs: Array(5).fill("") }]
            );

            setIsLoaded(true);
        }
    }, [tour, isLoaded]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setSelectedFile(file);
    };

    const handleTourImagesChange = (e) => {
        const files = Array.from(e.target.files);
        const withPreview = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setNewTourImages((prev) => [...prev, ...withPreview]);
    };
    
    const removeNewTourImage = (index) => {
        setNewTourImages((prev) => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[index].preview);
            updated.splice(index, 1);
            return updated;
        });
    };

    const removeOldTourImage = (image) => {
        setOldTourImages((prev) => prev.filter(img => img !== image));
        setDeleteTourImageIds((prev) => [...prev, image.id || image]);
    };

    const addVideo = () => {
        const trimmed = videoInput.trim();
        if (!trimmed) return;

        setTourVideos((prev) => [...prev, trimmed]);
        setAddedTourVideos((prev) => [...prev, trimmed]);
        setVideoInput("");
    };

    const removeVideo = (index) => {
        const url = tourVideos[index];
        if (addedTourVideos.includes(url)) {
            const findIdx = addedTourVideos.indexOf(url);
            if(findIdx > -1) {
                const newAdded = [...addedTourVideos];
                newAdded.splice(findIdx, 1);
                setAddedTourVideos(newAdded);
            }
        } else {
            setDeleteTourVideos((prev) => [...prev, url.id || url]);
        }
        setTourVideos((prev) => prev.filter((_, i) => i !== index));
    };
    
    const toggleCarSelection = (id) => {
        setSelectedCars(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };
    
    const toggleOtelSelection = (id) => {
        setSelectedOtels(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const handleInputChange = (sectionId, index, value) => {
        setSections((prev) =>
            prev.map((s) => s.id === sectionId ? { ...s, inputs: s.inputs.map((v, i) => (i === index ? value : v)) } : s)
        );
    };

    const handleAddSection = () => {
        const allFilled = sections[sections.length - 1]?.inputs?.some((x) => x.trim() !== "");
        if (!allFilled && sections.length > 0) return;

        const newSection = {
            id: sections.length + 1,
            expanded: true,
            serviceId: null,
            inputs: Array(5).fill(""),
        };
        setSections((prev) => prev.map((s) => ({ ...s, expanded: false })).concat(newSection));
    };

    const toggleSection = (id) => setSections((prev) => prev.map((s) => s.id === id ? { ...s, expanded: !s.expanded } : s));

    const handleRemoveSection = (id) => {
        setSections((prev) => {
            const toRemove = prev.find((s) => s.id === id);
            if (toRemove?.serviceId) setDeletedServiceIds((d) => [...d, toRemove.serviceId]);
            return prev.filter((s) => s.id !== id);
        });
    };

    const appendIfChanged = (formData, key, newVal, oldVal) => {
        if (newVal !== oldVal && newVal !== undefined && newVal !== null && newVal !== "") {
            formData.append(key, newVal);
        }
    };

    const handleSubmit = async () => {
        if (!tour) return;

        const formData = new FormData();
        formData.append("id", id);

        appendIfChanged(formData, "Name", nameAz, tour.name);
        appendIfChanged(formData, "NameEng", nameEn, tour.nameEng);
        appendIfChanged(formData, "NameRu", nameRu, tour.nameRu);
        appendIfChanged(formData, "NameAlm", nameAlm, tour.nameAlm);
        appendIfChanged(formData, "NameArab", nameArab, tour.nameArab);

        appendIfChanged(formData, "Description", descAz, tour.description);
        appendIfChanged(formData, "DescriptionEng", descEn, tour.descriptionEng);
        appendIfChanged(formData, "DescriptionRu", descRu, tour.descriptionRu);
        appendIfChanged(formData, "DescriptionAlm", descAlm, tour.descriptionAlm);
        appendIfChanged(formData, "DescriptionArab", descArab, tour.descriptionArab);

        if (selectedFile) formData.append("CardImage", selectedFile);
        
        newTourImages.forEach(item => formData.append("TourImages", item.file));
        deleteTourImageIds.forEach(delId => formData.append("DeleteTourImageIds", delId));
        
        if (addedTourVideos.length > 0)
            addedTourVideos.forEach(url => formData.append("TourVideos", url));

        if (deleteTourVideos.length > 0)
            deleteTourVideos.forEach(url => formData.append("DeleteTourVideoIds", url));
        
        selectedCars.forEach(cid => formData.append("CarTourIds", cid));
        selectedOtels.forEach(oid => formData.append("otelIds", oid));

        const servicesArray = sections
            .filter(s => s.inputs.some(x => x.trim() !== ""))
            .map((s) => ({
                id: s.serviceId,
                name: s.inputs[0],
                nameRU: s.inputs[1],
                nameEN: s.inputs[2],
                nameAL: s.inputs[3],
                nameAR: s.inputs[4],
            }));
            
        formData.append("servicesJson", JSON.stringify(servicesArray));
        deletedServiceIds.forEach((id) => formData.append("deleteTourServiceIds", id));

        try {
            await editTour(formData).unwrap();
            showToast(t("adminPanel.toursEdit.toast.success"), "success");
            navigate("/admin/tours");
            refetch();
        } catch (err) {
            console.error("❌ Xəta:", err);
            showToast(t("adminPanel.toursEdit.toast.error"), "error");
        }
    };

    return (
        <div id={'tours-edit'} className={'tours-wrapper tours-edit'}>
            <div className={'tours-edit'}>
                <div className={"root"}>
                    <h2>
                        <NavLink className="link" to="/admin/tours"> {t("adminPanel.toursEdit.breadcrumb.root")}</NavLink>
                        <img src={rootIcon} alt="" />
                        {t("adminPanel.toursEdit.breadcrumb.current")}
                    </h2>
                </div>
                <div className={'tours-edit-head'}>
                    <h1>{t("adminPanel.toursEdit.title")}</h1>
                    <p>{t("adminPanel.toursEdit.description")}</p>
                </div>
                <div className={'tours-edit-main'}>
                    <div className={'tours-edit-data'}>
                        {/* Başlıq */}
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>{t("adminPanel.toursEdit.sections.name.title")}</h3>
                                <p>{t("adminPanel.toursEdit.sections.name.desc")}</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={nameAz} onChange={(e) => setNameAz(e.target.value)} placeholder={t(`adminPanel.toursEdit.sections.name.placeholders.az`)} />
                                    </div>
                                    <div className={'langCountry'}><img src={aze} alt="" /></div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={nameRu} onChange={(e) => setNameRu(e.target.value)} placeholder={t(`adminPanel.toursEdit.sections.name.placeholders.ru`)} />
                                    </div>
                                    <div className={'langCountry'}><img src={rus} alt="" /></div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder={t(`adminPanel.toursEdit.sections.name.placeholders.en`)} />
                                    </div>
                                    <div className={'langCountry'}><img src={usa} alt="" /></div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={nameAlm} onChange={(e) => setNameAlm(e.target.value)} placeholder={"Başlıq (DE)"} />
                                    </div>
                                    <div className={'langCountry'}><img src={ger} alt="" /></div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={nameArab} onChange={(e) => setNameArab(e.target.value)} placeholder={"Başlıq (AR)"} />
                                    </div>
                                    <div className={'langCountry'}><img src={arb} alt="" /></div>
                                </div>
                            </div>
                        </div>

                        {/* CardImage */}
                        <div className="dataDiv images">
                            <div className="header">
                                <h3>{t("adminPanel.toursEdit.sections.image.title")} (CardImage)</h3>
                                <p>{t("adminPanel.toursEdit.sections.image.desc")}</p>
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
                                    <p>{t("adminPanel.toursEdit.sections.image.uploadText")}</p>
                                </label>
                            </div>
                            {!selectedFile && oldImage && (
                                <div className="uploadedFile">
                                    <div className="fileInfo">
                                        <img src={oldImage} alt="old" className="previewImg" />
                                        <span>{t("adminPanel.toursEdit.sections.image.oldImage")}</span>
                                    </div>
                                </div>
                            )}
                            {selectedFile && (
                                <div className="uploadedFile">
                                    <div className="fileInfo">
                                        <img src={URL.createObjectURL(selectedFile)} alt="preview" className="previewImg" />
                                        <span>{selectedFile.name}</span>
                                    </div>
                                    <button onClick={() => setSelectedFile(null)}>✕</button>
                                </div>
                            )}
                        </div>
                        
                        {/* TourImages */}
                        <div className="dataDiv images multi">
                            <div className="header">
                                <h3>Qalereya Şəkilləri (TourImages)</h3>
                                <p>Tura aid şəkilləri əlavə edin / mövcudları silin</p>
                            </div>
                            <div className="uploadBox">
                                <input type="file" id="tourImages" accept="image/*" multiple onChange={handleTourImagesChange} style={{display: "none"}} />
                                <label htmlFor="tourImages" className="uploadArea">
                                    <img src={uploadIcon} alt="upload"/>
                                    <p>Şəkilləri seçin və ya bura sürüşdürün</p>
                                </label>
                            </div>
                            <div className="uploadedHeader" onClick={() => setImagesOpen(p => !p)}>
                                <span>Şəkillər ({oldTourImages?.length + newTourImages?.length})</span>
                                <img src={imagesOpen ? openIcon : closeIcon} alt="toggle"/>
                            </div>
                            {imagesOpen && (
                                <div className="uploadedList">
                                    {oldTourImages.map((img, i) => (
                                        <div key={`old-${i}`} className="uploadedItem">
                                            <div className="fileLeft">
                                                <img src={img.url ? TOUR_IMAGES+img.url : TOUR_IMAGES+img} alt="old" className="filePreview"/>
                                                <span style={{maxWidth: '120px', overflow: 'hidden'}}>{img.name || img}</span>
                                            </div>
                                            <button onClick={() => removeOldTourImage(img)}>✕</button>
                                        </div>
                                    ))}
                                    {newTourImages.length > 0 && <hr style={{margin: "10px 0", borderTop: "1px dashed #eee"}}/>}
                                    {newTourImages.map((item, index) => (
                                        <div key={`new-${index}`} className="uploadedItem">
                                            <div className="fileLeft">
                                                <img src={item.preview} alt="preview" className="filePreview"/>
                                                <span style={{maxWidth: '120px', overflow: 'hidden'}}>{item.file.name}</span>
                                            </div>
                                            <button onClick={() => removeNewTourImage(index)}>✕</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* TourVideos */}
                        <div className="dataDiv images multi">
                            <div className="header">
                                <h3>Videolar (TourVideos)</h3>
                                <p>Tura aid YouTube video linklərini əlavə edin / silin</p>
                            </div>

                            <div className="video-input-row" style={{display: "flex", gap: "8px", alignItems: "center", marginTop: "8px"}}>
                                <div className="add-input" style={{flex: 1}}>
                                    <input
                                        placeholder="https://youtube.com/..."
                                        value={videoInput}
                                        onChange={(e) => setVideoInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && addVideo()}
                                        style={{width: "100%", height: "36px", border: "0.5px solid #b7b7b7", borderRadius: "5px", padding: "0 10px", fontSize: "12px", outline: "none"}}
                                    />
                                </div>
                                <button type="button" className="video-add-btn" onClick={addVideo} style={{height: "36px", padding: "0 16px", background: "#0a4080", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer"}}>
                                    Əlavə et
                                </button>
                            </div>

                            {tourVideos.length > 0 && (
                                <div className="uploadedList" style={{marginTop: "12px", maxHeight: "150px"}}>
                                    {tourVideos.map((url, index) => (
                                        <div key={index} className="uploadedItem">
                                            <div className="fileLeft">
                                                <span className="video-icon" style={{color: "red", marginRight: "6px"}}>▶</span>
                                                <span style={{maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis"}}>{url.url || url}</span>
                                            </div>
                                            <button onClick={() => removeVideo(index)}>✕</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Oteller ve Masinlar */}
                        <div className="dataDiv inputs">
                           <div className="header">
                                <h3>Otellər və Avtomobillər (Zəruri deyil)</h3>
                                <p>Bu tura aid olan hotel və maşınları əlaqələndirin</p>
                            </div>
                            <div style={{display: "flex", gap: "20px", marginTop: "10px"}}>
                                <div style={{flex: 1, border: "1px solid #eee", padding: "10px", borderRadius: "8px"}}>
                                    <h4 style={{marginBottom: "10px"}}>Otellər ({selectedOtels?.length} seçilib)</h4>
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
                                    <h4 style={{marginBottom: "10px"}}>Avtomobillər ({selectedCars?.length} seçilib)</h4>
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
                    
                    {/* Alt Başlıq / Təsvir */}
                    <div className={'tours-desc'}>
                        <div className={'header'}>
                            <h3>{t("adminPanel.toursEdit.sections.description.title")}</h3>
                            <p>{t("adminPanel.toursEdit.sections.description.desc")}</p>
                        </div>
                        <div className={'tours-desc-data'}>
                            <div className={'tours-desc-texts'}>
                                <textarea value={descAz} onChange={(e) => setDescAz(e.target.value)}  placeholder={t(`adminPanel.toursEdit.sections.description.placeholders.az`)} />
                                <div className={'langCountry'}><img src={aze} alt="" /></div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea value={descRu} onChange={(e) => setDescRu(e.target.value)}  placeholder={t(`adminPanel.toursEdit.sections.description.placeholders.ru`)} />
                                <div className={'langCountry'}><img src={rus} alt="" /></div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea value={descEn} onChange={(e) => setDescEn(e.target.value)}  placeholder={t(`adminPanel.toursEdit.sections.description.placeholders.en`)} />
                                <div className={'langCountry'}><img src={usa} alt="" /></div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea value={descAlm} onChange={(e) => setDescAlm(e.target.value)}  placeholder={"Məzmun (DE)"} />
                                <div className={'langCountry'}><img src={ger} alt="" /></div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea value={descArab} onChange={(e) => setDescArab(e.target.value)}  placeholder={"Məzmun (AR)"} />
                                <div className={'langCountry'}><img src={arb} alt="" /></div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Təkliflər */}
                    <div className="dataDiv3 inputs">
                        <div className="header">
                            <h3>{t("adminPanel.toursEdit.sections.offers.title")}</h3>
                            <p>{t("adminPanel.toursEdit.sections.offers.desc")}</p>
                        </div>

                        <div className={'offer-scroll'}>
                            {sections.map((section) => (
                                <div key={section.id} className="offer-section">
                                    <div className="offer-header" onClick={() => toggleSection(section.id)}>
                                        <span>{`${t("adminPanel.toursEdit.sections.offers.sectionTitle")}${section.id}`}</span>
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
                            <img src={plusIcon} alt="plus" /> {t("adminPanel.toursEdit.sections.offers.addBtn")}
                        </button>
                    </div>
                    
                    <button className="submitButton" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? t("adminPanel.toursEdit.buttons.saving") : t("adminPanel.toursEdit.buttons.save")}
                    </button>

                </div>
            </div>
        </div>
    );
}

export default ToursEdit;