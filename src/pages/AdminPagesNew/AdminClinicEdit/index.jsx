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
import {
    useGetAllDoctorsQuery,
    useGetAllOtelsQuery,
    useGetAllServiceQuery,
    useGetClinicByIdQuery, usePutClinicMutation
} from "../../../services/userApi.jsx";
import {
    CLINIC_CARD_IMAGES,
    CLINIC_IMAGES,
    CLINIC_SERT_IMAGES
} from "../../../contants.js";
import showToast from "../../../components/ToastMessage.js";
import {useTranslation} from "react-i18next";

function ClinicEdit() {
    const { t } = useTranslation();
    const {id} = useParams()
    const [isLoaded, setIsLoaded] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [editClinic, { isLoading }] = usePutClinicMutation();
    const {data:getClinicById , refetch} = useGetClinicByIdQuery(id)
    const clinic = getClinicById?.data
    const {data:getAllService} = useGetAllServiceQuery()
    const servis = getAllService?.data
    const {data:getAllOtels} = useGetAllOtelsQuery()
    const otels = getAllOtels?.data
    const {data:getAllDoctors} = useGetAllDoctorsQuery()
    const doctors = getAllDoctors?.data
    // 🔹 Name inputları
    const navigate = useNavigate()
    const [nameAz, setNameAz] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [nameRu, setNameRu] = useState("");
    const [nameAlm, setNameAlm] = useState("");
    const [nameArab, setNameArab] = useState("");

    // 🔹 Description inputları
    const [descAz, setDescAz] = useState("");
    const [descEn, setDescEn] = useState("");
    const [descRu, setDescRu] = useState("");
    const [descAlm, setDescAlm] = useState("");
    const [descArab, setDescArab] = useState("");

    const [clinicVideos, setClinicVideos] = useState([]);
    const [videoInput, setVideoInput] = useState("");
    const [addedClinicVideos, setAddedClinicVideos] = useState([]);
    const [deleteClinicVideos, setDeleteClinicVideos] = useState([]);
    const [locationAz, setLocationAz] = useState("");
    const [locationEn, setLocationEn] = useState("");
    const [locationRu, setLocationRu] = useState("");
    const [locationAlm, setLocationAlm] = useState("");
    const [locationArab, setLocationArab] = useState("");
    // 🔹 Checkbox-lar
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedDoctors, setSelectedDoctors] = useState([]);
    const [selectedOtels, setSelectedOtels] = useState([]);

    // 🔹 Şəkillər
    const [mainImage, setMainImage] = useState(null);
    const [oldMainImage, setOldMainImage] = useState(null);

    const [sertifikatFiles, setSertifikatFiles] = useState([]);
    const [oldSertifikatFiles, setOldSertifikatFiles] = useState([]);

    const [galereyaFiles, setGalereyaFiles] = useState([]);
    const [oldGalereyaFiles, setOldGalereyaFiles] = useState([]);

    const [sertifikatOpen, setSertifikatOpen] = useState(false);
    const [galereyaOpen, setGalereyaOpen] = useState(false);
    const [deleteClinicImages, setDeleteClinicImages] = useState([]);
    const [deleteClinicSertificates, setDeleteClinicSertificates] = useState([]);
    const [deleteDoctors, setDeleteDoctors] = useState([]);
    const [deleteOtels, setDeleteOtels] = useState([]);
    const [deleteServices, setDeleteServices] = useState([]);
    const removeOldSertifikat = (fileName) => {
        setOldSertifikatFiles(prev => prev.filter(f => f !== fileName));
        setDeleteClinicSertificates(prev => [...prev, fileName]);
    };

    const removeOldGalereya = (fileName) => {
        setOldGalereyaFiles(prev => prev.filter(f => f !== fileName));
        setDeleteClinicImages(prev => [...prev, fileName]);
    };
    useEffect(() => {
        refetch()
    }, []);
    useEffect(() => {
        if (clinic && !isLoaded) {
            setNameAz(clinic.name || "");
            setNameEn(clinic.nameEng || "");
            setNameRu(clinic.nameRu || "");
            setNameAlm(clinic.nameAlm || "");
            setNameArab(clinic.nameArab || "");

            setDescAz(clinic.description || "");
            setDescEn(clinic.descriptionEng || "");
            setDescRu(clinic.descriptionRu || "");
            setDescAlm(clinic.descriptionAlm || "");
            setDescArab(clinic.descriptionArab || "");

            setLocationAz(clinic.location || "");
            setLocationEn(clinic.locationEng || "");
            setLocationRu(clinic.locationRu || "");
            setLocationAlm(clinic.locationAlm || "");
            setLocationArab(clinic.locationArab || "");

            setSelectedServices(clinic.services?.map(s => s.id) || []);
            setSelectedDoctors(clinic.doctors?.map(d => d.id) || []);
            setSelectedOtels(clinic.otels?.map(o => o.id) || []);

            setOldMainImage(clinic.clinicCardImage ? `/uploads/${clinic.clinicCardImage}` : null);
            setOldSertifikatFiles(clinic.clinicSertificates || []);
            setOldGalereyaFiles(clinic.clinicImages || []);
            setClinicVideos(clinic.clinicVideos || []);
            setIsLoaded(true);
        }
    }, [clinic, isLoaded]);
    const addVideo = () => {
        const trimmed = videoInput.trim();
        if (!trimmed) return;

        setClinicVideos((prev) => [...prev, trimmed]);
        setAddedClinicVideos((prev) => [...prev, trimmed]);
        setVideoInput("");
    };

    const removeVideo = (index) => {
        const url = clinicVideos[index];

        // Əgər yeni əlavə olunanlardandırsa, added listindən çıxart
        if (addedClinicVideos.includes(url)) {
            // Birdən çox eyni url ola biləcəyi üçün yalnız birini silirik (indeksə görə deyil, amma ilk tapılanı)
            // Əslində index-ə görə manage etmək daha düzgün olardı amma bu sadə modeldə:
            const findIdx = addedClinicVideos.indexOf(url);
            if(findIdx > -1) {
                const newAdded = [...addedClinicVideos];
                newAdded.splice(findIdx, 1);
                setAddedClinicVideos(newAdded);
            }
        } else {
            // Əgər backend-dən gələn videodursa, silinənlərə əlavə et
            setDeleteClinicVideos((prev) => [...prev, url]);
        }

        setClinicVideos((prev) => prev.filter((_, i) => i !== index));
    };
    // 🔹 Sertifikat yükləmə funksiyası
    const handleSertifikatChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const withPreview = newFiles?.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setSertifikatFiles((prev) => [...prev, ...withPreview]);
    };

    // 🔹 Galereya yükləmə funksiyası
    const handleGalereyaChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const withPreview = newFiles?.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setGalereyaFiles((prev) => [...prev, ...withPreview]);
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

    const removeGalereya = (index) => {
        setGalereyaFiles((prev) => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[index].preview);
            updated.splice(index, 1);
            return updated;
        });
    };
    const toggleSelection = (id, selectedList, setList) => {
        setList(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };
    const toggleSelectionWithDelete = (id, selectedList, setList, deleteList, setDeleteList, originalList) => {
        setList(prev => {
            if (prev.includes(id)) {
                // user unchecked → silinənlərə əlavə et
                if (originalList.includes(id)) setDeleteList(prevDel => [...prevDel, id]);
                return prev.filter(x => x !== id);
            } else {
                // user yeniden seçti → silinənlərdən çıxart
                setDeleteList(prevDel => prevDel.filter(x => x !== id));
                return [...prev, id];
            }
        });
    };
// köməkçi funksiya — yalnız dəyəri dəyişəndə append et
    const appendIfChanged = (formData, key, newVal, oldVal) => {
        if (newVal !== oldVal && newVal !== undefined && newVal !== null && newVal !== "") {
            formData.append(key, newVal);
        }
    };

    const handleEdit = async () => {
        if (!clinic) return;

        const formData = new FormData();

        formData.append("id", clinic.id);

        // 🔹 yalnız dəyişən text sahələri
        appendIfChanged(formData, "name", nameAz, clinic.name);
        appendIfChanged(formData, "nameEng", nameEn, clinic.nameEng);
        appendIfChanged(formData, "nameRu", nameRu, clinic.nameRu);
        appendIfChanged(formData, "nameAlm", nameAlm, clinic.nameAlm);
        appendIfChanged(formData, "nameArab", nameArab, clinic.nameArab);

        appendIfChanged(formData, "description", descAz, clinic.description);
        appendIfChanged(formData, "descriptionEng", descEn, clinic.descriptionEng);
        appendIfChanged(formData, "descriptionRu", descRu, clinic.descriptionRu);
        appendIfChanged(formData, "descriptionAlm", descAlm, clinic.descriptionAlm);
        appendIfChanged(formData, "descriptionArab", descArab, clinic.descriptionArab);

        appendIfChanged(formData, "Location", locationAz, clinic.location);
        appendIfChanged(formData, "LocationEng", locationEn, clinic.locationEng);
        appendIfChanged(formData, "LocationRu", locationRu, clinic.locationRu);
        appendIfChanged(formData, "LocationAlm", locationAlm, clinic.locationAlm);
        appendIfChanged(formData, "LocationArab", locationArab, clinic.locationArab);

        // 🔹 yalnız yeni əsas şəkil seçilibsə
        if (selectedFile) formData.append("clinicCardImage", selectedFile);

        // 🔹 yalnız yeni yüklənənlər varsa
        if (galereyaFiles.length > 0)
            galereyaFiles.forEach(f => formData.append("clinicImages", f.file));
        if (sertifikatFiles.length > 0)
            sertifikatFiles.forEach(f => formData.append("clinicSertificates", f.file));

        // 🔹 silinənlər
        if (deleteClinicImages.length > 0)
            deleteClinicImages.forEach(f => formData.append("DeleteClinicImages", f));
        if (deleteClinicSertificates.length > 0)
            deleteClinicSertificates.forEach(f => formData.append("DeleteClinicSertificates", f));
        if (deleteServices.length > 0)
            deleteServices.forEach(id => formData.append("DeleteClinicServiceIds", id));
        if (deleteDoctors.length > 0)
            deleteDoctors.forEach(id => formData.append("DeleteDoctorIds", id));
        if (deleteOtels.length > 0)
            deleteOtels.forEach(id => formData.append("DeleteOtelIds", id));

        // 🔹 əlavə olunan (yeni) checkbox seçimləri
        const origServices = clinic.services?.map(s => s.id) || [];
        const origDoctors = clinic.doctors?.map(d => d.id) || [];
        const origOtels = clinic.otels?.map(o => o.id) || [];
// yeni əlavə olunan videolar
        if (addedClinicVideos.length > 0)
            addedClinicVideos.forEach(url => formData.append("ClinicVideos", url));

// silinəcək videolar
        if (deleteClinicVideos.length > 0)
            deleteClinicVideos.forEach(url => formData.append("DeleteClinicVideos", url));

        selectedServices
            .filter(id => !origServices.includes(id))
            .forEach(id => formData.append("ClinicServiceIds", id));

        selectedDoctors
            .filter(id => !origDoctors.includes(id))
            .forEach(id => formData.append("DoctorIds", id));

        selectedOtels
            .filter(id => !origOtels.includes(id))
            .forEach(id => formData.append("OtelIds", id));

        try {
            await editClinic(formData).unwrap();
            showToast(t("adminPanel.clinicEdit.toast.success"), 'success');
            refetch()
            navigate('/admin/clinic')
        } catch (err) {
            console.error("Error:", err);
            showToast(t("adminPanel.clinicEdit.toast.error"), 'error');
        }
    };

    return (
        <div id={'clinic-edit'}>
            <div className={'clinic-edit'}>
                <div className={"root"}>
                    <h2>
                        <NavLink className="link" to="/admin/clinic">{t("adminPanel.clinicEdit.breadcrumb.main")}</NavLink>
                        <img src={rootIcon} alt="" />
                        {t("adminPanel.clinicEdit.breadcrumb.sub")}
                    </h2>
                </div>
                <div className={'clinic-edit-head'}>
                    <h1>{t("adminPanel.clinicEdit.title")}</h1>
                    <p>{t("adminPanel.clinicEdit.description")}</p>
                </div>
                <div className={'clinic-edit-main'}>
                    <div className={'clinic-edit-data'}>
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>{t("adminPanel.clinicEdit.nameTitle")}</h3>
                                <p>{t("adminPanel.clinicEdit.nameDescription")}</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                    <input value={nameAz} onChange={(e)=>setNameAz(e.target.value)} placeholder={t("adminPanel.clinicEdit.placeholders.nameAz")} />
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={aze} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={nameRu} onChange={(e)=>setNameRu(e.target.value)} placeholder={t("adminPanel.clinicEdit.placeholders.nameRu")} />                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={rus} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={nameEn} onChange={(e)=>setNameEn(e.target.value)} placeholder={t("adminPanel.clinicEdit.placeholders.nameEn")} />
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={usa} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={nameAlm} onChange={(e)=>setNameAlm(e.target.value)} placeholder={t("adminPanel.clinicEdit.placeholders.nameAlm")} />
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={ger} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={nameArab} onChange={(e)=>setNameArab(e.target.value)} placeholder={t("adminPanel.clinicEdit.placeholders.nameArab")} />
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={arb} alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="dataDiv images">
                            <div className="header">
                                <h3>{t("adminPanel.clinicEdit.imageTitle")}</h3>
                                <p>{t("adminPanel.clinicEdit.imageDescription")}</p>
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
                                    <p>{t("adminPanel.clinicEdit.uploadHint")}</p>
                                </label>
                            </div>
                            {!selectedFile && oldMainImage && (
                                <div className="uploadedFile">
                                    <div className="fileInfo">
                                        <img
                                            src={`${CLINIC_CARD_IMAGES}${clinic.clinicCardImage}`}
                                            alt="clinic-main"
                                            className="previewImg"
                                        />
                                        <span>{clinic.clinicCardImage}</span>
                                    </div>
                                </div>
                            )}

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
                    <div className={'tours-desc'}>
                        <div className={'header'}>
                            <h3>{t("adminPanel.clinicEdit.descTitle")}</h3>
                            <p>{t("adminPanel.clinicEdit.descDescription")}</p>
                        </div>
                        <div className={'tours-desc-data'}>
                            <div className={'tours-desc-texts'}>
                                <textarea value={descAz} onChange={(e)=>setDescAz(e.target.value)} placeholder={t("adminPanel.clinicEdit.placeholders.descAz")} />
                                <div className={'langCountry'}>
                                    <img src={aze} alt=""/>
                                </div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea value={descRu} onChange={(e)=>setDescRu(e.target.value)} placeholder={t("adminPanel.clinicEdit.placeholders.descRu")} />
                                <div className={'langCountry'}>
                                    <img src={rus} alt=""/>
                                </div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea value={descEn} onChange={(e)=>setDescEn(e.target.value)} placeholder={t("adminPanel.clinicEdit.placeholders.descEn")} />
                                <div className={'langCountry'}>
                                    <img src={usa} alt=""/>
                                </div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea value={descAlm} onChange={(e)=>setDescAlm(e.target.value)} placeholder={t("adminPanel.clinicEdit.placeholders.descAlm")} />
                                <div className={'langCountry'}>
                                    <img src={ger} alt=""/>
                                </div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea value={descArab} onChange={(e)=>setDescArab(e.target.value)} placeholder={t("adminPanel.clinicEdit.placeholders.descArab")} />
                                <div className={'langCountry'}>
                                    <img src={arb} alt=""/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={'clinic-edit-data'}>
                        <div className={"dataDiv images2"}>
                            <div className={'header'}>
                                <h3>{t("adminPanel.clinicEdit.servicesTitle")}</h3>
                                <p>{t("adminPanel.clinicEdit.servicesDescription")}</p>
                            </div>
                            <div className={'addCategory'}>
                                {servis?.map(item => (
                                    <label key={item.id} className="checkboxItem">
                                        <input
                                            type="checkbox"
                                            checked={selectedServices.includes(item.id)}
                                            onChange={() =>
                                                toggleSelectionWithDelete(
                                                    item.id,
                                                    selectedServices, setSelectedServices,
                                                    deleteServices, setDeleteServices,
                                                    clinic.services?.map(s => s.id) || []
                                                )
                                            }

                                        />
                                        <span>{item.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className={"dataDiv images2"}>
                            <div className={'header'}>
                                <h3>{t("adminPanel.clinicEdit.doctorsTitle")}</h3>
                                <p>{t("adminPanel.clinicEdit.doctorsDescription")}</p>
                            </div>
                            <div className={'addCategory'}>
                                {doctors?.map(item => (
                                    <label key={item.id} className="checkboxItem">
                                        <input
                                            type="checkbox"
                                            checked={selectedDoctors.includes(item.id)}
                                            onChange={() =>
                                                toggleSelectionWithDelete(
                                                    item.id,
                                                    selectedDoctors, setSelectedDoctors,
                                                    deleteDoctors, setDeleteDoctors,
                                                    clinic.doctors?.map(d => d.id) || []
                                                )
                                            }
                                        />
                                        <span>{item.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className={"dataDiv images2"}>
                            <div className={'header'}>
                                <h3>{t("adminPanel.clinicEdit.hotelsTitle")}</h3>
                                <p>{t("adminPanel.clinicEdit.hotelsDescription")}</p>
                            </div>
                            <div className={'addCategory'}>
                                {otels?.map(item => (
                                    <label key={item.id} className="checkboxItem">
                                        <input
                                            type="checkbox"
                                            checked={selectedOtels.includes(item.id)}
                                            onChange={() =>
                                                toggleSelectionWithDelete(
                                                    item.id,
                                                    selectedOtels, setSelectedOtels,
                                                    deleteOtels, setDeleteOtels,
                                                    clinic.otels?.map(o => o.id) || []
                                                )
                                            }
                                        />
                                        <span>{item.name}</span>
                                    </label>
                                ))}

                            </div>
                        </div>
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>{t("adminPanel.clinicEdit.locationTitle")}</h3>
                                <p>{t("adminPanel.clinicEdit.locationDescription")}</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder={t("adminPanel.clinicEdit.placeholders.locationAz")} value={locationAz} onChange={(e) => setLocationAz(e.target.value)} />

                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={aze} alt="" />
                                    </div>
                                </div>

                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder={t("adminPanel.clinicEdit.placeholders.locationRu")} value={locationRu} onChange={(e) => setLocationRu(e.target.value)} />

                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={rus} alt="" />
                                    </div>
                                </div>

                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder={t("adminPanel.clinicEdit.placeholders.locationEn")} value={locationEn} onChange={(e) => setLocationEn(e.target.value)} />

                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={usa} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder={t("adminPanel.clinicEdit.placeholders.locationAlm")} value={locationAlm} onChange={(e) => setLocationAlm(e.target.value)} />
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={ger} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder={t("adminPanel.clinicEdit.placeholders.locationArab")} value={locationArab} onChange={(e) => setLocationArab(e.target.value)} />
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={arb} alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="dataDiv images multi">
                            <div className="header">
                                <h3>{t("adminPanel.clinicEdit.certificateTitle")}</h3>
                                <p>{t("adminPanel.clinicEdit.certificateDescription")}</p>
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
                                    <p>{t("adminPanel.clinicEdit.uploadHint")}</p>
                                </label>
                            </div>

                            <div className="uploadedHeader" onClick={() => setSertifikatOpen((p) => !p)}>
                                <span>{t("adminPanel.clinicEdit.uploadedHeader")}</span>
                                <img src={sertifikatOpen ? openIcon : closeIcon} alt="toggle" />
                            </div>


                            {sertifikatOpen && (
                                <div className="uploadedList">
                                    {/* 🔹 Köhnə şəkillər */}
                                    {oldSertifikatFiles.map((f, i) => (
                                        <div key={i} className="uploadedItem">
                                            <div className="fileLeft">
                                                <img src={`${CLINIC_SERT_IMAGES}${f}`} alt="old" className="filePreview" />
                                                <span>{f}</span>
                                            </div>
                                            <button onClick={() => removeOldSertifikat(f)}>✕</button>
                                        </div>
                                    ))}


                                    {/* 🔹 Yeni yüklənənlər */}
                                    {sertifikatFiles?.length > 0 && (
                                        <>
                                            <h4>{t("adminPanel.clinicEdit.uploadedSubTitle.newCertificates")}</h4>
                                            {sertifikatFiles.map((item, index) => (
                                                <div key={index} className="uploadedItem">
                                                    <div className="fileLeft">
                                                        <img src={item.preview} alt="preview" className="filePreview" />
                                                        <span>{item.file.name}</span>
                                                    </div>
                                                    <button onClick={() => removeSertifikat(index)}>✕</button>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* 🖼 Galereya */}
                        <div className="dataDiv images multi">
                            <div className="header">
                                <h3>{t("adminPanel.clinicEdit.galleryTitle")}</h3>
                                <p>{t("adminPanel.clinicEdit.galleryDescription")}</p>
                            </div>

                            <div className="uploadBox">
                                <input
                                    type="file"
                                    id="galereya-fileInput"
                                    accept="image/*"
                                    multiple
                                    onChange={handleGalereyaChange}
                                    style={{ display: "none" }}
                                />
                                <label htmlFor="galereya-fileInput" className="uploadArea">
                                    <img src={uploadIcon} alt="upload" />
                                    <p>{t("adminPanel.clinicEdit.uploadHint")}</p>
                                </label>
                            </div>

                            <div className="uploadedHeader" onClick={() => setGalereyaOpen((p) => !p)}>
                                <span>{t("adminPanel.clinicEdit.uploadedHeader")}</span>
                                <img src={galereyaOpen ? openIcon : closeIcon} alt="toggle" />
                            </div>

                            {galereyaOpen && (
                                <div className="uploadedList">
                                    {/* 🔹 Köhnə şəkillər */}
                                    {oldGalereyaFiles.map((f, i) => (
                                        <div key={i} className="uploadedItem">
                                            <div className="fileLeft">
                                                <img src={`${CLINIC_IMAGES}${f}`} alt="old" className="filePreview" />
                                                <span>{f}</span>
                                            </div>
                                            <button onClick={() => removeOldGalereya(f)}>✕</button>
                                        </div>
                                    ))}


                                    {/* 🔹 Yeni yüklənənlər */}
                                    {galereyaFiles?.length > 0 && (
                                        <>
                                            <h4>{t("adminPanel.clinicEdit.uploadedSubTitle.newGallery")}</h4>
                                            {galereyaFiles.map((item, index) => (
                                                <div key={index} className="uploadedItem">
                                                    <div className="fileLeft">
                                                        <img src={item.preview} alt="preview" className="filePreview" />
                                                        <span>{item.file.name}</span>
                                                    </div>
                                                    <button onClick={() => removeGalereya(index)}>✕</button>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* 🎬 YouTube Videolar */}
                        <div className="dataDiv images multi">
                            <div className="header">
                                <h3>{t("adminPanel.clinicEdit.videosTitle")}</h3>
                                <p>{t("adminPanel.clinicEdit.videosDescription")}</p>
                            </div>

                            <div className="video-input-row">
                                <div className="add-input">
                                    <input
                                        placeholder={t("adminPanel.clinicEdit.placeholders.videoUrl")}
                                        value={videoInput}
                                        onChange={(e) => setVideoInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && addVideo()}
                                    />
                                </div>
                                <button type="button" className="video-add-btn" onClick={addVideo}>
                                    {t("adminPanel.clinicEdit.buttons.addVideo")}
                                </button>
                            </div>

                            {clinicVideos.length > 0 && (
                                <div className="uploadedList">
                                    {clinicVideos.map((url, index) => (
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
                    <button className="submitButton" onClick={handleEdit} disabled={isLoading}>
                        {isLoading ? t("adminPanel.clinicEdit.buttons.loading") : t("adminPanel.clinicEdit.buttons.save")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ClinicEdit;