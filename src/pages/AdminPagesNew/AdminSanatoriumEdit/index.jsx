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
    useGetSanatoriumByIdQuery,
    usePutSanatoriumMutation
} from "../../../services/userApi.jsx";
import {SANATORIUM_CARD_IMAGES, SANATORIUM_IMAGES} from "../../../contants.js";
import showToast from "../../../components/ToastMessage.js";
import {useTranslation} from "react-i18next";

function SanatoriumEdit() {
    const {t} = useTranslation();
    const {id} = useParams();
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);

    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [editSanatorium, {isLoading}] = usePutSanatoriumMutation();
    const {data: getSanatoriumById, refetch} = useGetSanatoriumByIdQuery(id);
    const sanatorium = getSanatoriumById?.data;

    // 🔹 Ad
    const [nameAz, setNameAz] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [nameRu, setNameRu] = useState("");
    const [nameAlm, setNameAlm] = useState("");
    const [nameArab, setNameArab] = useState("");

    // 🔹 Təsvir
    const [descAz, setDescAz] = useState("");
    const [descEn, setDescEn] = useState("");
    const [descRu, setDescRu] = useState("");
    const [descAlm, setDescAlm] = useState("");
    const [descArab, setDescArab] = useState("");

    // 🔹 Yerləşmə
    const [locationAz, setLocationAz] = useState("");
    const [locationEn, setLocationEn] = useState("");
    const [locationRu, setLocationRu] = useState("");
    const [locationAlm, setLocationAlm] = useState("");
    const [locationArab, setLocationArab] = useState("");

    // 🔹 Şəkillər
    const [oldMainImage, setOldMainImage] = useState(null);
    const [galereyaFiles, setGalereyaFiles] = useState([]);
    const [oldGalereyaFiles, setOldGalereyaFiles] = useState([]);
    const [galereyaOpen, setGalereyaOpen] = useState(false);
    const [deleteImages, setDeleteImages] = useState([]);

    // 🔹 Videolar
    const [videos, setVideos] = useState([]);
    const [videoInput, setVideoInput] = useState("");
    const [addedVideos, setAddedVideos] = useState([]);
    const [deleteVideos, setDeleteVideos] = useState([]);

    // 🔹 Xidmətlər
    const [serviceList, setServiceList] = useState([]);
    const [addedServices, setAddedServices] = useState([]);      // yeni əlavə olunanlar
    const [deleteServiceIds, setDeleteServiceIds] = useState([]); // silinənlərin id-ləri
    const [serviceForm, setServiceForm] = useState({
        name: "", nameEng: "", nameRu: "", nameAlm: "", nameArab: ""
    });
// Room type checkboxes
    const [selectedRooms, setSelectedRooms] = useState([]);

// Standard Room
    const [stdDescAz, setStdDescAz] = useState("");
    const [stdDescEn, setStdDescEn] = useState("");
    const [stdDescRu, setStdDescRu] = useState("");
    const [stdDescAlm, setStdDescAlm] = useState("");
    const [stdDescArab, setStdDescArab] = useState("");
    const [editedServices, setEditedServices] = useState([]);
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
    useEffect(() => {
        refetch();
    }, []);

    useEffect(() => {
        if (sanatorium && !isLoaded) {
            setNameAz(sanatorium.name || "");
            setNameEn(sanatorium.nameEng || "");
            setNameRu(sanatorium.nameRu || "");
            setNameAlm(sanatorium.nameAlm || "");
            setNameArab(sanatorium.nameArab || "");

            setDescAz(sanatorium.description || "");
            setDescEn(sanatorium.descriptionEng || "");
            setDescRu(sanatorium.descriptionRu || "");
            setDescAlm(sanatorium.descriptionAlm || "");
            setDescArab(sanatorium.descriptionArab || "");

            setLocationAz(sanatorium.location || "");
            setLocationEn(sanatorium.locationEng || "");
            setLocationRu(sanatorium.locationRu || "");
            setLocationAlm(sanatorium.locationAlm || "");
            setLocationArab(sanatorium.locationArab || "");

            setOldMainImage(sanatorium.sanatoriumCardImage || null);
            setOldGalereyaFiles(sanatorium.images || []);
            setVideos(sanatorium.videos || []);
            setServiceList(sanatorium.services || []);
            setIsLoaded(true);
            setServiceList(sanatorium.services || []);
            // Standard Room
            const stdDesc = sanatorium.standardRoomDescription || "";
            const stdDescEng = sanatorium.standardRoomDescriptionEng || "";
            const stdDescRuVal = sanatorium.standardRoomDescriptionRu || "";
            const stdDescAlmVal = sanatorium.standardRoomDescriptionAlm || "";
            const stdDescArabVal = sanatorium.standardRoomDescriptionArab || "";

// Comfort Room
            const comfDesc = sanatorium.comfortRoomDescription || "";
            const comfDescEng = sanatorium.comfortRoomDescriptionEng || "";
            const comfDescRuVal = sanatorium.comfortRoomDescriptionRu || "";
            const comfDescAlmVal = sanatorium.comfortRoomDescriptionAlm || "";
            const comfDescArabVal = sanatorium.comfortRoomDescriptionArab || "";

// VIP Room
            const vipDesc = sanatorium.vipRoomDescription || "";
            const vipDescEng = sanatorium.vipRoomDescriptionEng || "";
            const vipDescRuVal = sanatorium.vipRoomDescriptionRu || "";
            const vipDescAlmVal = sanatorium.vipRoomDescriptionAlm || "";
            const vipDescArabVal = sanatorium.vipRoomDescriptionArab || "";

            setStdDescAz(stdDesc); setStdDescEn(stdDescEng); setStdDescRu(stdDescRuVal);
            setStdDescAlm(stdDescAlmVal); setStdDescArab(stdDescArabVal);

            setComfDescAz(comfDesc); setComfDescEn(comfDescEng); setComfDescRu(comfDescRuVal);
            setComfDescAlm(comfDescAlmVal); setComfDescArab(comfDescArabVal);

            setVipDescAz(vipDesc); setVipDescEn(vipDescEng); setVipDescRu(vipDescRuVal);
            setVipDescAlm(vipDescAlmVal); setVipDescArab(vipDescArabVal);

// Mövcud dolu olanları avtomatik seç
            const preSelected = [];
            if (stdDesc) preSelected.push('standard');
            if (comfDesc) preSelected.push('comfort');
            if (vipDesc) preSelected.push('vip');
            setSelectedRooms(preSelected);
        }
    }, [sanatorium, isLoaded]);

    // 🔹 Galereya
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

    const removeOldGalereya = (fileName) => {
        setOldGalereyaFiles((prev) => prev.filter(f => f !== fileName));
        setDeleteImages((prev) => [...prev, fileName]);
    };

    // 🔹 Videolar
    const addVideo = () => {
        const trimmed = videoInput.trim();
        if (!trimmed) return;
        setVideos((prev) => [...prev, trimmed]);
        setAddedVideos((prev) => [...prev, trimmed]);
        setVideoInput("");
    };

    const removeVideo = (index) => {
        const url = videos[index];
        if (addedVideos.includes(url)) {
            const findIdx = addedVideos.indexOf(url);
            if (findIdx > -1) {
                const newAdded = [...addedVideos];
                newAdded.splice(findIdx, 1);
                setAddedVideos(newAdded);
            }
        } else if (sanatorium.videos?.includes(url)) {
            setDeleteVideos((prev) => [...prev, url]);
        }
        setVideos((prev) => prev.filter((_, i) => i !== index));
    };

    // 🔹 Xidmətlər
    const addService = () => {
        if (!serviceForm.name.trim()) {
            showToast(t("adminPanel.sanatoriumEdit.toast.emptyService"), "warning");
            return;
        }
        const newService = { ...serviceForm };
        setServiceList((prev) => [...prev, newService]);
        setAddedServices((prev) => [...prev, newService]); // yalnız yeniləri izlə
        setServiceForm({ name: "", nameEng: "", nameRu: "", nameAlm: "", nameArab: "" });
    };

    const removeService = (index) => {
        const service = serviceList[index];

        if (service.id) {
            // Köhnə xidmətdir — id-ni sil siyahısına əlavə et
            setDeleteServiceIds((prev) => [...prev, service.id]);
        } else {
            // Yeni əlavə olunan — addedServices-dən çıxar
            setAddedServices((prev) =>
                prev.filter((s) => s.name !== service.name)
            );
        }

        setServiceList((prev) => prev.filter((_, i) => i !== index));
    };

    // 🔹 köməkçi
    const appendIfChanged = (formData, key, newVal, oldVal) => {
        if (newVal !== oldVal && newVal !== undefined && newVal !== null && newVal !== "") {
            formData.append(key, newVal);
        }
    };

    const handleEdit = async () => {
        if (!sanatorium) return;

        const formData = new FormData();

        formData.append("id", sanatorium.id);

        appendIfChanged(formData, "Name", nameAz, sanatorium.name);
        appendIfChanged(formData, "NameEng", nameEn, sanatorium.nameEng);
        appendIfChanged(formData, "NameRu", nameRu, sanatorium.nameRu);
        appendIfChanged(formData, "NameAlm", nameAlm, sanatorium.nameAlm);
        appendIfChanged(formData, "NameArab", nameArab, sanatorium.nameArab);

        appendIfChanged(formData, "Description", descAz, sanatorium.description);
        appendIfChanged(formData, "DescriptionEng", descEn, sanatorium.descriptionEng);
        appendIfChanged(formData, "DescriptionRu", descRu, sanatorium.descriptionRu);
        appendIfChanged(formData, "DescriptionAlm", descAlm, sanatorium.descriptionAlm);
        appendIfChanged(formData, "DescriptionArab", descArab, sanatorium.descriptionArab);

        appendIfChanged(formData, "Location", locationAz, sanatorium.location);
        appendIfChanged(formData, "LocationEng", locationEn, sanatorium.locationEng);
        appendIfChanged(formData, "LocationRu", locationRu, sanatorium.locationRu);
        appendIfChanged(formData, "LocationAlm", locationAlm, sanatorium.locationAlm);
        appendIfChanged(formData, "LocationArab", locationArab, sanatorium.locationArab);
// Standard Room
        appendIfChanged(formData, "StandardRoomDescription", stdDescAz, sanatorium.standardRoomDescription);
        appendIfChanged(formData, "StandardRoomDescriptionEng", stdDescEn, sanatorium.standardRoomDescriptionEng);
        appendIfChanged(formData, "StandardRoomDescriptionRu", stdDescRu, sanatorium.standardRoomDescriptionRu);
        appendIfChanged(formData, "StandardRoomDescriptionAlm", stdDescAlm, sanatorium.standardRoomDescriptionAlm);
        appendIfChanged(formData, "StandardRoomDescriptionArab", stdDescArab, sanatorium.standardRoomDescriptionArab);

// Comfort Room
        appendIfChanged(formData, "ComfortRoomDescription", comfDescAz, sanatorium.comfortRoomDescription);
        appendIfChanged(formData, "ComfortRoomDescriptionEng", comfDescEn, sanatorium.comfortRoomDescriptionEng);
        appendIfChanged(formData, "ComfortRoomDescriptionRu", comfDescRu, sanatorium.comfortRoomDescriptionRu);
        appendIfChanged(formData, "ComfortRoomDescriptionAlm", comfDescAlm, sanatorium.comfortRoomDescriptionAlm);
        appendIfChanged(formData, "ComfortRoomDescriptionArab", comfDescArab, sanatorium.comfortRoomDescriptionArab);

// VIP Room
        appendIfChanged(formData, "VipRoomDescription", vipDescAz, sanatorium.vipRoomDescription);
        appendIfChanged(formData, "VipRoomDescriptionEng", vipDescEn, sanatorium.vipRoomDescriptionEng);
        appendIfChanged(formData, "VipRoomDescriptionRu", vipDescRu, sanatorium.vipRoomDescriptionRu);
        appendIfChanged(formData, "VipRoomDescriptionAlm", vipDescAlm, sanatorium.vipRoomDescriptionAlm);
        appendIfChanged(formData, "VipRoomDescriptionArab", vipDescArab, sanatorium.vipRoomDescriptionArab);
        // 🔹 Əsas şəkil
        if (selectedFile) formData.append("SanatoriumCardImage", selectedFile);
        if (editedServices.length > 0) {
            formData.append("editServiceJson", JSON.stringify(editedServices));
        }
        // 🔹 Yeni galereya şəkilləri
        if (galereyaFiles.length > 0)
            galereyaFiles.forEach(f => formData.append("Images", f.file));

        // 🔹 Silinəcək şəkillər
        if (deleteImages.length > 0)
            deleteImages.forEach(f => formData.append("DeleteImageIds", f));

        // 🔹 Yeni videolar
        if (addedVideos.length > 0)
            addedVideos.forEach(url => formData.append("Videos", url));

        // 🔹 Silinəcək videolar
        if (deleteVideos.length > 0)
            deleteVideos.forEach(url => formData.append("DeleteVideoIds", url));

        // 🔹 Xidmətlər — tam JSON string
        if (addedServices.length > 0) {
            formData.append("serviceJson", JSON.stringify(addedServices));
        }

        if (deleteServiceIds.length > 0) {
            deleteServiceIds.forEach(id => formData.append("DeleteServiceIds", id));
        }

        try {
            await editSanatorium(formData).unwrap();
            showToast(t("adminPanel.sanatoriumEdit.toast.success"), 'success');
            refetch();
            navigate('/admin/sanatorium');
        } catch (err) {
            console.error("Error:", err);
            showToast(t("adminPanel.sanatoriumEdit.toast.error"), 'error');
        }
    };

    return (
        <div id={'Sanatorium-edit'}>
            <div className={'Sanatorium-edit'}>
                <div className={"root"}>
                    <h2>
                        <NavLink className="link"
                                 to="/admin/sanatorium">{t("adminPanel.sanatoriumEdit.breadcrumb.main")}</NavLink>
                        <img src={rootIcon} alt=""/>
                        {t("adminPanel.sanatoriumEdit.breadcrumb.sub")}
                    </h2>
                </div>

                <div className={'Sanatorium-edit-head'}>
                    <h1>{t("adminPanel.sanatoriumEdit.title")}</h1>
                    <p>{t("adminPanel.sanatoriumEdit.description")}</p>
                </div>

                <div className={'Sanatorium-edit-main'}>

                    {/* 🔹 Ad + Şəkil */}
                    <div className={'Sanatorium-edit-data'}>
                        <div className={"dataDiv inputs "}>
                            <div className={'header'}>
                                <h3>{t("adminPanel.sanatoriumEdit.nameTitle")}</h3>
                                <p>{t("adminPanel.sanatoriumEdit.nameDescription")}</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input value={nameAz} onChange={(e) => setNameAz(e.target.value)}
                                               placeholder={t("adminPanel.sanatoriumEdit.placeholders.nameAz")}/>
                                    </div>
                                    <img src={aze} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input value={nameRu} onChange={(e) => setNameRu(e.target.value)}
                                               placeholder={t("adminPanel.sanatoriumEdit.placeholders.nameRu")}/>
                                    </div>
                                    <img src={rus} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input value={nameEn} onChange={(e) => setNameEn(e.target.value)}
                                               placeholder={t("adminPanel.sanatoriumEdit.placeholders.nameEn")}/>
                                    </div>
                                    <img src={usa} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input value={nameAlm} onChange={(e) => setNameAlm(e.target.value)}
                                               placeholder={t("adminPanel.sanatoriumEdit.placeholders.nameAlm")}/>
                                    </div>
                                    <img src={ger} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input value={nameArab} onChange={(e) => setNameArab(e.target.value)}
                                               placeholder={t("adminPanel.sanatoriumEdit.placeholders.nameArab")}/>
                                    </div>
                                    <img src={arb} alt=""/>
                                </div>
                            </div>
                        </div>

                        {/* Yerləşmə (Location) - Yeni */}
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>{t("adminPanel.sanatoriumEdit.locationTitle")}</h3>
                                <p>{t("adminPanel.sanatoriumEdit.locationDescription")}</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input
                                            value={locationAz}
                                            onChange={(e) => setLocationAz(e.target.value)}
                                            placeholder={t("adminPanel.sanatoriumEdit.placeholders.locationAz")}
                                        />
                                    </div>
                                    <img src={aze} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input
                                            value={locationRu}
                                            onChange={(e) => setLocationRu(e.target.value)}
                                            placeholder={t("adminPanel.sanatoriumEdit.placeholders.locationRu")}
                                        />
                                    </div>
                                    <img src={rus} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input
                                            value={locationEn}
                                            onChange={(e) => setLocationEn(e.target.value)}
                                            placeholder={t("adminPanel.sanatoriumEdit.placeholders.locationEn")}
                                        />
                                    </div>
                                    <img src={usa} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input
                                            value={locationAlm}
                                            onChange={(e) => setLocationAlm(e.target.value)}
                                            placeholder={t("adminPanel.sanatoriumEdit.placeholders.locationAlm")}
                                        />
                                    </div>
                                    <img src={ger} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className={'add-input'}>
                                        <input
                                            value={locationArab}
                                            onChange={(e) => setLocationArab(e.target.value)}
                                            placeholder={t("adminPanel.sanatoriumEdit.placeholders.locationArab")}
                                        />
                                    </div>
                                    <img src={arb} alt=""/>
                                </div>
                            </div>
                        </div>

                        <div className="dataDiv images">
                            <div className="header">
                                <h3>{t("adminPanel.sanatoriumEdit.imageTitle")}</h3>
                                <p>{t("adminPanel.sanatoriumEdit.imageDescription")}</p>
                            </div>
                            <div
                                className={`uploadBox ${isDragging ? "dragging" : ""}`}
                                onDragOver={(e) => {e.preventDefault(); setIsDragging(true);}}
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
                                    <p>{t("adminPanel.sanatoriumEdit.uploadHint")}</p>
                                </label>
                            </div>

                            {!selectedFile && oldMainImage && (
                                <div className="uploadedFile">
                                    <div className="fileInfo">
                                        <img
                                            src={`${SANATORIUM_CARD_IMAGES}${oldMainImage}`}
                                            alt="sanatorium-main"
                                            className="previewImg"
                                        />
                                        <span>{oldMainImage}</span>
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

                    {/* 🔹 Təsvir */}
                    <div className={'tours-desc'}>
                        <div className={'header'}>
                            <h3>{t("adminPanel.sanatoriumEdit.descTitle")}</h3>
                            <p>{t("adminPanel.sanatoriumEdit.descDescription")}</p>
                        </div>
                        <div className={'tours-desc-data'}>
                            <div className={'tours-desc-texts'}>
                                <textarea value={descAz} onChange={(e) => setDescAz(e.target.value)}
                                          placeholder={t("adminPanel.sanatoriumEdit.placeholders.descAz")}/>
                                <div className={'langCountry'}><img src={aze} alt=""/></div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea value={descRu} onChange={(e) => setDescRu(e.target.value)}
                                          placeholder={t("adminPanel.sanatoriumEdit.placeholders.descRu")}/>
                                <div className={'langCountry'}><img src={rus} alt=""/></div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea value={descEn} onChange={(e) => setDescEn(e.target.value)}
                                          placeholder={t("adminPanel.sanatoriumEdit.placeholders.descEn")}/>
                                <div className={'langCountry'}><img src={usa} alt=""/></div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea value={descAlm} onChange={(e) => setDescAlm(e.target.value)}
                                          placeholder={t("adminPanel.sanatoriumEdit.placeholders.descAlm")}/>
                                <div className={'langCountry'}><img src={ger} alt=""/></div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea value={descArab} onChange={(e) => setDescArab(e.target.value)}
                                          placeholder={t("adminPanel.sanatoriumEdit.placeholders.descArab")}/>
                                <div className={'langCountry'}><img src={arb} alt=""/></div>
                            </div>
                        </div>
                    </div>
                    {/* 🔹 Otaq növləri */}
                    <div className={'tours-desc'}>
                        <div className={'header'}>
                            <h3>Otaq növləri</h3>
                            <p>Mövcud otaq növlərini seçin və təsvirini daxil edin</p>
                        </div>

                        {/* Checkboxlar */}
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

                        {/* Standard */}
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

                        {/* Comfort */}
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

                        {/* VIP */}
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
                    <div className={'Sanatorium-edit-data'}>

                        {/* 🔹 Xidmətlər */}
                        <div className="dataDiv inputs xidmett">
                            <div className="header">
                                <h3>{t("adminPanel.sanatoriumEdit.servicesTitle")}</h3>
                                <p>{t("adminPanel.sanatoriumEdit.servicesDescription")}</p>
                            </div>
                            <div className="add-inputs">
                                <div className="add-data">
                                    <div className="add-input">
                                        <input
                                            placeholder={t("adminPanel.sanatoriumEdit.placeholders.serviceAz")}
                                            value={serviceForm.name}
                                            onChange={(e) => setServiceForm(p => ({...p, name: e.target.value}))}
                                        />
                                    </div>
                                    <img src={aze} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className="add-input">
                                        <input
                                            placeholder={t("adminPanel.sanatoriumEdit.placeholders.serviceRu")}
                                            value={serviceForm.nameRu}
                                            onChange={(e) => setServiceForm(p => ({...p, nameRu: e.target.value}))}
                                        />
                                    </div>
                                    <img src={rus} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className="add-input">
                                        <input
                                            placeholder={t("adminPanel.sanatoriumEdit.placeholders.serviceEn")}
                                            value={serviceForm.nameEng}
                                            onChange={(e) => setServiceForm(p => ({...p, nameEng: e.target.value}))}
                                        />
                                    </div>
                                    <img src={usa} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className="add-input">
                                        <input
                                            placeholder={t("adminPanel.sanatoriumEdit.placeholders.serviceAlm")}
                                            value={serviceForm.nameAlm}
                                            onChange={(e) => setServiceForm(p => ({...p, nameAlm: e.target.value}))}
                                        />
                                    </div>
                                    <img src={ger} alt=""/>
                                </div>
                                <div className="add-data">
                                    <div className="add-input">
                                        <input
                                            placeholder={t("adminPanel.sanatoriumEdit.placeholders.serviceArab")}
                                            value={serviceForm.nameArab}
                                            onChange={(e) => setServiceForm(p => ({...p, nameArab: e.target.value}))}
                                        />
                                    </div>
                                    <img src={arb} alt=""/>
                                </div>

                                <button type="button" className="video-add-btn" onClick={addService}>
                                    {t("adminPanel.sanatoriumEdit.buttons.addService")}
                                </button>
                            </div>

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
                                                            // Köhnədirsə edited siyahısına əlavə et
                                                            if (s.id) {
                                                                setEditedServices(prev => {
                                                                    const exists = prev.find(x => x.id === s.id);
                                                                    if (exists) return prev.map(x => x.id === s.id ? {...x, name: e.target.value} : x);
                                                                    return [...prev, {...updated[index], name: e.target.value}];
                                                                });
                                                            }
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
                                                            if (s.id) {
                                                                setEditedServices(prev => {
                                                                    const exists = prev.find(x => x.id === s.id);
                                                                    if (exists) return prev.map(x => x.id === s.id ? {...x, nameRu: e.target.value} : x);
                                                                    return [...prev, {...updated[index], nameRu: e.target.value}];
                                                                });
                                                            }
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
                                                            if (s.id) {
                                                                setEditedServices(prev => {
                                                                    const exists = prev.find(x => x.id === s.id);
                                                                    if (exists) return prev.map(x => x.id === s.id ? {...x, nameEng: e.target.value} : x);
                                                                    return [...prev, {...updated[index], nameEng: e.target.value}];
                                                                });
                                                            }
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
                                                            if (s.id) {
                                                                setEditedServices(prev => {
                                                                    const exists = prev.find(x => x.id === s.id);
                                                                    if (exists) return prev.map(x => x.id === s.id ? {...x, nameAlm: e.target.value} : x);
                                                                    return [...prev, {...updated[index], nameAlm: e.target.value}];
                                                                });
                                                            }
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
                                                            if (s.id) {
                                                                setEditedServices(prev => {
                                                                    const exists = prev.find(x => x.id === s.id);
                                                                    if (exists) return prev.map(x => x.id === s.id ? {...x, nameArab: e.target.value} : x);
                                                                    return [...prev, {...updated[index], nameArab: e.target.value}];
                                                                });
                                                            }
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

                        {/* 🔹 Galereya */}
                        <div className="dataDiv images multi">
                            <div className="header">
                                <h3>{t("adminPanel.sanatoriumEdit.galleryTitle")}</h3>
                                <p>{t("adminPanel.sanatoriumEdit.galleryDescription")}</p>
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
                                    <p>{t("adminPanel.sanatoriumEdit.uploadHint")}</p>
                                </label>
                            </div>
                            <div className="uploadedHeader" onClick={() => setGalereyaOpen((p) => !p)}>
                                <span>{t("adminPanel.sanatoriumEdit.uploadedHeader")}</span>
                                <img src={galereyaOpen ? openIcon : closeIcon} alt="toggle"/>
                            </div>
                            {galereyaOpen && (
                                <div className="uploadedList">
                                    {oldGalereyaFiles.map((f, i) => (
                                        <div key={i} className="uploadedItem">
                                            <div className="fileLeft">
                                                <img src={`${SANATORIUM_IMAGES}${f}`} alt="old" className="filePreview"/>
                                                <span>{f}</span>
                                            </div>
                                            <button onClick={() => removeOldGalereya(f)}>✕</button>
                                        </div>
                                    ))}
                                    {galereyaFiles.length > 0 && (
                                        <>
                                            <h4>{t("adminPanel.sanatoriumEdit.uploadedSubTitle.newGallery")}</h4>
                                            {galereyaFiles.map((item, index) => (
                                                <div key={index} className="uploadedItem">
                                                    <div className="fileLeft">
                                                        <img src={item.preview} alt="preview" className="filePreview"/>
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

                        {/* 🔹 Videolar */}
                        <div className="dataDiv images multi">
                            <div className="header">
                                <h3>{t("adminPanel.sanatoriumEdit.videosTitle")}</h3>
                                <p>{t("adminPanel.sanatoriumEdit.videosDescription")}</p>
                            </div>
                            <div className="video-input-row">
                                <div className="add-input">
                                    <input
                                        placeholder={t("adminPanel.sanatoriumEdit.placeholders.videoUrl")}
                                        value={videoInput}
                                        onChange={(e) => setVideoInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && addVideo()}
                                    />
                                </div>
                                <button type="button" className="video-add-btn" onClick={addVideo}>
                                    {t("adminPanel.sanatoriumEdit.buttons.addVideo")}
                                </button>
                            </div>
                            {videos.length > 0 && (
                                <div className="uploadedList">
                                    {videos.map((url, index) => (
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
                        {isLoading ? t("adminPanel.sanatoriumEdit.buttons.loading") : t("adminPanel.sanatoriumEdit.buttons.save")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SanatoriumEdit;