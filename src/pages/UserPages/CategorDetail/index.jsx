import "./index.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import banner from "/src/assets/CategoryBanner.png";
import mobileBanner from "/src/assets/MobileBannerCategoryDetail.png";
import image from "/src/assets/clevelandClinic.png";
import image1 from "/src/assets/Johns.png";
import image2 from "/src/assets/CategoryDetailImage.png";
import ServicesCardCategory from "../../../components/UserComponents/CategoryDetail/ServicesCard/index.jsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CustomSlider from "../../../components/UserComponents/CategoryDetail/CustomSlider/index.jsx";
import { useMediaQuery } from "react-responsive";
import icon1 from "../../../assets/Servis/cancer.png";
import icon4 from "../../../assets/Servis/oftomoloq.png";
import icon3 from "../../../assets/Servis/genekoloq.png";
import icon5 from "../../../assets/Servis/hepatoloq.png";
import {
    useGetCategoryByIdQuery,
    useGetClinicByCategoryQuery,
    usePostContactMutation
} from "../../../services/userApi.jsx";
import { message } from "antd";
import {CLINIC_CARD_IMAGES} from "../../../contants.js"; // Success/error için ekledim

function CategoryDetail() {
    const { id } = useParams();
    const { data: getCategoryById } = useGetCategoryByIdQuery(id);
    const category = getCategoryById?.data;
    const {data:getClinicByCategory} = useGetClinicByCategoryQuery(id)
    const clinic = getClinicByCategory?.data
    const [postContact] = usePostContactMutation(); // Mutation hook'unu ekledim
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [showAllServices, setShowAllServices] = useState(false);
    const [email, setEmail] = useState("");
    const [description, setDescription] = useState(""); // setNote'u düzelttim: setDescription
    const [errors, setErrors] = useState({});
    const visibleItems = 4; // Number of visible items
    const [currentIndex, setCurrentIndex] = useState(0);
    const isMobile = useMediaQuery({ maxWidth: 768 });

    // Dil bazlı metin seçimi
    const getLocalizedText = (item, field) => {
        switch (i18n.language) {
            case 'en':
                return field === 'name' ? item?.nameEng : item?.descriptionEng;
            case 'ru':
                return field === 'name' ? item?.nameRu : item?.descriptionRu;
            default: // 'tr' veya varsayılan
                return field === 'name' ? item?.name : item?.description;
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!email.trim()) {
            newErrors.email = t("categoryDetail.form.errors.emailRequired");
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = t("categoryDetail.form.errors.emailInvalid");
        }
        if (!description.trim()) {
            newErrors.description = t("categoryDetail.form.errors.descriptionRequired");
        }
        return newErrors;
    };

    // Form submit handler'ı ekledim
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                await postContact({ email, description }).unwrap(); // Backend'e gönder (categoryId eklemek istersen buraya ekle: { email, description, categoryId: id })
                message.success(t("categoryDetail.contact.form.success") || "Mesajınız başarıyla gönderildi!"); // Success message (translation ekle istersen)
                setEmail("");
                setDescription("");
                setErrors({});
            } catch (error) {
                console.error("Contact error:", error);
                message.error(t("categoryDetail.contact.form.error") || "Mesaj gönderilirken hata oluştu!");
            }
        }
    };

    // Calculate max index based on total category count
    const categoriesCount = 12; // Categories are fixed, from CustomSlider
    const maxIndex = Math.ceil(categoriesCount - visibleItems);

    // Slide the slider when a bullet is clicked

    const cards = [
        {
            name: t("categoryDetail.cards.cancer.name"),
            description: t("categoryDetail.cards.cancer.description"),
            icon: icon1,
        },
        {
            name: t("categoryDetail.cards.oftamologiya.name"),
            description: t("categoryDetail.cards.oftamologiya.description"),
            icon: icon4,
        },
        {
            name: t("categoryDetail.cards.ginekologiya.name"),
            description: t("categoryDetail.cards.ginekologiya.description"),
            icon: icon3,
        },
        {
            name: t("categoryDetail.cards.hepatologiya.name"),
            description: t("categoryDetail.cards.hepatologiya.description"),
            icon: icon5,
        },
    ];

    return (
        <div id="category-detail">
            <div className="container">
                <div className="head">
                    <p data-aos="fade-up" data-aos-delay="100">
                        <Link to="/">{t("categoryDetail.breadcrumb.home")}</Link>
                        <div className="dot active"></div>
                        <Link to={`/category/${category?.id}`}>
                            {getLocalizedText(category, 'name') || t("categoryDetail.breadcrumb.category")}
                        </Link>
                    </p>
                </div>
                <div className="first-section row">
                    <div className="col-6 col-md-12 col-sm-12 col-xs-12 second">
                        <div className="content">
                            <h2>{getLocalizedText(category, 'name')}</h2>
                            <p>{getLocalizedText(category, 'desc')}</p>
                            <button onClick={() => navigate("/contact")}>
                                {t("categoryDetail.firstSection.button")}
                            </button>
                        </div>
                    </div>
                    <div className="col-6 col-md-12 col-sm-12 col-xs-12 first">
                        <div className="image">
                            <img
                                src={isMobile ? mobileBanner : banner}
                                alt={t("categoryDetail.firstSection.bannerAlt")}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    {clinic?.map((item) => (
                        <div className="second-section">
                            <div className="header">
                                <div className="title">
                                    <img src={CLINIC_CARD_IMAGES+item.clinicCardImage} alt={t("categoryDetail.secondSection.imageAlt")} />
                                    <h2>{getLocalizedText(item, 'name')}</h2>
                                </div>
                                <p>{getLocalizedText(item, 'desc')}</p>
                            </div>
                            <div className="row" style={{ marginBottom: "48px" }}>
                                {item.services?.map((serv) => (
                                    <ServicesCardCategory
                                        key={serv.id} // Key ekledim, unique olması için
                                        id={serv.id}
                                        name={getLocalizedText(serv, 'name')}
                                        desc={getLocalizedText(serv, 'desc')}
                                        icon={serv.serviceCardImage}
                                    />
                                ))}
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <button onClick={() => setShowAllServices(!showAllServices)}>
                                    {t("categoryDetail.secondSection.button")}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="25"
                                        height="26"
                                        viewBox="0 0 25 26"
                                        fill="none"
                                    >
                                        <g clip-path="url(#clip0_375_402)">
                                            <path
                                                d="M17.7238 16.0466C17.4455 15.5647 17.5061 14.5701 17.6393 13.6878C17.809 12.5507 18.1568 11.4431 18.7061 10.434C19.118 9.67747 19.674 8.8585 20.2949 8.5M20.2949 8.5C19.674 8.8585 18.6861 8.9309 17.8256 8.90896C16.6767 8.87947 15.5436 8.62693 14.4747 8.20655C13.6436 7.8801 12.7513 7.43401 12.4738 6.95336M20.2949 8.5L4.70647 17.5"
                                                stroke="black"
                                            />
                                            <path
                                                d="M17.7238 16.0466C17.4455 15.5647 17.5061 14.5701 17.6393 13.6878C17.809 12.5507 18.1568 11.4431 18.7061 10.434C19.118 9.67747 19.674 8.8585 20.2949 8.5M20.2949 8.5C19.674 8.8585 18.6861 8.9309 17.8256 8.90896C16.6767 8.87947 15.5436 8.62693 14.4747 8.20655C13.6436 7.8801 12.7513 7.43401 12.4738 6.95336M20.2949 8.5L4.70647 17.5"
                                                stroke="#00DA7B"
                                            />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_375_402">
                                                <rect
                                                    width="18"
                                                    height="18"
                                                    fill="white"
                                                    transform="translate(24.7949 16.2942) rotate(150)"
                                                />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="contact">
                    <div className="row">
                        <div className="col-4 col-md-12 col-sm-12 col-xs-12">
                            <div className="image">
                                <img src={image2} alt={t("categoryDetail.contact.imageAlt")} />
                            </div>
                        </div>
                        <div className="col-8 col-md-12 col-sm-12 col-xs-12">
                            <div className="form">
                                <div className="form-head">
                                    <hr />
                                    <h2>{t("categoryDetail.contact.form.title")}</h2>
                                </div>
                                <div className="form-body">
                                    <form onSubmit={handleSubmit}> {/* onSubmit'i handleSubmit ile bağladım */}
                                        <div className="row">
                                            <div className="col-12">
                                                <label>{t("categoryDetail.contact.form.labels.email")}</label>
                                                <br />
                                                <input
                                                    type="email"
                                                    placeholder={t("categoryDetail.contact.form.placeholders.email")}
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    maxLength={100}
                                                    required
                                                />
                                                {errors.email && (
                                                    <span className="error-message">{errors.email}</span>
                                                )}
                                            </div>
                                            <div className="col-12">
                                                <label>{t("categoryDetail.contact.form.labels.description")}</label>
                                                <br />
                                                <textarea
                                                    rows={5}
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    maxLength={700}
                                                    required
                                                />
                                                {errors.description && (
                                                    <span className="error-message">{errors.description}</span>
                                                )}
                                            </div>
                                            <div className="col-12">
                                                <button type="submit">{t("categoryDetail.contact.form.button")}</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="services">
                    <div className="header">
                        <h3>{t("categoryDetail.services.title")}</h3>
                        <p>{t("categoryDetail.services.description")}</p>
                    </div>
                    <div>
                        <CustomSlider
                            currentIndex={currentIndex}
                            setCurrentIndex={setCurrentIndex}
                            visibleItems={visibleItems}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoryDetail;