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
function SerhEdit() {
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
            showToast("Bütün əsas sahələr doldurulmalıdır!", "warning");
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
            showToast("Şərh uğurla yeniləndi ✅", "success");
            navigate("/admin/serh");
        } catch (err) {
            console.error("PUT error:", err);
            showToast("Yeniləmə zamanı xəta baş verdi ❌", "error");
        }
    };
    if (isLoading) return <p>Yüklənir...</p>;
    return (
        <div id={'serh-edit'}>
            <div className={'serh-edit'}>
                <div className={"root"}>
                    <h2>
                        <NavLink className="link" to="/admin/serh">Şərh</NavLink>
                        <img src={rootIcon} alt="" />
                        Şərhə düzəliş et
                    </h2>
                </div>
                <div className={'serh-edit-head'}>
                    <h1>Şərhə düzəliş et</h1>
                    <p>Buradan şərhləri idarə edə və düzəliş edə bilərsiniz</p>
                </div>
                <div className={'serh-edit-main'}>
                    <div className={'serh-edit-data'}>
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>Şərh yazan</h3>
                                <p>Şərh yazanın sistemdə görünəcək adını daxil edin.</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder={'Ad daxil edin'}
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
                                <h3>Şərhin yazıldığı ölkənin adı</h3>
                                <p>Rəyin hansı ölkədən yazıldığını göstərin.</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                            placeholder={'Məsələn: Azərbaycan'}
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
                                <h3>Şəkil</h3>
                                <p>Şərh yazan şəxsin profil şəklini yükləyin.</p>
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
                                    <p>Faylı yükləmək üçün klikləyin və ya sürükləyin</p>
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
                                <h3>Təsvir</h3>
                                <p>Şərh mətni daxil edin.</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input
                                            value={descAz}
                                            onChange={(e) => setDescAz(e.target.value)}
                                            placeholder={'Təsvir (AZ)'}
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
                                            placeholder={'Описание (RU)'}
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
                                            placeholder={'Description (EN)'}
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
                        {isUpdating ? "Yenilənir..." : "Yadda saxla"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SerhEdit;