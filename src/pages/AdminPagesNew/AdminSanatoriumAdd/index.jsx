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
    useGetAllServiceQuery,
    usePostSanatoriumMutation
} from "../../../services/userApi.jsx";
import showToast from "../../../components/ToastMessage.js";
import {useTranslation} from "react-i18next";

function SanatoriumAdd() {
    const {t} = useTranslation();
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [postClinic, {isLoading}] = usePostSanatoriumMutation();
    // checkbox state-lərini sil, bunu əlavə et:
    const [serviceList, setServiceList] = useState([]);
    const [serviceForm, setServiceForm] = useState({
        name: "", nameEng: "", nameRu: "", nameAlm: "", nameArab: ""
    });

    const addService = () => {
        if (!serviceForm.name.trim()) {
            showToast(t("adminPanel.sanatoriumAdd.toast.emptyService"), "warning");
            return;
        }
        setServiceList((prev) => [...prev, {...serviceForm}]);
        setServiceForm({ name: "", nameEng: "", nameRu: "", nameAlm: "", nameArab: "" });
    };

    const removeService = (index) => {
        setServiceList((prev) => prev.filter((_, i) => i !== index));
    };
    const navigate = useNavigate();

    const [galereyaFiles, setGalereyaFiles] = useState([]);
    const [galereyaOpen, setGalereyaOpen] = useState(false);

    const [clinicVideos, setClinicVideos] = useState([]);
    const [videoInput, setVideoInput] = useState("");

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

    const [locationAz, setLocationAz] = useState("");
    const [locationEn, setLocationEn] = useState("");
    const [locationRu, setLocationRu] = useState("");
    const [locationAlm, setLocationAlm] = useState("");
    const [locationArab, setLocationArab] = useState("");

// Room type checkboxes
    const [selectedRooms, setSelectedRooms] = useState([]);

// Standard Room
    const [stdDescAz, setStdDescAz] = useState("");
    const [stdDescEn, setStdDescEn] = useState("");
    const [stdDescRu, setStdDescRu] = useState("");
    const [stdDescAlm, setStdDescAlm] = useState("");
    const [stdDescArab, setStdDescArab] = useState("");

// Comfort Room
    const [comfDescAz, setComfDescAz] = useState("");
    const [comfDescEn, setComfDescEn] = useState("");
    const [comfDescRu, setComfDescRu] = useState("");
    const [comfDescAlm, setComfDescAlm] = useState("");
    const [comfDescArab, setComfDescArab] = useState("");

// VIP Room
    const [vipDescAz, setVipDescAz] = useState("");
    const [vipDescEn, setVipDescEn] = useState("");
    const [vipDescRu, setVipDescRu] = useState("");
    const [vipDescAlm, setVipDescAlm] = useState("");
    const [vipDescArab, setVipDescArab] = useState("");

    const toggleRoom = (type) => {
        setSelectedRooms(prev =>
            prev.includes(type) ? prev.filter(r => r !== type) : [...prev, type]
        );
    };
    const handleGalereyaChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const withPreview = newFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setGalereyaFiles((prev) => [...prev, ...withPreview]);
    };

    const removeGalereya = (index) => {
        setGalereyaFiles((prev) => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[index].preview);
            updated.splice(index, 1);
            return updated;
        });
    };

    const toggleSelection = (id) => {
        setSelectedServices((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const addVideo = () => {
        const trimmed = videoInput.trim();
        if (!trimmed) return;
        setClinicVideos((prev) => [...prev, trimmed]);
        setVideoInput("");
    };

    const removeVideo = (index) => {
        setClinicVideos((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!selectedFile) {
            showToast(t("adminPanel.sanatoriumAdd.toast.noMainImage"), "warning");
            return;
        }

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

        formData.append("Location", locationAz);
        formData.append("LocationEng", locationEn);
        formData.append("LocationRu", locationRu);
        formData.append("LocationAlm", locationAlm);
        formData.append("LocationArab", locationArab);
// Standard Room
        formData.append("StandardRoomDescription", stdDescAz);
        formData.append("StandardRoomDescriptionEng", stdDescEn);
        formData.append("StandardRoomDescriptionRu", stdDescRu);
        formData.append("StandardRoomDescriptionAlm", stdDescAlm);
        formData.append("StandardRoomDescriptionArab", stdDescArab);

// Comfort Room
        formData.append("ComfortRoomDescription", comfDescAz);
        formData.append("ComfortRoomDescriptionEng", comfDescEn);
        formData.append("ComfortRoomDescriptionRu", comfDescRu);
        formData.append("ComfortRoomDescriptionAlm", comfDescAlm);
        formData.append("ComfortRoomDescriptionArab", comfDescArab);

// VIP Room
        formData.append("VipRoomDescription", vipDescAz);
        formData.append("VipRoomDescriptionEng", vipDescEn);
        formData.append("VipRoomDescriptionRu", vipDescRu);
        formData.append("VipRoomDescriptionAlm", vipDescAlm);
        formData.append("VipRoomDescriptionArab", vipDescArab);
        formData.append("SanatoriumCardImage", selectedFile);

        galereyaFiles.forEach((item) => {
            formData.append("Images", item.file);
        });

        clinicVideos.forEach((url) => {
            formData.append("Videos", url);
        });


        formData.append("serviceJson", JSON.stringify(serviceList));

        try {
            await postClinic(formData).unwrap();
            showToast(t("adminPanel.sanatoriumAdd.toast.success"), "success");

            setNameAz(""); setNameEn(""); setNameRu(""); setNameAlm(""); setNameArab("");
            setDescAz(""); setDescEn(""); setDescRu(""); setDescAlm(""); setDescArab("");
            setLocationAz(""); setLocationEn(""); setLocationRu(""); setLocationAlm(""); setLocationArab("");
            setSelectedFile(null);
            setGalereyaFiles([]);
            setClinicVideos([]);
            setVideoInput("");
            setServiceList([]);
            setServiceForm({ name: "", nameEng: "", nameRu: "", nameAlm: "", nameArab: "" });
            setSelectedRooms([]);
            setStdDescAz(""); setStdDescEn(""); setStdDescRu(""); setStdDescAlm(""); setStdDescArab("");
            setComfDescAz(""); setComfDescEn(""); setComfDescRu(""); setComfDescAlm(""); setComfDescArab("");
            setVipDescAz(""); setVipDescEn(""); setVipDescRu(""); setVipDescAlm(""); setVipDescArab("");
            navigate('/admin/sanatorium');
        } catch (err) {
            console.error("Xəta:", err);
            showToast(t("adminPanel.sanatoriumAdd.toast.error"), "error");
        }
    };

    return (
        <div id={'Sanatorium-add'}>
            <div className={'Sanatorium-add'}>
                <div className={"root"}>
                    <h2>
                        <NavLink className="link" to="/admin/sanatorium">
                            {t("adminPanel.sanatoriumAdd.breadcrumb.main")}
                        </NavLink>
                        <img src={rootIcon} alt=""/>
                        {t("adminPanel.sanatoriumAdd.breadcrumb.sub")}
                    </h2>
                </div>

                <div className={'Sanatorium-add-head'}>
                    <h1>{t("adminPanel.sanatoriumAdd.title")}</h1>
                    <p>{t("adminPanel.sanatoriumAdd.description")}</p>
                </div>

                <div className={'Sanatorium-add-main'}>

                    {/* 🔹 Ad + Şəkil */}
                    <div className={'Sanatorium-add-data'}>
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>{t("adminPanel.sanatoriumAdd.nameTitle")}</h3>
                                <p>{t("adminPanel.sanatoriumAdd.nameDescription")}</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input
                                            placeholder={t("adminPanel.sanatoriumAdd.placeholders.nameAz")}
                                            value={nameAz}
                                            onChange={(e) => setNameAz(e.target.value)}
                                        />
                                    </div>
                                    <img src={aze} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input
                                            placeholder={t("adminPanel.sanatoriumAdd.placeholders.nameRu")}
                                            value={nameRu}
                                            onChange={(e) => setNameRu(e.target.value)}
                                        />
                                    </div>
                                    <img src={rus} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input
                                            placeholder={t("adminPanel.sanatoriumAdd.placeholders.nameEn")}
                                            value={nameEn}
                                            onChange={(e) => setNameEn(e.target.value)}
                                        />
                                    </div>
                                    <img src={usa} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input
                                            placeholder={t("adminPanel.sanatoriumAdd.placeholders.nameAlm")}
                                            value={nameAlm}
                                            onChange={(e) => setNameAlm(e.target.value)}
                                        />
                                    </div>
                                    <img src={ger} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input
                                            placeholder={t("adminPanel.sanatoriumAdd.placeholders.nameArab")}
                                            value={nameArab}
                                            onChange={(e) => setNameArab(e.target.value)}
                                        />
                                    </div>
                                    <img src={arb} alt=""/>
                                </div>
                            </div>
                        </div>

                        {/* Yerləşmə (Location) - Yeni */}
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>{t("adminPanel.sanatoriumAdd.locationTitle")}</h3>
                                <p>{t("adminPanel.sanatoriumAdd.locationDescription")}</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input
                                            placeholder={t("adminPanel.sanatoriumAdd.placeholders.locationAz")}
                                            value={locationAz}
                                            onChange={(e) => setLocationAz(e.target.value)}
                                        />
                                    </div>
                                    <img src={aze} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input
                                            placeholder={t("adminPanel.sanatoriumAdd.placeholders.locationRu")}
                                            value={locationRu}
                                            onChange={(e) => setLocationRu(e.target.value)}
                                        />
                                    </div>
                                    <img src={rus} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input
                                            placeholder={t("adminPanel.sanatoriumAdd.placeholders.locationEn")}
                                            value={locationEn}
                                            onChange={(e) => setLocationEn(e.target.value)}
                                        />
                                    </div>
                                    <img src={usa} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input
                                            placeholder={t("adminPanel.sanatoriumAdd.placeholders.locationAlm")}
                                            value={locationAlm}
                                            onChange={(e) => setLocationAlm(e.target.value)}
                                        />
                                    </div>
                                    <img src={ger} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input
                                            placeholder={t("adminPanel.sanatoriumAdd.placeholders.locationArab")}
                                            value={locationArab}
                                            onChange={(e) => setLocationArab(e.target.value)}
                                        />
                                    </div>
                                    <img src={arb} alt=""/>
                                </div>
                            </div>
                        </div>

                        <div className="dataDiv images">
                            <div className="header">
                                <h3>{t("adminPanel.sanatoriumAdd.imageTitle")}</h3>
                                <p>{t("adminPanel.sanatoriumAdd.imageDescription")}</p>
                            </div>
                            <div
                                className={`uploadBox ${isDragging ? "dragging" : ""}`}
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                            >
                                <input
                                    type="file"
                                    id="sanatoriumImage"
                                    accept="image/*"
                                    onChange={(e) => setSelectedFile(e.target.files[0])}
                                    style={{display: "none"}}
                                />
                                <label htmlFor="sanatoriumImage" className="uploadArea">
                                    <img src={uploadIcon} alt="upload"/>
                                    <p>{t("adminPanel.sanatoriumAdd.uploadHint")}</p>
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

                    {/* 🔹 Təsvir */}
                    <div className={'tours-desc'}>
                        <div className={'header'}>
                            <h3>{t("adminPanel.sanatoriumAdd.descTitle")}</h3>
                            <p>{t("adminPanel.sanatoriumAdd.descDescription")}</p>
                        </div>
                        <div className={'tours-desc-data'}>
                            <div className={'tours-desc-texts'}>
                                <textarea
                                    placeholder={t("adminPanel.sanatoriumAdd.placeholders.descAz")}
                                    value={descAz}
                                    onChange={(e) => setDescAz(e.target.value)}
                                />
                                <div className={'langCountry'}>
                                    <img src={aze} alt=""/>
                                </div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea
                                    placeholder={t("adminPanel.sanatoriumAdd.placeholders.descRu")}
                                    value={descRu}
                                    onChange={(e) => setDescRu(e.target.value)}
                                />
                                <div className={'langCountry'}>
                                    <img src={rus} alt=""/>
                                </div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea
                                    placeholder={t("adminPanel.sanatoriumAdd.placeholders.descEn")}
                                    value={descEn}
                                    onChange={(e) => setDescEn(e.target.value)}
                                />
                                <div className={'langCountry'}>
                                    <img src={usa} alt=""/>
                                </div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea
                                    placeholder={t("adminPanel.sanatoriumAdd.placeholders.descAlm")}
                                    value={descAlm}
                                    onChange={(e) => setDescAlm(e.target.value)}
                                />
                                <div className={'langCountry'}>
                                    <img src={ger} alt=""/>
                                </div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea
                                    placeholder={t("adminPanel.sanatoriumAdd.placeholders.descArab")}
                                    value={descArab}
                                    onChange={(e) => setDescArab(e.target.value)}
                                />
                                <div className={'langCountry'}>
                                    <img src={arb} alt=""/>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* 🔹 Otaq növləri */}
                    <div className={'tours-desc'}>
                        <div className={'header'}>
                            <h3>{t("adminPanel.sanatoriumAdd.roomsTitle")}</h3>
                            <p>{t("adminPanel.sanatoriumAdd.roomsDescription")}</p>
                        </div>

                        {/* Checkbox-lar */}
                        <div style={{display: 'flex', gap: '24px', marginBottom: '16px'}}>
                            {[
                                {key: 'standard', label: 'Standart'},
                                {key: 'comfort', label: 'Comfort'},
                                {key: 'vip', label: 'VIP'},
                            ].map(room => (
                                <label key={room.key} style={{display:'flex', alignItems:'center', gap:'8px', cursor:'pointer', fontSize:'13px', fontWeight:'500'}}>
                                    <input
                                        type="checkbox"
                                        checked={selectedRooms.includes(room.key)}
                                        onChange={() => toggleRoom(room.key)}
                                        className="room-checkbox"
                                    />
                                    {room.label}
                                </label>
                            ))}
                        </div>

                        {/* Standard Room Description */}
                        {selectedRooms.includes('standard') && (
                            <div style={{marginBottom: '20px'}}>
                                <p style={{fontSize:'13px', fontWeight:'500', marginBottom:'10px', color:'#0A4080'}}>🛏 Standart Otaq</p>
                                <div className={'tours-desc-data'}>
                                    <div className={'tours-desc-texts'}>
                                        <textarea placeholder="Standart otaq təsviri (AZ)" value={stdDescAz} onChange={e => setStdDescAz(e.target.value)}/>
                                        <div className={'langCountry'}><img src={aze} alt=""/></div>
                                    </div>
                                    <div className={'tours-desc-texts'}>
                                        <textarea placeholder="Standart otaq təsviri (RU)" value={stdDescRu} onChange={e => setStdDescRu(e.target.value)}/>
                                        <div className={'langCountry'}><img src={rus} alt=""/></div>
                                    </div>
                                    <div className={'tours-desc-texts'}>
                                        <textarea placeholder="Standart otaq təsviri (EN)" value={stdDescEn} onChange={e => setStdDescEn(e.target.value)}/>
                                        <div className={'langCountry'}><img src={usa} alt=""/></div>
                                    </div>
                                    <div className={'tours-desc-texts'}>
                                        <textarea placeholder="Standart otaq təsviri (ALM)" value={stdDescAlm} onChange={e => setStdDescAlm(e.target.value)}/>
                                        <div className={'langCountry'}><img src={ger} alt=""/></div>
                                    </div>
                                    <div className={'tours-desc-texts'}>
                                        <textarea placeholder="Standart otaq təsviri (AR)" value={stdDescArab} onChange={e => setStdDescArab(e.target.value)}/>
                                        <div className={'langCountry'}><img src={arb} alt=""/></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Comfort Room Description */}
                        {selectedRooms.includes('comfort') && (
                            <div style={{marginBottom: '20px'}}>
                                <p style={{fontSize:'13px', fontWeight:'500', marginBottom:'10px', color:'#0A4080'}}>🛏 Comfort Otaq</p>
                                <div className={'tours-desc-data'}>
                                    <div className={'tours-desc-texts'}>
                                        <textarea placeholder="Comfort otaq təsviri (AZ)" value={comfDescAz} onChange={e => setComfDescAz(e.target.value)}/>
                                        <div className={'langCountry'}><img src={aze} alt=""/></div>
                                    </div>
                                    <div className={'tours-desc-texts'}>
                                        <textarea placeholder="Comfort otaq təsviri (RU)" value={comfDescRu} onChange={e => setComfDescRu(e.target.value)}/>
                                        <div className={'langCountry'}><img src={rus} alt=""/></div>
                                    </div>
                                    <div className={'tours-desc-texts'}>
                                        <textarea placeholder="Comfort otaq təsviri (EN)" value={comfDescEn} onChange={e => setComfDescEn(e.target.value)}/>
                                        <div className={'langCountry'}><img src={usa} alt=""/></div>
                                    </div>
                                    <div className={'tours-desc-texts'}>
                                        <textarea placeholder="Comfort otaq təsviri (ALM)" value={comfDescAlm} onChange={e => setComfDescAlm(e.target.value)}/>
                                        <div className={'langCountry'}><img src={ger} alt=""/></div>
                                    </div>
                                    <div className={'tours-desc-texts'}>
                                        <textarea placeholder="Comfort otaq təsviri (AR)" value={comfDescArab} onChange={e => setComfDescArab(e.target.value)}/>
                                        <div className={'langCountry'}><img src={arb} alt=""/></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* VIP Room Description */}
                        {selectedRooms.includes('vip') && (
                            <div style={{marginBottom: '20px'}}>
                                <p style={{fontSize:'13px', fontWeight:'500', marginBottom:'10px', color:'#0A4080'}}>👑 VIP Otaq</p>
                                <div className={'tours-desc-data'}>
                                    <div className={'tours-desc-texts'}>
                                        <textarea placeholder="VIP otaq təsviri (AZ)" value={vipDescAz} onChange={e => setVipDescAz(e.target.value)}/>
                                        <div className={'langCountry'}><img src={aze} alt=""/></div>
                                    </div>
                                    <div className={'tours-desc-texts'}>
                                        <textarea placeholder="VIP otaq təsviri (RU)" value={vipDescRu} onChange={e => setVipDescRu(e.target.value)}/>
                                        <div className={'langCountry'}><img src={rus} alt=""/></div>
                                    </div>
                                    <div className={'tours-desc-texts'}>
                                        <textarea placeholder="VIP otaq təsviri (EN)" value={vipDescEn} onChange={e => setVipDescEn(e.target.value)}/>
                                        <div className={'langCountry'}><img src={usa} alt=""/></div>
                                    </div>
                                    <div className={'tours-desc-texts'}>
                                        <textarea placeholder="VIP otaq təsviri (ALM)" value={vipDescAlm} onChange={e => setVipDescAlm(e.target.value)}/>
                                        <div className={'langCountry'}><img src={ger} alt=""/></div>
                                    </div>
                                    <div className={'tours-desc-texts'}>
                                        <textarea placeholder="VIP otaq təsviri (AR)" value={vipDescArab} onChange={e => setVipDescArab(e.target.value)}/>
                                        <div className={'langCountry'}><img src={arb} alt=""/></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* 🔹 Xidmətlər + Galereya + Videolar */}
                    <div className={'Sanatorium-add-data'}>

                        {/* Xidmətlər */}
                        <div className="dataDiv inputs xidmett">
                            <div className="header">
                                <h3>{t("adminPanel.sanatoriumAdd.servicesTitle")}</h3>
                                <p>{t("adminPanel.sanatoriumAdd.servicesDescription")}</p>
                            </div>
                            <div className="add-inputs">
                                <div className="add-data">
                                    <div className="add-input">
                                        <input
                                            placeholder={t("adminPanel.sanatoriumAdd.placeholders.serviceAz")}
                                            value={serviceForm.name}
                                            onChange={(e) => setServiceForm(p => ({...p, name: e.target.value}))}
                                        />
                                    </div>
                                    <img src={aze} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className="add-input">
                                        <input
                                            placeholder={t("adminPanel.sanatoriumAdd.placeholders.serviceRu")}
                                            value={serviceForm.nameRu}
                                            onChange={(e) => setServiceForm(p => ({...p, nameRu: e.target.value}))}
                                        />
                                    </div>
                                    <img src={rus} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className="add-input">
                                        <input
                                            placeholder={t("adminPanel.sanatoriumAdd.placeholders.serviceEn")}
                                            value={serviceForm.nameEng}
                                            onChange={(e) => setServiceForm(p => ({...p, nameEng: e.target.value}))}
                                        />
                                    </div>
                                    <img src={usa} alt=""/>
                                </div>

                                <div className="add-data">
                                    <div className="add-input">
                                        <input
                                            placeholder={t("adminPanel.sanatoriumAdd.placeholders.serviceAlm")}
                                            value={serviceForm.nameAlm}
                                            onChange={(e) => setServiceForm(p => ({...p, nameAlm: e.target.value}))}
                                        />
                                    </div>
                                    <img src={ger} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className="add-input">
                                        <input
                                            placeholder={t("adminPanel.sanatoriumAdd.placeholders.serviceArab")}
                                            value={serviceForm.nameArab}
                                            onChange={(e) => setServiceForm(p => ({...p, nameArab: e.target.value}))}
                                        />
                                    </div>
                                    <img src={arb} alt=""/>
                                </div>
                            </div>

                            <button type="button" className="video-add-btn" onClick={addService}>
                                {t("adminPanel.sanatoriumAdd.buttons.addService")}
                            </button>

                            {serviceList.length > 0 && (
                                <div className="uploadedList" style={{marginTop: "10px"}}>
                                    {serviceList.map((s, index) => (
                                        <div key={index} className="uploadedItem">
                                            <div className="fileLeft" style={{width: '100%'}}>
                                                <div style={{display:'flex', alignItems:'center', gap:'6px', width:'100%'}}>
                                                    <img src={aze} alt="" style={{width:'18px', height:'18px', flexShrink:0}}/>
                                                    <input
                                                        value={s.name || ""}
                                                        onChange={(e) => {
                                                            const updated = [...serviceList];
                                                            updated[index] = {...updated[index], name: e.target.value};
                                                            setServiceList(updated);
                                                        }}
                                                        style={{flex:1, height:'28px', border:'0.5px solid #B7B7B7', borderRadius:'4px', padding:'0 8px', fontSize:'12px', outline:'none'}}
                                                    />
                                                </div>
                                                <div style={{display:'flex', alignItems:'center', gap:'6px', width:'100%'}}>
                                                    <img src={rus} alt="" style={{width:'18px', height:'18px', flexShrink:0}}/>
                                                    <input
                                                        value={s.nameRu || ""}
                                                        onChange={(e) => {
                                                            const updated = [...serviceList];
                                                            updated[index] = {...updated[index], nameRu: e.target.value};
                                                            setServiceList(updated);
                                                        }}
                                                        style={{flex:1, height:'28px', border:'0.5px solid #B7B7B7', borderRadius:'4px', padding:'0 8px', fontSize:'12px', outline:'none'}}
                                                    />
                                                </div>
                                                <div style={{display:'flex', alignItems:'center', gap:'6px', width:'100%'}}>
                                                    <img src={usa} alt="" style={{width:'18px', height:'18px', flexShrink:0}}/>
                                                    <input
                                                        value={s.nameEng || ""}
                                                        onChange={(e) => {
                                                            const updated = [...serviceList];
                                                            updated[index] = {...updated[index], nameEng: e.target.value};
                                                            setServiceList(updated);
                                                        }}
                                                        style={{flex:1, height:'28px', border:'0.5px solid #B7B7B7', borderRadius:'4px', padding:'0 8px', fontSize:'12px', outline:'none'}}
                                                    />
                                                </div>
                                                <div style={{display:'flex', alignItems:'center', gap:'6px', width:'100%'}}>
                                                    <img src={ger} alt="" style={{width:'18px', height:'18px', flexShrink:0}}/>
                                                    <input
                                                        value={s.nameAlm || ""}
                                                        onChange={(e) => {
                                                            const updated = [...serviceList];
                                                            updated[index] = {...updated[index], nameAlm: e.target.value};
                                                            setServiceList(updated);
                                                        }}
                                                        style={{flex:1, height:'28px', border:'0.5px solid #B7B7B7', borderRadius:'4px', padding:'0 8px', fontSize:'12px', outline:'none'}}
                                                    />
                                                </div>
                                                <div style={{display:'flex', alignItems:'center', gap:'6px', width:'100%'}}>
                                                    <img src={arb} alt="" style={{width:'18px', height:'18px', flexShrink:0}}/>
                                                    <input
                                                        value={s.nameArab || ""}
                                                        onChange={(e) => {
                                                            const updated = [...serviceList];
                                                            updated[index] = {...updated[index], nameArab: e.target.value};
                                                            setServiceList(updated);
                                                        }}
                                                        style={{flex:1, height:'28px', border:'0.5px solid #B7B7B7', borderRadius:'4px', padding:'0 8px', fontSize:'12px', outline:'none'}}
                                                    />
                                                </div>
                                            </div>
                                            <button onClick={() => removeService(index)} style={{alignSelf:'flex-start', marginTop:'4px'}}>✕</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Galereya */}
                        <div className="dataDiv images multi">
                            <div className="header">
                                <h3>{t("adminPanel.sanatoriumAdd.galleryTitle")}</h3>
                                <p>{t("adminPanel.sanatoriumAdd.galleryDescription")}</p>
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
                                    <p>{t("adminPanel.sanatoriumAdd.uploadHint")}</p>
                                </label>
                            </div>
                            <div className="uploadedHeader" onClick={() => setGalereyaOpen((p) => !p)}>
                                <span>{t("adminPanel.sanatoriumAdd.uploadedHeader")}</span>
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

                        {/* Videolar */}
                        <div className="dataDiv images multi">
                            <div className="header">
                                <h3>{t("adminPanel.sanatoriumAdd.videosTitle")}</h3>
                                <p>{t("adminPanel.sanatoriumAdd.videosDescription")}</p>
                            </div>
                            <div className="video-input-row">
                                <div className="add-input">
                                    <input
                                        placeholder={t("adminPanel.sanatoriumAdd.placeholders.videoUrl")}
                                        value={videoInput}
                                        onChange={(e) => setVideoInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && addVideo()}
                                    />
                                </div>
                                <button type="button" className="video-add-btn" onClick={addVideo}>
                                    {t("adminPanel.sanatoriumAdd.buttons.addVideo")}
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

                    <button className="submitButton" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading
                            ? t("adminPanel.sanatoriumAdd.buttons.loading")
                            : t("adminPanel.sanatoriumAdd.buttons.save")
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SanatoriumAdd;