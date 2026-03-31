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

        // 🔹 Əsas şəkil
        if (selectedFile) formData.append("SanatoriumCardImage", selectedFile);

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
                                {/*<div className="add-data">*/}
                                {/*    <div className={'add-input'}>*/}
                                {/*        <input value={nameAlm} onChange={(e) => setNameAlm(e.target.value)}*/}
                                {/*               placeholder={t("adminPanel.sanatoriumEdit.placeholders.nameAlm")}/>*/}
                                {/*    </div>*/}
                                {/*    <img src={ger} alt=""/>*/}
                                {/*</div>*/}
                                {/*<div className="add-data">*/}
                                {/*    <div className={'add-input'}>*/}
                                {/*        <input value={nameArab} onChange={(e) => setNameArab(e.target.value)}*/}
                                {/*               placeholder={t("adminPanel.sanatoriumEdit.placeholders.nameArab")}/>*/}
                                {/*    </div>*/}
                                {/*    <img src={arb} alt=""/>*/}
                                {/*</div>*/}
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
                                {/*<div className="add-data">*/}
                                {/*    <div className={'add-input'}>*/}
                                {/*        <input*/}
                                {/*            value={locationAlm}*/}
                                {/*            onChange={(e) => setLocationAlm(e.target.value)}*/}
                                {/*            placeholder={t("adminPanel.sanatoriumEdit.placeholders.locationAlm")}*/}
                                {/*        />*/}
                                {/*    </div>*/}
                                {/*    <img src={ger} alt=""/>*/}
                                {/*</div>*/}
                                {/*<div className="add-data">*/}
                                {/*    <div className={'add-input'}>*/}
                                {/*        <input*/}
                                {/*            value={locationArab}*/}
                                {/*            onChange={(e) => setLocationArab(e.target.value)}*/}
                                {/*            placeholder={t("adminPanel.sanatoriumEdit.placeholders.locationArab")}*/}
                                {/*        />*/}
                                {/*    </div>*/}
                                {/*    <img src={arb} alt=""/>*/}
                                {/*</div>*/}
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
                            {/*<div className={'tours-desc-texts'}>*/}
                            {/*    <textarea value={descAlm} onChange={(e) => setDescAlm(e.target.value)}*/}
                            {/*              placeholder={t("adminPanel.sanatoriumEdit.placeholders.descAlm")}/>*/}
                            {/*    <div className={'langCountry'}><img src={ger} alt=""/></div>*/}
                            {/*</div>*/}
                            {/*<div className={'tours-desc-texts'}>*/}
                            {/*    <textarea value={descArab} onChange={(e) => setDescArab(e.target.value)}*/}
                            {/*              placeholder={t("adminPanel.sanatoriumEdit.placeholders.descArab")}/>*/}
                            {/*    <div className={'langCountry'}><img src={arb} alt=""/></div>*/}
                            {/*</div>*/}
                        </div>
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
                                {/*<div className="add-data">*/}
                                {/*    <div className="add-input">*/}
                                {/*        <input*/}
                                {/*            placeholder={t("adminPanel.sanatoriumEdit.placeholders.serviceAlm")}*/}
                                {/*            value={serviceForm.nameAlm}*/}
                                {/*            onChange={(e) => setServiceForm(p => ({...p, nameAlm: e.target.value}))}*/}
                                {/*        />*/}
                                {/*    </div>*/}
                                {/*    <img src={ger} alt=""/>*/}
                                {/*</div>*/}

                                <button type="button" className="video-add-btn" onClick={addService}>
                                    {t("adminPanel.sanatoriumEdit.buttons.addService")}
                                </button>
                            </div>

                            {serviceList.length > 0 && (
                                <div className="uploadedList" style={{marginTop: "10px"}}>
                                    {serviceList.map((s, index) => (
                                        <div key={index} className="uploadedItem">
                                            <div className="fileLeft">
                                                <span>{index + 1}. {s.name}</span>
                                                <span>{index + 1}. {s.nameEng} (ENG)</span>
                                                <span>{index + 1}. {s.nameRu} (RU)</span>
                                                {/*{s.nameEng && <span style={{color: "#999", fontSize: "11px"}}> / {s.nameEng}</span>}*/}
                                            </div>
                                            <button onClick={() => removeService(index)}>✕</button>
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