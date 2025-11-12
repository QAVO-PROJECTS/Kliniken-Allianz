import "./index.scss";
import banner from "/src/assets/AboutBanner.png";
import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {useGetAllClinicQuery, usePostContactMutation} from "../../../services/userApi.jsx"; // Mutation hook'unu ekledim
import { message } from "antd";
import ServiceDetailCard from "../../../components/UserComponents/ServicesDetailCard/index.jsx"; // Success/error için ekledim
import img1 from "/src/assets/dSamer.png"
import {useMediaQuery} from "react-responsive";
import mobileBanner from "../../../assets/MobileBanner.png";
import ClinicCard2 from "../../../components/UserComponents/ClinicCard2/index.jsx";
function ClinicsPage() {
    const {data:getAllClinic} = useGetAllClinicQuery()
    const clinics = getAllClinic?.data
    const { t } = useTranslation();

    const isMobile = useMediaQuery({maxWidth:768})
    const [searchTerm, setSearchTerm] = useState("");

    const filteredClinics = clinics?.filter((clinic) =>
        clinic.name?.toLowerCase().includes(searchTerm) ||
        clinic.nameEng?.toLowerCase().includes(searchTerm) ||
        clinic.nameRu?.toLowerCase().includes(searchTerm) 
    );


    return (
        <div id="clinics-page">
            <div className="container">
                <div className="clinics-page">
                    <div className="head">
                        <h1>Klinikalar</h1>
                        <p data-aos="fade-up" data-aos-delay="100">
                            <Link to="/">{t("contact.breadcrumb.home")}</Link>
                            <div className="dot"></div>
                            <Link to="/clinics">Klinikalar</Link>
                        </p>
                        <div className={'search'}>
                            <input type={'text'} onChange={(e) => setSearchTerm(e.target.value.toLowerCase())} placeholder={"Axtarış edin....."}/>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M17.2583 16.075L14.425 13.25C15.3392 12.0854 15.8352 10.6472 15.8333 9.16667C15.8333 7.84813 15.4423 6.5592 14.7098 5.46287C13.9773 4.36654 12.9361 3.51206 11.7179 3.00747C10.4997 2.50289 9.15927 2.37087 7.86607 2.6281C6.57286 2.88534 5.38497 3.52027 4.45262 4.45262C3.52027 5.38497 2.88534 6.57286 2.6281 7.86607C2.37087 9.15927 2.50289 10.4997 3.00747 11.7179C3.51206 12.9361 4.36654 13.9773 5.46287 14.7098C6.5592 15.4423 7.84813 15.8333 9.16667 15.8333C10.6472 15.8352 12.0854 15.3392 13.25 14.425L16.075 17.2583C16.1525 17.3364 16.2446 17.3984 16.3462 17.4407C16.4477 17.4831 16.5567 17.5048 16.6667 17.5048C16.7767 17.5048 16.8856 17.4831 16.9871 17.4407C17.0887 17.3984 17.1809 17.3364 17.2583 17.2583C17.3364 17.1809 17.3984 17.0887 17.4407 16.9871C17.4831 16.8856 17.5048 16.7767 17.5048 16.6667C17.5048 16.5567 17.4831 16.4477 17.4407 16.3462C17.3984 16.2446 17.3364 16.1525 17.2583 16.075ZM4.16667 9.16667C4.16667 8.17776 4.45991 7.21106 5.00932 6.38882C5.55873 5.56657 6.33962 4.92571 7.25325 4.54727C8.16688 4.16883 9.17222 4.06982 10.1421 4.26274C11.112 4.45567 12.0029 4.93187 12.7022 5.63114C13.4015 6.3304 13.8777 7.22131 14.0706 8.19122C14.2635 9.16112 14.1645 10.1665 13.7861 11.0801C13.4076 11.9937 12.7668 12.7746 11.9445 13.324C11.1223 13.8734 10.1556 14.1667 9.16667 14.1667C7.84059 14.1667 6.56882 13.6399 5.63114 12.7022C4.69345 11.7645 4.16667 10.4928 4.16667 9.16667Z" fill="#474747"/>
                            </svg>
                        </div>
                    </div>
                    <div className={'headers'}>
                        <h2>Etibar Edilən Sağlamlıq Mərkəzləri</h2>
                        <p>Kliniken Allianz yalnız beynəlxalq standartlara cavab verən, müasir və etibarlı klinikalarla əməkdaşlıq edir.</p>
                    </div>
                    <div className={'cards'}>
                        <div className={'row'}>
                            {filteredClinics?.length > 0 ? (
                                filteredClinics.map((item, index) => (
                                    <ClinicCard2 key={index} item={item} desc={"Baki"} name={"Anar"} img={img1}/>
                                ))
                            ) : (
                                <p style={{ textAlign: "center", width: "100%", marginTop: "20px" }}>
                                    Axtardığınız klinika tapılmadı 😔
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className={"bannerAbout"}>
                <img
                    src={isMobile ? mobileBanner : banner}
                    alt={t("aboutUs.bannerAlt")}
                />
            </div>
        </div>
    );
}

export default ClinicsPage;