import "./index.scss"
import banner from "/src/assets/AboutBanner.png"
import {Link, useNavigate} from "react-router-dom";
import Title from "../../../components/UserComponents/Title/index.jsx";
import {MdCall, MdEmail} from "react-icons/md";
import {FaLocationDot} from "react-icons/fa6";
import {useEffect, useState} from "react";
import {t} from "i18next";

function Contact() {
    const navigate = useNavigate();
    const [name, setFirstName] = useState("");
    const [surname, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhone] = useState("");
    const [description, setNote] = useState("");

    // Validasiya error state-i
    const [errors, setErrors] = useState({});

    // useEffect(() => {
    //     AOS.init({
    //         duration: 1000, // Animasiya müddəti (ms)
    //         once: true      // Hər element yalnız bir dəfə animasiya edilsin
    //     });
    // }, []);

    // Validasiya funksiyası: hər bir sahəni required kimi yoxlayır
    const validate = () => {
        const newErrors = {};
        if (!name.trim()) {
            newErrors.name = t("contact.form.errors.firstNameRequired") || "Adınızı daxil edin";
        }
        if (!surname.trim()) {
            newErrors.surname = t("contact.form.errors.lastNameRequired") || "Soyadınızı daxil edin";
        }
        if (!email.trim()) {
            newErrors.email = t("contact.form.errors.emailRequired") || "Emailinizi daxil edin";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = t("contact.form.errors.emailInvalid") || "Düzgün email daxil edin";
        }
        if (!phoneNumber.trim()) {
            newErrors.phoneNumber = t("contact.form.errors.phoneRequired") || "Telefon nömrənizi daxil edin";
        }
        if (!description.trim()) {
            newErrors.description = t("contact.form.errors.descriptionRequired") || "Mesajınızı daxil edin";
        }
        return newErrors;
    };

    // Form submit funksiyası
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const validationErrors = validate();
    //     if (Object.keys(validationErrors).length > 0) {
    //         setErrors(validationErrors);
    //         console.error("Validasiya xətaları:", JSON.stringify(validationErrors, null, 2));
    //         showToast(t("contact.form.validationErrors") || "Xahiş olunur bütün xanalari düzgün doldurun", "error");
    //         return;
    //     }
    //     setErrors({});
    //
    //     const formData = {
    //         name,
    //         surname,
    //         email,
    //         phoneNumber,
    //         description,
    //     };
    //
    //     try {
    //         await postContact(formData).unwrap();
    //         showToast(t("contact.form.successMessage"), "success");
    //         // Form reset edirik
    //         setFirstName("");
    //         setLastName("");
    //         setEmail("");
    //         setPhone("");
    //         setNote("");
    //     } catch (error) {
    //         console.error("Mesaj göndərilərkən xəta baş verdi:", error);
    //         showToast(t("contact.form.errorMessage"), "error");
    //     }
    // };
    return (<div id={"contact"}>
        <div className={"container"}>
            <div className={"contact"}>
                <div className={"head"}>
                    <h1>Əlaqə</h1>
                    <p data-aos="fade-up" data-aos-delay="100">
                        <Link to={"/"}>Ana səhifə</Link>
                        <div className={"dot"}></div>
                        <Link to={"/contact"}>Əlaqə</Link>
                    </p>
                </div>
                <div className={"main"}>
                    <Title title={"Kömək etməyə hazırıq"}
                           desc={"Tibbi turizmlə bağlı bütün suallarınız üçün bizimlə rahatlıqla əlaqə saxlaya bilərsiniz. Mütəxəssis komandamız sizə uyğun həll yollarını təqdim edəcək."}/>
                    <div className={"row"}>
                        <div className={"col-4 col-md-12 col-sm-12 col-xs-12"}>
                            <div className={"contactCard"}>
                                <div className={"icon"}>
                                    <MdCall/>
                                </div>
                                <div className={"text"}>
                                    <h4>Mobil</h4>
                                    <p>+994 50 123 45 67</p>
                                </div>
                            </div>
                        </div>
                        <div className={"col-4 col-md-12 col-sm-12 col-xs-12"}>
                            <div className={"contactCard"}>
                                <div className={"icon"}>
                                    <MdEmail/>
                                </div>
                                <div className={"text"}>
                                    <h4>Email</h4>
                                    <p>info@kliniken-allianz.az</p>
                                </div>
                            </div>
                        </div>
                        <div className={"col-4 col-md-12 col-sm-12 col-xs-12"}>
                            <div className={"contactCard"}>
                                <div className={"icon"}>
                                    <FaLocationDot/>
                                </div>
                                <div className={"text"}>
                                    <h4>Ünvan</h4>
                                    <p>Nizami küçəsi 45, Bakı, Azərbaycan</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"row form-section"}>
                    <div className={"col-6 col-md-12 col-sm-12 col-xs-12"}>
                        <div className={"form"} data-aos="fade-right">
                            <div className={"form-head"}>
                                <hr/>
                                <h2>Formu dolduraraq bizimlə əlaqə saxlayın</h2>
                            </div>
                            <div className={"form-body"}>
                                <form onSubmit={""}>
                                    <div className={"row"}>
                                        <div className={"col-6 col-md-12 col-sm-12 col-xs-12"}>
                                            <label>Ad</label> <br/>
                                            <input
                                                placeholder="Adınızı daxil edin"
                                                value={name}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                maxLength={50}
                                                required
                                            />
                                            {errors.name && <span className="error-message">{errors.name}</span>}
                                        </div>
                                        <div className={"col-6 col-md-12 col-sm-12 col-xs-12"}>
                                            <label>Soyad</label> <br/>
                                            <input
                                                placeholder="Soyadınızı daxil edin"
                                                value={surname}
                                                onChange={(e) => setLastName(e.target.value)}
                                                maxLength={50}
                                                required
                                            />
                                            {errors.surname && <span className="error-message">{errors.surname}</span>}
                                        </div>
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
                                            {errors.email && <span className="error-message">{errors.email}</span>}
                                        </div>
                                        <div className={"col-12"}>
                                            <label>Nömrə</label> <br/>
                                            <input
                                                type="tel"
                                                placeholder="+994 99 999 99 99"
                                                value={phoneNumber}
                                                onChange={(e) => setPhone(e.target.value)}
                                                maxLength={20}
                                                required
                                            />
                                            {errors.phoneNumber &&
                                                <span className="error-message">{errors.phoneNumber}</span>}
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
                                            {errors.description &&
                                                <span className="error-message">{errors.description}</span>}
                                        </div>
                                        <div className={"col-12"}>
                                            <button type="submit">Göndər</button>
                                        </div>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                    <div className={"col-6 col-md-12 col-sm-12 col-xs-12"}>
                        <div className="map" data-aos="fade-left">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3603.5460616273745!2d49.85555347640196!3d40.41115175597831!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d003436b447%3A0xb8c6c13c52985f63!2sQAVO%20MMC!5e1!3m2!1sen!2saz!4v1745930590256!5m2!1sen!2saz"
                                width="100%"
                                height="580"
                                style={{border: 0}}
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
        <div className={"bannerAbout"}>
            <img src={banner} alt="banner logo"/>
        </div>
    </div>);
}

export default Contact;