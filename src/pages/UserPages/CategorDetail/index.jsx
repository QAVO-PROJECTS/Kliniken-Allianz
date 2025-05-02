import "./index.scss";
import {Link, useNavigate} from "react-router-dom";
import banner from "/src/assets/CategoryBanner.png";
import mobileBanner from "/src/assets/MobileBannerCategoryDetail.png";
import image from "/src/assets/clevelandClinic.png";
import image1 from "/src/assets/Johns.png";
import image2 from "/src/assets/CategoryDetailImage.png";
import ServicesCardCategory from "../../../components/UserComponents/CategoryDetail/ServicesCard/index.jsx";
import {useState} from "react";
import {t} from "i18next";
import CustomSlider from "../../../components/UserComponents/CategoryDetail/CustomSlider/index.jsx";
import HomeServiceCard from "../../../components/UserComponents/Home/ServiceCardHome/index.jsx";
import icon1 from "../../../assets/Servis/cancer.png";
import icon4 from "../../../assets/Servis/oftomoloq.png";
import icon3 from "../../../assets/Servis/genekoloq.png";
import icon5 from "../../../assets/Servis/hepatoloq.png";
import icon6 from "../../../assets/Servis/travmatoloq.png";
import icon2 from "../../../assets/Servis/ortaped.png";
import { useMediaQuery } from 'react-responsive';
function CategoryDetail() {
    const [showAllServices, setShowAllServices] = useState(false);
    const [email, setEmail] = useState("");
    const [description, setNote] = useState("");
    const [errors, setErrors] = useState({});

    const visibleItems = 4; // Görünen öğe sayısı
    const [currentIndex, setCurrentIndex] = useState(0);

    const validate = () => {
        const newErrors = {};

        if (!email.trim()) {
            newErrors.email = t("contact.form.errors.emailRequired") || "Emailinizi daxil edin";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = t("contact.form.errors.emailInvalid") || "Düzgün email daxil edin";
        }
        return newErrors;
    };

    // Toplam kategori sayısına göre maksimum index hesapla
    const categoriesCount = 12; // Kategoriler sabit, CustomSlider'dan geliyor
    const maxIndex = Math.ceil(categoriesCount - visibleItems);

    // Bullet'a tıklayınca slider'ı kaydır
    const handleBulletClick = (index) => {
        if (index <= maxIndex) {
            setCurrentIndex(index);
        }
    };
    const navigate = useNavigate()
    const cards = [{
        name: "Xərçəng müalicəsi",
        description: "Abş",
        icon: icon1,
    },
        {
            name: "Oftamologiya",
            description: "Bangkok",
            icon: icon4,
        },

        {
            name: "Ginekologiya",
            description: "İstanbul",
            icon: icon3,
        },

        {
            name: "Hepatologiya",
            description: "Sinqapur",
            icon: icon5,
        }];
    const isMobile = useMediaQuery({ maxWidth: 768 });
    return (
        <div id={"category-detail"}>
            <div className={"container"}>
                <div className={"head"}>
                    <p data-aos="fade-up" data-aos-delay="100">
                        <Link to={"/"}>Ana səhifə</Link>

                        <div className={"dot active"}></div>
                        <Link to={"/category/:id"}>Kateqoriyalar</Link>
                    </p>
                </div>
                <div className={"first-section row"}>
                    <div className={"col-6 col-md-12 col-sm-12 col-xs-12 second"}>
                        <div className={"content"}>
                            <h2>Ürək-Damar Cərrahiyyəsi</h2>
                            <p>
                                Ürək və damar xəstəlikləri dünya üzrə ən geniş yayılmış sağlamlıq
                                problemlərindəndir. Kliniken Allianz olaraq, bu sahədə
                                ixtisaslaşmış, beynəlxalq təcrübəyə malik həkimlər və yüksək
                                texnologiyalı klinikalarla əməkdaşlıq edirik.
                            </p>
                            <button onClick={() => navigate('/contact')}>Müraciət et</button>
                        </div>
                    </div>
                    <div className={"col-6 col-md-12 col-sm-12 col-xs-12 first"}>
                        <div className={"image"}>
                            <img src={isMobile ? mobileBanner : banner} alt="Banner" />
                        </div>
                    </div>
                </div>
                <div className={"second-section"}>
                    <div className={"header"}>
                        <div className={"title"}>
                            <img src={image} alt=""/>
                            <h2>Cleveland Clinic</h2>
                        </div>
                        <p>
                            Cleveland Clinic, qabaqcıl texnologiyalar və peşəkar həkim heyəti
                            ilə ürək-damar xəstəliklərinin müalicəsində dünya səviyyəli
                            xidmətlər təqdim edən, etibarlı və tanınmış bir tibbi mərkəzdir.
                        </p>
                    </div>
                    <div className={"row"} style={{marginBottom: "48px"}}>
                        {cards.map((item, index)=>(
                            <ServicesCardCategory key={index}  name={item.name} icon={item.icon} />
                    ))}
                </div>
                <div style={{textAlign: "center"}}>
                    <button onClick={() => setShowAllServices(!showAllServices)}>
                        {showAllServices ? "Hamısına bax" : "Hamısına bax"}{" "}
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
            <div className={"third-section"}>
                <div className={"header"}>
                    <div className={"title"}>
                        <img src={image1} alt=""/>
                        <h2>Johns Hopkins Medicine</h2>
                    </div>
                    <p>
                        Johns Hopkins, dünya miqyasında tanınmış tibbi tədqiqat və müalicə
                        mərkəzidir. Ürək-damar xəstəlikləri və cərrahiyyəsi sahəsində
                        qabaqcıl müalicə metodları tətbiq edir.
                    </p>
                </div>
                <div className={"row"} style={{marginBottom: "48px"}}>
                    {cards.map((item, index)=>(
                        <ServicesCardCategory key={index}  name={item.name} icon={item.icon} />
                    ))}
                </div>
                <div style={{textAlign: "center"}}>
                    <button onClick={() => setShowAllServices(!showAllServices)}>
                        {showAllServices ? "Hamısına bax" : "Hamısına bax"}{" "}
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
            <div className={"contact"}>
                <div className={"row"}>
                    <div className={"col-4 col-md-12 col-sm-12 col-xs-12"}>
                        <div className={"image"}>
                            <img src={image2}/>
                        </div>
                    </div>
                    <div className={"col-8 col-md-12 col-sm-12 col-xs-12"}>
                        <div className={"form"}>
                            <div className={"form-head"}>
                                <hr/>
                                <h2>
                                    Əgər hər hansı çətinliklə qarşılaşırsınızsa, bizə müraciət
                                    edin.
                                </h2>
                            </div>
                            <div className={"form-body"}>
                                <form onSubmit={""}>
                                    <div className={"row"}>
                                        <div className={"col-12"}>
                                            <label>Email</label> <br/>
                                            <input
                                                type="email"
                                                placeholder="examle@gmail.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                maxLength={100}
                                                required
                                            />
                                            {errors.email && (
                                                <span className="error-message">{errors.email}</span>
                                            )}
                                        </div>
                                        <div className={"col-12"}>
                                            <label>Qeyd</label> <br/>
                                            <textarea
                                                rows={5}
                                                value={description}
                                                onChange={(e) => setNote(e.target.value)}
                                                maxLength={700}
                                                required
                                            />
                                            {errors.description && (
                                                <span className="error-message">
                            {errors.description}
                          </span>
                                            )}
                                        </div>
                                        <div className={"col-12"}>
                                            <button type="submit">Göndər</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"services"}>
                <div className={"header"}>
                    <h3>Digər kateqoriyalar</h3>
                    <p>
                        Beynalxalq səviyyəli klinikalarda müxtəlif tibbi sahələrdə təqdim
                        etdiyimiz xidmətlərdən yararlanın.
                    </p>
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
)
    ;
}

export default CategoryDetail;