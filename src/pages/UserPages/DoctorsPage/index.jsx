import "./index.scss";
import banner from "/src/assets/AboutBanner.png";
import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePostContactMutation } from "../../../services/userApi.jsx"; // Mutation hook'unu ekledim
import { message } from "antd";
import ServiceDetailCard from "../../../components/UserComponents/ServicesDetailCard/index.jsx"; // Success/error için ekledim
import img1 from "/src/assets/dSamer.png"
import DoktorCard2 from "../../../components/UserComponents/DoktorCard2/index.jsx";
import dolu from "/src/assets/doluUlduz.svg"
import bos from  "/src/assets/bosUlduz.svg"
import Pagination from "../../../components/UserComponents/Pagination/index.jsx";
function DoctorsPage() {
    const { t } = useTranslation();


    // ---- FILTER STATE-lər ----
    const [selectedExperience, setSelectedExperience] = useState([]);
    const [selectedClinics, setSelectedClinics] = useState([]);
    const [selectedRatings, setSelectedRatings] = useState([]);
    const [selectedAreas, setSelectedAreas] = useState([]);

    // ---- Toggle funksiyaları ----
    const toggleExperience = (val) => {
        setSelectedExperience((prev) =>
            prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
        );
    };

    const toggleClinic = (val) => {
        setSelectedClinics((prev) =>
            prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
        );
    };

    const toggleRating = (val) => {
        setSelectedRatings((prev) =>
            prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
        );
    };

    const toggleArea = (val) => {
        setSelectedAreas((prev) =>
            prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
        );
    };

    // ---- Reset funksiyaları ----
    const resetExperience = () => setSelectedExperience([]);
    const resetClinics = () => setSelectedClinics([]);
    const resetRatings = () => setSelectedRatings([]);
    const resetAreas = () => setSelectedAreas([]);
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
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 6;
    return (
        <div id="doctors-page">
            <div className="container">
                <div className="doctors-page">
                    <div className="head">
                        <h1>Həkimlər</h1>
                        <p data-aos="fade-up" data-aos-delay="100">
                            <Link to="/">{t("contact.breadcrumb.home")}</Link>
                            <div className="dot"></div>
                            <Link to="/doctors">Həkimlər</Link>
                        </p>
                        <div className={'search'}>
                            <input type={'text'} placeholder={"Axtarış edin....."}/>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M17.2583 16.075L14.425 13.25C15.3392 12.0854 15.8352 10.6472 15.8333 9.16667C15.8333 7.84813 15.4423 6.5592 14.7098 5.46287C13.9773 4.36654 12.9361 3.51206 11.7179 3.00747C10.4997 2.50289 9.15927 2.37087 7.86607 2.6281C6.57286 2.88534 5.38497 3.52027 4.45262 4.45262C3.52027 5.38497 2.88534 6.57286 2.6281 7.86607C2.37087 9.15927 2.50289 10.4997 3.00747 11.7179C3.51206 12.9361 4.36654 13.9773 5.46287 14.7098C6.5592 15.4423 7.84813 15.8333 9.16667 15.8333C10.6472 15.8352 12.0854 15.3392 13.25 14.425L16.075 17.2583C16.1525 17.3364 16.2446 17.3984 16.3462 17.4407C16.4477 17.4831 16.5567 17.5048 16.6667 17.5048C16.7767 17.5048 16.8856 17.4831 16.9871 17.4407C17.0887 17.3984 17.1809 17.3364 17.2583 17.2583C17.3364 17.1809 17.3984 17.0887 17.4407 16.9871C17.4831 16.8856 17.5048 16.7767 17.5048 16.6667C17.5048 16.5567 17.4831 16.4477 17.4407 16.3462C17.3984 16.2446 17.3364 16.1525 17.2583 16.075ZM4.16667 9.16667C4.16667 8.17776 4.45991 7.21106 5.00932 6.38882C5.55873 5.56657 6.33962 4.92571 7.25325 4.54727C8.16688 4.16883 9.17222 4.06982 10.1421 4.26274C11.112 4.45567 12.0029 4.93187 12.7022 5.63114C13.4015 6.3304 13.8777 7.22131 14.0706 8.19122C14.2635 9.16112 14.1645 10.1665 13.7861 11.0801C13.4076 11.9937 12.7668 12.7746 11.9445 13.324C11.1223 13.8734 10.1556 14.1667 9.16667 14.1667C7.84059 14.1667 6.56882 13.6399 5.63114 12.7022C4.69345 11.7645 4.16667 10.4928 4.16667 9.16667Z" fill="#474747"/>
                            </svg>
                        </div>
                    </div>
                    <div className={'headers'}>
                        <h2>Sağlamlığınız üçün ən doğru seçim</h2>
                        <p>Müxtəlif sahələr üzrə ixtisaslaşmış həkimlərdən özünüzə uyğun olanı seçin</p>
                    </div>
                    <div className={'cards'}>
                        <div className={'row'}>
                            <div className={'col-3'} style={{
                                padding:"32px 8px"
                            }}>
                                <div className="filter-bar">
                                    <h3>Filtr</h3>
                                    <div className={'hr'}></div>
                                    {/* İş təcrübəsi */}
                                    <div className="filter-section">
                                        <div className="filter-header">
                                            <span><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M3.44141 6.87875H10.3202" stroke="black" stroke-width="1.28978" stroke-linecap="round" stroke-linejoin="round"/>
</svg> İş təcrübəsi</span>
                                            <button onClick={resetExperience}>Sıfırlayın</button>
                                        </div>
                                        <div className="filter-options">
                                            {[1, 2, 3, 4, 5, "5+"].map((year, i) => (
                                                <label key={i}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedExperience.includes(year)}
                                                        onChange={() => toggleExperience(year)}
                                                    />
                                                    {year}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Klinika */}
                                    <div className="filter-section">
                                        <div className="filter-header">
                                            <span><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M3.44141 6.87875H10.3202" stroke="black" stroke-width="1.28978" stroke-linecap="round" stroke-linejoin="round"/>
</svg> Klinika</span>
                                            <button onClick={resetClinics}>Sıfırlayın</button>
                                        </div>
                                        <div className="filter-options">
                                            {["GlobalMed", "Simul Hospital", "Yeni Klinika", "CityMed", "Baku Clinic"].map((clinic, i) => (
                                                <label key={i}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedClinics.includes(clinic)}
                                                        onChange={() => toggleClinic(clinic)}
                                                    />
                                                    {clinic}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Reytinq */}
                                    <div className="filter-section">
                                        <div className="filter-header">
                                            <span><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M3.44141 6.87875H10.3202" stroke="black" stroke-width="1.28978" stroke-linecap="round" stroke-linejoin="round"/>
</svg> Reytinq</span>
                                            <button  onClick={resetRatings}>Sıfırlayın</button>
                                        </div>
                                        <div className="filter-options rating">
                                            {[5, 4, 3, 2, 1].map((stars, i) => (
                                                <label key={i}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedRatings.includes(stars)}
                                                        onChange={() => toggleRating(stars)}
                                                    />
                                                    {[...Array(5)].map((_, idx) => (
                                                        <img
                                                            key={idx}
                                                            src={idx < stars ? dolu : bos}
                                                            alt="star"
                                                            className="rating-star"
                                                        />
                                                    ))}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* İxtisas sahəsi */}
                                    <div className="filter-section">
                                        <div className="filter-header">
                                            <span><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M3.44141 6.87875H10.3202" stroke="black" stroke-width="1.28978" stroke-linecap="round" stroke-linejoin="round"/>
</svg> İxtisas sahəsi</span>
                                            <button onClick={resetAreas}>Sıfırlayın</button>
                                        </div>
                                        <div className="filter-options">
                                            {["Ürək-damar", "Xəstəxana", "Travmatologiya", "Urolojiya", "Cərrahiyyə"].map((area, i) => (
                                                <label key={i}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedAreas.includes(area)}
                                                        onChange={() => toggleArea(area)}
                                                    />
                                                    {area}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className={'col-9'}>
                                <div className={'row'}>
                                    {array.map((item, index) => (
                                        <DoktorCard2 desc={"Baki"} name={"Anar"} img={img1}/>
                                    ))}
                                </div>
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
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

export default DoctorsPage;