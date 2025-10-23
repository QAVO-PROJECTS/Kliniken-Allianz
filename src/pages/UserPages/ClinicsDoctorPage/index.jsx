import "./index.scss";
import banner from "/src/assets/AboutBanner.png";
import { Link, useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";

import img1 from "/src/assets/dSamer.png"

import DoktorCard from "../../../components/UserComponents/ClinicDetail/DoktorCard/index.jsx";
import bannerMobile from "../../../assets/MobileBanner.png";
import {useMediaQuery} from "react-responsive";
function ClinicsDoctor() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isMobile = useMediaQuery({maxWidth:768})
    // Validation error state

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
                <img src={isMobile? bannerMobile : banner} alt={t("contact.bannerAlt")} />
            </div>
        </div>
    );
}

export default ClinicsDoctor;