import './index.scss'
import {NavLink, useNavigate} from "react-router-dom";
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
import {useState} from "react";
import {usePostOtelsMutation} from "../../../services/userApi.jsx";
import showToast from "../../../components/ToastMessage.js";
function OtelAdd() {
    const [postOtel, { isLoading }] = usePostOtelsMutation();
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
const navigate = useNavigate();
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
    };

    const ratings = [5, 4, 3, 2, 1];
    const [rating, setRating] = useState(null);
    const [hotelLink, setHotelLink] = useState("");
    const [hotelNames, setHotelNames] = useState({
        az: "",
        ru: "",
        en: ""
    });
    const [countryNames, setCountryNames] = useState({
        az: "",
        ru: "",
        en: ""
    });

    const handleSubmit = async () => {
        // 🔹 Dolu ulduzların sayını tap
        const selectedStars = rating ? rating : 0;

        // 🔹 Boş sahə yoxlaması
        if (!selectedFile || selectedStars === 0 || !hotelNames.az.trim()) {
            showToast("Zəhmət olmasa bütün sahələri doldurun.", 'warning');
            return;
        }

        const formData = new FormData();
        formData.append("name", hotelNames.az);
        formData.append("nameRu", hotelNames.ru);
        formData.append("nameEng", hotelNames.en);
        formData.append("location", countryNames.az);
        formData.append("locationRu", countryNames.ru);
        formData.append("locationEng", countryNames.en);
        formData.append("raiting", Number(selectedStars)); // ⭐ dolu ulduz sayı
        formData.append("otelLink", hotelLink);
        formData.append("cardImage", selectedFile);

        try {
            const response = await postOtel(formData).unwrap();
            console.log("Otel əlavə olundu:", response);
            showToast("Otel uğurla əlavə olundu!", 'success');
            // 🔹 Form reset
            setHotelNames({ az: "", ru: "", en: "" });
            setCountryNames({ az: "", ru: "", en: "" });
            setHotelLink("");
            setRating(null);
            setSelectedFile(null);
            navigate('/admin/otel')
        } catch (err) {
            console.error("Xəta:", err);
            showToast("Otel əlavə olunarkən xəta baş verdi!", 'error');
        }
    };

    return (
        <div id={'otel-add'}>
            <div className={'otel-add'}>
                <div className={"root"}>
                    <h2>
                        <NavLink className="link" to="/admin/otel">Otel</NavLink>
                        <img src={rootIcon} alt="" />
                        Yeni otel yarat
                    </h2>
                </div>
                <div className={'otel-add-head'}>
                    <h1>Yeni otel yarat</h1>
                    <p>Buradan otelləri idarə edə və yenilərini yarada bilərsiniz.</p>
                </div>
                <div className={'otel-add-main'}>
                    <div className={'otel-add-data'}>
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>Otel adı</h3>
                                <p>Otelin sistemdə görünəcək adını daxil edin.</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input
                                            placeholder="Otel adı (AZ)"
                                            value={hotelNames.az}
                                            onChange={(e) =>
                                                setHotelNames((prev) => ({ ...prev, az: e.target.value }))
                                            }
                                        />
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={aze} alt="" />
                                    </div>
                                </div>

                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input
                                            placeholder="Otel adı (RU)"
                                            value={hotelNames.ru}
                                            onChange={(e) =>
                                                setHotelNames((prev) => ({ ...prev, ru: e.target.value }))
                                            }
                                        />
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={rus} alt="" />
                                    </div>
                                </div>

                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input
                                            placeholder="Otel adı (EN)"
                                            value={hotelNames.en}
                                            onChange={(e) =>
                                                setHotelNames((prev) => ({ ...prev, en: e.target.value }))
                                            }
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
                                <h3>Yerləşdiyi ölkənin adı</h3>
                                <p>Otelin yerləşdiyi ölkəni dillərə əsasən daxil edin.</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input
                                            placeholder="Ölkə (AZ)"
                                            value={countryNames.az}
                                            onChange={(e) =>
                                                setCountryNames((prev) => ({ ...prev, az: e.target.value }))
                                            }
                                        />
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={aze} alt="" />
                                    </div>
                                </div>

                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input
                                            placeholder="Ölkə (RU)"
                                            value={countryNames.ru}
                                            onChange={(e) =>
                                                setCountryNames((prev) => ({ ...prev, ru: e.target.value }))
                                            }
                                        />
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={rus} alt="" />
                                    </div>
                                </div>

                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input
                                            placeholder="Ölkə (EN)"
                                            value={countryNames.en}
                                            onChange={(e) =>
                                                setCountryNames((prev) => ({ ...prev, en: e.target.value }))
                                            }
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
                        <div className="dataDiv2 inputs">
                            {/* 🔹 Reytinq bölməsi */}
                            <div className="reyting">
                                <div className="header">
                                    <h3>Reytinqi</h3>
                                    <p>Otel üçün reytinq dəyəri təyin edin.</p>
                                </div>

                                <div className="stars">
                                    {ratings.map((value) => (
                                        <label key={value} className="ratingOption">
                                            <input
                                                type="checkbox"
                                                checked={rating === value}
                                                onChange={() => setRating(value)}
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
                        disabled={isLoading}
                    >
                        {isLoading ? "Yüklənir..." : "Yadda saxla"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OtelAdd;