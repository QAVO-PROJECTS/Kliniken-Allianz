import "./index.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import banners from "/src/assets/AboutBanner.png";
import banner from "/src/assets/CategoryBanner.png";
import mobileBanner from "/src/assets/MobileBannerCategoryDetail.png";
import image from "/src/assets/CatgoryContantOrange.png";
import image1 from "/src/assets/blueIcon.png";
import image2 from "/src/assets/CategoryDetailImage.png";
import image3 from "/src/assets/whiteIcon.png";
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
import {CLINIC_CARD_IMAGES} from "../../../contants.js";
import HomeServiceCard from "../../../components/UserComponents/Home/ServiceCardHome/index.jsx"; // Success/error için ekledim

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
                    <h1>Xidmət</h1>
                    <p data-aos="fade-up" data-aos-delay="100">
                        <Link to="/">{t("contact.breadcrumb.home")}</Link>
                        <div className="dot dot1"></div>
                        <Link to="/">Kateqoriya</Link>
                        <div className="dot dot2"></div>
                        <Link to="/clinics">Klinikalar</Link>
                    </p>


                </div>
                <div className="first-section row">
                    <div className="col-6 col-md-12 col-sm-12 col-xs-12 second">
                        <div className="content">
                            <h2>{getLocalizedText(category, 'name')}</h2>
                            <p>{getLocalizedText(category, 'desc')}</p>
                            <div className={"muraciet"} onClick={()=>navigate('/contact')}>
                                Müraciət et <button><svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                                <path d="M11.2256 7.60838C11.1641 7.55116 11.1149 7.48216 11.0807 7.40549C11.0466 7.32883 11.0282 7.24607 11.0267 7.16215C11.0252 7.07823 11.0407 6.99487 11.0721 6.91705C11.1035 6.83922 11.1503 6.76853 11.2097 6.70918C11.269 6.64983 11.3397 6.60304 11.4176 6.57161C11.4954 6.54018 11.5787 6.52474 11.6627 6.52622C11.7466 6.5277 11.8293 6.54607 11.906 6.58023C11.9827 6.61439 12.0517 6.66364 12.1089 6.72505L15.4422 10.0584C15.5593 10.1756 15.625 10.3344 15.625 10.5C15.625 10.6657 15.5593 10.8245 15.4422 10.9417L12.1089 14.275C12.0517 14.3365 11.9827 14.3857 11.906 14.4199C11.8293 14.454 11.7466 14.4724 11.6627 14.4739C11.5787 14.4754 11.4954 14.4599 11.4176 14.4285C11.3397 14.397 11.269 14.3503 11.2097 14.2909C11.1503 14.2316 11.1035 14.1609 11.0721 14.083C11.0407 14.0052 11.0252 13.9219 11.0267 13.8379C11.0282 13.754 11.0466 13.6713 11.0807 13.5946C11.1149 13.5179 11.1641 13.4489 11.2255 13.3917L13.4922 11.125L5.41722 11.125C5.25146 11.125 5.09248 11.0592 4.97527 10.942C4.85806 10.8248 4.79222 10.6658 4.79222 10.5C4.79222 10.3343 4.85806 10.1753 4.97527 10.0581C5.09248 9.94089 5.25146 9.87505 5.41722 9.87505L13.4922 9.87505L11.2256 7.60838Z" fill="white"/>
                            </svg></button>
                            </div>
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
                                    <HomeServiceCard
                                        key={serv.id} // Key ekledim, unique olması için
                                        id={serv.id}
                                        name={getLocalizedText(serv, 'name')}
                                        desc={getLocalizedText(serv, 'desc')}
                                        icon={serv.serviceCardImage}
                                    />
                                ))}
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <button className={'hamisiniBax'} onClick={() => setShowAllServices(!showAllServices)}>
                                    {t("categoryDetail.secondSection.button")}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                                        <path d="M14.6382 21.1114L11.8882 18.3614C11.7592 18.2324 11.6867 18.0575 11.6867 17.875C11.6867 17.6926 11.7592 17.5176 11.8882 17.3886C12.0172 17.2596 12.1922 17.1871 12.3746 17.1871C12.5571 17.1871 12.732 17.2596 12.861 17.3886L14.4371 18.9656L14.4371 17.875C14.4371 14.5518 12.8043 13.8712 10.7349 13.0092C8.60368 12.1215 6.18712 11.1143 6.18712 6.87502L6.18712 6.78908C5.53904 6.62175 4.97424 6.2238 4.59858 5.66982C4.22292 5.11585 4.0622 4.44389 4.14654 3.77989C4.23088 3.1159 4.55449 2.50545 5.05671 2.06298C5.55893 1.62052 6.20529 1.3764 6.87462 1.3764C7.54395 1.3764 8.19031 1.62052 8.69253 2.06298C9.19475 2.50545 9.51836 3.1159 9.6027 3.77989C9.68704 4.44389 9.52632 5.11585 9.15066 5.66983C8.775 6.2238 8.2102 6.62175 7.56212 6.78908L7.56212 6.87502C7.56212 10.1982 9.19493 10.8788 11.2643 11.7408C13.3956 12.6328 15.8121 13.6357 15.8121 17.875L15.8121 18.9656L17.3882 17.3886C17.5172 17.2596 17.6922 17.1871 17.8746 17.1871C18.0571 17.1871 18.232 17.2596 18.361 17.3886C18.49 17.5176 18.5625 17.6926 18.5625 17.875C18.5625 18.0575 18.49 18.2324 18.361 18.3614L15.611 21.1114C15.5472 21.1753 15.4714 21.2261 15.3879 21.2607C15.3044 21.2953 15.215 21.3131 15.1246 21.3131C15.0343 21.3131 14.9448 21.2953 14.8613 21.2607C14.7779 21.2261 14.7021 21.1753 14.6382 21.1114Z" fill="#424242"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="contact">
                    <div className={"orange"}>
                        <img src={image}/>
                    </div>
                    <div className={'blueIcon'}>
                        <img  src={image1}/>
                    </div>
                    <div className={'whiteIcon'}>
                        <img  src={image3}/>
                    </div>
                    <div className="row">

                        <div className="col-7 col-md-12 col-sm-12 col-xs-12">
                            <div className="form">
                                <div className="form-head">

                                    <h2>{t("categoryDetail.contact.form.title")}</h2>
                                </div>
                                <div className="form-body">
                                    <form onSubmit={handleSubmit}> {/* onSubmit'i handleSubmit ile bağladım */}
                                        <div className="row">
                                            <div className="col-12" style={{
                                                padding:"12px 0"
                                            }}>
                                                <input
                                                    type="email"
                                                    placeholder="Email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    maxLength={100}
                                                    required
                                                />
                                                {errors.email && (
                                                    <span className="error-message">{errors.email}</span>
                                                )}
                                            </div>
                                            <div className="col-12" style={{
                                                padding:"12px 0"
                                            }}>
                                                <textarea
                                                    rows={5}
                                                    placeholder={"Qeyd"}
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    maxLength={700}
                                                    required
                                                />
                                                {errors.description && (
                                                    <span className="error-message">{errors.description}</span>
                                                )}
                                            </div>
                                            <div className="col-12" style={{
                                                padding:"12px 0"
                                            }}>
                                                <button type="submit">{t("categoryDetail.contact.form.button")}</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col-5 col-md-12 col-sm-12 col-xs-12">
                            <div className="image">
                                <img src={image2} alt={t("categoryDetail.contact.imageAlt")} />
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
            <div className="bannerAbout">
                <img src={banners} alt={t("contact.bannerAlt")} />
            </div>
        </div>
    );
}

export default CategoryDetail;