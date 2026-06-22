import "./index.scss";
import { Link, useParams } from "react-router-dom";
import banners from "/src/assets/AboutBanner.png";
import mobileBanners from "/src/assets/MobileBanner.png";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { useGetCarByIdQuery, usePostContactMutation } from "../../../services/userApi.jsx";
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
    const [postContact] = usePostContactMutation();

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

    const handleApplyClick = () => {
        if (!description) {
            const carName = getName(car);
            const messageTemplate = {
                az: `Mən "${carName}" avtomobili üçün müraciət etmək istəyirəm.`,
                en: `I would like to apply for the car "${carName}".`,
                ru: `Я хотел бы подать заявку на автомобиль "${carName}".`,
                ar: `أود التقدم بطلب للحصول على السيارة "${carName}".`
            };
            setDescription(messageTemplate[currentLang] || messageTemplate['az']);
        }
        scrollToContact();
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            const payload = { name, surname, email, phoneNumber, description };
            try {
                await postContact(payload).unwrap();
                showToast(t("contact.succesToast"), "success");
                setName(""); setSurname(""); setEmail(""); setPhoneNumber(""); setDescription(""); setErrors({});
            } catch (error) {
                console.error("Contact error:", error);
                showToast(t("contact.errorToast"), "error");
            }
        }
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

                            <button className="car-info__btn" onClick={handleApplyClick}>
                                {t("toursPage.applyButton") || "Müraciət et"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── CONTACT FORM ── */}
                <div className="contact" ref={contactRef}>
                    <div className="orange"><img src={image} /></div>
                    <div className="blueIcon"><img src={image1} /></div>
                    <div className="whiteIcon"><img src={image3} /></div>
                    <div className="row" style={{ justifyContent: "space-between" }}>
                        <div className="col-32 col-md-60 col-sm-60 col-xs-60">
                            <div className="form">
                                <div className="form-head">
                                    <h2>{t("contact.form.title")}</h2>
                                </div>
                                <div className="form-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="row" style={{ justifyContent: "space-between" }}>
                                            <div className="col-29" style={{ padding: "12px 0" }}>
                                                <input type="text" placeholder={t("contact.form.placeholders.name")} value={name} onChange={(e) => setName(e.target.value)} />
                                                {errors.name && <span className="error-message">{errors.name}</span>}
                                            </div>
                                            <div className="col-29" style={{ padding: "12px 0" }}>
                                                <input type="text" placeholder={t("contact.form.placeholders.surname")} value={surname} onChange={(e) => setSurname(e.target.value)} />
                                                {errors.surname && <span className="error-message">{errors.surname}</span>}
                                            </div>
                                            <div className="col-60" style={{ padding: "12px 0" }}>
                                                <input type="email" placeholder={t("contact.form.placeholders.email")} value={email} onChange={(e) => setEmail(e.target.value)} />
                                                {errors.email && <span className="error-message">{errors.email}</span>}
                                            </div>
                                            <div className="col-60" style={{ padding: "12px 0" }}>
                                                <input type="number" placeholder={t("contact.form.placeholders.phone")} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                                                {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
                                            </div>
                                            <div className="col-60" style={{ padding: "12px 0" }}>
                                                <textarea rows={5} placeholder={t("contact.form.placeholders.description")} value={description} onChange={(e) => setDescription(e.target.value)} />
                                                {errors.description && <span className="error-message">{errors.description}</span>}
                                            </div>
                                            <div className="col-60" style={{ padding: "12px 0" }}>
                                                <button type="submit">{t("contact.form.button")}</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col-25 col-md-60 col-sm-60 col-xs-60">
                            <div className="image">
                                <img src={image2} alt={t("categoryDetail.contact.imageAlt")} />
                            </div>
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