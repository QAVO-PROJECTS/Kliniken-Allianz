import "./index.scss";
import { Link, useParams } from "react-router-dom";
import banners from "/src/assets/AboutBanner.png";
import mobileBanners from "/src/assets/MobileBanner.png";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { useGetCarByIdQuery } from "../../../services/userApi.jsx";
import i18n from "../../../i18n.js";
import image from "../../../assets/CatgoryContantOrange.png";
import image1 from "../../../assets/blueIcon.png";
import image3 from "../../../assets/whiteIcon.png";
import image2 from "../../../assets/CategoryDetailImage.png";
import showToast from "../../../components/ToastMessage.js";
import { useState, useRef } from "react";
import { CAR_CARD_IMAGES, CAR_IMAGES } from "../../../contants.js";

function CarDetail() {
    const { id } = useParams();
    const { t } = useTranslation();
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const { data: getCarById } = useGetCarByIdQuery(id);
    const car = getCarById?.data;
    const currentLang = i18n.language;
    const contactRef = useRef(null);

    const [activeImg, setActiveImg] = useState(0);
    const [lightbox, setLightbox] = useState(null);

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState({});

    const scrollToContact = () => {
        contactRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const getName = (item) => {
        if (!item) return "";
        if (currentLang === "en") return item.nameEng || item.name;
        if (currentLang === "ru") return item.nameRu || item.name;
        if (currentLang === "de") return item.nameAlm || item.name;
        if (currentLang === "ar") return item.nameArab || item.name;
        return item.name;
    };

    const getDescription = (item) => {
        if (!item) return "";
        if (currentLang === "en") return item.descriptionEng || item.description;
        if (currentLang === "ru") return item.descriptionRu || item.description;
        if (currentLang === "de") return item.descriptionAlm || item.description;
        if (currentLang === "ar") return item.descriptionArab || item.description;
        return item.description;
    };

    const carImages = car?.carImages || [];
    const mainImage = carImages[activeImg] ? `${CAR_IMAGES}${carImages[activeImg]}` : null;

    const validate = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = t("categoryDetail.form.errors.nameRequired");
        if (!surname.trim()) newErrors.surname = t("categoryDetail.form.errors.surnameRequired");
        if (!email.trim()) {
            newErrors.email = t("categoryDetail.form.errors.emailRequired");
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = t("categoryDetail.form.errors.emailInvalid");
        }
        if (!phoneNumber.trim()) newErrors.phoneNumber = t("categoryDetail.form.errors.phoneRequired");
        if (!description.trim()) newErrors.description = t("categoryDetail.form.errors.descriptionRequired");
        return newErrors;
    };

 

    return (
        <div id="car-detail">
            <div className="container">

                {/* ── HEAD ── */}
                <div className="head">
                    <h1>{getName(car)}</h1>
                    <p data-aos="fade-up" data-aos-delay="100">
                        <Link to="/">{t("contact.breadcrumb.home")}</Link>
                        <div className="dot dot1"></div>
                        <Link to="/cars">{t("carsPage.title") || "Avtomobillər"}</Link>
                        <div className="dot dot2"></div>
                        <Link to={`/cars/${car?.id}`}>{getName(car)}</Link>
                    </p>
                </div>

                {/* ── MAIN SECTION ── */}
                <div className="row main-row">

                    {/* LEFT — Gallery */}
                    <div className="col-30 col-md-60 col-sm-60 col-xs-60">
                        <div className="gallery">
                            {/* Main image */}
                            <div className="gallery__main" onClick={() => setLightbox(mainImage)}>
                                {mainImage && <img src={mainImage} alt={getName(car)} />}
                                <div className="gallery__zoom">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                                        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                                        <path d="M11 8v6M8 11h6"/>
                                    </svg>
                                </div>
                                {car?.type && <span className="gallery__badge">{car.type}</span>}
                            </div>
                            {/* Thumbnails */}
                            {carImages.length > 1 && (
                                <div className="gallery__thumbs">
                                    {carImages.map((img, i) => (
                                        <div
                                            key={i}
                                            className={`gallery__thumb ${i === activeImg ? "active" : ""}`}
                                            onClick={() => setActiveImg(i)}
                                        >
                                            <img src={`${CAR_IMAGES}${img}`} alt={`thumb-${i}`} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT — Info */}
                    <div className="col-25 col-md-60 col-sm-60 col-xs-60">
                        <div className="car-info">
                            <h2>{getName(car)}</h2>

                            {/* Price badge */}
                            <div className="car-info__price">
                                <span className="car-info__price-amount">{car?.price}</span>
                                <span className="car-info__price-currency">AZN</span>
                                <span className="car-info__price-per">/ {t("carDetail.perDay") || "gün"}</span>
                            </div>

                            {/* Specs row */}
                            <div className="car-info__specs">
                                <div className="spec-item">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#003778" strokeWidth="2">
                                        <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                                    </svg>
                                    <span>{car?.type}</span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="car-info__desc">
                                <p>{getDescription(car)}</p>
                            </div>

                            <button className="car-info__btn" onClick={scrollToContact}>
                                {t("toursPage.applyButton") || "Müraciət et"}
                            </button>
                        </div>
                    </div>
                </div>

           
            </div>

            {/* ── BANNER ── */}
            <div className="bannerAbout">
                <img src={isMobile ? mobileBanners : banners} alt={t("contact.bannerAlt")} />
            </div>

            {/* ── LIGHTBOX ── */}
            {lightbox && (
                <div className="lightbox" onClick={() => setLightbox(null)}>
                    <button className="lightbox__close" onClick={() => setLightbox(null)}>✕</button>
                    <img src={lightbox} alt="car" onClick={(e) => e.stopPropagation()} />
                </div>
            )}
        </div>
    );
}

export default CarDetail;