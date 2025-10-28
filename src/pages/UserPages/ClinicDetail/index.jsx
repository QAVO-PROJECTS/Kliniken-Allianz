import './index.scss';
import {Link, useParams} from 'react-router-dom';
import CardCertificate from '../../../components/UserComponents/ClinicDetail/CertCard/index.jsx';

import {useRef, useState, useEffect} from 'react';
import Pagination from '../../../components/Pagination/index.jsx';
import DoktorCard from '../../../components/UserComponents/ClinicDetail/DoktorCard/index.jsx';
import {HiOutlineArrowLeft, HiOutlineArrowRight} from 'react-icons/hi';
import gallery1 from '/src/assets/1212.jpg';
import gallery2 from '/src/assets/2121.jpg';
import gallery3 from '/src/assets/3313.jpg';
import gallery4 from '/src/assets/454.jpg';
import dimage from "/src/assets/doktor.jpg";
import dimage2 from "/src/assets/doktor2.jpg";
import dimage3 from "/src/assets/dmarcDoktor.png";
import dimage4 from "/src/assets/dSamer.png";
import dimage5 from "/src/assets/doktor5.jpg";
import dimage6 from "/src/assets/doktor6.jpg";
import {useGetClinicByIdQuery} from "../../../services/userApi.jsx";
import {CLINIC_CARD_IMAGES, CLINIC_IMAGES} from "../../../contants.js";
import {useTranslation} from "react-i18next";
import HomeServiceCard from "../../../components/UserComponents/Home/ServiceCardHome/index.jsx";
import banner from "../../../assets/AboutBanner.png";
import ClinicHotel from "../ClinicHotel/index.jsx";
import {t} from "i18next";
import mobileBanner from "../../../assets/MobileBanner.png";
import {useMediaQuery} from "react-responsive";
const galleryImages = [gallery1, gallery2, gallery3, gallery4];
import img2 from '/src/assets/ClinicDetialFirst.png'
import sertifikat from '/src/assets/Sertifikat11.jpg'
import cardIcon from "/src/assets/icon1.png"
function ClinicDetail() {
    const {id} = useParams()

const {data:getClinicById} = useGetClinicByIdQuery(id)
    const clinic = getClinicById?.data
    const [showAllServices, setShowAllServices] = useState(false);
    const { t, i18n } = useTranslation();
    const getLocalizedText = (item, field) => {
        switch (i18n.language) {
            case 'en':
                return field === 'name' ? item?.nameEng : item?.descriptionEng;
            case 'ru':
                return field === 'name' ? item?.nameRu : item?.descriptionRu;
            default: // 'tr' veya varsayılan
                return field === 'name' ? item?.name : item?.description;
        }
    };const certificates = clinic?.clinicSertificates || [];
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(window.innerWidth <= 576 ? 2 : 6);

    useEffect(() => {
        const handleResize = () => {
            setItemsPerPage(window.innerWidth <= 576 ? 2 : 6);
            setCurrentPage(1); // ekran ölçüsü dəyişəndə birinci səhifəyə qaytar
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const totalPages = Math.ceil(certificates.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedCertificates = certificates.slice(startIndex, endIndex);
    // update itemsPerPage on resize
    useEffect(() => {
        const handleResize = () => {
            setItemsPerPage(window.innerWidth <= 576 ? 2 : 6);
            setCurrentPage(1); // reset to first page if layout changes
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const [name, setFirstName] = useState('');
    const [surname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhone] = useState('');
    const [description, setNote] = useState('');
    const [errors] = useState({});

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


    const services = [
        {},
        {},
        {},
        {},
    ]
    const serviceCards = services.map((item, i) => (
        <HomeServiceCard
            id={item.id}
            name={"Xərçəng müalicəsi"}
            desc={"Həyat keyfiyyətinizi yüksəltmək üçün ən yeni xərçəng müalicə üsulları."}
            icon={cardIcon}
        />
    ));
    const displayedServiceCards = showAllServices
        ? serviceCards
        : serviceCards?.slice(0, 4);

    const sliderRef = useRef(null);
    const gallerySliderRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [galleryIndex, setGalleryIndex] = useState(0);

    const cards = [{
        name: "Dr. Harry Donal",
        description: "Frankfurt, Almaniya",
        imageUrl: dimage,
    },
        {
            name: "Dr. Maria Smith",
            description: "ABŞ",
            imageUrl: dimage2,
        },
        {
            name: "Dr. Marc Gillinov",
            description: "Türkiye",
            imageUrl: dimage3,
        },
        {
            name: "Dr. Samer Jaber",
            description: "Tailand",
            imageUrl: dimage4,
        },
        {
            name: "Dr. Panya Sriratanajai",
            description: "Madrid, İspaniya",
            imageUrl:dimage5,
        }, {
            name: "Dr. Maria Keller",
            description: "Sinqapur",
            imageUrl: dimage6,
        }];
    const getVisibleCards = () => window.innerWidth <= 576 ? 2 : 4;
    const maxIndex = cards.length - getVisibleCards();
    const maxGalleryIndex = galleryImages.length - 1;


    // gallery handlers
    const handleGalleryPrev = () => {
        if (galleryIndex > 0) {
            const next = galleryIndex - 1;
            setGalleryIndex(next);
            gallerySliderRef.current.style.transform = `translateX(-${next * 100}%)`;
        }
    };
    const handleGalleryNext = () => {
        if (galleryIndex < maxGalleryIndex) {
            const next = galleryIndex + 1;
            setGalleryIndex(next);
            gallerySliderRef.current.style.transform = `translateX(-${next * 100}%)`;
        }
    };
    const handleGalleryBulletClick = (index) => {
        setGalleryIndex(index);
        gallerySliderRef.current.style.transform = `translateX(-${index * 100}%)`;
    };
    const isMobile = useMediaQuery({maxWidth:768})
    const sertifikats = [
        {},
        {},
        {},
        {},
        {},
        {},
    ]
const doctors = [
    {},
    {},
    {},
    {},
]
    return (
        <div id="clinic-detail">
            <div className="container">
                {/* Breadcrumb */}
                <div className="head" data-aos="fade-up" data-aos-delay="100">
                    <h1>Klinika</h1>
                    <p>
                        <Link to="/">Ana səhifə</Link>
                        <div className="dot"/>
                        <Link to={`/clinics/${clinic?.id}`}>GlobalMed Klinikası</Link>
                    </p>
                </div>

                {/* First Section */}
                <div className="row first-section">
                    <div className="col-35 col-md-60 col-sm-60 col-xs-60">
                        <div className="content">
                            <h3>GlobalMed Klinikası</h3>
                            <p>
                                GlobalMed Klinikası Almaniyada yerləşən, geniş tibbi xidmət sahələr və ən son texnologiyalarla təchiz olunmuş aparıcı sağlamlıq mərkəzlərindən biridir. Klinikada kardiologiya, onkologiya, ortopediya, estetik və digər sahələr üzrə müalicə və diaqnostika xidmətləri təqdim olunur.
                            </p>
                            <div className={"icons"}>
                                <div className={"icon1"}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="149" height="72" viewBox="0 0 149 72"
                                         fill="none">
                                        <g clip-path="url(#clip0_501_1250)">
                                            <path
                                                d="M15.6825 6.71799C14.4436 20.7142 26.3933 31.8644 37.9369 37.7483C45.0116 41.3536 52.7625 43.5739 60.6773 44.287C64.5889 44.6414 68.689 44.7302 72.5783 44.1118C76.1677 43.5419 79.7877 42.1399 82.034 39.1843C86.5092 33.2959 82.0252 25.1109 76.472 21.6733C73.7069 19.9633 70.2334 19.1412 67.013 19.787C63.7926 20.4327 61.2316 22.6355 60.0388 25.7169C57.6373 31.929 60.2493 38.9969 63.9392 44.1595C68.1407 50.0465 74.1802 54.3084 80.8003 57.1673C88.5757 60.5245 97.0697 62.0597 105.43 63.1443C114.236 64.2863 123.104 64.7462 131.974 65.1214C134.17 65.213 136.362 65.2969 138.559 65.3821C139.182 65.4074 139.929 65.6915 140.3 66.2127C140.597 66.6351 140.473 67.0894 139.888 67.0713C130.291 66.7627 120.683 66.4125 111.128 65.4244C102.002 64.4774 92.7312 63.065 84.064 59.9527C76.4 57.199 69.2063 52.9954 63.8194 46.8401C59.2153 41.5844 55.584 34.3842 56.794 27.2678C57.3432 24.0591 58.9325 21.0129 61.8613 19.3503C65.2209 17.4348 69.422 17.5491 73.0408 18.6536C79.8897 20.7505 86.4134 27.2565 86.4955 34.707C86.5354 38.5433 84.0671 41.8369 80.8036 43.6984C77.3177 45.6884 73.1777 46.1289 69.2243 46.2443C60.6146 46.4874 51.9196 44.9669 43.8817 41.8812C36.3559 38.9897 29.122 34.8243 23.3825 29.1396C18.4292 24.2307 14.3624 18.0483 13.3865 11.0649C13.1493 9.3711 13.1195 7.66381 13.2731 5.96478C13.3613 4.96685 15.7642 5.89556 15.6917 6.73936L15.6825 6.71799Z"
                                                fill="black"/>
                                            <path
                                                d="M15.0924 2.4315L11.6565 8.80292L10.0039 11.87L9.11229 13.5222C8.92857 13.8673 8.48229 14.3791 8.55272 14.7785C8.62524 15.2372 7.91093 15.2406 7.65441 15.199C7.09551 15.1137 6.57175 14.806 6.20057 14.3894C5.82939 13.9729 5.86109 13.5927 6.10045 13.1271C6.4106 12.5308 6.73871 11.9444 7.05405 11.3557L8.83718 8.0513L12.5263 1.21037C13.0007 0.337294 15.5493 1.58132 15.0924 2.4315Z"
                                                fill="black"/>
                                            <path
                                                d="M16.449 3.19653C18.4771 6.68598 20.6792 10.0576 22.8196 13.4765C23.0995 13.9217 22.9916 14.3203 22.3998 14.3402C21.8079 14.36 21.0033 13.9996 20.6528 13.5083C18.2128 10.0659 16.0362 6.41772 13.9169 2.78026C13.5818 2.20686 14.4267 2.0709 14.7981 2.13406C15.4592 2.23848 16.1075 2.62194 16.4414 3.20166L16.449 3.19653Z"
                                                fill="black"/>
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_501_1250">
                                                <rect width="142" height="46" fill="white"
                                                      transform="matrix(0.982843 0.184444 0.184444 -0.982843 0 45.2109)"/>
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-25 col-md-60 col-sm-60 col-xs-60">
                        <div className="image">
                            {/*<img src={CLINIC_CARD_IMAGES+clinic?.clinicCardImage} alt="GlobalMed Klinikası"/>*/}
                            <img src={img2} alt="GlobalMed Klinikası"/>
                        </div>
                    </div>
                </div>

                {/* Second Section: Certificates */}
                <div className="second-section">
                    <h2>Sertifikatlar</h2>
                    <div className="row">
                        {/*{clinic?.clinicSertificates?.map((card, idx) => (*/}
                        {/*    <CardCertificate*/}
                        {/*        index={idx}*/}
                        {/*        image={card}*/}
                        {/*        number={idx+1}*/}
                        {/*        text="Sertifikat"*/}
                        {/*        data-aos="zoom-in"*/}
                        {/*        data-aos-delay={idx * 100}*/}
                        {/*    />*/}
                        {/*))}*/}
                        {sertifikats.map((card, idx) => (
                            <CardCertificate
                                index={idx}
                                image={sertifikat}
                                number={idx+1}
                                text="Sertifikat"
                                data-aos="zoom-in"
                                data-aos-delay={idx * 100}
                            />
                        ))}
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginTop: 30,
                            marginBottom: 45
                        }}
                        data-aos="fade-up"
                    >
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>

                {/* Third Section: Services */}
                <div className="third-section">
                    <div className="header">
                        <h2>Xəstəxananın Təklif Etdiyi Tibbi Xidmətlər</h2>
                        <p>Sizin ehtiyaclarınıza uyğun tibbi xidmət sahələrini kəşf edin.</p>
                    </div>
                    <div className="row" style={{marginBottom: 50}}>
                        {displayedServiceCards}
                    </div>
                    <div style={{textAlign: 'center'}}>
                        <button className={"clinicDetailThird"} onClick={() => setShowAllServices(!showAllServices)}>
                            Hamısına bax <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                            <path d="M23.5291 8.03068L20.5291 11.0307C20.3884 11.1714 20.1975 11.2505 19.9985 11.2505C19.7995 11.2505 19.6086 11.1714 19.4679 11.0307C19.3271 10.8899 19.2481 10.6991 19.2481 10.5001C19.2481 10.301 19.3271 10.1102 19.4679 9.96943L21.1882 8.25005H19.9985C16.3732 8.25005 15.6307 10.0313 14.6904 12.2888C13.7219 14.6138 12.6232 17.2501 7.99849 17.2501H7.90474C7.72219 17.957 7.28807 18.5732 6.68373 18.983C6.0794 19.3928 5.34635 19.5681 4.62199 19.4761C3.89763 19.3841 3.23169 19.0311 2.749 18.4832C2.2663 17.9353 2 17.2302 2 16.5001C2 15.7699 2.2663 15.0648 2.749 14.5169C3.23169 13.969 3.89763 13.616 4.62199 13.524C5.34635 13.432 6.0794 13.6073 6.68373 14.0171C7.28807 14.4269 7.72219 15.0431 7.90474 15.7501H7.99849C11.6238 15.7501 12.3663 13.9688 13.3066 11.7113C14.2797 9.3863 15.3738 6.75005 19.9985 6.75005H21.1882L19.4679 5.03068C19.3271 4.88995 19.2481 4.69907 19.2481 4.50005C19.2481 4.30103 19.3271 4.11016 19.4679 3.96943C19.6086 3.8287 19.7995 3.74963 19.9985 3.74963C20.1975 3.74963 20.3884 3.8287 20.5291 3.96943L23.5291 6.96943C23.5988 7.03908 23.6542 7.1218 23.6919 7.21285C23.7297 7.30389 23.7491 7.40149 23.7491 7.50005C23.7491 7.59861 23.7297 7.69621 23.6919 7.78726C23.6542 7.8783 23.5988 7.96102 23.5291 8.03068Z" fill="#424242"/>
                        </svg>
                        </button>
                    </div>
                </div>

                {/* Fourth Section: Doctors */}
                <div className="fourth-section">
                    <div className="header">
                        <div>
                            <h2>GlobalMed-in Peşəkar Komandası</h2>
                            <p>
                                Müxtəlif sahələr üzrə ixtisaslaşmış mütəxəssislərimiz yüksək tibbi bilik və praktiki
                                təcrübəyə malikdir.
                            </p>
                        </div>

                    </div>
                    <div className="slider-wrapper" style={{
                        marginBottom: '50px',
                    }}>
                        <div className="slider-card row" ref={sliderRef}>
                            {cards.map((item) => (
                                <DoktorCard id={item?.id} name={item.name} desc={item.role} img={item.imageUrl} />
                            ))}
                        </div>
                    </div>
                    <div style={{textAlign: 'center'}}>
                        <button className={"clinicDetailThird"} onClick={() => setShowAllServices(!showAllServices)}>
                            Hamısına bax <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                            <path d="M23.5291 8.03068L20.5291 11.0307C20.3884 11.1714 20.1975 11.2505 19.9985 11.2505C19.7995 11.2505 19.6086 11.1714 19.4679 11.0307C19.3271 10.8899 19.2481 10.6991 19.2481 10.5001C19.2481 10.301 19.3271 10.1102 19.4679 9.96943L21.1882 8.25005H19.9985C16.3732 8.25005 15.6307 10.0313 14.6904 12.2888C13.7219 14.6138 12.6232 17.2501 7.99849 17.2501H7.90474C7.72219 17.957 7.28807 18.5732 6.68373 18.983C6.0794 19.3928 5.34635 19.5681 4.62199 19.4761C3.89763 19.3841 3.23169 19.0311 2.749 18.4832C2.2663 17.9353 2 17.2302 2 16.5001C2 15.7699 2.2663 15.0648 2.749 14.5169C3.23169 13.969 3.89763 13.616 4.62199 13.524C5.34635 13.432 6.0794 13.6073 6.68373 14.0171C7.28807 14.4269 7.72219 15.0431 7.90474 15.7501H7.99849C11.6238 15.7501 12.3663 13.9688 13.3066 11.7113C14.2797 9.3863 15.3738 6.75005 19.9985 6.75005H21.1882L19.4679 5.03068C19.3271 4.88995 19.2481 4.69907 19.2481 4.50005C19.2481 4.30103 19.3271 4.11016 19.4679 3.96943C19.6086 3.8287 19.7995 3.74963 19.9985 3.74963C20.1975 3.74963 20.3884 3.8287 20.5291 3.96943L23.5291 6.96943C23.5988 7.03908 23.6542 7.1218 23.6919 7.21285C23.7297 7.30389 23.7491 7.40149 23.7491 7.50005C23.7491 7.59861 23.7297 7.69621 23.6919 7.78726C23.6542 7.8783 23.5988 7.96102 23.5291 8.03068Z" fill="#424242"/>
                        </svg>
                        </button>
                    </div>
                </div>

                {/* Fifth Section: Gallery */}
                <div className="fifth-section">
                    <h2>Image gallery</h2>
                    <div className="gallery">
                        <div className="gallery-slider-wrapper">
                            <div className="gallery-slider" ref={gallerySliderRef}>
                                {galleryImages.map((img, idx) => (
                                    <div className="gallery-slide" key={idx}>
                                        <img src={img} alt={`Gallery ${idx + 1}`}/>
                                    </div>
                                ))}
                            </div>
                            <button
                                className="gallery-prev"
                                onClick={handleGalleryPrev}
                                aria-label="Previous image"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M14 7L9 12L14 17" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                            <button
                                className="gallery-next"
                                onClick={handleGalleryNext}
                                aria-label="Next image"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M10 7L15 12L10 17" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                        <div className="gallery-pagination">
                            {galleryImages.map((_, idx) => (
                                <span
                                    key={idx}
                                    className={`gallery-bullet ${galleryIndex === idx ? 'active' : ''}`}
                                    onClick={() => handleGalleryBulletClick(idx)}
                                    role="button"
                                    aria-label={`Go to image ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <ClinicHotel/>
                {/* Contact Section */}
                <div className="contact">
                    <div className="row form-section">
                        <div className="col-30 col-md-60 col-sm-60 col-xs-60">
                            <div className="form" data-aos="fade-right">
                                <div className="form-head">
                                    <hr/>
                                    <h2>Formu dolduraraq bizimlə əlaqə saxlayın</h2>
                                </div>
                                <div className="form-body">
                                    <form onSubmit={() => { /* handle submission */
                                    }}>
                                        <div className="row">
                                            <div className="col-30 col-md-60 col-sm-60 col-xs-60">
                                                <label>Ad</label>
                                                <input
                                                    placeholder="Adınızı daxil edin"
                                                    value={name}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                    maxLength={50}
                                                    required
                                                />
                                                {errors.name && <span className="error-message">{errors.name}</span>}
                                            </div>
                                            <div className="col-30 col-md-60 col-sm-60 col-xs-60">
                                                <label>Soyad</label>
                                                <input
                                                    placeholder="Soyadınızı daxil edin"
                                                    value={surname}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                    maxLength={50}
                                                    required
                                                />
                                                {errors.surname && (
                                                    <span className="error-message">{errors.surname}</span>
                                                )}
                                            </div>
                                            <div className="col-60">
                                                <label>Email</label>
                                                <input
                                                    type="email"
                                                    placeholder="example@gmail.com"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    maxLength={100}
                                                    required
                                                />
                                                {errors.email && <span className="error-message">{errors.email}</span>}
                                            </div>
                                            <div className="col-60">
                                                <label>Nömrə</label>
                                                <input
                                                    type="tel"
                                                    placeholder="+994 99 999 99 99"
                                                    value={phoneNumber}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    maxLength={20}
                                                    required
                                                />
                                                {errors.phoneNumber && (
                                                    <span className="error-message">{errors.phoneNumber}</span>
                                                )}
                                            </div>
                                            <div className="col-60">
                                                <label>Qeyd</label>
                                                <textarea
                                                    rows={5}
                                                    value={description}
                                                    onChange={(e) => setNote(e.target.value)}
                                                    maxLength={700}
                                                    required
                                                />
                                                {errors.description && (
                                                    <span className="error-message">{errors.description}</span>
                                                )}
                                            </div>
                                            <div className="col-60">
                                                <button type="submit">Göndər</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col-30 col-md-60 col-sm-60 col-xs-60">
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
                <img
                    src={isMobile ? mobileBanner : banner}
                    alt={t("aboutUs.bannerAlt")}
                />
            </div>
        </div>
    );
}

export default ClinicDetail;