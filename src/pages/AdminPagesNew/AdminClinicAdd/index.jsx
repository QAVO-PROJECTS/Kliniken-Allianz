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
import {
    useGetAllDoctorsQuery,
    useGetAllOtelsQuery,
    useGetAllServiceQuery,
    usePostClinicMutation
} from "../../../services/userApi.jsx";
import showToast from "../../../components/ToastMessage.js";
import {useTranslation} from "react-i18next";

function ClinicAdd() {
    const {t} = useTranslation();
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [postClinic, {isLoading}] = usePostClinicMutation();
    const {data: getAllService} = useGetAllServiceQuery()
    const servis = getAllService?.data
    const {data: getAllOtels} = useGetAllOtelsQuery()
    const otels = getAllOtels?.data
    const {data: getAllDoctors} = useGetAllDoctorsQuery()
    const doctors = getAllDoctors?.data
    // 🔹 Ayrı state-lər
    const navigate = useNavigate();
    const [sertifikatFiles, setSertifikatFiles] = useState([]);
    const [sertifikatOpen, setSertifikatOpen] = useState(false);

    const [galereyaFiles, setGalereyaFiles] = useState([]);
    const [galereyaOpen, setGalereyaOpen] = useState(false);
    const [nameAz, setNameAz] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [nameRu, setNameRu] = useState("");

    const [descAz, setDescAz] = useState("");
    const [descEn, setDescEn] = useState("");
    const [descRu, setDescRu] = useState("");

    const [locationAz, setLocationAz] = useState("");
    const [locationEn, setLocationEn] = useState("");
    const [locationRu, setLocationRu] = useState("");

// Checkbox seçilən elementlər
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedDoctors, setSelectedDoctors] = useState([]);
    const [selectedOtels, setSelectedOtels] = useState([]);

    // 🔹 Sertifikat yükləmə funksiyası
    const handleSertifikatChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const withPreview = newFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setSertifikatFiles((prev) => [...prev, ...withPreview]);
    };

    // 🔹 Galereya yükləmə funksiyası
    const handleGalereyaChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const withPreview = newFiles.map((file) => ({
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
        setList((prev) =>
            prev.includes(id)
                ? prev.filter((x) => x !== id)
                : [...prev, id]
        );
    };
    const handleSubmit = async () => {
        if (!selectedFile) {
            showToast(t("adminPanel.clinicAdd.toast.noMainImage"), "warning");
            return;
        }

        const formData = new FormData();

        // 🔹 Adlar
        formData.append("name", nameAz);
        formData.append("nameEng", nameEn);
        formData.append("nameRu", nameRu);
        // Əgər Alman və Ərəb də olacaqsa əlavə et:
        // formData.append("NameAlm", nameDe);
        // formData.append("NameArab", nameAr);

        // 🔹 Təsvirlər
        formData.append("description", descAz);
        formData.append("descriptionEng", descEn);
        formData.append("descriptionRu", descRu);

        // 🔹 Məkan
        formData.append("location", locationAz);
        formData.append("locationEng", locationEn);
        formData.append("locationRu", locationRu);

        // 🔹 Əsas şəkil
        formData.append("clinicCardImage", selectedFile);

        // 🔹 Sertifikat şəkilləri
        sertifikatFiles.forEach((item) => {
            formData.append("clinicCertificates", item.file);
        });

        // 🔹 Qalereya şəkilləri
        galereyaFiles.forEach((item) => {
            formData.append("clinicImages", item.file);
        });

        // 🔹 Checkbox seçimləri (xidmət, doktor, otel)
        selectedServices.forEach((id) => formData.append("clinicServiceIds", id));
        selectedDoctors.forEach((id) => formData.append("doctorIds", id));
        selectedOtels.forEach((id) => formData.append("otelIds", id));

        try {
            const res = await postClinic(formData).unwrap();
            showToast(t("adminPanel.clinicAdd.toast.success"), "success");

            // Reset form
            setNameAz("");
            setNameEn("");
            setNameRu("");
            setDescAz("");
            setDescEn("");
            setDescRu("");
            setLocationAz("");
            setLocationEn("");
            setLocationRu("");
            setSelectedFile(null);
            setSertifikatFiles([]);
            setGalereyaFiles([]);
            setSelectedServices([]);
            setSelectedDoctors([]);
            setSelectedOtels([]);
            navigate('/admin/clinic')
        } catch (err) {
            console.error("Xəta:", err);
            showToast(t("adminPanel.clinicAdd.toast.error"), "error");
        }
    };
    return (
        <div id={'clinic-add'}>
            <div className={'clinic-add'}>
                <div className={"root"}>
                    <h2>
                        <NavLink className="link"
                                 to="/admin/clinic"> {t("adminPanel.clinicAdd.breadcrumb.main")}</NavLink>
                        <img src={rootIcon} alt=""/>
                        {t("adminPanel.clinicAdd.breadcrumb.sub")}
                    </h2>
                </div>
                <div className={'clinic-add-head'}>
                    <h1>{t("adminPanel.clinicAdd.title")}</h1>
                    <p>{t("adminPanel.clinicAdd.description")}</p>
                </div>
                <div className={'clinic-add-main'}>
                    <div className={'clinic-add-data'}>
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>{t("adminPanel.clinicAdd.nameTitle")}</h3>
                                <p>{t("adminPanel.clinicAdd.nameDescription")}</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input placeholder={t("adminPanel.clinicAdd.placeholders.nameAz")}
                                               value={nameAz} onChange={(e) => setNameAz(e.target.value)}/>
                                    </div>
                                    <img src={aze} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>

                                        <input placeholder={t("adminPanel.clinicAdd.placeholders.nameRu")}
                                               value={nameRu} onChange={(e) => setNameRu(e.target.value)}/>
                                    </div>
                                    <img src={rus} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>

                                        <input placeholder={t("adminPanel.clinicAdd.placeholders.nameEn")}
                                               value={nameEn} onChange={(e) => setNameEn(e.target.value)}/>
                                    </div>
                                    <img src={usa} alt=""/>
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
                                <h3>{t("adminPanel.clinicAdd.imageTitle")}</h3>
                                <p>{t("adminPanel.clinicAdd.imageDescription")}</p>
                            </div>
                            <div
                                className={`uploadBox ${isDragging ? "dragging" : ""}`}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setIsDragging(true);
                                }}
                                onDragLeave={() => setIsDragging(false)}
                            >
                                <input
                                    type="file"
                                    id="clinicImage"
                                    accept="image/*"
                                    onChange={(e) => setSelectedFile(e.target.files[0])}
                                    style={{display: "none"}}
                                />
                                <label htmlFor="clinicImage" className="uploadArea">
                                    <img src={uploadIcon} alt="upload"/>
                                    <p>{t("adminPanel.clinicAdd.uploadHint")}</p>
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
                    <div className={'tours-desc'}>
                        <div className={'header'}>
                            <h3>{t("adminPanel.clinicAdd.descTitle")}</h3>
                            <p>{t("adminPanel.clinicAdd.descDescription")}</p>
                        </div>
                        <div className={'tours-desc-data'}>
                            <div className={'tours-desc-texts'}>
                                <textarea placeholder={t("adminPanel.clinicAdd.placeholders.descAz")} value={descAz}
                                          onChange={(e) => setDescAz(e.target.value)}/>
                                <div className={'langCountry'}>
                                    <img src={aze} alt=""/>
                                </div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea placeholder={t("adminPanel.clinicAdd.placeholders.descRu")} value={descRu}
                                          onChange={(e) => setDescRu(e.target.value)}/>
                                <div className={'langCountry'}>
                                    <img src={rus} alt=""/>
                                </div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea placeholder={t("adminPanel.clinicAdd.placeholders.descEn")} value={descEn}
                                          onChange={(e) => setDescEn(e.target.value)}/>
                                <div className={'langCountry'}>
                                    <img src={usa} alt=""/>
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
                    <div className={'clinic-add-data'}>
                        <div className={"dataDiv images2"}>
                            <div className={'header'}>
                                <h3>{t("adminPanel.clinicAdd.servicesTitle")}</h3>
                                <p>{t("adminPanel.clinicAdd.servicesDescription")}</p>
                            </div>
                            <div className={'addCategory'}>
                                {servis?.map((item, index) => (
                                    <label key={item.id} className="checkboxItem">
                                        <input
                                            type="checkbox"
                                            checked={selectedServices.includes(item.id)}
                                            onChange={() => toggleSelection(item.id, selectedServices, setSelectedServices)}

                                        />
                                        <span>{item.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className={"dataDiv images2"}>
                            <div className={'header'}>
                                <h3>{t("adminPanel.clinicAdd.doctorsTitle")}</h3>
                                <p>{t("adminPanel.clinicAdd.doctorsDescription")}</p>
                            </div>
                            <div className={'addCategory'}>
                                {doctors?.map((item, index) => (
                                    <label key={item.id} className="checkboxItem">
                                        <input
                                            type="checkbox"
                                            checked={selectedDoctors.includes(item.id)}
                                            onChange={() => toggleSelection(item.id, selectedDoctors, setSelectedDoctors)}

                                        />
                                        <span>{item.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className={"dataDiv images2"}>
                            <div className={'header'}>
                                <h3>{t("adminPanel.clinicAdd.hotelsTitle")}</h3>
                                <p>{t("adminPanel.clinicAdd.hotelsDescription")}</p>
                            </div>
                            <div className={'addCategory'}>
                                {otels?.map((item, index) => (
                                    <label key={item.id} className="checkboxItem">
                                        <input
                                            type="checkbox"
                                            checked={selectedOtels.includes(item.id)}
                                            onChange={() => toggleSelection(item.id, selectedOtels, setSelectedOtels)}
                                        />
                                        <span>{item.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>{t("adminPanel.clinicAdd.locationTitle")}</h3>
                                <p>{t("adminPanel.clinicAdd.locationDescription")}</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder={t("adminPanel.clinicAdd.placeholders.locationAz")}
                                               value={locationAz} onChange={(e) => setLocationAz(e.target.value)}/>

                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={aze} alt=""/>
                                    </div>
                                </div>

                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder={t("adminPanel.clinicAdd.placeholders.locationRu")}
                                               value={locationRu} onChange={(e) => setLocationRu(e.target.value)}/>

                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={rus} alt=""/>
                                    </div>
                                </div>

                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder={t("adminPanel.clinicAdd.placeholders.locationEn")}
                                               value={locationEn} onChange={(e) => setLocationEn(e.target.value)}/>

                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={usa} alt=""/>
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
                        <div className="dataDiv images multi">
                            <div className="header">
                                <h3>{t("adminPanel.clinicAdd.certificateTitle")}</h3>
                                <p>{t("adminPanel.clinicAdd.certificateDescription")}</p>
                            </div>

                            <div className="uploadBox">
                                <input
                                    type="file"
                                    id="sertifikat-fileInput"
                                    accept="image/*"
                                    multiple
                                    onChange={handleSertifikatChange}
                                    style={{display: "none"}}
                                />
                                <label htmlFor="sertifikat-fileInput" className="uploadArea">
                                    <img src={uploadIcon} alt="upload"/>
                                    <p>{t("adminPanel.clinicAdd.uploadHint")}</p>
                                </label>
                            </div>

                            <div className="uploadedHeader" onClick={() => setSertifikatOpen((p) => !p)}>
                                <span>{t("adminPanel.clinicAdd.uploadedHeader")}</span>
                                <img src={sertifikatOpen ? openIcon : closeIcon} alt="toggle"/>
                            </div>

                            {sertifikatOpen && sertifikatFiles.length > 0 && (
                                <div className="uploadedList">
                                    {sertifikatFiles.map((item, index) => (
                                        <div key={index} className="uploadedItem">
                                            <div className="fileLeft">
                                                <img src={item.preview} alt="preview" className="filePreview"/>
                                                <span>{item.file.name}</span>
                                            </div>
                                            <button onClick={() => removeSertifikat(index)}>✕</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 🖼 Galereya */}
                        <div className="dataDiv images multi">
                            <div className="header">
                                <h3>{t("adminPanel.clinicAdd.galleryTitle")}</h3>
                                <p>{t("adminPanel.clinicAdd.galleryDescription")}</p>
                            </div>

                            <div className="uploadBox">
                                <input
                                    type="file"
                                    id="galereya-fileInput"
                                    accept="image/*"
                                    multiple
                                    onChange={handleGalereyaChange}
                                    style={{display: "none"}}
                                />
                                <label htmlFor="galereya-fileInput" className="uploadArea">
                                    <img src={uploadIcon} alt="upload"/>
                                    <p>{t("adminPanel.clinicAdd.uploadHint")}</p>
                                </label>
                            </div>

                            <div className="uploadedHeader" onClick={() => setGalereyaOpen((p) => !p)}>
                                <span>{t("adminPanel.clinicAdd.uploadedHeader")}</span>
                                <img src={galereyaOpen ? openIcon : closeIcon} alt="toggle"/>
                            </div>

                            {galereyaOpen && galereyaFiles.length > 0 && (
                                <div className="uploadedList">
                                    {galereyaFiles.map((item, index) => (
                                        <div key={index} className="uploadedItem">
                                            <div className="fileLeft">
                                                <img src={item.preview} alt="preview" className="filePreview"/>
                                                <span>{item.file.name}</span>
                                            </div>
                                            <button onClick={() => removeGalereya(index)}>✕</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>


                    </div>
                    <button className="submitButton" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? t("adminPanel.clinicAdd.buttons.loading") : t("adminPanel.clinicAdd.buttons.save")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ClinicAdd;