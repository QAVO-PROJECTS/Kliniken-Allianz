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
function ClinicAdd() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [postClinic, { isLoading }] = usePostClinicMutation();
    const {data:getAllService} = useGetAllServiceQuery()
    const servis = getAllService?.data
    const {data:getAllOtels} = useGetAllOtelsQuery()
    const otels = getAllOtels?.data
    const {data:getAllDoctors} = useGetAllDoctorsQuery()
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
            showToast("Zəhmət olmasa əsas şəkli əlavə edin.", "warning");
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
            showToast("Klinika uğurla əlavə olundu ✅", "success");

            // Reset form
            setNameAz(""); setNameEn(""); setNameRu("");
            setDescAz(""); setDescEn(""); setDescRu("");
            setLocationAz(""); setLocationEn(""); setLocationRu("");
            setSelectedFile(null);
            setSertifikatFiles([]);
            setGalereyaFiles([]);
            setSelectedServices([]);
            setSelectedDoctors([]);
            setSelectedOtels([]);
            navigate('/admin/clinic')
        } catch (err) {
            console.error("Xəta:", err);
            showToast("Klinika əlavə olunarkən xəta baş verdi ❌", "error");
        }
    };
    return (
        <div id={'clinic-add'}>
            <div className={'clinic-add'}>
                <div className={"root"}>
                    <h2>
                        <NavLink className="link" to="/admin/clinic">Klinika</NavLink>
                        <img src={rootIcon} alt="" />
                        Yeni klinika yarat
                    </h2>
                </div>
                <div className={'clinic-add-head'}>
                    <h1>Yeni klinika yarat</h1>
                    <p>Buradan klinikaları idarə edə və yenilərini yarada bilərsiniz.</p>
                </div>
                <div className={'clinic-add-main'}>
                    <div className={'clinic-add-data'}>
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>Klinika adı</h3>
                                <p>Xidmətin sistemdə görünəcək adını daxil edin.</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                    <input placeholder="Ad (AZ)" value={nameAz} onChange={(e) => setNameAz(e.target.value)} />
                                    </div>
                                    <img src={aze} alt="" />
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>

                                    <input placeholder="Ad (RU)" value={nameRu} onChange={(e) => setNameRu(e.target.value)} />
                                    </div>
                                    <img src={rus} alt="" />
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>

                                    <input placeholder="Ad (EN)" value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
                                    </div>
                                    <img src={usa} alt="" />
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
                                <h3>Klinika şəkil</h3>
                                <p>Klinikanı təmsil edəcək şəkil yükləyin.</p>
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
                    <div className={'tours-desc'}>
                        <div className={'header'}>
                            <h3>Təsvir</h3>
                            <p>Paketin qısa təsvirini yazın.</p>
                        </div>
                        <div className={'tours-desc-data'}>
                            <div className={'tours-desc-texts'}>
                                <textarea placeholder="Təsvir (AZ)" value={descAz} onChange={(e) => setDescAz(e.target.value)} />
                                <div className={'langCountry'}>
                                    <img src={aze} alt=""/>
                                </div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea placeholder="Təsvir (RU)" value={descRu} onChange={(e) => setDescRu(e.target.value)} />
                                <div className={'langCountry'}>
                                    <img src={rus} alt=""/>
                                </div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea placeholder="Təsvir (EN)" value={descEn} onChange={(e) => setDescEn(e.target.value)} />
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
                                <h3>Xidmətlər</h3>
                                <p>Xidmətin əlaqəli olduğu klinikanı seçin.</p>
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
                                <h3>Doktor</h3>
                                <p>Xidmətin əlaqəli olduğu doktorları seçin.</p>
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
                                <h3>Oteller</h3>
                                <p>Xidmətin əlaqəli olduğu otelleri seçin.</p>
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
                                <h3>Yerləşdiyi ölkənin adı</h3>
                                <p>Otelin yerləşdiyi ölkəni dillərə əsasən daxil edin.</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder="Ölkə (AZ)" value={locationAz} onChange={(e) => setLocationAz(e.target.value)} />

                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={aze} alt="" />
                                    </div>
                                </div>

                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder="Ölkə (RU)" value={locationRu} onChange={(e) => setLocationRu(e.target.value)} />

                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={rus} alt="" />
                                    </div>
                                </div>

                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder="Ölkə (EN)" value={locationEn} onChange={(e) => setLocationEn(e.target.value)} />

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
                        <div className="dataDiv images multi">
                            <div className="header">
                                <h3>Sertifikat</h3>
                                <p>Klinikanı təmsil edəcək sertifikatları yükləyin.</p>
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

                        {/* 🖼 Galereya */}
                        <div className="dataDiv images multi">
                            <div className="header">
                                <h3>Galereya</h3>
                                <p>Klinikanın mövcud şəkillərini yükləyin.</p>
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
                                    <p>Faylı yükləmək üçün bu sahəyə klikləyin və ya sürükləyin</p>
                                </label>
                            </div>

                            <div className="uploadedHeader" onClick={() => setGalereyaOpen((p) => !p)}>
                                <span>Yüklənənlər</span>
                                <img src={galereyaOpen ? openIcon : closeIcon} alt="toggle" />
                            </div>

                            {galereyaOpen && galereyaFiles.length > 0 && (
                                <div className="uploadedList">
                                    {galereyaFiles.map((item, index) => (
                                        <div key={index} className="uploadedItem">
                                            <div className="fileLeft">
                                                <img src={item.preview} alt="preview" className="filePreview" />
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
                        {isLoading ? "Yüklənir..." : "Yadda saxla"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ClinicAdd;