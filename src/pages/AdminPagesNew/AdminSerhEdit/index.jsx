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
import {useGetCustomerViewByIdQuery, usePutCustomerViewMutation} from "../../../services/userApi.jsx";
import {VIEW_CARD_IMAGES} from "../../../contants.js";
import showToast from "../../../components/ToastMessage.js";
import {useTranslation} from "react-i18next";
function SerhEdit() {
    const { t } = useTranslation();
    const {id} = useParams();
    const { data: getCustomerViewById, isLoading } = useGetCustomerViewByIdQuery(id);
    const view = getCustomerViewById?.data;
    const navigate = useNavigate();
    const [editView, { isLoading: isUpdating }] = usePutCustomerViewMutation();
    const [name, setName] = useState("");
    const [country, setCountry] = useState("");
    const [descAz, setDescAz] = useState("");
    const [descRu, setDescRu] = useState("");
    const [descEn, setDescEn] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    useEffect(() => {
        if (view) {
            setName(view.customerName || "");
            setCountry(view.country || "");
            setDescAz(view.reviewText || "");
            setDescRu(view.reviewTextRu || "");
            setDescEn(view.reviewTextEng || "");
        }
    }, [view]);
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setSelectedFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) setSelectedFile(file);
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
    }; const handleSubmit = async () => {
        if (!name.trim() || !country.trim() || !descAz.trim()) {
            showToast(t("adminPanel.commentEdit.toast.warning"), "warning");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("id", id);
            formData.append("customerName", name);
            formData.append("reviewText", descAz);
            formData.append("reviewTextRu", descRu);
            formData.append("reviewTextEng", descEn);
            formData.append("country", country);
            formData.append("rating", 1); // sabit

            if (selectedFile) {
                formData.append("profilImage", selectedFile);
            }

            await editView(formData).unwrap();
            showToast(t("adminPanel.commentEdit.toast.success"), "success");
            navigate("/admin/serh");
        } catch (err) {
            console.error("PUT error:", err);
            showToast(t("adminPanel.commentEdit.toast.error"), "error");
        }
    };
    if (isLoading) return <p>{t("adminPanel.commentEdit.loading")}</p>;
    return (
        <div id={'serh-edit'}>
            <div className={'serh-edit'}>
                <div className={"root"}>
                    <h2>
                        <NavLink className="link" to="/admin/serh"> {t("adminPanel.commentEdit.breadcrumb.root")}</NavLink>
                        <img src={rootIcon} alt="" />
                        {t("adminPanel.commentEdit.breadcrumb.current")}
                    </h2>
                </div>
                <div className={'serh-edit-head'}>
                    <h1>{t("adminPanel.commentEdit.title")}</h1>
                    <p>{t("adminPanel.commentEdit.description")}</p>
                </div>
                <div className={'serh-edit-main'}>
                    <div className={'serh-edit-data'}>
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>{t("adminPanel.commentEdit.sections.author.title")}</h3>
                                <p>{t("adminPanel.commentEdit.sections.author.desc")}</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder={t("adminPanel.commentEdit.sections.author.placeholder")}
                                        />
                                    </div>
                                    {/*<div className={'langCountry'}>*/}
                                    {/*    <img src={aze} alt="" />*/}
                                    {/*</div>*/}
                                </div>
                                {/*<div className={'add-data'}>*/}
                                {/*    <div className={'add-input'}>*/}
                                {/*        <input placeholder={'Travmatologiya'}/>*/}
                                {/*    </div>*/}
                                {/*    <div className={'langCountry'}>*/}
                                {/*        <img src={rus} alt="" />*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                {/*<div className={'add-data'}>*/}
                                {/*    <div className={'add-input'}>*/}
                                {/*        <input placeholder={'Travmatologiya'}/>*/}
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
                                <h3>{t("adminPanel.commentEdit.sections.country.title")}</h3>
                                <p>{t("adminPanel.commentEdit.sections.country.desc")}</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                            placeholder={t("adminPanel.commentEdit.sections.country.placeholder")}
                                        />
                                    </div>
                                    {/*<div className={'langCountry'}>*/}
                                    {/*    <img src={aze} alt="" />*/}
                                    {/*</div>*/}
                                </div>
                                {/*<div className={'add-data'}>*/}
                                {/*    <div className={'add-input'}>*/}
                                {/*        <input placeholder={'Travmatologiya'}/>*/}
                                {/*    </div>*/}
                                {/*    <div className={'langCountry'}>*/}
                                {/*        <img src={rus} alt="" />*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                {/*<div className={'add-data'}>*/}
                                {/*    <div className={'add-input'}>*/}
                                {/*        <input placeholder={'Travmatologiya'}/>*/}
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
                                <h3>{t("adminPanel.commentEdit.sections.image.title")}</h3>
                                <p>{t("adminPanel.commentEdit.sections.image.desc")}</p>
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
                                    <p>{t("adminPanel.commentEdit.sections.image.uploadText")}</p>
                                </label>
                            </div>

                            {(selectedFile || view?.profilImage) && (
                                <div className="uploadedFile">
                                    <div className="fileInfo">
                                        <img
                                            src={
                                                selectedFile
                                                    ? URL.createObjectURL(selectedFile)
                                                    : VIEW_CARD_IMAGES + view.profilImage
                                            }
                                            alt="preview"
                                            className="previewImg"
                                        />
                                        <span>{selectedFile ? selectedFile.name : view.profilImage}</span>
                                    </div>
                                    <button onClick={handleRemoveFile}>✕</button>
                                </div>
                            )}
                        </div>
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>{t("adminPanel.commentEdit.sections.description.title")}</h3>
                                <p>{t("adminPanel.commentEdit.sections.description.desc")}</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input
                                            value={descAz}
                                            onChange={(e) => setDescAz(e.target.value)}
                                            placeholder={t(`adminPanel.commentEdit.sections.description.placeholders.az`)}
                                        />
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={aze} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input
                                            value={descRu}
                                            onChange={(e) => setDescRu(e.target.value)}
                                            placeholder={t(`adminPanel.commentEdit.sections.description.placeholders.ru`)}
                                        />
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={rus} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input
                                            value={descEn}
                                            onChange={(e) => setDescEn(e.target.value)}
                                            placeholder={t(`adminPanel.commentEdit.sections.description.placeholders.en`)}
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
                        disabled={isUpdating}
                    >
                        {isUpdating
                            ? t("adminPanel.commentEdit.buttons.saving")
                            : t("adminPanel.commentEdit.buttons.save")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SerhEdit;