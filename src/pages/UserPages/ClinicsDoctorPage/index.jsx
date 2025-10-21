import "./index.scss";
import banner from "/src/assets/AboutBanner.png";
import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePostContactMutation } from "../../../services/userApi.jsx"; // Mutation hook'unu ekledim
import { message } from "antd";
import ServiceDetailCard from "../../../components/UserComponents/ServicesDetailCard/index.jsx"; // Success/error için ekledim
import img1 from "/src/assets/dSamer.png"

import DoktorCard from "../../../components/UserComponents/ClinicDetail/DoktorCard/index.jsx";
function ClinicsDoctor() {
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
    const array = [
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
    ]

    return (
        <div id="clinics-doctor-page">
            <div className="container">
                <div className="clinics-doctor-page">
                    <div className="head">
                        <h1>Həkimlər</h1>
                        <p data-aos="fade-up" data-aos-delay="100">
                            <Link to="/">GlobalMed klinika</Link>
                            <div className="dot"></div>
                            <Link to="/clinics-doctor">Həkimlər</Link>
                        </p>
                    </div>
                    <div className={'headers'}>
                        <h2>GlobalMed-in Peşəkar Komandası</h2>
                        <p>Müxtəlif sahələr üzrə ixtisaslaşmış həkimlərdən özünüzə uyğun olanı seçin</p>
                    </div>
                    <div className={'cards'}>
                        <div className={'row'}>
                            {array.map((item, index) => (
                                <DoktorCard img={img1} name={"anar"} desc={"5 il"}/>
                            ))}
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

export default ClinicsDoctor;