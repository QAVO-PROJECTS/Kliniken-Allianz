import './index.scss'
import {NavLink} from "react-router-dom";
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
function ToursAdd() {
    const [activeIcon, setActiveIcon] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setSelectedFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) setSelectedFile(file);
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
    };
    const langs = [aze, rus, usa, ger, arb];
    const [sections, setSections] = useState([
        { id: 1, expanded: true, inputs: Array(5).fill("") },
    ]);

    // 🔹 Input dəyərlərini dəyiş
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

    // 🔹 Yeni bölmə əlavə et (yalnız əvvəlki doludursa)
    const handleAddSection = () => {
        const allFilled = sections[sections.length - 1].inputs.every(
            (x) => x.trim() !== ""
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

    // 🔹 Bölməni bağla/aç
    const toggleSection = (id) => {
        setSections((prev) =>
            prev.map((s) =>
                s.id === id ? { ...s, expanded: !s.expanded } : s
            )
        );
    };

    // 🔹 Bölməni sil
    const handleRemoveSection = (id) => {
        setSections((prev) => prev.filter((s) => s.id !== id));
    };

    const allInputsFilled =
        sections[sections.length - 1].inputs.every((x) => x.trim() !== "");
    return (
        <div id={'tours-add'}>
            <div className={'tours-add'}>
                <div className={"root"}>
                    <h2>
                        <NavLink className="link" to="/admin/tours">Xidmət paketi</NavLink>
                        <img src={rootIcon} alt="" />
                        Yeni xidmət paketi yarat
                    </h2>
                </div>
                <div className={'tours-add-head'}>
                    <h1>Yeni xidmət paketi yarat</h1>
                    <p>Buradan xidmət paketlərini idarə edə və yenilərini yarada bilərsiniz.</p>
                </div>
                <div className={'tours-add-main'}>
                    <div className={'tours-add-data'}>
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>Xidmət paket adı</h3>
                                <p>Xidmətin sistemdə görünəcək adını daxil edin.</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder={'Travmatologiya'}/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={aze} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder={'Travmatologiya'}/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={rus} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder={'Travmatologiya'}/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={usa} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder={'Travmatologiya'}/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={ger} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder={'Travmatologiya'}/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={arb} alt="" />
                                    </div>
                                </div>
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

                            {selectedFile && (
                                <div className="uploadedFile">
                                    <div className="fileInfo">
                                        <img
                                            src={URL.createObjectURL(selectedFile)}
                                            alt="preview"
                                            className="previewImg"
                                        />
                                        <span>{selectedFile.name}</span>
                                    </div>
                                    <button onClick={handleRemoveFile}>✕</button>
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
                                <textarea placeholder={'Təsvir əlavə edin...'}/>
                                <div className={'langCountry'}>
                                    <img src={aze} alt=""/>
                                </div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea  placeholder={'Təsvir əlavə edin...'}/>
                                <div className={'langCountry'}>
                                    <img src={rus} alt=""/>
                                </div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea  placeholder={'Təsvir əlavə edin...'}/>
                                <div className={'langCountry'}>
                                    <img src={usa} alt=""/>
                                </div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea  placeholder={'Təsvir əlavə edin...'}/>
                                <div className={'langCountry'}>
                                    <img src={ger} alt=""/>
                                </div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea  placeholder={'Təsvir əlavə edin...'}/>
                                <div className={'langCountry'}>
                                    <img src={arb} alt=""/>
                                </div>
                            </div>
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

export default ToursAdd;