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
import starEmpty from "../../../assets/doluUlduz.svg";
import starFilled from "../../../assets/bosUlduz.svg";
import plusIcon from "../../../assets/plusIcon.svg";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {useGetAllClinicQuery, useGetDoctorsByIdQuery, usePutDoctorsMutation} from "../../../services/userApi.jsx";
import {DOCTOR_IMG_URL, CERT_CLINIC_URL, CERT_DOKTOR_URL} from "../../../contants.js";
import showToast from "../../../components/ToastMessage.js";
import {useTranslation} from "react-i18next";
function DoctorEdit() {
    const { t } = useTranslation();
    const {id} = useParams();
    const navigate = useNavigate()
    const [isDragging, setIsDragging] = useState(false);
    const [activeIcon, setActiveIcon] = useState([]);
    const {data:getAllClinic} = useGetAllClinicQuery()
    const clinic = getAllClinic?.data
    const {data:getDoctorsById,isFetching,refetch} = useGetDoctorsByIdQuery(id)
    const doctor = getDoctorsById?.data
    const [editDoctor, {isLoading}] = usePutDoctorsMutation();
    const [nameAz, setNameAz] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [nameRu, setNameRu] = useState("");
    const [nameAlm, setNameAlm] = useState("");
    const [nameArab, setNameArab] = useState("");
    const [surNameAz, setSurNameAz] = useState("");
    const [surNameEn, setSurNameEn] = useState("");
    const [surNameRu, setSurNameRu] = useState("");
    const [surNameAlm, setSurNameAlm] = useState("");
    const [surNameArab, setSurNameArab] = useState("");
    const [roleAz, setRoleAz] = useState("");
    const [roleEn, setRoleEn] = useState("");
    const [roleRu, setRoleRu] = useState("");
    const [roleAlm, setRoleAlm] = useState("");
    const [roleArab, setRoleArab] = useState("");
    const [experience, setExperience] = useState("");
    const [rating, setRating] = useState(0);    // 🔹 Ayrı state-lər
    const [selectedFile, setSelectedFile] = useState(null);
    const [sertifikatFiles, setSertifikatFiles] = useState([]);
    const [sertifikatOpen, setSertifikatOpen] = useState(true);
    const [activeClinics, setActiveClinics] = useState([]);


    // 🔹 Sertifikat yükləmə funksiyası
    const handleSertifikatChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const withPreview = newFiles?.map((file) => ({
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
        { id: 1, expanded: true, inputs: Array(5).fill("") },
    ]);
    useEffect(() => {
        if (doctor) {
            setNameAz(doctor.name || "");
            setNameEn(doctor.nameEng || "");
            setNameRu(doctor.nameRu || "");
            setNameAlm(doctor.nameAlm || "");
            setNameArab(doctor.nameArab || "");
            setSurNameAz(doctor.surName || "");
            setSurNameEn(doctor.surNameEng || "");
            setSurNameRu(doctor.surNameRu || "");
            setSurNameAlm(doctor.surNameAlm || "");
            setSurNameArab(doctor.surNameArab || "");
            setRoleAz(doctor.role || "");
            setRoleEn(doctor.roleEng || "");
            setRoleRu(doctor.roleRu || "");
            setRoleAlm(doctor.roleAlm || "");
            setRoleArab(doctor.roleArab || "");
            setExperience(doctor.experience || "");
            setRating(doctor.rate || 0);

            // şəkil preview
            if (doctor.doctorImage) {
                setSelectedFile({ preview: DOCTOR_IMG_URL + doctor.doctorImage, isFromServer: true });
            }

            // sertifikat preview-ləri
            if (doctor.doctorSertificates?.length) {
                const certs = doctor.doctorSertificates?.map((f) => ({
                    preview: CERT_DOKTOR_URL + f,
                    isFromServer: true,
                    fileName: f
                }));
                setSertifikatFiles(certs);
            }

            // klinikalar
            if (doctor.clinics?.length) {
                const ids = doctor.clinics?.map((c) => c.id);
                setActiveClinics(ids);
            }

            // bio bölmələri
            if (doctor.bio?.length) {
                const bioSections = doctor.bio?.map((b) => ({
                    id: b.id, // 🟩 burada backend bio id-sini saxlayırıq
                    expanded: true,
                    inputs: [
                        b.name || "",
                        b.nameEng || "",
                        b.nameRu || "",
                        b.nameAlm || "",
                        b.nameArab || "",
                    ],
                }));
                setSections(bioSections);
            }
            else {
                setSections([{ id: 1, expanded: true, inputs: Array(5).fill("") }]);
            }
        }
    }, [doctor]);
    // 🔹 Input dəyərlərini dəyiş
    const handleInputChange = (sectionId, index, value) => {
        setSections((prev) =>
            prev?.map((s) =>
                s.id === sectionId
                    ? {
                        ...s,
                        inputs: s.inputs?.map((v, i) => (i === index ? value : v)),
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
            prev?.map((s) => ({ ...s, expanded: false })).concat(newSection)
        );
    };

    // 🔹 Bölməni bağla/aç
    const toggleSection = (id) => {
        setSections((prev) =>
            prev?.map((s) =>
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
        try {
            const formData = new FormData();

            formData.append("id", id);
            formData.append("name", nameAz);
            formData.append("nameEng", nameEn);
            formData.append("nameRu", nameRu);
            formData.append("nameAlm", nameAlm);
            formData.append("nameArab", nameArab);
            formData.append("surName", surNameAz);
            formData.append("surNameEng", surNameEn);
            formData.append("surNameRu", surNameRu);
            formData.append("surNameAlm", surNameAlm);
            formData.append("surNameArab", surNameArab);
            formData.append("role", roleAz);
            formData.append("roleEng", roleEn);
            formData.append("roleRu", roleRu);
            formData.append("roleAlm", roleAlm);
            formData.append("roleArab", roleArab);
            formData.append("experience", experience);
            formData.append("rate", rating);
            formData.append('bornDate','')
            // ✅ Bio dəyişikliklərini yoxla (yalnız dəyişən və yeni bio-lar getsin)
            const existingBios = doctor?.bio || [];

            const updatedBios = sections
                ?.map((s) => {
                    // Əgər bu bölmədə id varsa, backend-dən gəlmiş bio deməkdir
                    const oldBio = existingBios.find((b) => b.id === s.id);

                    // Əgər backend-də bu bio yoxdursa → yeni əlavədir
                    if (!oldBio) {
                        return {
                            name: s.inputs[0],
                            nameEng: s.inputs[1],
                            nameRu: s.inputs[2],
                            nameAlm: s.inputs[3],
                            nameArab: s.inputs[4],
                        };
                    }

                    // Əgər bu bio var, amma dəyişib
                    const changed =
                        oldBio.name !== s.inputs[0] ||
                        oldBio.nameEng !== s.inputs[1] ||
                        oldBio.nameRu !== s.inputs[2] ||
                        oldBio.nameAlm !== s.inputs[3] ||
                        oldBio.nameArab !== s.inputs[4];

                    if (changed) {
                        return {
                            id: oldBio.id,
                            name: s.inputs[0],
                            nameEng: s.inputs[1],
                            nameRu: s.inputs[2],
                            nameAlm: s.inputs[3],
                            nameArab: s.inputs[4],
                        };
                    }

                    // Eyni qalıbsa, göndərmə
                    return null;
                })
                .filter(Boolean);

            if (updatedBios.length > 0) {
                formData.append("biosJson", JSON.stringify(updatedBios));
            }



            // ✅ Yeni şəkil varsa əlavə et
            if (selectedFile && !selectedFile.isFromServer) {
                formData.append("doctorImage", selectedFile);
            }

            // ✅ Yeni sertifikatlar
            const newCertificates = sertifikatFiles.filter((f) => !f.isFromServer);
            newCertificates.forEach((f) => formData.append("doctorSertificates", f.file));

            // ✅ Silinmiş sertifikatlar
            const deletedCertificates = doctor.doctorSertificates.filter(
                (oldFile) => !sertifikatFiles.some((f) =>
                    f.isFromServer && f.fileName === oldFile
                )
            );
            deletedCertificates.forEach((f) =>
                formData.append("deleteDoctorSertificates", f)
            );

            // ✅ Klinikalar (aktivlər və silinənlər)
            const currentClinicIds = doctor.clinics?.map((c) => c.id);
            const addedClinics = activeClinics.filter(
                (id) => !currentClinicIds.includes(id)
            );
            const deletedClinics = currentClinicIds.filter(
                (id) => !activeClinics.includes(id)
            );

            addedClinics.forEach((id) => formData.append("clinicIds", id));
            deletedClinics.forEach((id) => formData.append("deleteClinicIds", id));

            // ✅ Bio silinənləri tap
            const existingBiosIds = doctor.bio || [];
            const deletedBioIds = existingBiosIds
                .filter(
                    (b, idx) =>
                        !sections[idx] ||
                        (sections[idx] &&
                            (!sections[idx].inputs[0] &&
                                !sections[idx].inputs[1] &&
                                !sections[idx].inputs[2] &&
                                !sections[idx].inputs[3] &&
                                !sections[idx].inputs[4]))
                )
                ?.map((b) => b.id);

            deletedBioIds.forEach((id) => formData.append("deleteBioIds", id));

            // ✅ PUT çağırışı
            await editDoctor(formData).unwrap();
            showToast(t("adminPanel.doctorEdit.toast.success"), "success");
            navigate("/admin/doctors");
            refetch()
        } catch (err) {
            console.error(err);
            showToast(t("adminPanel.doctorEdit.toast.error"), "error");
        }
    };
    useEffect(() => {
        refetch()
    }, []);
    if (isFetching) return <p className="loading">Yüklənir...</p>;
    return (
        <div id={'doctor-edit'}>
            <div className={'doctor-edit'}>
                <div className={"root"}>
                    <h2>
                        <NavLink className="link" to="/admin/doctors"> {t("adminPanel.doctorEdit.breadcrumb.root")}</NavLink>
                        <img src={rootIcon} alt="" />
                        {t("adminPanel.doctorEdit.breadcrumb.current")}
                    </h2>
                </div>
                <div className={'doctor-edit-head'}>
                    <h1>{t("adminPanel.doctorEdit.title")}</h1>
                    <p>{t("adminPanel.doctorEdit.description")}</p>

                </div>
                <div className={'doctor-edit-main'}>
                    <div className={'doctor-edit-data'}>
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>{t("adminPanel.doctorEdit.sections.name.title")}</h3>
                                <p>{t("adminPanel.doctorEdit.sections.name.desc")}</p>

                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={nameAz} onChange={(e)=>setNameAz(e.target.value)} placeholder="Azərbaycan"/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={aze} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={nameRu} onChange={(e)=>setNameRu(e.target.value)} placeholder="Rus"/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={rus} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={nameEn} onChange={(e)=>setNameEn(e.target.value)} placeholder="İngilis"/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={usa} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={nameAlm} onChange={(e)=>setNameAlm(e.target.value)} placeholder="Alman"/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={ger} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={nameArab} onChange={(e)=>setNameArab(e.target.value)} placeholder="Ərəb"/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={arb} alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>{t("adminPanel.doctorEdit.sections.surname.title")}</h3>
                                <p>{t("adminPanel.doctorEdit.sections.surname.desc")}</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={surNameAz} onChange={(e)=>setSurNameAz(e.target.value)} placeholder="Azərbaycan"/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={aze} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={surNameRu} onChange={(e)=>setSurNameRu(e.target.value)} placeholder="Rus"/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={rus} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={surNameEn} onChange={(e)=>setSurNameEn(e.target.value)} placeholder="İngilis"/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={usa} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={surNameAlm} onChange={(e)=>setSurNameAlm(e.target.value)} placeholder="Alman"/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={ger} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={surNameArab} onChange={(e)=>setSurNameArab(e.target.value)} placeholder="Ərəb"/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={arb} alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>{t("adminPanel.doctorEdit.sections.role.title")}</h3>
                                <p>{t("adminPanel.doctorEdit.sections.role.desc")}</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={roleAz} onChange={(e)=>setRoleAz(e.target.value)} placeholder="Azərbaycan"/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={aze} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={roleRu} onChange={(e)=>setRoleRu(e.target.value)} placeholder="Rus"/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={rus} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={roleEn} onChange={(e)=>setRoleEn(e.target.value)} placeholder="İngilis"/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={usa} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={roleAlm} onChange={(e)=>setRoleAlm(e.target.value)} placeholder="Alman"/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={ger} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={roleArab} onChange={(e)=>setRoleArab(e.target.value)} placeholder="Ərəb"/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={arb} alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="dataDiv images">
                            <div className="header">
                                <h3>{t("adminPanel.doctorEdit.sections.image.title")}</h3>
                                <p>{t("adminPanel.doctorEdit.sections.image.desc")}</p>
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
                                    <p>{t("adminPanel.doctorEdit.sections.image.uploadText")}</p>
                                </label>
                            </div>


                            {selectedFile && (
                                <div className="uploadedFile">
                                    <div className="fileInfo">
                                        <img
                                            src={
                                                selectedFile.isFromServer
                                                    ? selectedFile.preview
                                                    : URL.createObjectURL(selectedFile)
                                            }
                                            alt="preview"
                                            className="previewImg"
                                        />
                                        <span>
                                            {selectedFile.isFromServer
                                                ? "Server şəkli"
                                                : selectedFile.name}
                                        </span>
                                    </div>
                                    <button onClick={() => setSelectedFile(null)}>✕</button>
                                </div>
                            )}
                        </div>


                    </div>

                    <div className={'doctor-edit-data'}>

                        <div className={"dataDiv images2"}>
                            <div className={'header'}>
                                <h3>{t("adminPanel.doctorEdit.sections.clinic.title")}</h3>
                                <p>{t("adminPanel.doctorEdit.sections.clinic.desc")}</p>
                            </div>
                            <div className={'addCategory'}>
                                {clinic?.map((item) => (
                                    <label key={item.id} className="checkboxItem">
                                        <input
                                            type="checkbox"
                                            checked={activeClinics.includes(item.id)}
                                            onChange={() => {
                                                setActiveClinics((prev) =>
                                                    prev.includes(item.id)
                                                        ? prev.filter((i) => i !== item.id)
                                                        : [...prev, item.id]
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
                                <h3>{t("adminPanel.doctorEdit.sections.certificate.title")}</h3>
                                <p>{t("adminPanel.doctorEdit.sections.certificate.desc")}</p>
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
                                    <p>{t("adminPanel.doctorEdit.sections.image.uploadText")}</p>
                                </label>
                            </div>

                            <div className="uploadedHeader" onClick={() => setSertifikatOpen((p) => !p)}>
                                <span>{t("adminPanel.doctorEdit.sections.certificate.uploaded")}</span>
                                <img src={sertifikatOpen ? openIcon : closeIcon} alt="toggle" />
                            </div>

                            {sertifikatOpen && sertifikatFiles.length > 0 && (
                                <div className="uploadedList">
                                    {sertifikatFiles?.map((item, index) => (
                                        <div key={index} className="uploadedItem">
                                            <div className="fileLeft">
                                                <img src={item.preview} alt="preview" className="filePreview"/>
                                                <span>{item.isFromServer ? "Server faylı" : item.file.name}</span>
                                            </div>
                                            <button onClick={() => removeSertifikat(index)}>✕</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className={"dataDiv3 inputs"}>
                            <div className={'header'}>
                                <h3>{t("adminPanel.doctorEdit.sections.experience.title")}</h3>
                                <p>{t("adminPanel.doctorEdit.sections.experience.desc")}</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={experience} onChange={(e)=>setExperience(e.target.value)} placeholder="3 il"/>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="dataDiv2 inputs">
                            {/* 🔹 Reytinq bölməsi */}
                            <div className="reyting">
                                <div className="header">
                                    <h3>{t("adminPanel.doctorEdit.sections.rating.title")}</h3>
                                    <p>{t("adminPanel.doctorEdit.sections.rating.desc")}</p>
                                </div>

                                <div className="stars">
                                    {ratings?.map((value) => (
                                        <label key={value} className="ratingOption">
                                            <input
                                                type="checkbox"
                                                checked={rating === value}
                                                onChange={() => setRating(value)}
                                            />
                                            <div className="starsRow">
                                                {Array.from({ length: 5 })?.map((_, i) => (
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
                                <h3>{t("adminPanel.doctorEdit.sections.bio.title")}</h3>
                                <p>{t("adminPanel.doctorEdit.sections.bio.desc")}</p>
                            </div>

                            <div className="offer-scroll">
                                {sections?.map((section) => (
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
                                                {[aze, rus, usa, ger, arb]?.map((lang, i) => (
                                                    <div key={i} className="add-data">
                                                        <div className="add-input">
                                                            <ReactQuill
                                                                theme="snow"
                                                                value={section.inputs[i]}
                                                                onChange={(val) => handleInputChange(section.id, i, val)}
                                                                className="custom-quill"
                                                            />
                                                        </div>
                                                        <div className="langCountry">
                                                        <img src={lang} alt="lang"/>
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

export default DoctorEdit;