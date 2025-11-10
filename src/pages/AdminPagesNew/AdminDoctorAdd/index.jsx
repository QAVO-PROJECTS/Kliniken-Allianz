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
import starEmpty from "../../../assets/doluUlduz.svg";
import starFilled from "../../../assets/bosUlduz.svg";
import plusIcon from "../../../assets/plusIcon.svg";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {useGetAllClinicQuery, usePostDoctorsMutation} from "../../../services/userApi.jsx";
import showToast from "../../../components/ToastMessage.js";

function DoctorAdd() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [activeIcon, setActiveIcon] = useState([]);
    const navigate = useNavigate()
    const {data:getAllClinic} = useGetAllClinicQuery()
    const clinic = getAllClinic?.data
    const [postDoctor, {isLoading}] = usePostDoctorsMutation();
    const [nameAz, setNameAz] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [nameRu, setNameRu] = useState("");

    const [surNameAz, setSurNameAz] = useState("");
    const [surNameEn, setSurNameEn] = useState("");
    const [surNameRu, setSurNameRu] = useState("");

    const [roleAz, setRoleAz] = useState("");
    const [roleEn, setRoleEn] = useState("");
    const [roleRu, setRoleRu] = useState("");


    const [experience, setExperience] = useState("");
    // 🔹 Ayrı state-lər
    const [sertifikatFiles, setSertifikatFiles] = useState([]);
    const [sertifikatOpen, setSertifikatOpen] = useState(false);

    const [rating, setRating] = useState(null); // yalnız bir reytinq seçilə bilər

    // 🔹 Sertifikat yükləmə funksiyası
    const handleSertifikatChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const withPreview = newFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setSertifikatFiles((prev) => [...prev, ...withPreview]);
    };



    // 🔹 Silmə funksiyaları
    const removeSertifikat = (index) => {
        setSertifikatFiles((prev) => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[index].preview);
            updated.splice(index, 1);
            return updated;
        });
    };


    const ratings = [5, 4, 3, 2, 1];

    const langs = [aze, rus, usa];
    const [sections, setSections] = useState([
        { id: 1, expanded: true, inputs: Array(3).fill("") },
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
            inputs: Array(3).fill(""),
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
    const handleSubmit = async () => {
        console.log('ss')
        try {
            const formData = new FormData();

            formData.append("name", nameAz);
            formData.append("nameEng", nameEn);
            formData.append("nameRu", nameRu);

            formData.append("surName", surNameAz);
            formData.append("surNameEng", surNameEn);
            formData.append("surNameRu", surNameRu);

            formData.append("role", roleAz);
            formData.append("roleEng", roleEn);
            formData.append("roleRu", roleRu);

            formData.append("rate", rating ?? 0);
            formData.append("experience", experience || "0");

            // Bio-ları JSON kimi yığırıq
            const bioObjects = sections.map((s) => ({
                name: s.inputs[0] || "",
                nameEng: s.inputs[1] || "",
                nameRu: s.inputs[2] || "",
                nameAlm: null,
                nameArab: null,
            }));
            formData.append("biosJson", JSON.stringify(bioObjects));

            // Şəkil və sertifikat
            if (selectedFile) formData.append("doctorImage", selectedFile);
            sertifikatFiles.forEach((item) => {
                formData.append("doctorSertificates", item.file);
            });

            // Klinika ID-ləri
            const selectedClinicIds = clinic
                .filter((_, i) => activeIcon.includes(i))
                .map((c) => c.id);
            selectedClinicIds.forEach((id) => formData.append("doctorClinicIds", id));

            await postDoctor(formData).unwrap();
            showToast("Həkim uğurla əlavə olundu!", "success");
            navigate('/admin/doctors')
        } catch (err) {
            console.error(err);
            showToast("Xəta baş verdi, yenidən cəhd edin!", "error");
        }
    };
    return (
        <div id={'doctor-add'}>
            <div className={'doctor-add'}>
                <div className={"root"}>
                    <h2>
                        <NavLink className="link" to="/admin/doctors">Həkim</NavLink>
                        <img src={rootIcon} alt="" />
                        Yeni həkim yarat
                    </h2>
                </div>
                <div className={'doctor-add-head'}>
                    <h1>Yeni həkim yarat</h1>
                    <p>Buradan həkimləri idarə edə və yenilərini yarada bilərsiniz.</p>
                </div>
                <div className={'doctor-add-main'}>
                    <div className={'doctor-add-data'}>
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>Həkim adı</h3>
                                <p>Həkimin sistemdə görünəcək adını daxil edin.</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder="Azərbaycan dilində" value={nameAz} onChange={(e)=>setNameAz(e.target.value)}/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={aze} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder="Rus dilində" value={nameRu} onChange={(e)=>setNameRu(e.target.value)}/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={rus} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder="İngilis dilində" value={nameEn} onChange={(e)=>setNameEn(e.target.value)}/>
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
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>Həkim soyadı</h3>
                                <p>Xidmətin sistemdə görünəcək soyadını daxil edin.</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder="Azərbaycan" value={surNameAz} onChange={(e)=>setSurNameAz(e.target.value)}/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={aze} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder="Rus" value={surNameRu} onChange={(e)=>setSurNameRu(e.target.value)}/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={rus} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder="İngilis" value={surNameEn} onChange={(e)=>setSurNameEn(e.target.value)}/>
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
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>Vəzifə</h3>
                                <p>Həkimin sistemdə görünəcək vəzifə adını daxil edin.</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder="Azərbaycan" value={roleAz} onChange={(e)=>setRoleAz(e.target.value)}/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={aze} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder="Rus" value={roleRu} onChange={(e)=>setRoleRu(e.target.value)}/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={rus} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder="İngilis" value={roleEn} onChange={(e)=>setRoleEn(e.target.value)}/>
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
                                <h3>Həkim şəkil</h3>
                                <p>Həkimi təmsil edəcək şəkil yükləyin.</p>
                            </div>
                            <div
                                className={`uploadBox ${isDragging ? "dragging" : ""}`}
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                            >
                                <input
                                    type="file"
                                    id="clinicImage"
                                    accept="image/*"
                                    onChange={(e) => setSelectedFile(e.target.files[0])}
                                    style={{ display: "none" }}
                                />
                                <label htmlFor="clinicImage" className="uploadArea">
                                    <img src={uploadIcon} alt="upload" />
                                    <p>Faylı yükləmək üçün bu sahəyə klikləyin və ya sürükləyin</p>
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
                                    <button onClick={() => setSelectedFile(null)}>✕</button>
                                </div>
                            )}
                        </div>


                    </div>

                    <div className={'doctor-add-data'}>

                        <div className={"dataDiv images2"}>
                            <div className={'header'}>
                                <h3>Klinika</h3>
                                <p>Həkimin əlaqəli olduğu klinikaları seçin.</p>
                            </div>
                            <div className={'addCategory'}>
                                {clinic?.map((item, index) => (
                                    <label key={index} className="checkboxItem">
                                        <input
                                            type="checkbox"
                                            checked={activeIcon.includes(index)}
                                            onChange={() => {
                                                setActiveIcon((prev) =>
                                                    prev.includes(index)
                                                        ? prev.filter((i) => i !== index) // varsa sil
                                                        : [...prev, index] // yoxdursa əlavə et
                                                );
                                            }}
                                        />
                                        <span>{item.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="dataDiv images multi">
                            <div className="header">
                                <h3>Sertifikat</h3>
                                <p>Həkimi təmsil edəcək sertifikatları yükləyin.</p>
                            </div>

                            <div className="uploadBox">
                                <input
                                    type="file"
                                    id="sertifikat-fileInput"
                                    accept="image/*"
                                    multiple
                                    onChange={handleSertifikatChange}
                                    style={{ display: "none" }}
                                />
                                <label htmlFor="sertifikat-fileInput" className="uploadArea">
                                    <img src={uploadIcon} alt="upload" />
                                    <p>Faylı yükləmək üçün bu sahəyə klikləyin və ya sürükləyin</p>
                                </label>
                            </div>

                            <div className="uploadedHeader" onClick={() => setSertifikatOpen((p) => !p)}>
                                <span>Yüklənənlər</span>
                                <img src={sertifikatOpen ? openIcon : closeIcon} alt="toggle" />
                            </div>

                            {sertifikatOpen && sertifikatFiles.length > 0 && (
                                <div className="uploadedList">
                                    {sertifikatFiles.map((item, index) => (
                                        <div key={index} className="uploadedItem">
                                            <div className="fileLeft">
                                                <img src={item.preview} alt="preview" className="filePreview" />
                                                <span>{item.file.name}</span>
                                            </div>
                                            <button onClick={() => removeSertifikat(index)}>✕</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className={"dataDiv3 inputs"}>
                            <div className={'header'}>
                                <h3>Təcrübə müddəti</h3>
                                <p>Həkimin sistemdə görünəcək təcrübə müddətini daxil edin.</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder="Məs: 5" value={experience} onChange={(e)=>setExperience(e.target.value)} />

                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="dataDiv2 inputs">
                            {/* 🔹 Reytinq bölməsi */}
                            <div className="reyting">
                                <div className="header">
                                    <h3>Reytinqi</h3>
                                    <p>Həkim üçün reytinq dəyəri təyin edin.</p>
                                </div>

                                <div className="stars">
                                    {ratings.map((value) => (
                                        <label key={value} className="ratingOption">
                                            <input
                                                type="checkbox"
                                                checked={rating === value}
                                                onChange={() => setRating(value)}
                                            />
                                            <div className="starsRow">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <img
                                                        key={i}
                                                        src={i < value ? starEmpty : starFilled}
                                                        alt="star"
                                                        className="starIcon"
                                                    />
                                                ))}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                        </div>
                        <div className="dataDiv4 inputs quill-section">
                            <div className="header">
                                <h3>Bio</h3>
                                <p>Həkimin sistemdə görünəcək bioqrafiyasını daxil edin.</p>
                            </div>

                            <div className="offer-scroll">
                                {sections.map((section) => (
                                    <div key={section.id} className="offer-section">
                                        <div className="offer-header" onClick={() => toggleSection(section.id)}>
                                            <span>Bio #{section.id}</span>
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
                                                <img src={section.expanded ? openIcon : closeIcon} />
                                            </div>
                                        </div>

                                        {section.expanded && (
                                            <div className="add-inputs">
                                                {langs.map((lang, index) => (
                                                    <div key={index} className="add-data">
                                                        <div className="add-input">
                                                            <ReactQuill
                                                                theme="snow"
                                                                value={section.inputs[index]}
                                                                onChange={(val) =>
                                                                    handleInputChange(section.id, index, val)
                                                                }
                                                                className="custom-quill"
                                                                placeholder="Buraya yaz..."
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

                            <button
                                className={`addButton ${!allInputsFilled ? "disabled" : ""}`}
                                onClick={handleAddSection}
                                disabled={!allInputsFilled}
                            >
                                <img src={plusIcon} alt="plus" /> Əlavə et
                            </button>
                        </div>



                    </div>
                    <button
                        className={`submitButton ${isLoading ? "loading" : ""}`}
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? "Yadda saxlanılır..." : "Yadda saxla"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DoctorAdd;