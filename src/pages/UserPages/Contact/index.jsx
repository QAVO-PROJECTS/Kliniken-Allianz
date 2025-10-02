import "./index.scss";
import banner from "/src/assets/AboutBanner.png";
import { Link, useNavigate } from "react-router-dom";
import Title from "../../../components/UserComponents/Title/index.jsx";
import { MdCall, MdEmail } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePostContactMutation } from "../../../services/userApi.jsx"; // Mutation hook'unu ekledim
import { message } from "antd"; // Success/error için ekledim

function Contact() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [postContact] = usePostContactMutation(); // Mutation hook'unu ekledim
    const [name, setName] = useState(""); // setFirstName → setName (tutarlılık için, ama istersen değiştir)
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [description, setDescription] = useState(""); // setNote'u düzelttim: setDescription

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
                            desc={t("contact.main.description")}
                        />
                        <div className="row">
                            <div className="col-4 col-md-12 col-sm-12 col-xs-12">
                                <div className="contactCard">
                                    <div className="icon">
                                        <MdCall />
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
                                        <MdEmail />
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
                                        <FaLocationDot />
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
                <img src={banner} alt={t("contact.bannerAlt")} />
            </div>
        </div>
    );
}

export default Contact;