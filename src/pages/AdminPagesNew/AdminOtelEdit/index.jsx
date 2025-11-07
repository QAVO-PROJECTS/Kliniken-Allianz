import './index.scss'
import {NavLink, useNavigate, useParams} from "react-router-dom";
import rootIcon from '/src/assets/rootIcon.svg'
import aze from '/src/assets/azerbaijan.svg'
import rus from '/src/assets/russia.svg'
import usa from '/src/assets/unitedstates.svg'
import ger from '/src/assets/germany.svg'
import arb from '/src/assets/unitedarabemirates.svg'
import uploadIcon from '/src/assets/uploadIcon.svg'
import linkIcon from '/src/assets/linkIcon.svg'
import starEmpty from "/src/assets/doluUlduz.svg"; // boş ulduz
import starFilled from "/src/assets/bosUlduz.svg";
import {useEffect, useState} from "react";
import {useGetOtelsByIdQuery, usePutOtelsMutation} from "../../../services/userApi.jsx";
import showToast from "../../../components/ToastMessage.js";
import {OTEL_CARD_IMAGES} from "../../../contants.js";
function OtelEdit() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {data:getOtelsById,isLoading,refetch} = useGetOtelsByIdQuery(id)
    const otel = getOtelsById?.data
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [editOtel, { isLoading: isUpdating }] = usePutOtelsMutation();
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setSelectedFile(file);
    };
    useEffect(() => {
        refetch()
    }, []);
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
    };
    const [raiting, setRaiting] = useState(0);
    const [hotelLink, setHotelLink] = useState("");
    const [name, setName] = useState("");
    const [nameRu, setNameRu] = useState("");
    const [nameEng, setNameEng] = useState("");
    const [location, setLocation] = useState("");
    const [locationRu, setLocationRu] = useState("");
    const [locationEng, setLocationEng] = useState("");

    // 🔹 Gələn datanı inputlara yaz
    useEffect(() => {
        if (otel) {
            setName(otel.name || "");
            setNameRu(otel.nameRu || "");
            setNameEng(otel.nameEng || "");
            setLocation(otel.location || "");
            setLocationRu(otel.locationRu || "");
            setLocationEng(otel.locationEng || "");
            setHotelLink(otel.otelLink || "");
            setRaiting(otel.raiting || 0);
        }
    }, [otel]);
    // 🔹 Edit (PUT) funksiyası
    const handleSubmit = async () => {
        if (!name.trim() || !location.trim()) {
            showToast("Zəhmət olmasa əsas sahələri doldurun.", 'warning');
            return;
        }

        const formData = new FormData();
        formData.append("id", id);
        formData.append("name", name);
        formData.append("nameRu", nameRu);
        formData.append("nameEng", nameEng);
        formData.append("location", location);
        formData.append("locationRu", locationRu);
        formData.append("locationEng", locationEng);

        // 🔸 Əgər rating dəyişməyibsə backenddəki dəyəri göndər
        const raitingToSend = raiting && raiting > 0 ? raiting : otel?.raiting || 0;
        formData.append("raiting", Number(raitingToSend));

        formData.append("otelLink", hotelLink);

        // 🔸 Yeni şəkil varsa onu, yoxdursa mövcud şəkil adı qalsın
        if (selectedFile) {
            formData.append("cardImage", selectedFile);
        }

        try {
            await editOtel(formData).unwrap();
            showToast("Otel uğurla redaktə olundu ✅", 'success');
            navigate("/admin/otel");
        } catch (err) {
            console.error("Xəta:", err);
            showToast("Redaktə zamanı xəta baş verdi ❌", 'error');
        }
    };

    if (isLoading) return <p>Yüklənir...</p>;
    return (
        <div id={'otel-edit'}>
            <div className={'otel-edit'}>
                <div className={"root"}>
                    <h2>
                        <NavLink className="link" to="/admin/otel">Otel</NavLink>
                        <img src={rootIcon} alt="" />
                        Otelə düzəliş edin
                    </h2>
                </div>
                <div className={'otel-edit-head'}>
                    <h1>Otelə düzəliş edin</h1>
                    <p>Buradan otelləri idarə edə və düzəliş edə bilərsiz.</p>
                </div>
                <div className={'otel-edit-main'}>
                    <div className={'otel-edit-data'}>
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>Otel adı</h3>
                                <p>Otelin sistemdə görünəcək adını daxil edin.</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Otel adı (AZ)" />
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={aze} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={nameRu} onChange={(e) => setNameRu(e.target.value)} placeholder="Otel adı (RU)" />
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={rus} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={nameEng} onChange={(e) => setNameEng(e.target.value)} placeholder="Otel adı (EN)" />
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
                                <h3>Otel şəkil</h3>
                                <p>Otelin sistemdə görünəcək şəklini yükləyin.</p>
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
                                    <p>
                                        Faylı yükləmək üçün bu sahəyə klikləyin <br /> və ya sürükləyin
                                    </p>
                                </label>
                            </div>

                            {(selectedFile || otel?.cardImage) && (
                                <div className="uploadedFile">
                                    <div className="fileInfo">
                                        <img
                                            src={
                                                selectedFile
                                                    ? URL.createObjectURL(selectedFile)
                                                    : OTEL_CARD_IMAGES + otel.cardImage
                                            }
                                            alt="preview"
                                            className="previewImg"
                                        />
                                        <span>{selectedFile ? selectedFile.name : otel.cardImage}</span>
                                    </div>
                                    <button onClick={handleRemoveFile}>✕</button>
                                </div>
                            )}
                        </div>
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>Yerləşdiyi ölkənin adı</h3>
                                <p>Otelin yerləşdiyi ölkəni dillərə əsasən daxil edin.</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ölkə (AZ)" />
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={aze} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={locationRu} onChange={(e) => setLocationRu(e.target.value)} placeholder="Ölkə (RU)" />
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={rus} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input value={locationEng} onChange={(e) => setLocationEng(e.target.value)} placeholder="Ölkə (EN)" />
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
                        <div className="dataDiv2 inputs">
                            {/* 🔹 Reytinq bölməsi */}
                            <div className="reyting">
                                <div className="header">
                                    <h3>Reytinqi</h3>
                                    <p>Otel üçün reytinq dəyəri təyin edin.</p>
                                </div>

                                <div className="stars">
                                    {[5, 4, 3, 2, 1].map((value) => (
                                        <label key={value} className="ratingOption">
                                            <input
                                                type="checkbox"
                                                name="raiting"
                                                checked={raiting === value}
                                                onChange={() => setRaiting(value)}
                                            />
                                            <div className="starsRow">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <img
                                                        key={i}
                                                        src={i < value ? starEmpty : starFilled}
                                                        alt="star"
                                                        className="starIcon"
                                                    />
                                                ))}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* 🔹 Otel link bölməsi */}
                            <div className="linkDiv">
                                <div className="header">
                                    <h3>Otel link</h3>
                                    <p>Otelə keçid etmək üçün otel linkini daxil edin.</p>
                                </div>
                                <div className="linkInputWrapper">
                                    <img src={linkIcon} alt="link" className="linkIcon" />
                                    <input
                                        type="text"
                                        placeholder="https://www.fairmonthotels.com/baku/"
                                        value={hotelLink}
                                        onChange={(e) => setHotelLink(e.target.value)}
                                    />
                                    {hotelLink && (
                                        <button
                                            type="button"
                                            className="clearBtn"
                                            onClick={() => setHotelLink("")}
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
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

export default OtelEdit;