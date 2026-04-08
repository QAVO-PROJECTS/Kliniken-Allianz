import "./index.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import banners from "/src/assets/AboutBanner.png";
import mobileBanners from "/src/assets/MobileBanner.png";
import { useTranslation } from "react-i18next";
import red from "/src/assets/redTeklif.svg";
import blue from "/src/assets/blueTeklif.svg";
import { useMediaQuery } from "react-responsive";
import { useGetToursByIdQuery, usePostContactTourMutation } from "../../../services/userApi.jsx";
import i18n from "../../../i18n.js";
import image from "../../../assets/CatgoryContantOrange.png";
import image1 from "../../../assets/blueIcon.png";
import image3 from "../../../assets/whiteIcon.png";
import image2 from "../../../assets/CategoryDetailImage.png";
import showToast from "../../../components/ToastMessage.js";
import { useState, useRef } from "react";
import {
    TOUR_IMAGES,
    OTEL_CARD_IMAGES,
    CAR_CARD_IMAGES,
} from "../../../contants.js";

function StarRating({ rating }) {
    return (
        <div className="star-rating">
            {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className={s <= Math.round(rating) ? "star filled" : "star"}>★</span>
            ))}
        </div>
    );
}

function TourDetail() {
    const { id } = useParams();
    const { t } = useTranslation();
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const { data: getToursById } = useGetToursByIdQuery(id);
    const tour = getToursById?.data;
    const currentLang = i18n.language;
    const contactRef = useRef(null);
    const navigate = useNavigate()
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState({});
    const [postContact] = usePostContactTourMutation();

    // Active image index for gallery lightbox
    const [activeImg, setActiveImg] = useState(null);

    const scrollToContact = () => {
        contactRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    // Multilang helpers
    const getName = (item) => {
        if (!item) return "";
        if (currentLang === "en") return item.nameEng || item.nameEN || item.name;
        if (currentLang === "ru") return item.nameRu || item.nameRU || item.name;
        if (currentLang === "de") return item.nameAlm || item.nameAL || item.name;
        if (currentLang === "ar") return item.nameArab || item.nameAR || item.name;
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

    const getLocation = (item) => {
        if (!item) return "";
        if (currentLang === "en") return item.locationEng || item.location;
        if (currentLang === "ru") return item.locationRu || item.location;
        if (currentLang === "de") return item.locationAlm || item.location;
        if (currentLang === "ar") return item.locationArab || item.location;
        return item.location;
    };

    // Deduplicate by id
    const uniqueCars = tour?.cars
        ? [...new Map(tour.cars.map((c) => [c.id, c])).values()]
        : [];
    const uniqueOtels = tour?.otels
        ? [...new Map(tour.otels.map((o) => [o.id, o])).values()]
        : [];

    const tourImages = tour?.tourImages || [];

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
            const payload = { name, surname, email, phoneNumber, description, tourId: id };
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
        <div id="tour-detail">
            <div className="container">

                {/* ── HEAD ── */}
                <div className="head">
                    <h1>{getName(tour)}</h1>
                    <p data-aos="fade-up" data-aos-delay="100">
                        <Link to="/">{t("contact.breadcrumb.home")}</Link>
                        <div className="dot dot1"></div>
                        <Link to="/tours">{t("toursPage.title")}</Link>
                        <div className="dot dot2"></div>
                        <Link to={`/tours/${tour?.id}`}>{getName(tour)}</Link>
                    </p>
                </div>

                {/* ── MAIN INFO + IMAGE GRID ── */}
                <div className="row" style={{ justifyContent: "space-between", marginBottom: "60px" }}>
                    <div className="col-25 col-md-60 col-sm-60 col-xs-60 order2">
                        <div className="content">
                            <p>{getDescription(tour)}</p>
                            <div className="row">
                                {tour?.services?.map((srv, i) => (
                                    <div className="col-30" key={srv.id || i}>
                                        <div className="teklif">
                                            <img src={i % 2 === 0 ? red : blue} alt="" />
                                            <h5>{getName(srv)}</h5>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={scrollToContact}>{t("toursPage.applyButton")}</button>
                        </div>
                    </div>

                    {/* Dynamic Tour Images */}
                    <div className="col-30 col-md-60 col-sm-60 col-xs-60 order1">
                        <div className="image-grid">
                            {tourImages.slice(0, 3).map((img, i) => (
                                <div
                                    className={`image image${i + 1}`}
                                    key={i}
                                    onClick={() => setActiveImg(`${TOUR_IMAGES}${img}`)}
                                >
                                    <img src={`${TOUR_IMAGES}${img}`} alt={`tour-img-${i}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── CARS SECTION ── */}
                {uniqueCars.length > 0 && (
                    <div className="cars-section">
                        <div className="section-head">
                            <h2>{t("tourDetail.cars.title") || "Avtomobillər"}</h2>
                            <div className="section-line"></div>
                        </div>
                        <div className="row cars-row">
                            {uniqueCars.map((car) => (
                                <div className="col-15 col-md-30 col-sm-60 col-xs-60" key={car.id}>
                                    <div className="car-card">
                                        {car.carImages?.[0] && (
                                            <div className="car-card__image">
                                                <img src={`${CAR_CARD_IMAGES}${car.carImages[0]}`} alt={getName(car)} />
                                                <span className="car-card__type">{car.type}</span>
                                            </div>
                                        )}
                                        <div className="car-card__body">
                                            <h4>{getName(car)}</h4>
                                            <p>{getDescription(car)}</p>
                                            <div className="car-card__footer">
                                                <span className="car-card__price">{car.price} <small>AZN</small></span>
                                                <button onClick={()=>navigate(`/cars/${car.id}`)}>{t("toursPage.applyButton") || "Müraciət"}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── HOTELS SECTION ── */}
                {uniqueOtels.length > 0 && (
                    <div className="otels-section">
                        <div className="section-head">
                            <h2>{t("tourDetail.otels.title") || "Otellər"}</h2>
                            <div className="section-line"></div>
                        </div>
                        <div className="row otels-row">
                            {uniqueOtels.map((otel) => (
                                <div className="col-15 col-md-30 col-sm-60 col-xs-60" key={otel.id}>
                                    <div className="otel-card">
                                        {otel.cardImage && (
                                            <div className="otel-card__image">
                                                <img src={`${OTEL_CARD_IMAGES}${otel.cardImage}`} alt={getName(otel)} />
                                            </div>
                                        )}
                                        <div className="otel-card__body">
                                            <h4>{getName(otel)}</h4>
                                            <div className="otel-card__meta">
                                                <span className="otel-card__location">
                                                    <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                                                        <path d="M6 0C3.243 0 1 2.243 1 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.757-2.243-5-5-5zm0 7a2 2 0 110-4 2 2 0 010 4z" fill="#003778"/>
                                                    </svg>
                                                    {getLocation(otel)}
                                                </span>
                                                <StarRating rating={otel.raiting} />
                                            </div>
                                            {otel.otelLink && (
                                                <a
                                                    href={otel.otelLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="otel-card__link"
                                                >
                                                    {t("tourDetail.otels.visit") || "Oteli ziyarət et"} →
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

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
            {activeImg && (
                <div className="lightbox" onClick={() => setActiveImg(null)}>
                    <button className="lightbox__close" onClick={() => setActiveImg(null)}>✕</button>
                    <img src={activeImg} alt="tour" />
                </div>
            )}
        </div>
    );
}

export default TourDetail;