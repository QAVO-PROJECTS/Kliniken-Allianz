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
import {usePostCustomerViewMutation} from "../../../services/userApi.jsx";
import showToast from "../../../components/ToastMessage.js";
import {useTranslation} from "react-i18next";
function SerhAdd() {
    const { t } = useTranslation();
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const navigate = useNavigate();
    const [postSerh, { isLoading }] = usePostCustomerViewMutation();
    const [names, setNames] = useState({ az: "", ru: "", en: "" });
    const [comments, setComments] = useState({ az: "", ru: "", en: "" });
    const [countries, setCountries] = useState({ az: "", ru: "", en: "" });
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

    const handleInputChange = (setter, lang, value) => {
        setter(prev => ({ ...prev, [lang]: value }));
    };

    // 🔹 POST sorğusu
    const handleSubmit = async () => {
        if (!names.az.trim() || !comments.az.trim() || !countries.az.trim()) {
            showToast(t("adminPanel.commentAdd.toast.warning"), "warning");
            return;
        }

        try {
            const formData = new FormData();

            // 🔸 Dil əsaslı dəyərlər
            formData.append("customerName", names.az);
            // formData.append("nameRu", names.ru);
            // formData.append("nameEng", names.en);

            formData.append("reviewText", comments.az);
            formData.append("reviewTextRu", comments.ru);
            formData.append("reviewTextEng", comments.en);

            formData.append("country", countries.az);
            // formData.append("countryNameRu", countries.ru);
            // formData.append("countryNameEng", countries.en);

            // 🔸 Şəkil varsa əlavə et
            if (selectedFile) {
                formData.append("profilImage", selectedFile);
            }

            // 🔸 Rating sabit 5 (int kimi)
            formData.append("rating", 5);

            await postSerh(formData).unwrap();
            showToast(t("adminPanel.commentAdd.toast.success"), "success");
            navigate("/admin/serh");
        } catch (err) {
            console.error("POST error:", err);
            showToast(t("adminPanel.commentAdd.toast.error"), "error");
        }
    };


    return (
        <div id={'serh-add'}>
            <div className={'serh-add'}>
                <div className={"root"}>
                    <h2>
                        <NavLink className="link" to="/admin/serh">{t("adminPanel.commentAdd.breadcrumb.root")}</NavLink>
                        <img src={rootIcon} alt="" />
                        {t("adminPanel.commentAdd.breadcrumb.current")}
                    </h2>
                </div>
                <div className={'serh-add-head'}>
                    <h1>{t("adminPanel.commentAdd.title")}</h1>
                    <p>{t("adminPanel.commentAdd.description")}</p>
                </div>
                <div className={'serh-add-main'}>
                    <div className={'serh-add-data'}>
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>{t("adminPanel.commentAdd.sections.author.title")}</h3>
                                <p>{t("adminPanel.commentAdd.sections.author.desc")}</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input
                                            value={names.az}
                                            onChange={e => handleInputChange(setNames, "az", e.target.value)}
                                            placeholder={t("adminPanel.commentAdd.sections.author.placeholder")}
                                        />
                                    </div>
                                    {/*<div className={'langCountry'}>*/}
                                    {/*    <img src={aze} alt="" />*/}
                                    {/*</div>*/}
                                </div>
                                {/*<div className={'add-data'}>*/}
                                {/*    <div className={'add-input'}>*/}
                                {/*        <input*/}
                                {/*            value={names.ru}*/}
                                {/*            onChange={e => handleInputChange(setNames, "ru", e.target.value)}*/}
                                {/*            placeholder={'Например: Анар Мамедов'}*/}
                                {/*        />*/}
                                {/*    </div>*/}
                                {/*    <div className={'langCountry'}>*/}
                                {/*        <img src={rus} alt="" />*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                {/*<div className={'add-data'}>*/}
                                {/*    <div className={'add-input'}>*/}
                                {/*        <input*/}
                                {/*            value={names.en}*/}
                                {/*            onChange={e => handleInputChange(setNames, "en", e.target.value)}*/}
                                {/*            placeholder={'Example: Anar Mammadov'}*/}
                                {/*        />*/}
                                {/*    </div>*/}
                                {/*    <div className={'langCountry'}>*/}
                                {/*        <img src={usa} alt="" />*/}
                                {/*    </div>*/}
                                {/*</div>*/}
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
                                <h3>{t("adminPanel.commentAdd.sections.country.title")}</h3>
                                <p>{t("adminPanel.commentAdd.sections.country.desc")}</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input
                                            value={countries.az}
                                            onChange={e => handleInputChange(setCountries, "az", e.target.value)}
                                            placeholder={t("adminPanel.commentAdd.sections.country.placeholder")}
                                        />
                                    </div>
                                    {/*<div className={'langCountry'}>*/}
                                    {/*    <img src={aze} alt="" />*/}
                                    {/*</div>*/}
                                </div>
                                {/*<div className={'add-data'}>*/}
                                {/*    <div className={'add-input'}>*/}
                                {/*        <input*/}
                                {/*            value={countries.ru}*/}
                                {/*            onChange={e => handleInputChange(setCountries, "ru", e.target.value)}*/}
                                {/*            placeholder={'Например: Россия'}*/}
                                {/*        />*/}
                                {/*    </div>*/}
                                {/*    <div className={'langCountry'}>*/}
                                {/*        <img src={rus} alt="" />*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                {/*<div className={'add-data'}>*/}
                                {/*    <div className={'add-input'}>*/}
                                {/*        <input*/}
                                {/*            value={countries.en}*/}
                                {/*            onChange={e => handleInputChange(setCountries, "en", e.target.value)}*/}
                                {/*            placeholder={'Example: England'}*/}
                                {/*        />*/}
                                {/*    </div>*/}
                                {/*    <div className={'langCountry'}>*/}
                                {/*        <img src={usa} alt="" />*/}
                                {/*    </div>*/}
                                {/*</div>*/}
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
                                <h3>{t("adminPanel.commentAdd.sections.image.title")}</h3>
                                <p>{t("adminPanel.commentAdd.sections.image.desc")}</p>
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
                                    <p>{t("adminPanel.commentAdd.sections.image.uploadText")}</p>
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
                                    <button onClick={handleRemoveFile}>✕</button>
                                </div>
                            )}
                        </div>
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>{t("adminPanel.commentAdd.sections.description.title")}</h3>
                                <p>{t("adminPanel.commentAdd.sections.description.desc")}</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input
                                            value={comments.az}
                                            onChange={e => handleInputChange(setComments, "az", e.target.value)}
                                            placeholder={t(`adminPanel.commentAdd.sections.description.placeholders.az`)}
                                        />
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={aze} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input
                                            value={comments.ru}
                                            onChange={e => handleInputChange(setComments, "ru", e.target.value)}
                                            placeholder={t(`adminPanel.commentAdd.sections.description.placeholders.ru`)}
                                        />
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={rus} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input
                                            value={comments.en}
                                            onChange={e => handleInputChange(setComments, "en", e.target.value)}
                                            placeholder={t(`adminPanel.commentAdd.sections.description.placeholders.en`)}
                                        />
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

                    </div>
                    <button
                        className={'submitButton'}
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading
                            ? t("adminPanel.commentAdd.buttons.saving")
                            : t("adminPanel.commentAdd.buttons.save")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SerhAdd;