import './index.scss';
import {Link} from 'react-router-dom';
import image from '/src/assets/ClinicDetialFirst.png';
import CardCertificate from '../../../components/UserComponents/ClinicDetail/CertCard/index.jsx';
import sert1 from '/src/assets/Sertifikat/1.png';
import sert2 from '/src/assets/Sertifikat/2.png';
import sert3 from '/src/assets/Sertifikat/3.png';
import sert4 from '/src/assets/Sertifikat/4.png';
import sert5 from '/src/assets/Sertifikat/5.png';
import sert6 from '/src/assets/Sertifikat/6.png';
import {useRef, useState, useEffect} from 'react';
import Pagination from '../../../components/Pagination/index.jsx';
import {GoArrowDown} from 'react-icons/go';
import DoktorCard from '../../../components/UserComponents/ClinicDetail/DoktorCard/index.jsx';
import {HiOutlineArrowLeft, HiOutlineArrowRight} from 'react-icons/hi';
import gallery1 from '/src/assets/1212.jpg';
import gallery2 from '/src/assets/2121.jpg';
import gallery3 from '/src/assets/3313.jpg';
import gallery4 from '/src/assets/454.jpg';
import HomeServiceCard from "../../../components/UserComponents/Home/ServiceCardHome/index.jsx";
import image2 from "../../../assets/ServisDetailCard2.png";
import image3 from "../../../assets/ServisDetailCard3.png";
import image4 from "../../../assets/ServisDetailCard4.png";
import image5 from "../../../assets/ServisDetailCard5.png";
import image6 from "../../../assets/ServisDetailCard6.png";
import icon1 from "../../../assets/Servis/cancer.png";
import icon4 from "../../../assets/Servis/oftomoloq.png";
import icon3 from "../../../assets/Servis/genekoloq.png";
import icon5 from "../../../assets/Servis/hepatoloq.png";
import icon6 from "../../../assets/Servis/travmatoloq.png";
import icon2 from "../../../assets/Servis/ortaped.png";
import dimage from "/src/assets/doktor.jpg";
import dimage2 from "/src/assets/doktor2.jpg";
import dimage3 from "/src/assets/dmarcDoktor.png";
import dimage4 from "/src/assets/dSamer.png";
import dimage5 from "/src/assets/doktor5.jpg";
import dimage6 from "/src/assets/doktor6.jpg";
const galleryImages = [gallery1, gallery2, gallery3, gallery4];

function ClinicDetail() {
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

    const [currentPage, setCurrentPage] = useState(1);
    const [showAllServices, setShowAllServices] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(
        window.innerWidth <= 576 ? 2 : 6
    );

    // update itemsPerPage on resize
    useEffect(() => {
        const handleResize = () => {
            setItemsPerPage(window.innerWidth <= 576 ? 2 : 6);
            setCurrentPage(1); // reset to first page if layout changes
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const totalPages = Math.ceil(cardsData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedCards = cardsData.slice(startIndex, endIndex);

    const [name, setFirstName] = useState('');
    const [surname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhone] = useState('');
    const [description, setNote] = useState('');
    const [errors, setErrors] = useState({});

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const array = [{
        name: "Xərçəng müalicəsi",
        description: "Abş",
        icon:icon1,
    },
        {
            name: "Oftamologiya",
            description: "Bangkok",
            icon:icon4,
        },

        {
            name: "Ginekologiya",
            description: "İstanbul",
            icon:icon3,
        },

        {
            name: "Hepatologiya",
            description: "Sinqapur",
            icon:icon5,
        }, {
            name: "Travmatologiya",
            description: "Bangkok",
            icon:icon6,
        },
        {
            name: "Onurğanın müalicəsi",
            description: "Berlin",
            icon:icon2,
        },];

    const serviceCards = array.map((item, i) => (
        <HomeServiceCard key={i + 1} name={item.name} desc={item.description} icon={item.icon} />
    ));
    const displayedServiceCards = showAllServices
        ? serviceCards
        : serviceCards.slice(0, 4);

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

    // doctor slider handlers
    const handlePrev = () => {
        if (currentIndex > 0) {
            const next = currentIndex - 1;
            setCurrentIndex(next);
            const percentage = window.innerWidth <= 576 ? next * 50 : next * 25;
            sliderRef.current.style.transform = `translateX(-${percentage}%)`;
        }
    };
    const handleNext = () => {
        if (currentIndex < maxIndex) {
            const next = currentIndex + 1;
            setCurrentIndex(next);
            const percentage = window.innerWidth <= 576 ? next * 50 : next * 25;
            sliderRef.current.style.transform = `translateX(-${percentage}%)`;
        }
    };
    const handleBulletClick = (index) => {
        if (index <= maxIndex) {
            setCurrentIndex(index);
            const percentage = window.innerWidth <= 576 ? index * 50 : index * 25;
            sliderRef.current.style.transform = `translateX(-${percentage}%)`;
        }
    };

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

    return (
        <div id="clinic-detail">
            <div className="container">
                {/* Breadcrumb */}
                <div className="head" data-aos="fade-up" data-aos-delay="100">
                    <p>
                        <Link to="/">Ana səhifə</Link>
                        <div className="dot"/>
                        <Link to="/clinics/1">Klinika</Link>
                    </p>
                </div>

                {/* First Section */}
                <div className="row first-section">
                    <div className="col-7 col-md-12 col-sm-12 col-xs-12">
                        <div className="content">
                            <h3>GlobalMed Klinikası</h3>
                            <p>
                                GlobalMed Klinikası Almaniyada yerləşən, geniş tibbi xidmət sahələr
                                və ən son texnologiyalarla təchiz olunmuş aparıcı sağlamlıq
                                mərkəzlərindən biridir. Klinikada kardiologiya, onkologiya,
                                ortopediya, estetik və digər sahələr üzrə müalicə və diaqnostika
                                xidmətləri təqdim olunur.
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
                                <div className={"icon3"}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="57" height="57" viewBox="0 0 57 57"
                                         fill="none">
                                        <path opacity="0.5"
                                              d="M23.75 40.375C23.75 52.25 43.9375 53.4375 43.9375 40.375V30.875"
                                              stroke="#CACACA"/>
                                        <path opacity="0.5" d="M43.9375 27.2886H43.9612V27.3123H43.9375V27.2886Z"
                                              stroke="#47D1D6" stroke-opacity="0.78" stroke-linejoin="round"/>
                                        <path
                                            d="M47.5 27.3125C47.5 29.28 45.905 30.875 43.9375 30.875C41.97 30.875 40.375 29.28 40.375 27.3125C40.375 25.345 41.97 23.75 43.9375 23.75C45.905 23.75 47.5 25.345 47.5 27.3125Z"
                                            stroke="#47D1D6" stroke-opacity="0.78"/>
                                        <path
                                            d="M17.8125 11.875V11.875C15.0448 11.875 13.661 11.875 12.7887 12.7193C12.7652 12.742 12.742 12.7652 12.7193 12.7887C11.875 13.661 11.875 15.0448 11.875 17.8125V28.5C11.875 34.0353 11.875 36.803 13.5635 38.5477C13.609 38.5947 13.6553 38.641 13.7023 38.6865C15.447 40.375 18.2147 40.375 23.75 40.375V40.375C29.2853 40.375 32.053 40.375 33.7977 38.6865C33.8447 38.641 33.891 38.5947 33.9365 38.5477C35.625 36.803 35.625 34.0353 35.625 28.5V16.625C35.625 14.992 35.625 14.1755 35.3156 13.5481C35.0235 12.9558 34.5442 12.4765 33.9519 12.1844C33.3245 11.875 32.508 11.875 30.875 11.875V11.875M17.8125 11.875C17.8125 13.1867 18.8758 14.25 20.1875 14.25C21.4992 14.25 22.5625 13.1867 22.5625 11.875C22.5625 10.5633 21.4992 9.5 20.1875 9.5C18.8758 9.5 17.8125 10.5633 17.8125 11.875ZM30.875 11.875C30.875 13.1867 29.8117 14.25 28.5 14.25C27.1883 14.25 26.125 13.1867 26.125 11.875C26.125 10.5633 27.1883 9.5 28.5 9.5C29.8117 9.5 30.875 10.5633 30.875 11.875Z"
                                            stroke="#37DEA1" stroke-opacity="0.51"/>
                                    </svg>
                                </div>
                                <div className={"icon2"}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"
                                         fill="none">
                                        <path
                                            d="M25 43.5325C14.5833 39.5835 6.25 30.4731 6.25 19.4559C6.25 13.3077 10.9187 8.3335 16.675 8.3335C20.0875 8.3335 23.1062 10.0844 25 12.7904C26.8937 10.0844 29.9312 8.3335 33.325 8.3335C39.0812 8.3335 43.75 13.3077 43.75 19.4559C43.75 28.7737 35.4167 39.5835 25 43.5325Z"
                                            stroke="#E9E9E9" stroke-opacity="0.78" stroke-width="2.375"
                                            stroke-linecap="round" stroke-linejoin="round"/>
                                        <path opacity="0.5"
                                              d="M42.7087 25H37.7463C37.5888 25 37.4378 24.9374 37.3264 24.8261L34.9578 22.4575C34.6713 22.1709 34.1882 22.2493 34.0069 22.6118L31.6187 27.3882C31.4375 27.7507 30.9544 27.8291 30.6678 27.5425L28.6209 25.4956C28.3615 25.2362 27.9312 25.2718 27.7179 25.5703L23.6825 31.2199C23.3852 31.6361 22.7359 31.5067 22.6208 31.0083L20.1394 20.2552C20.0171 19.7253 19.3059 19.625 19.0418 20.1004L15.0283 27.3246C14.8194 27.7007 14.2924 27.7366 14.0343 27.3925L11.8694 24.506C11.6526 24.217 11.2301 24.1869 10.9746 24.4424L9.54923 25.8678C9.43788 25.9791 9.28686 26.0417 9.12939 26.0417H7.29199"
                                              stroke="#37DEA1" stroke-opacity="0.51" stroke-width="2.375"
                                              stroke-linecap="round"/>
                                    </svg>
                                </div>
                                <div className={"icon4"}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="51" height="51" viewBox="0 0 51 51"
                                         fill="none">
                                        <path
                                            d="M45.6875 25.5C45.6875 37.2361 37.2361 45.6875 25.5 45.6875C13.7639 45.6875 5.3125 37.2361 5.3125 25.5C5.3125 13.7639 13.7639 5.3125 25.5 5.3125C37.2361 5.3125 45.6875 13.7639 45.6875 25.5Z"
                                            stroke="#83EFC8" stroke-opacity="0.51" stroke-width="1.95833"/>
                                        <path opacity="0.5"
                                              d="M22.0533 16.8502C21.8511 17.3383 21.8511 17.9572 21.8511 19.1948V21.7336C21.8511 21.789 21.8511 21.8167 21.8339 21.8339C21.8167 21.8511 21.789 21.8511 21.7336 21.8511H19.1948C17.9572 21.8511 17.3383 21.8511 16.8502 22.0533C16.1993 22.3229 15.6822 22.84 15.4126 23.4908C15.2104 23.979 15.2104 24.5978 15.2104 25.8354C15.2104 27.0731 15.2104 27.6919 15.4126 28.1801C15.6822 28.8309 16.1993 29.348 16.8502 29.6176C17.3383 29.8198 17.9572 29.8198 19.1948 29.8198H21.7336C21.789 29.8198 21.8167 29.8198 21.8339 29.837C21.8511 29.8542 21.8511 29.8819 21.8511 29.9373V32.4761C21.8511 33.7137 21.8511 34.3326 22.0533 34.8207C22.3229 35.4716 22.84 35.9887 23.4908 36.2583C23.979 36.4605 24.5978 36.4604 25.8354 36.4604C27.0731 36.4604 27.6919 36.4605 28.1801 36.2583C28.8309 35.9887 29.348 35.4716 29.6176 34.8207C29.8198 34.3326 29.8198 33.7137 29.8198 32.4761V29.9373C29.8198 29.8819 29.8198 29.8542 29.837 29.837C29.8542 29.8198 29.8819 29.8198 29.9373 29.8198H32.4761C33.7137 29.8198 34.3326 29.8198 34.8207 29.6176C35.4716 29.348 35.9887 28.8309 36.2583 28.1801C36.4605 27.6919 36.4604 27.0731 36.4604 25.8354C36.4604 24.5978 36.4605 23.979 36.2583 23.4908C35.9887 22.84 35.4716 22.3229 34.8207 22.0533C34.3326 21.8511 33.7137 21.8511 32.4761 21.8511H29.9373C29.8819 21.8511 29.8542 21.8511 29.837 21.8339C29.8198 21.8167 29.8198 21.789 29.8198 21.7336V19.1948C29.8198 17.9572 29.8198 17.3383 29.6176 16.8502C29.348 16.1993 28.8309 15.6822 28.1801 15.4126C27.6919 15.2104 27.0731 15.2104 25.8354 15.2104C24.5978 15.2104 23.979 15.2104 23.4908 15.4126C22.84 15.6822 22.3229 16.1993 22.0533 16.8502Z"
                                              stroke="#83EFC8" stroke-opacity="0.51" stroke-width="1.95833"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-5 col-md-12 col-sm-12 col-xs-12">
                        <div className="image">
                            <img src={image} alt="GlobalMed Klinikası"/>
                        </div>
                    </div>
                </div>

                {/* Second Section: Certificates */}
                <div className="second-section">
                    <h2>Sertifikatlar</h2>
                    <div className="row">
                        {paginatedCards.map((card, idx) => (
                            <CardCertificate
                                key={card.id}
                                index={idx}
                                image={card.image}
                                number={card.number}
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
                            {showAllServices ? 'Daha az' : 'Daha çox'} <GoArrowDown/>
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
                        <div className="navigationBtn">
                            <button className="prev" onClick={handlePrev} aria-label="Previous">
                                <HiOutlineArrowLeft/>
                            </button>
                            <button className="next" onClick={handleNext} aria-label="Next">
                                <HiOutlineArrowRight/>
                            </button>
                        </div>
                    </div>
                    <div className="slider-wrapper">
                        <div className="slider-card row" ref={sliderRef}>
                            {cards.map((item, i) => (
                                <DoktorCard key={i} name={item.name} img={item.imageUrl} />
                            ))}
                        </div>
                    </div>
                    <div className="custom-pagination">
                        {Array.from({length: maxIndex + 1}).map((_, idx) => (
                            <span
                                key={idx}
                                className={`custom-bullet ${currentIndex === idx ? 'active' : ''}`}
                                onClick={() => handleBulletClick(idx)}
                                role="button"
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Fifth Section: Gallery */}
                <div className="fifth-section">
                    <h2>Image gallery</h2>
                    <div className="gallery">
                        <div className="gallery-slider-wrapper">
                            <div className="gallery-slider" ref={gallerySliderRef}>
                                {galleryImages.map((src, idx) => (
                                    <div className="gallery-slide" key={idx}>
                                        <img src={src} alt={`Gallery ${idx + 1}`}/>
                                    </div>
                                ))}
                            </div>
                            <button
                                className="gallery-prev"
                                onClick={handleGalleryPrev}
                                aria-label="Previous image"
                            >
                                <HiOutlineArrowLeft/>
                            </button>
                            <button
                                className="gallery-next"
                                onClick={handleGalleryNext}
                                aria-label="Next image"
                            >
                                <HiOutlineArrowRight/>
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

                {/* Contact Section */}
                <div className="contact">
                    <div className="row form-section">
                        <div className="col-6 col-md-12 col-sm-12 col-xs-12">
                            <div className="form" data-aos="fade-right">
                                <div className="form-head">
                                    <hr/>
                                    <h2>Formu dolduraraq bizimlə əlaqə saxlayın</h2>
                                </div>
                                <div className="form-body">
                                    <form onSubmit={() => { /* handle submission */
                                    }}>
                                        <div className="row">
                                            <div className="col-6 col-md-12 col-sm-12 col-xs-12">
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
                                            <div className="col-6 col-md-12 col-sm-12 col-xs-12">
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
                                            <div className="col-12">
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
                                            <div className="col-12">
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
                                            <div className="col-12">
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
                                            <div className="col-12">
                                                <button type="submit">Göndər</button>
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
        </div>
    );
}

export default ClinicDetail;