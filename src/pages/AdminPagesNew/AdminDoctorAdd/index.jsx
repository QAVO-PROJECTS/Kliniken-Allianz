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
import {useTranslation} from "react-i18next";

function DoctorAdd() {
    const { t } = useTranslation();
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
            showToast(t("adminPanel.doctorAdd.toast.success"), "success");
            navigate('/admin/doctors')
        } catch (err) {
            console.error(err);
            showToast(t("adminPanel.doctorAdd.toast.error"), "error");
        }
    };
    return (
        <div id={'doctor-add'}>
            <div className={'doctor-add'}>
                <div className={"root"}>
                    <h2>
                        <NavLink className="link" to="/admin/doctors"> {t("adminPanel.doctorAdd.breadcrumb.root")}</NavLink>
                        <img src={rootIcon} alt="" />
                        {t("adminPanel.doctorAdd.breadcrumb.current")}
                    </h2>
                </div>
                <div className={'doctor-add-head'}>
                    <h1>{t("adminPanel.doctorAdd.title")}</h1>
                    <p>{t("adminPanel.doctorAdd.description")}</p>
                </div>
                <div className={'doctor-add-main'}>
                    <div className={'doctor-add-data'}>
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>{t("adminPanel.doctorAdd.sections.name.title")}</h3>
                                <p>{t("adminPanel.doctorAdd.sections.name.desc")}</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder={t("adminPanel.doctorAdd.placeholders.nameAz")} value={nameAz} onChange={(e)=>setNameAz(e.target.value)}/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={aze} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder={t("adminPanel.doctorAdd.placeholders.nameRu")} value={nameRu} onChange={(e)=>setNameRu(e.target.value)}/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={rus} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder={t("adminPanel.doctorAdd.placeholders.nameEn")} value={nameEn} onChange={(e)=>setNameEn(e.target.value)}/>
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
                                <h3>{t("adminPanel.doctorAdd.sections.surname.title")}</h3>
                                <p>{t("adminPanel.doctorAdd.sections.surname.desc")}</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder={t("adminPanel.doctorAdd.placeholders.surnameAz")} value={surNameAz} onChange={(e)=>setSurNameAz(e.target.value)}/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={aze} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder={t("adminPanel.doctorAdd.placeholders.surnameRu")} value={surNameRu} onChange={(e)=>setSurNameRu(e.target.value)}/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={rus} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder={t("adminPanel.doctorAdd.placeholders.surnameEn")} value={surNameEn} onChange={(e)=>setSurNameEn(e.target.value)}/>
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
                                <h3>{t("adminPanel.doctorAdd.sections.role.title")}</h3>
                                <p>{t("adminPanel.doctorAdd.sections.role.desc")}</p>

                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder={t("adminPanel.doctorAdd.placeholders.roleAz")} value={roleAz} onChange={(e)=>setRoleAz(e.target.value)}/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={aze} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder={t("adminPanel.doctorAdd.placeholders.roleRu")} value={roleRu} onChange={(e)=>setRoleRu(e.target.value)}/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={rus} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder={t("adminPanel.doctorAdd.placeholders.roleEn")} value={roleEn} onChange={(e)=>setRoleEn(e.target.value)}/>
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
                                <h3>{t("adminPanel.doctorAdd.sections.image.title")}</h3>
                                <p>{t("adminPanel.doctorAdd.sections.image.desc")}</p>
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
                                    <p>{t("adminPanel.doctorAdd.sections.image.uploadText")}</p>
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
                                <h3>{t("adminPanel.doctorAdd.sections.clinic.title")}</h3>
                                <p>{t("adminPanel.doctorAdd.sections.clinic.desc")}</p>

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
                                <h3>{t("adminPanel.doctorAdd.sections.certificate.title")}</h3>
                                <p>{t("adminPanel.doctorAdd.sections.certificate.desc")}</p>
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
                                    <p>{t("adminPanel.doctorAdd.uploadHint")}</p>
                                </label>
                            </div>

                            <div className="uploadedHeader" onClick={() => setSertifikatOpen((p) => !p)}>
                                <span>{t("adminPanel.doctorAdd.sections.certificate.uploaded")}</span>
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
                                <h3>{t("adminPanel.doctorAdd.sections.experience.title")}</h3>
                                <p>{t("adminPanel.doctorAdd.sections.experience.desc")}</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder= {t("adminPanel.doctorAdd.sections.experience.placeholder")} value={experience} onChange={(e)=>setExperience(e.target.value)} />
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="dataDiv2 inputs">
                            {/* 🔹 Reytinq bölməsi */}
                            <div className="reyting">
                                <div className="header">
                                    <h3>{t("adminPanel.doctorAdd.sections.rating.title")}</h3>
                                    <p>{t("adminPanel.doctorAdd.sections.rating.desc")}</p>

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
                                <h3>{t("adminPanel.doctorAdd.sections.bio.title")}</h3>
                                <p>{t("adminPanel.doctorAdd.sections.bio.desc")}</p>
                            </div>

                            <div className="offer-scroll">
                                {sections.map((section) => (
                                    <div key={section.id} className="offer-section">
                                        <div className="offer-header" onClick={() => toggleSection(section.id)}>
                                            <span>{t("adminPanel.doctorAdd.sections.bio.section")} #{section.id}</span>
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
                                                                placeholder={t("adminPanel.doctorAdd.sections.bio.placeholder")}
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
                                <img src={plusIcon} alt="plus" /> {t("adminPanel.doctorAdd.sections.bio.addButton")}
                            </button>
                        </div>



                    </div>
                    <button
                        className={`submitButton ${isLoading ? "loading" : ""}`}
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading
                            ? t("adminPanel.doctorAdd.buttons.loading")
                            : t("adminPanel.doctorAdd.buttons.save")}
                    </button>

                </div>
            </div>
        </div>
    );
}

export default DoctorAdd;