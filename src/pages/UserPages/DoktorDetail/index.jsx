import './index.scss'
import {Link, useParams} from "react-router-dom";
import doktor from "/src/assets/doktor 1.jpg"
import Pagination from "../../../components/UserComponents/Pagination/index.jsx";
import {useEffect, useState} from "react";
import sert1 from '/src/assets/Sertifikat/1.png';
import sert2 from '/src/assets/Sertifikat/2.png';
import sert3 from '/src/assets/Sertifikat/3.png';
import sert4 from '/src/assets/Sertifikat/4.png';
import sert5 from '/src/assets/Sertifikat/5.png';
import sert6 from '/src/assets/Sertifikat/6.png';
import CardCertificateCategory from "../../../components/UserComponents/CategoryDetail/CertCard/index.jsx";
import {useGetClinicByIdQuery, useGetDoctorsByIdQuery} from "../../../services/userApi.jsx";
import {DOCTOR_IMG_URL} from "../../../contants.js";
import {useTranslation} from "react-i18next";
import banners from "../../../assets/AboutBanner.png";
import red from "/src/assets/redTeklif.svg"
import blue from "/src/assets/blueTeklif.svg"
import mobileBanner from "../../../assets/MobileBanner.png";
import mobileBanners from "../../../assets/MobileBanner.png";
import banner from "../../../assets/AboutBanner.png";
import {t} from "i18next";
import {useMediaQuery} from "react-responsive";
function DoktorDetail() {
    const {id} = useParams();
    const {data:getDoctorsById} = useGetDoctorsByIdQuery(id)
    const { t, i18n } = useTranslation();
    const doctor= getDoctorsById?.data
    const {data:getClinicById} = useGetClinicByIdQuery(doctor?.clinicId)
    const clinic = getClinicById?.data
    const [currentPage, setCurrentPage] = useState(1);
    const cardsData = [
        {id: 1, image: sert1, number: '01'},
        {id: 2, image: sert2, number: '02'},
        {id: 3, image: sert3, number: '03'},
        {id: 4, image: sert4, number: '04'},
        {id: 5, image: sert5, number: '05'},
        {id: 6, image: sert6, number: '06'},
        {id: 7, image: sert6, number: '07'},
        {id: 8, image: sert6, number: '08'},
    ];
    const [itemsPerPage, setItemsPerPage] = useState(
        window.innerWidth <= 576 ? 2 : 4
    );
    const isMobile = useMediaQuery({maxWidth:768})
    // update itemsPerPage on resize
    useEffect(() => {
        const handleResize = () => {
            setItemsPerPage(window.innerWidth <= 576 ? 2 : 4);
            setCurrentPage(1); // reset to first page if layout changes
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const totalPages = Math.ceil(cardsData.length / itemsPerPage);
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const getLocalizedText = (item, field) => {
        switch (i18n.language) {
            case 'en':
                return field === 'name' ? item?.nameEng : field === 'role' ? item?.roleEng : item?.descriptionEng;
            case 'ru':
                return field === 'name' ? item?.nameRu : field === 'role' ? item?.roleRu : item?.descriptionRu;
            default: // 'tr' veya varsayılan
                return field === 'name' ? item?.name : field === 'role' ? item?.role : item?.description;
        }
    };
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedCards = cardsData.slice(startIndex, endIndex);
    return (
        <div id={"doktorDetail"}>
            <div className={"container"}>
                <div className="head">
                    <h1>Doctor</h1>
                    <p data-aos="fade-up" data-aos-delay="100">
                        <Link to="/">{t("contact.breadcrumb.home")}</Link>
                        <div className="dot dot1"></div>
                        <Link to="/">Həkimlər</Link>
                        <div className="dot dot2"></div>
                        <Link to="/clinics">Kathy Jackson</Link>
                    </p>
                </div>
                <div className={"doktorContainer"}>
                    <div className={"doktor"}>
                        <div className={"image"}>
                            <img src={DOCTOR_IMG_URL+doctor?.doctorImage } />
                        </div>
                        <div className={"content"}>
                            <h2>{getLocalizedText(doctor, 'name')}</h2>
                            <p>{getLocalizedText(doctor, 'role')}</p>
                            <div className={"stars"}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19"
                                     fill="none">
                                    <path
                                        d="M8.99975 13.4525L12.1122 15.335C12.6822 15.68 13.3797 15.17 13.2297 14.525L12.4047 10.985L15.1572 8.60001C15.6597 8.16501 15.3897 7.34001 14.7297 7.28751L11.1072 6.98001L9.68975 3.63501C9.43475 3.02751 8.56475 3.02751 8.30975 3.63501L6.89225 6.97251L3.26975 7.28001C2.60975 7.33251 2.33975 8.15751 2.84225 8.59251L5.59475 10.9775L4.76975 14.5175C4.61975 15.1625 5.31725 15.6725 5.88725 15.3275L8.99975 13.4525Z"
                                        fill="#2F2F2F"/>
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19"
                                     fill="none">
                                    <path
                                        d="M8.99975 13.4525L12.1122 15.335C12.6822 15.68 13.3797 15.17 13.2297 14.525L12.4047 10.985L15.1572 8.60001C15.6597 8.16501 15.3897 7.34001 14.7297 7.28751L11.1072 6.98001L9.68975 3.63501C9.43475 3.02751 8.56475 3.02751 8.30975 3.63501L6.89225 6.97251L3.26975 7.28001C2.60975 7.33251 2.33975 8.15751 2.84225 8.59251L5.59475 10.9775L4.76975 14.5175C4.61975 15.1625 5.31725 15.6725 5.88725 15.3275L8.99975 13.4525Z"
                                        fill="#2F2F2F"/>
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19"
                                     fill="none">
                                    <path
                                        d="M8.99975 13.4525L12.1122 15.335C12.6822 15.68 13.3797 15.17 13.2297 14.525L12.4047 10.985L15.1572 8.60001C15.6597 8.16501 15.3897 7.34001 14.7297 7.28751L11.1072 6.98001L9.68975 3.63501C9.43475 3.02751 8.56475 3.02751 8.30975 3.63501L6.89225 6.97251L3.26975 7.28001C2.60975 7.33251 2.33975 8.15751 2.84225 8.59251L5.59475 10.9775L4.76975 14.5175C4.61975 15.1625 5.31725 15.6725 5.88725 15.3275L8.99975 13.4525Z"
                                        fill="#2F2F2F"/>
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19"
                                     fill="none">
                                    <path
                                        d="M8.99975 13.4525L12.1122 15.335C12.6822 15.68 13.3797 15.17 13.2297 14.525L12.4047 10.985L15.1572 8.60001C15.6597 8.16501 15.3897 7.34001 14.7297 7.28751L11.1072 6.98001L9.68975 3.63501C9.43475 3.02751 8.56475 3.02751 8.30975 3.63501L6.89225 6.97251L3.26975 7.28001C2.60975 7.33251 2.33975 8.15751 2.84225 8.59251L5.59475 10.9775L4.76975 14.5175C4.61975 15.1625 5.31725 15.6725 5.88725 15.3275L8.99975 13.4525Z"
                                        fill="#2F2F2F"/>
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19"
                                     fill="none">
                                    <path
                                        d="M8.99975 13.4525L12.1122 15.335C12.6822 15.68 13.3797 15.17 13.2297 14.525L12.4047 10.985L15.1572 8.60001C15.6597 8.16501 15.3897 7.34001 14.7297 7.28751L11.1072 6.98001L9.68975 3.63501C9.43475 3.02751 8.56475 3.02751 8.30975 3.63501L6.89225 6.97251L3.26975 7.28001C2.60975 7.33251 2.33975 8.15751 2.84225 8.59251L5.59475 10.9775L4.76975 14.5175C4.61975 15.1625 5.31725 15.6725 5.88725 15.3275L8.99975 13.4525Z"
                                        fill="#2F2F2F"/>
                                </svg>
                            </div>
                            <div className={"about"}>
                                <div><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 25" fill="none">
                                    <path d="M6.25 4C6.05109 4 5.86032 4.07902 5.71967 4.21967C5.57902 4.36032 5.5 4.55109 5.5 4.75V21H7.5V18.25C7.5 17.56 8.06 17 8.75 17H15.25C15.94 17 16.5 17.56 16.5 18.25V21H18.5V12.25C18.5 12.0511 18.421 11.8603 18.2803 11.7197C18.1397 11.579 17.9489 11.5 17.75 11.5H15.75C15.5511 11.5 15.3603 11.421 15.2197 11.2803C15.079 11.1397 15 10.9489 15 10.75V4.75C15 4.55109 14.921 4.36032 14.7803 4.21967C14.6397 4.07902 14.4489 4 14.25 4H6.25ZM9 18.5V21H11.25V18.5H9ZM12.75 18.5V21H15V18.5H12.75ZM19.25 22.5H4.75C4.55109 22.5 4.36032 22.421 4.21967 22.2803C4.07902 22.1397 4 21.9489 4 21.75V4.75C4 4.15326 4.23705 3.58097 4.65901 3.15901C5.08097 2.73705 5.65326 2.5 6.25 2.5H14.25C14.8467 2.5 15.419 2.73705 15.841 3.15901C16.2629 3.58097 16.5 4.15326 16.5 4.75V10H17.75C18.0455 10 18.3381 10.0582 18.611 10.1713C18.884 10.2843 19.1321 10.4501 19.341 10.659C19.5499 10.8679 19.7157 11.116 19.8287 11.389C19.9418 11.6619 20 11.9545 20 12.25V21.75C20 21.9489 19.921 22.1397 19.7803 22.2803C19.6397 22.421 19.4489 22.5 19.25 22.5ZM7.5 7C7.5 6.73478 7.60536 6.48043 7.79289 6.29289C7.98043 6.10536 8.23478 6 8.5 6C8.76522 6 9.01957 6.10536 9.20711 6.29289C9.39464 6.48043 9.5 6.73478 9.5 7C9.5 7.26522 9.39464 7.51957 9.20711 7.70711C9.01957 7.89464 8.76522 8 8.5 8C8.23478 8 7.98043 7.89464 7.79289 7.70711C7.60536 7.51957 7.5 7.26522 7.5 7ZM8.5 13C8.23478 13 7.98043 13.1054 7.79289 13.2929C7.60536 13.4804 7.5 13.7348 7.5 14C7.5 14.2652 7.60536 14.5196 7.79289 14.7071C7.98043 14.8946 8.23478 15 8.5 15C8.76522 15 9.01957 14.8946 9.20711 14.7071C9.39464 14.5196 9.5 14.2652 9.5 14C9.5 13.7348 9.39464 13.4804 9.20711 13.2929C9.01957 13.1054 8.76522 13 8.5 13ZM8.5 9.5C8.23478 9.5 7.98043 9.60536 7.79289 9.79289C7.60536 9.98043 7.5 10.2348 7.5 10.5C7.5 10.7652 7.60536 11.0196 7.79289 11.2071C7.98043 11.3946 8.23478 11.5 8.5 11.5C8.76522 11.5 9.01957 11.3946 9.20711 11.2071C9.39464 11.0196 9.5 10.7652 9.5 10.5C9.5 10.2348 9.39464 9.98043 9.20711 9.79289C9.01957 9.60536 8.76522 9.5 8.5 9.5ZM12 6C11.7348 6 11.4804 6.10536 11.2929 6.29289C11.1054 6.48043 11 6.73478 11 7C11 7.26522 11.1054 7.51957 11.2929 7.70711C11.4804 7.89464 11.7348 8 12 8C12.2652 8 12.5196 7.89464 12.7071 7.70711C12.8946 7.51957 13 7.26522 13 7C13 6.73478 12.8946 6.48043 12.7071 6.29289C12.5196 6.10536 12.2652 6 12 6ZM12 13C11.7348 13 11.4804 13.1054 11.2929 13.2929C11.1054 13.4804 11 13.7348 11 14C11 14.2652 11.1054 14.5196 11.2929 14.7071C11.4804 14.8946 11.7348 15 12 15C12.2652 15 12.5196 14.8946 12.7071 14.7071C12.8946 14.5196 13 14.2652 13 14C13 13.7348 12.8946 13.4804 12.7071 13.2929C12.5196 13.1054 12.2652 13 12 13ZM15.5 13C15.2348 13 14.9804 13.1054 14.7929 13.2929C14.6054 13.4804 14.5 13.7348 14.5 14C14.5 14.2652 14.6054 14.5196 14.7929 14.7071C14.9804 14.8946 15.2348 15 15.5 15C15.7652 15 16.0196 14.8946 16.2071 14.7071C16.3946 14.5196 16.5 14.2652 16.5 14C16.5 13.7348 16.3946 13.4804 16.2071 13.2929C16.0196 13.1054 15.7652 13 15.5 13ZM12 9.5C11.7348 9.5 11.4804 9.60536 11.2929 9.79289C11.1054 9.98043 11 10.2348 11 10.5C11 10.7652 11.1054 11.0196 11.2929 11.2071C11.4804 11.3946 11.7348 11.5 12 11.5C12.2652 11.5 12.5196 11.3946 12.7071 11.2071C12.8946 11.0196 13 10.7652 13 10.5C13 10.2348 12.8946 9.98043 12.7071 9.79289C12.5196 9.60536 12.2652 9.5 12 9.5Z" fill="#313131"/>
                                </svg> <span>{getLocalizedText(clinic, 'name') || clinic?.name}</span></div>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 25" fill="none">
                                        <path d="M20.25 9.49999C20.2508 8.10967 19.9003 6.7417 19.2309 5.52313C18.5616 4.30456 17.5951 3.27492 16.4213 2.52983C15.2475 1.78475 13.9044 1.34839 12.5168 1.26129C11.1293 1.1742 9.74217 1.43918 8.48441 2.03164C7.22665 2.6241 6.13901 3.52481 5.32253 4.65011C4.50604 5.77542 3.98718 7.08882 3.81415 8.46832C3.64111 9.84782 3.81951 11.2487 4.33278 12.5408C4.84605 13.8329 5.67753 14.9743 6.75 15.859V23C6.74991 23.1279 6.78253 23.2537 6.84477 23.3654C6.907 23.4772 6.99678 23.5712 7.10558 23.6384C7.21437 23.7057 7.33856 23.744 7.46634 23.7498C7.59412 23.7555 7.72124 23.7285 7.83563 23.6712L12 21.5937L16.1653 23.6759C16.2698 23.7258 16.3843 23.7511 16.5 23.75C16.6989 23.75 16.8897 23.671 17.0303 23.5303C17.171 23.3897 17.25 23.1989 17.25 23V15.859C18.1884 15.0862 18.944 14.1152 19.4627 13.0157C19.9814 11.9163 20.2503 10.7156 20.25 9.49999ZM5.25 9.49999C5.25 8.16496 5.64588 6.85992 6.38758 5.74989C7.12928 4.63985 8.18349 3.77469 9.41689 3.2638C10.6503 2.75291 12.0075 2.61923 13.3169 2.87969C14.6262 3.14014 15.829 3.78301 16.773 4.72702C17.717 5.67102 18.3599 6.87375 18.6203 8.18313C18.8808 9.4925 18.7471 10.8497 18.2362 12.0831C17.7253 13.3165 16.8601 14.3707 15.7501 15.1124C14.6401 15.8541 13.335 16.25 12 16.25C10.2104 16.248 8.49466 15.5362 7.22922 14.2708C5.96378 13.0053 5.25199 11.2896 5.25 9.49999ZM15.75 21.7869L12.3347 20.0797C12.2305 20.0275 12.1156 20.0004 11.9991 20.0004C11.8825 20.0004 11.7676 20.0275 11.6634 20.0797L8.25 21.7869V16.8472C9.41097 17.4406 10.6962 17.75 12 17.75C13.3038 17.75 14.589 17.4406 15.75 16.8472V21.7869ZM12 14.75C13.0384 14.75 14.0534 14.4421 14.9167 13.8652C15.7801 13.2883 16.453 12.4684 16.8504 11.5091C17.2477 10.5498 17.3517 9.49416 17.1491 8.47576C16.9466 7.45736 16.4465 6.5219 15.7123 5.78767C14.9781 5.05345 14.0426 4.55344 13.0242 4.35086C12.0058 4.14829 10.9502 4.25226 9.99091 4.64962C9.0316 5.04698 8.21166 5.71988 7.63479 6.58324C7.05791 7.4466 6.75 8.46163 6.75 9.49999C6.75149 10.8919 7.30509 12.2264 8.28934 13.2107C9.27358 14.1949 10.6081 14.7485 12 14.75ZM12 5.74999C12.7417 5.74999 13.4667 5.96992 14.0834 6.38197C14.7001 6.79403 15.1807 7.3797 15.4646 8.06492C15.7484 8.75015 15.8226 9.50415 15.6779 10.2316C15.5333 10.959 15.1761 11.6272 14.6517 12.1516C14.1272 12.6761 13.459 13.0332 12.7316 13.1779C12.0042 13.3226 11.2502 13.2484 10.5649 12.9645C9.87972 12.6807 9.29405 12.2001 8.88199 11.5834C8.46994 10.9667 8.25 10.2417 8.25 9.49999C8.25 8.50542 8.64509 7.5516 9.34835 6.84834C10.0516 6.14507 11.0054 5.74999 12 5.74999Z" fill="#313131"/>
                                    </svg>
                                    <span>8 illik təcrübə</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"doktorDetail"}>
                        <div className={"first-section"}>
                            <h2>Bio</h2>
                            <div className={'row'}>
                                <div className={'col-6 col-md-12 col-sm-12 col-xs-12'}>
                                    <div className={"bio"}>
                                        <div>
                                            <img src={blue}/>
                                        </div>
                                        <div>
                                            <h3>Təhsil və akademik keçmiş</h3>
                                            <p>Azərbaycan Tibb Universiteti məzunu, Almaniyada (Berlin Charité Klinikası) ortopediya üzrə ixtisaslaşma.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={'col-6 col-md-12 col-sm-12 col-xs-12'}><div className={"bio"}>
                                    <div>
                                       <img src={red}/>
                                    </div>
                                    <div>
                                        <h3>İş təcrübəsi və çalışdığı müəssisələr</h3>
                                        <p>5 ildən artıq beynəlxalq təcrübə. Almaniyanın aparıcı klinikalarında çalışmış, hal-hazırda həm Almaniyada, həm də Azərbaycanda fəaliyyət göstərir.</p>
                                    </div>
                                </div></div>
                                <div className={'col-6 col-md-12 col-sm-12 col-xs-12'}><div className={"bio"}>
                                    <div>
                                        <img src={blue}/>
                                    </div>
                                    <div>
                                        <h3>İxtisaslaşdığı sahələr və güclü tərəfləri</h3>
                                        <p>Travmatik zədələr, oynaq dəyişdirmə əməliyyatları, minimal invaziv cərrahiyyə üzrə ixtisaslaşmışdır.</p>
                                    </div>
                                </div></div>
                            </div>



                        </div>
                        <div>
                            <div className={'second-section'}>
                                <h2>Sertifikatlar</h2>
                                <div className={'row'}>
                                    {doctor?.doctorSertificates?.map((card, index) => (
                                        <CardCertificateCategory
                                            key={card.id}
                                            index={index}
                                            image={card}
                                            number={index+1}
                                            text='Sertifikat'
                                            data-aos='zoom-in'
                                            data-aos-delay={index * 100}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div
                                style={{display: 'flex', justifyContent: 'end', marginTop: '30px', marginBottom: '45px'}}
                                data-aos='fade-up'
                            >
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className={"bannerAbout"}>
                <img
                    src={isMobile ? mobileBanners : banners}
                    alt={t("aboutUs.bannerAlt")}
                />
            </div>
        </div>
    );
}

export default DoktorDetail;