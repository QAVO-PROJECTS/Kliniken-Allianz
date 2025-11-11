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
import plusIcon from '/src/assets/plusIcon.svg'
import openIcon from '/src/assets/accordionOpen.svg'
import closeIcon from '/src/assets/accordionClose.svg'
import {useGetToursByIdQuery, usePutToursMutation} from "../../../services/userApi.jsx";
import showToast from "../../../components/ToastMessage.js";
import {TOUR_CARD_IMG} from "/src/contants.js";
import {useTranslation} from "react-i18next";
function ToursEdit() {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: getToursById, refetch } = useGetToursByIdQuery(id);
    const tour = getToursById?.data;

    const [editTour, { isLoading }] = usePutToursMutation();

    // 🔹 State-lər
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const [nameAz, setNameAz] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [nameRu, setNameRu] = useState("");
    const [descAz, setDescAz] = useState("");
    const [descEn, setDescEn] = useState("");
    const [descRu, setDescRu] = useState("");
    const [oldImage, setOldImage] = useState(null);
    const [deletedServiceIds, setDeletedServiceIds] = useState([]);

    const [sections, setSections] = useState([
        { id: 1, expanded: true, inputs: Array(3).fill("") },
    ]);

    const langs = [aze, rus, usa];

    // 🔹 Data gələndə formu doldur
    useEffect(() => {
        if (tour) {
            setNameAz(tour.name || "");
            setNameEn(tour.nameEng || "");
            setNameRu(tour.nameRu || "");
            // setNameAlm(tour.nameAlm || "");
            // setNameArab(tour.nameArab || "");

            setDescAz(tour.description || "");
            setDescEn(tour.descriptionEng || "");
            setDescRu(tour.descriptionRu || "");
            // setDescAlm(tour.descriptionAlm || "");
            // setDescArab(tour.descriptionArab || "");

            setOldImage(tour.cardImage ? `${TOUR_CARD_IMG}${tour.cardImage.split("/").pop()}` : null);

            const mappedServices = tour.services?.map((s, i) => ({
                id: s.id || i + 1,
                expanded: true,
                serviceId: s.id || null, // 🟢 backend üçün lazım olan ID
                inputs: [
                    s.name || "",
                    s.nameRU || "",
                    s.nameEN || "",
                ],
            })) || [];

            setSections(
                mappedServices.length > 0
                    ? mappedServices
                    : [{ id: 1, expanded: true, serviceId: null, inputs: Array(3).fill("") }]
            );


        }
    }, [tour]);

    // 🔹 File funksiyaları
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setSelectedFile(file);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = () => setIsDragging(false);
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) setSelectedFile(file);
    };
    const handleRemoveFile = () => setSelectedFile(null);

    // 🔹 Təklifləri idarə et
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

    const handleAddSection = () => {
        const allFilled = sections[sections.length - 1].inputs?.every(
            (x) => x.trim() !== ""
        );
        if (!allFilled) return;

        const newSection = {
            id: sections.length + 1,
            expanded: true,
            serviceId: null, // 🟢 yeni əlavə olunan təklif üçün boş id
            inputs: Array(3).fill(""),
        };


        setSections((prev) =>
            prev.map((s) => ({ ...s, expanded: false })).concat(newSection)
        );
    };

    const toggleSection = (id) => {
        setSections((prev) =>
            prev.map((s) =>
                s.id === id ? { ...s, expanded: !s.expanded } : s
            )
        );
    };

    const handleRemoveSection = (id) => {
        setSections((prev) => {
            const toRemove = prev.find((s) => s.id === id);
            if (toRemove?.serviceId) {
                // 🟥 Əgər bu service backend-də mövcuddursa, id-ni silinənlərə əlavə edirik
                setDeletedServiceIds((prevDeleted) => [...prevDeleted, toRemove.serviceId]);
            }
            return prev.filter((s) => s.id !== id);
        });
    };


    const allInputsFilled =
        sections.length > 0 &&
        sections[sections.length - 1]?.inputs?.every((x) => x.trim() !== "");


    // 🔹 PUT request
    const handleSubmit = async () => {
        const formData = new FormData();

        formData.append("id", id);
        formData.append("name", nameAz);
        formData.append("nameEng", nameEn);
        formData.append("nameRu", nameRu);
        formData.append("description", descAz);
        formData.append("descriptionEng", descEn);
        formData.append("descriptionRu", descRu);

        if (selectedFile) {
            formData.append("cardImage", selectedFile);
        }

        const servicesArray = sections
            .filter(s => s.inputs.some(x => x.trim() !== "")) // boşları göndərmirik
            .map((s) => ({
                id: s.serviceId, // varsa → update, yoxdursa → create
                name: s.inputs[0],
                nameRU: s.inputs[1],
                nameEN: s.inputs[2],
            }));

        formData.append("servicesJson", JSON.stringify(servicesArray));
        // 🟥 Silinən təkliflərin id-lərini ayrı-ayrılıqda göndər
        deletedServiceIds.forEach((id) => {
            formData.append("deleteTourServiceIds", id);
        });



        try {
            await editTour(formData).unwrap();
            showToast(t("adminPanel.toursEdit.toast.success"), "success");
            navigate("/admin/tours");
            refetch();
        } catch (err) {
            console.error("❌ Xəta:", err);
            showToast(t("adminPanel.toursEdit.toast.error"), "error");
        }
    };
    return (
        <div id={'tours-edit'}>
            <div className={'tours-edit'}>
                <div className={"root"}>
                    <h2>
                        <NavLink className="link" to="/admin/tours">  {t("adminPanel.toursEdit.breadcrumb.root")}</NavLink>
                        <img src={rootIcon} alt="" />
                        {t("adminPanel.toursEdit.breadcrumb.current")}
                    </h2>
                </div>
                <div className={'tours-edit-head'}>
                    <h1>{t("adminPanel.toursEdit.title")}</h1>
                    <p>{t("adminPanel.toursEdit.description")}</p>
                </div>
                <div className={'tours-edit-main'}>
                    <div className={'tours-edit-data'}>
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>{t("adminPanel.toursEdit.sections.name.title")}</h3>
                                <p>{t("adminPanel.toursEdit.sections.name.desc")}</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={nameAz} onChange={(e) => setNameAz(e.target.value)} placeholder={t(`adminPanel.toursEdit.sections.name.placeholders.az`)} />
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={aze} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={nameRu} onChange={(e) => setNameRu(e.target.value)} placeholder={t(`adminPanel.toursEdit.sections.name.placeholders.ru`)} />
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={rus} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder={t(`adminPanel.toursEdit.sections.name.placeholders.en`)} />
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
                                <h3>{t("adminPanel.toursEdit.sections.image.title")}</h3>
                                <p>{t("adminPanel.toursEdit.sections.image.desc")}</p>
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
                                    <p>{t("adminPanel.toursEdit.sections.image.uploadText")}</p>
                                </label>
                            </div>

                            {/* Köhnə şəkil */}
                            {!selectedFile && oldImage && (
                                <div className="uploadedFile">
                                    <div className="fileInfo">
                                        <img src={oldImage} alt="old" className="previewImg" />
                                        <span>{t("adminPanel.toursEdit.sections.image.oldImage")}</span>
                                    </div>
                                </div>
                            )}

                            {/* Yeni seçilən şəkil */}
                            {selectedFile && (
                                <div className="uploadedFile">
                                    <div className="fileInfo">
                                        <img src={URL.createObjectURL(selectedFile)} alt="preview" className="previewImg" />
                                        <span>{selectedFile.name}</span>
                                    </div>
                                    <button onClick={() => setSelectedFile(null)}>✕</button>
                                </div>
                            )}

                        </div>


                    </div>
                    <div className={'tours-desc'}>
                        <div className={'header'}>
                            <h3>{t("adminPanel.toursEdit.sections.description.title")}</h3>
                            <p>{t("adminPanel.toursEdit.sections.description.desc")}</p>
                        </div>
                        <div className={'tours-desc-data'}>
                            <div className={'tours-desc-texts'}>
                                <textarea value={descAz} onChange={(e) => setDescAz(e.target.value)}  placeholder={t(`adminPanel.toursEdit.sections.description.placeholders.az`)} />
                                <div className={'langCountry'}>
                                    <img src={aze} alt="" />
                                </div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea value={descRu} onChange={(e) => setDescRu(e.target.value)}  placeholder={t(`adminPanel.toursEdit.sections.description.placeholders.ru`)} />
                                <div className={'langCountry'}>
                                    <img src={rus} alt="" />
                                </div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea value={descEn} onChange={(e) => setDescEn(e.target.value)}  placeholder={t(`adminPanel.toursEdit.sections.description.placeholders.en`)} />
                                <div className={'langCountry'}>
                                    <img src={usa} alt="" />
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
                    <div className="dataDiv3 inputs">
                        <div className="header">
                            <h3>{t("adminPanel.toursEdit.sections.offers.title")}</h3>
                            <p>{t("adminPanel.toursEdit.sections.offers.desc")}</p>
                        </div>

                        <div className={'offer-scroll'}>
                            {sections.map((section) => (
                                <div key={section.id} className="offer-section">
                                    <div className="offer-header" onClick={() => toggleSection(section.id)}>
                                        <span>{`${t("adminPanel.toursEdit.sections.offers.sectionTitle")}${section.id}`}</span>
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
                            <img src={plusIcon} alt="plus" /> {t("adminPanel.toursEdit.sections.offers.addBtn")}
                        </button>
                    </div>
                    <button
                        className="submitButton"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading
                            ? t("adminPanel.toursEdit.buttons.saving")
                            : t("adminPanel.toursEdit.buttons.save")}
                    </button>

                </div>
            </div>
        </div>
    );
}

export default ToursEdit;