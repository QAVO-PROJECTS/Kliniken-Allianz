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
import {useGetToursByIdQuery, usePutToursMutation} from "../../../services/userApi.jsx";
import showToast from "../../../components/ToastMessage.js";
import {TOUR_CARD_IMG} from "../../../contants.js";
function ToursEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: getToursById, refetch } = useGetToursByIdQuery(id);
    const tour = getToursById?.data;

    const [editTour, { isLoading }] = usePutToursMutation();

    // 🔹 State-lər
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const [nameAz, setNameAz] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [nameRu, setNameRu] = useState("");
    const [descAz, setDescAz] = useState("");
    const [descEn, setDescEn] = useState("");
    const [descRu, setDescRu] = useState("");

    const [sections, setSections] = useState([
        { id: 1, expanded: true, inputs: Array(3).fill("") },
    ]);

    const langs = [aze, rus, usa];

    // 🔹 Data gələndə formu doldur
    useEffect(() => {
        if (tour) {
            setNameAz(tour.name || "");
            setNameEn(tour.nameEng || "");
            setNameRu(tour.nameRu || "");
            setDescAz(tour.description || "");
            setDescEn(tour.descriptionEng || "");
            setDescRu(tour.descriptionRu || "");

            if (tour.services?.length) {
                const newSections = tour.services.map((s, i) => ({
                    id: i + 1,
                    expanded: true,
                    inputs: [
                        s.name || "",
                        s.nameRU || "",
                        s.nameEN || "",
                    ],
                }));
                setSections(newSections);
            }
        }
    }, [tour]);

    // 🔹 File funksiyaları
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setSelectedFile(file);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = () => setIsDragging(false);
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) setSelectedFile(file);
    };
    const handleRemoveFile = () => setSelectedFile(null);

    // 🔹 Təklifləri idarə et
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
            (x) => x.trim() !== ""
        );
        if (!allFilled) return;

        const newSection = {
            id: sections.length + 1,
            expanded: true,
            inputs: Array(3).fill(""),
        };

        setSections((prev) =>
            prev.map((s) => ({ ...s, expanded: false })).concat(newSection)
        );
    };

    const toggleSection = (id) => {
        setSections((prev) =>
            prev.map((s) =>
                s.id === id ? { ...s, expanded: !s.expanded } : s
            )
        );
    };

    const handleRemoveSection = (id) => {
        setSections((prev) => prev.filter((s) => s.id !== id));
    };

    const allInputsFilled = sections[sections.length - 1].inputs.every(
        (x) => x.trim() !== ""
    );

    // 🔹 PUT request
    const handleSubmit = async () => {
        const formData = new FormData();

        formData.append("id", id);
        formData.append("name", nameAz);
        formData.append("nameEng", nameEn);
        formData.append("nameRu", nameRu);
        formData.append("description", descAz);
        formData.append("descriptionEng", descEn);
        formData.append("descriptionRu", descRu);

        if (selectedFile) {
            formData.append("cardImage", selectedFile);
        }

        const servicesArray = sections.map((s) => ({
            name: s.inputs[0],
            nameRU: s.inputs[1],
            nameEN: s.inputs[2],
        }));

        formData.append("servicesJson", JSON.stringify(servicesArray));

        try {
            await editTour(formData).unwrap();
            showToast("✅ Xidmət paketi uğurla yeniləndi!", "success");
            navigate("/admin/tours");
            refetch();
        } catch (err) {
            console.error("❌ Xəta:", err);
            showToast("Xidmət paketi yenilənərkən xəta baş verdi!", "error");
        }
    };
    return (
        <div id={'tours-edit'}>
            <div className={'tours-edit'}>
                <div className={"root"}>
                    <h2>
                        <NavLink className="link" to="/admin/tours">Xidmət paketi</NavLink>
                        <img src={rootIcon} alt="" />
                        Xidmət paketinə düzəliş edin
                    </h2>
                </div>
                <div className={'tours-edit-head'}>
                    <h1>Xidmət paketinə düzəliş edin</h1>
                    <p>Buradan xidmət paketlərini idarə edə və düzəliş edə bilərsiniz.</p>
                </div>
                <div className={'tours-edit-main'}>
                    <div className={'tours-edit-data'}>
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>Xidmət paket adı</h3>
                                <p>Xidmətin sistemdə görünəcək adını daxil edin.</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={nameAz} onChange={(e) => setNameAz(e.target.value)} placeholder="Ad (AZ)" />
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={aze} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={nameRu} onChange={(e) => setNameRu(e.target.value)} placeholder="Ad (RU)" />
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={rus} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder="Ad (EN)" />
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={usa} alt="" />
                                    </div>
                                </div>
                                {/*<div className={'add-data'}>*/}
                                {/*    <div className={'add-input'}>*/}
                                {/*        <input placeholder={'Travmatologiya'}/>*/}
                                {/*    </div>*/}
                                {/*    <div className={'langCountry'}>*/}
                                {/*        <img src={ger} alt="" />*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                {/*<div className={'add-data'}>*/}
                                {/*    <div className={'add-input'}>*/}
                                {/*        <input placeholder={'Travmatologiya'}/>*/}
                                {/*    </div>*/}
                                {/*    <div className={'langCountry'}>*/}
                                {/*        <img src={arb} alt="" />*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                            </div>
                        </div>
                        <div className="dataDiv images">
                            <div className="header">
                                <h3>Xidmət şəkil</h3>
                                <p>Paketin sistemdə görünəcək şəklini yükləyin.</p>
                            </div>

                            <div
                                className={`uploadBox ${isDragging ? "dragging" : ""}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <input
                                    type="file"
                                    id="fileInput"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: "none" }}
                                />
                                <label htmlFor="fileInput" className="uploadArea">
                                    <img src={uploadIcon} alt="upload" />
                                    <p>
                                        Faylı yükləmək üçün bu sahəyə klikləyin <br /> və ya sürükləyin
                                    </p>
                                </label>
                            </div>

                            {(selectedFile || tour?.cardImage) && (
                                <div className="uploadedFile">
                                    <div className="fileInfo">
                                        <img
                                            src={
                                                selectedFile
                                                    ? URL.createObjectURL(selectedFile)

                                                        : `${TOUR_CARD_IMG}${tour.cardImage}`
                                            }
                                            alt="preview"
                                            className="previewImg"
                                            onError={(e) => { e.target.src = "/fallback-image.png"; }} // şəkil tapılmazsa fallback
                                        />
                                    </div>
                                    {selectedFile && <button onClick={handleRemoveFile}>✕</button>}
                                </div>
                            )}

                        </div>


                    </div>
                    <div className={'tours-desc'}>
                        <div className={'header'}>
                            <h3>Təsvir</h3>
                            <p>Paketin qısa təsvirini yazın.</p>
                        </div>
                        <div className={'tours-desc-data'}>
                            <div className={'tours-desc-texts'}>
                                <textarea value={descAz} onChange={(e) => setDescAz(e.target.value)} placeholder="Təsvir (AZ)" />
                                <div className={'langCountry'}>
                                    <img src={aze} alt="" />
                                </div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea value={descRu} onChange={(e) => setDescRu(e.target.value)} placeholder="Təsvir (RU)" />
                                <div className={'langCountry'}>
                                    <img src={rus} alt="" />
                                </div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea value={descEn} onChange={(e) => setDescEn(e.target.value)} placeholder="Təsvir (EN)" />
                                <div className={'langCountry'}>
                                    <img src={usa} alt="" />
                                </div>
                            </div>
                            {/*<div className={'tours-desc-texts'}>*/}
                            {/*    <textarea  placeholder={'Təsvir əlavə edin...'}/>*/}
                            {/*    <div className={'langCountry'}>*/}
                            {/*        <img src={ger} alt=""/>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                            {/*<div className={'tours-desc-texts'}>*/}
                            {/*    <textarea  placeholder={'Təsvir əlavə edin...'}/>*/}
                            {/*    <div className={'langCountry'}>*/}
                            {/*        <img src={arb} alt=""/>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                    <div className="dataDiv3 inputs">
                        <div className="header">
                            <h3>Təklif</h3>
                            <p>Paketə daxil olan təklifləri daxil edin.</p>
                        </div>

                        <div className={'offer-scroll'}>
                            {sections.map((section) => (
                                <div key={section.id} className="offer-section">
                                    <div className="offer-header" onClick={() => toggleSection(section.id)}>
                                        <span>Təklif #{section.id}</span>
                                        <div className="header-actions">
                                            {sections.length > 1 && (
                                                <button
                                                    className="remove-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveSection(section.id);
                                                    }}
                                                >
                                                    ✕
                                                </button>
                                            )}
                                            <img src={section.expanded ? openIcon : closeIcon}/>
                                        </div>
                                    </div>

                                    {section.expanded && (
                                        <div className="add-inputs">
                                            {langs.map((lang, index) => (
                                                <div key={index} className="add-data">
                                                    <div className="add-input">
                                                        <input
                                                            placeholder="Travmatologiya"
                                                            value={section.inputs[index]}
                                                            onChange={(e) =>
                                                                handleInputChange(section.id, index, e.target.value)
                                                            }
                                                        />
                                                    </div>
                                                    <div className="langCountry">
                                                        <img src={lang} alt="lang" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* 🔹 Əlavə et düyməsi */}
                        <button
                            className={`addButton ${!allInputsFilled ? "disabled" : ""}`}
                            onClick={handleAddSection}
                            disabled={!allInputsFilled}
                        >
                            <img src={plusIcon} alt="plus" /> Əlavə et
                        </button>
                    </div>
                    <button className={'submitButton'}>Yadda saxla</button>
                </div>
            </div>
        </div>
    );
}

export default ToursEdit;