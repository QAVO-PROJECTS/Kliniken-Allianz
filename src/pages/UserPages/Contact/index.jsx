import "./index.scss";
import banner from "/src/assets/AboutBanner.png";
import { Link, useNavigate } from "react-router-dom";
import Title from "../../../components/UserComponents/Title/index.jsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePostContactMutation } from "../../../services/userApi.jsx"; // Mutation hook'unu ekledim
import { message } from "antd";
import {useMediaQuery} from "react-responsive"; // Success/error için ekledim
import mobileBanner from "/src/assets/MobileBanner.png"
function Contact() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [postContact] = usePostContactMutation(); // Mutation hook'unu ekledim
    const [name, setName] = useState(""); // setFirstName → setName (tutarlılık için, ama istersen değiştir)
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [description, setDescription] = useState(""); // setNote'u düzelttim: setDescription
    const isMobile = useMediaQuery({maxWidth:768})
    // Validation error state
    const [errors, setErrors] = useState({});

    // Validation function: checks each field as required
    const validate = () => {
        const newErrors = {};
        if (!name.trim()) {
            newErrors.name = t("contact.form.errors.firstNameRequired");
        }
        if (!surname.trim()) {
            newErrors.surname = t("contact.form.errors.lastNameRequired");
        }
        if (!email.trim()) {
            newErrors.email = t("contact.form.errors.emailRequired");
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = t("contact.form.errors.emailInvalid");
        }
        if (!phoneNumber.trim()) {
            newErrors.phoneNumber = t("contact.form.errors.phoneRequired");
        }
        if (!description.trim()) {
            newErrors.description = t("contact.form.errors.descriptionRequired");
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
                await postContact({ name, surname, email, phoneNumber, description }).unwrap(); // Backend'e gönder
                message.success(t("contact.form.success") || "Mesajınız başarıyla gönderildi!"); // Success message (translation ekle istersen)
                // Form'u resetle
                setName("");
                setSurname("");
                setEmail("");
                setPhoneNumber("");
                setDescription("");
                setErrors({});
            } catch (error) {
                console.error("Contact error:", error);
                message.error(t("contact.form.error") || "Mesaj gönderilirken hata oluştu!");
            }
        }
    };

    return (
        <div id="contact">
            <div className="container">
                <div className="contact">
                    <div className="head">
                        <h1>{t("contact.title")}</h1>
                        <p data-aos="fade-up" data-aos-delay="100">
                            <Link to="/">{t("contact.breadcrumb.home")}</Link>
                            <div className="dot"></div>
                            <Link to="/contact">{t("contact.breadcrumb.contact")}</Link>
                        </p>
                    </div>
                    <div className="main">
                        <Title
                            title={t("contact.main.title")}
                            desc={'Tibbi turizmlə bağlı bütün suallarınız üçün bizimlə rahatlıqla əlaqə saxlaya bilərsiniz. Mütəxəssis komandamız sizə uyğun həll yollarını təqdim edəcək.'}
                        />
                        <div className="row">
                            <div className="col-4 col-md-12 col-sm-12 col-xs-12">
                                <div className="contactCard">
                                    <div className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                            <path d="M6.01667 9.49167C7.21667 11.85 9.15 13.775 11.5083 14.9833L13.3417 13.15C13.5667 12.925 13.9 12.85 14.1917 12.95C15.125 13.2583 16.1333 13.425 17.1667 13.425C17.625 13.425 18 13.8 18 14.2583V17.1667C18 17.625 17.625 18 17.1667 18C9.34167 18 3 11.6583 3 3.83333C3 3.375 3.375 3 3.83333 3H6.75C7.20833 3 7.58333 3.375 7.58333 3.83333C7.58333 4.875 7.75 5.875 8.05833 6.80833C8.15 7.1 8.08333 7.425 7.85 7.65833L6.01667 9.49167Z" fill="#003778" fill-opacity="0.67"/>
                                        </svg>
                                    </div>
                                    <div className="text">
                                        <h4>{t("contact.contactCard.mobile.title")}</h4>
                                        <p>{t("contact.contactCard.mobile.value")}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-4 col-md-12 col-sm-12 col-xs-12">
                                <div className="contactCard">
                                    <div className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                            <path d="M17.168 3.83337H3.83464C2.91797 3.83337 2.1763 4.58337 2.1763 5.50004L2.16797 15.5C2.16797 16.4167 2.91797 17.1667 3.83464 17.1667H17.168C18.0846 17.1667 18.8346 16.4167 18.8346 15.5V5.50004C18.8346 4.58337 18.0846 3.83337 17.168 3.83337ZM16.8346 7.37504L10.943 11.0584C10.6763 11.225 10.3263 11.225 10.0596 11.0584L4.16797 7.37504C4.08441 7.32813 4.01123 7.26476 3.95288 7.18875C3.89452 7.11275 3.85219 7.02569 3.82845 6.93285C3.80471 6.84001 3.80005 6.74332 3.81477 6.64863C3.82948 6.55394 3.86325 6.46322 3.91404 6.38196C3.96482 6.3007 4.03157 6.23059 4.11024 6.17587C4.18891 6.12115 4.27786 6.08297 4.37172 6.06362C4.46557 6.04428 4.56237 6.04418 4.65626 6.06333C4.75016 6.08248 4.83919 6.12049 4.91797 6.17504L10.5013 9.66671L16.0846 6.17504C16.1634 6.12049 16.2524 6.08248 16.3463 6.06333C16.4402 6.04418 16.537 6.04428 16.6309 6.06362C16.7247 6.08297 16.8137 6.12115 16.8924 6.17587C16.971 6.23059 17.0378 6.3007 17.0886 6.38196C17.1394 6.46322 17.1731 6.55394 17.1878 6.64863C17.2026 6.74332 17.1979 6.84001 17.1742 6.93285C17.1504 7.02569 17.1081 7.11275 17.0497 7.18875C16.9914 7.26476 16.9182 7.32813 16.8346 7.37504Z" fill="#003778" fill-opacity="0.67"/>
                                        </svg>
                                    </div>
                                    <div className="text">
                                        <h4>{t("contact.contactCard.email.title")}</h4>
                                        <p>{t("contact.contactCard.email.value")}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-4 col-md-12 col-sm-12 col-xs-12">
                                <div className="contactCard">
                                    <div className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.8837 18.945C9.8837 18.945 3.83203 13.8483 3.83203 8.83329C3.83203 7.06518 4.53441 5.36949 5.78465 4.11925C7.0349 2.86901 8.73059 2.16663 10.4987 2.16663C12.2668 2.16663 13.9625 2.86901 15.2127 4.11925C16.463 5.36949 17.1654 7.06518 17.1654 8.83329C17.1654 13.8483 11.1137 18.945 11.1137 18.945C10.777 19.255 10.2229 19.2516 9.8837 18.945ZM10.4987 11.75C10.8817 11.75 11.261 11.6745 11.6149 11.5279C11.9687 11.3814 12.2903 11.1665 12.5611 10.8957C12.8319 10.6249 13.0468 10.3033 13.1933 9.94945C13.3399 9.59559 13.4154 9.21632 13.4154 8.83329C13.4154 8.45027 13.3399 8.071 13.1933 7.71713C13.0468 7.36327 12.8319 7.04174 12.5611 6.7709C12.2903 6.50006 11.9687 6.28522 11.6149 6.13864C11.261 5.99207 10.8817 5.91663 10.4987 5.91663C9.72515 5.91663 8.98328 6.22392 8.4363 6.7709C7.88932 7.31788 7.58203 8.05974 7.58203 8.83329C7.58203 9.60684 7.88932 10.3487 8.4363 10.8957C8.98328 11.4427 9.72515 11.75 10.4987 11.75Z" fill="#003778" fill-opacity="0.67"/>
                                        </svg>
                                    </div>
                                    <div className="text">
                                        <h4>{t("contact.contactCard.address.title")}</h4>
                                        <p>{t("contact.contactCard.address.value")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row form-section">
                        <div className="col-6 col-md-12 col-sm-12 col-xs-12">
                            <div className="form" data-aos="fade-right">
                                <div className="form-head">
                                    <hr />
                                    <h2>{t("contact.form.title")}</h2>
                                </div>
                                <div className="form-body">
                                    <form onSubmit={handleSubmit}> {/* onSubmit'i handleSubmit ile bağladım */}
                                        <div className="row">
                                            <div className="col-6 col-md-12 col-sm-12 col-xs-12">
                                                <label>{t("contact.form.labels.name")}</label> <br />
                                                <input
                                                    placeholder={t("contact.form.placeholders.name")}
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    maxLength={50}
                                                    required
                                                />
                                                {errors.name && (
                                                    <span className="error-message">{errors.name}</span>
                                                )}
                                            </div>
                                            <div className="col-6 col-md-12 col-sm-12 col-xs-12">
                                                <label>{t("contact.form.labels.surname")}</label> <br />
                                                <input
                                                    placeholder={t("contact.form.placeholders.surname")}
                                                    value={surname}
                                                    onChange={(e) => setSurname(e.target.value)}
                                                    maxLength={50}
                                                    required
                                                />
                                                {errors.surname && (
                                                    <span className="error-message">{errors.surname}</span>
                                                )}
                                            </div>
                                            <div className="col-12">
                                                <label>{t("contact.form.labels.email")}</label> <br />
                                                <input
                                                    type="email"
                                                    placeholder={t("contact.form.placeholders.email")}
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
                                                <label>{t("contact.form.labels.phone")}</label> <br />
                                                <input
                                                    type="tel"
                                                    placeholder={t("contact.form.placeholders.phone")}
                                                    value={phoneNumber}
                                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                                    maxLength={20}
                                                    required
                                                />
                                                {errors.phoneNumber && (
                                                    <span className="error-message">
                                                        {errors.phoneNumber}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="col-12">
                                                <label>{t("contact.form.labels.description")}</label>{" "}
                                                <br />
                                                <textarea
                                                    rows={5}
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    maxLength={700}
                                                    required
                                                />
                                                {errors.description && (
                                                    <span className="error-message">
                                                        {errors.description}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="col-12">
                                                <button type="submit">{t("contact.form.button")}</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-md-12 col-sm-12 col-xs-12">
                            <div className="map" data-aos="fade-left">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3603.5460616273745!2d49.85555347640196!3d40.41115175597831!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d003436b447%3A0xb8c6c13c52985f63!2sQAVO%20MMC!5e1!3m2!1sen!2saz!4v1745930590256!5m2!1sen!2saz"
                                    width="100%"
                                    height="580"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Google Map"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bannerAbout">
                <img src={isMobile ? mobileBanner : banner} alt={t("contact.bannerAlt")} />
            </div>
        </div>
    );
}

export default Contact;