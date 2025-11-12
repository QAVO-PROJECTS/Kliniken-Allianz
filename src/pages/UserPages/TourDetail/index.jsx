import "./index.scss";
import { Link, useParams } from "react-router-dom";
import banners from "/src/assets/AboutBanner.png";
import mobileBanners from "/src/assets/MobileBanner.png";
import {useTranslation} from "react-i18next";
import red from "/src/assets/redTeklif.svg"
import blue from "/src/assets/blueTeklif.svg"
import img1 from '/src/assets/turDetail1.jpg'
import img2 from '/src/assets/turDetail2.jpg'
import img3 from '/src/assets/turDetail3.jpg'
import {useMediaQuery} from "react-responsive";
import {useGetToursByIdQuery} from "../../../services/userApi.jsx";
import i18n from "../../../i18n.js";
import image from "../../../assets/CatgoryContantOrange.png";
import image1 from "../../../assets/blueIcon.png";
import image3 from "../../../assets/whiteIcon.png";
import image2 from "../../../assets/CategoryDetailImage.png";
import {message} from "antd";
import {useState} from "react";
import showToast from "../../../components/ToastMessage.js";
function TourDetail() {
    const { id } = useParams();
    const {t} = useTranslation();
    const isMobile = useMediaQuery({maxWidth:768})
    const {data:getToursById} = useGetToursByIdQuery(id)
    const tour = getToursById?.data
    const currentLang = i18n.language;
    // ✅ form sahələri üçün state
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState({});

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
            const payload = {
                name,
                surname,
                email,
                phoneNumber,
                description,
                tourId: id, // 🔹 burda göndəririk
            };

            try {
                await postContact(payload).unwrap();
                showToast("Mesajınız uğurla göndərildi ✅",'success');

                // reset
                setName("");
                setSurname("");
                setEmail("");
                setPhoneNumber("");
                setDescription("");
                setErrors({});
            } catch (error) {
                console.error("Contact error:", error);
                showToast("Mesaj göndərilərkən xəta baş verdi ❌",'error');
            }
        }
    };
    return (
        <div id="tour-detail">
            <div className="container">
                <div className="head">
                    <h1>{tour?.name}</h1>
                    <p data-aos="fade-up" data-aos-delay="100">
                        <Link to="/">{t("contact.breadcrumb.home")}</Link>
                        <div className="dot dot1"></div>
                        <Link to="/tours">Tibbi Tur Paketləri</Link>
                        <div className="dot dot2"></div>
                        <Link to={`/tours/${tour?.id}`}>{tour?.name}</Link>
                    </p>
                </div>
                <div className={"row"} style={{
                    justifyContent: "space-between",
                    marginBottom: "60px",
                }}>
                    <div className={'col-25 col-md-60 col-sm-60 col-xs-60 order2'}>
                        <div className={'content'}>
                            <h2>{tour?.name}</h2>
                            <p>{tour?.description}</p>

                            <div className="row">
                                {tour?.services?.map((srv, i) => {
                                    const serviceName =
                                        currentLang === "en"
                                            ? srv.nameEN
                                            : currentLang === "ru"
                                                ? srv.nameRU
                                                : currentLang === "de"
                                                    ? srv.nameAL
                                                    : currentLang === "ar"
                                                        ? srv.nameAR
                                                        : srv.name;
                                    return (
                                        <div className="col-30" key={srv.id || i}>
                                            <div className="teklif">
                                                <img src={i % 2 === 0 ? red : blue} alt="" />
                                                <h5>{serviceName}</h5>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <button>Müraciət et</button>
                        </div>
                    </div>
                    <div className={'col-30 col-md-60 col-sm-60 col-xs-60 order1'}>
                        <div className="image-grid">
                            <div className="image image1">
                                <img src={img1} alt="Germany"/>
                            </div>
                            <div className="image image2">
                                <img src={img2} alt="Laboratory"/>
                            </div>
                            <div className="image image3">
                                <img src={img3} alt="Hospital"/>
                            </div>
                        </div>

                    </div>
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
                    <div className="row" style={{
                        justifyContent: 'space-between',
                    }}>

                        <div className="col-32 col-md-60 col-sm-60 col-xs-60">
                            <div className="form">
                                <div className="form-head">

                                    <h2>{t("categoryDetail.contact.form.title")}</h2>
                                </div>
                                <div className="form-body">
                                    <form onSubmit={handleSubmit}> {/* onSubmit'i handleSubmit ile bağladım */}
                                        <div className="row" style={{
                                            justifyContent: 'space-between',
                                        }}>
                                            <div className="col-29" style={{ padding: "12px 0" }}>
                                                <input
                                                    type="text"
                                                    placeholder="Ad"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}

                                                />
                                                {errors.name && <span className="error-message">{errors.name}</span>}
                                            </div>
                                            <div className="col-29" style={{ padding: "12px 0" }}>
                                                <input
                                                    type="text"
                                                    placeholder="Soyad"
                                                    value={surname}
                                                    onChange={(e) => setSurname(e.target.value)}
                                                />
                                                {errors.surname && <span className="error-message">{errors.surname}</span>}
                                            </div>
                                            <div className="col-60" style={{ padding: "12px 0" }}>
                                                <input
                                                    type="email"
                                                    placeholder="Email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                                {errors.email && <span className="error-message">{errors.email}</span>}
                                            </div>
                                            <div className="col-60" style={{ padding: "12px 0" }}>
                                                <input
                                                    type="text"
                                                    placeholder="Telefon"
                                                    value={phoneNumber}
                                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                                />
                                                {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
                                            </div>
                                            <div className="col-60" style={{ padding: "12px 0" }}>
                                                <textarea
                                                    rows={5}
                                                    placeholder="Qeyd"
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                />
                                                {errors.description && <span className="error-message">{errors.description}</span>}
                                            </div>
                                            <div className="col-60" style={{ padding: "12px 0" }}>
                                                <button type="submit">
                                                    {t("categoryDetail.contact.form.button")}
                                                </button>
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
            <div className="bannerAbout">
                <img src={isMobile? mobileBanners : banners} alt={t("contact.bannerAlt")}/>
            </div>
        </div>
    );
}

export default TourDetail;