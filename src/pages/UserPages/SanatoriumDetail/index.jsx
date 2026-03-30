import './index.scss';
import {Link, useParams} from 'react-router-dom';
import {useRef, useState, useEffect} from 'react';
import {HiOutlineArrowLeft, HiOutlineArrowRight} from 'react-icons/hi';
import {useGetSanatoriumByIdQuery, usePostContactSanatoriumMutation, useGetAllSanatoriumQuery} from "../../../services/userApi.jsx";
import {SANATORIUM_CARD_IMAGES, SANATORIUM_IMAGES} from "../../../contants.js";
import {useTranslation} from "react-i18next";
import HomeServiceCard from "../../../components/UserComponents/Home/ServiceCardHome/index.jsx";
import SanatoriumCard from "../../../components/UserComponents/SanatoriumCard/index.jsx";
import banner from "../../../assets/AboutBanner.png";
import mobileBanner from "../../../assets/MobileBanner.png";
import {useMediaQuery} from "react-responsive";
import showToast from "../../../components/ToastMessage.js";

function SanatoriumDetail() {
    const {id} = useParams();
    const {data: getSanatoriumById} = useGetSanatoriumByIdQuery(id);
    const {data: allSanatoriums} = useGetAllSanatoriumQuery();
    const sanatorium = getSanatoriumById?.data;
    const [showAllServices, setShowAllServices] = useState(false);
    const {t, i18n} = useTranslation();
    const [postSanatoriumContact] = usePostContactSanatoriumMutation();

    const getLocalizedText = (item, field) => {
        if (!item) return "";
        const lang = i18n.language;
        if (field === 'name') {
            return lang === 'en' ? item.nameEng : (lang === 'ru' ? item.nameRu : (lang === 'az' ? item.name : item.name));
        } else if (field === 'location') {
            return lang === 'en' ? item.locationEng : (lang === 'ru' ? item.locationRu : (lang === 'az' ? item.location : item.location));
        } else {
            return lang === 'en' ? item.descriptionEng : (lang === 'ru' ? item.descriptionRu : (lang === 'az' ? item.description : item.description));
        }
    };

    const [name, setFirstName] = useState('');
    const [surname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhone] = useState('');
    const [description, setNote] = useState('');

    const serviceCards = sanatorium?.services?.map((item) => (
        <HomeServiceCard
            key={item.id}
            id={item.id}
            name={getLocalizedText(item, "name")}
            desc={getLocalizedText(item, "description")}
            icon={item.categoryImage || ""}
        />
    ));

    const displayedServiceCards = showAllServices
        ? serviceCards
        : serviceCards?.slice(0, 4);

    const gallerySliderRef = useRef(null);
    const [galleryIndex, setGalleryIndex] = useState(0);
    const galleryImages = sanatorium?.images || [];
    const maxGalleryIndex = Math.max(0, galleryImages?.length - 1);

    const handleGalleryPrev = () => {
        if (galleryIndex > 0) {
            const next = galleryIndex - 1;
            setGalleryIndex(next);
            if (gallerySliderRef.current) gallerySliderRef.current.style.transform = `translateX(-${next * 100}%)`;
        }
    };
    const handleGalleryNext = () => {
        if (galleryIndex < maxGalleryIndex) {
            const next = galleryIndex + 1;
            setGalleryIndex(next);
            if (gallerySliderRef.current) gallerySliderRef.current.style.transform = `translateX(-${next * 100}%)`;
        }
    };
    const handleGalleryBulletClick = (index) => {
        setGalleryIndex(index);
        if (gallerySliderRef.current) gallerySliderRef.current.style.transform = `translateX(-${index * 100}%)`;
    };

    const isMobile = useMediaQuery({maxWidth: 768});

    // Related Section Logic
    const relatedSliderRef = useRef(null);
    const [relatedIndex, setRelatedIndex] = useState(0);
    const [visibleRelatedCards, setVisibleRelatedCards] = useState(4);
    const relatedSanatoriums = allSanatoriums?.data?.filter(s => s.id !== id) || [];
    const maxRelatedIndex = Math.max(0, relatedSanatoriums.length - visibleRelatedCards);

    useEffect(() => {
        const updateVisible = () => {
            if (window.innerWidth <= 576) setVisibleRelatedCards(2);
            else setVisibleRelatedCards(4);
        };
        updateVisible();
        window.addEventListener('resize', updateVisible);
        return () => window.removeEventListener('resize', updateVisible);
    }, []);

    const handleRelatedBulletClick = (index) => {
        if (index <= maxRelatedIndex) {
            setRelatedIndex(index);
            if (relatedSliderRef.current) {
                relatedSliderRef.current.style.transform = `translateX(-${index * (100 / visibleRelatedCards)}%)`;
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = {
            name,
            surname,
            email,
            phoneNumber,
            description,
            sanatoriumId: id
        };

        try {
            await postSanatoriumContact(body).unwrap();
            showToast(t("contact.succesToast"), 'success');
            setFirstName("");
            setLastName("");
            setEmail("");
            setPhone("");
            setNote("");
        } catch (err) {
            console.error(err);
            showToast(t("contact.errorToast"), 'error');
        }
    };

    const formatYoutubeUrl = (url) => {
        if (!url) return "";
        if (url.includes("youtube.com/watch?v=")) {
            const videoId = url.split("watch?v=")[1].split("&")[0];
            return `https://www.youtube.com/embed/${videoId}`;
        }
        if (url.includes("youtu.be/")) {
            const videoId = url.split("youtu.be/")[1].split("?")[0];
            return `https://www.youtube.com/embed/${videoId}`;
        }
        return url;
    };

    return (
        <div id="sanatorium-detail">
            <div className="container">
                {/* Breadcrumb Section */}
                <div className="head" data-aos="fade-up" data-aos-delay="100">
                    <h1>{getLocalizedText(sanatorium, "name")}</h1>
                    <p>
                        <Link to="/">{t("sanatoriumDetail.breadcrumb.home")}</Link>
                        <div className="dot"/>
                        <Link to="/sanatoriums">{t("sanatoriumDetail.breadcrumb.sanatoriums")}</Link>
                        <div className="dot"/>
                        <span>{getLocalizedText(sanatorium, "name")}</span>
                    </p>
                </div>

                {/* First Section */}
                <div className="row first-section">
                    <div className="col-35 col-md-60 col-sm-60 col-xs-60" data-aos="fade-right">
                        <div className="content">
                            <div className="icons">
                                <svg className="icon1" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                                    <circle cx="6.5" cy="6.5" r="6.5" fill="#003778"/>
                                </svg>
                                <svg className="icon2" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <circle cx="10" cy="10" r="10" fill="#003778" fillOpacity="0.1"/>
                                </svg>
                                <svg className="icon3" xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="0 0 37 37" fill="none">
                                    <circle cx="18.5" cy="18.5" r="18.5" fill="#003778" fillOpacity="0.1"/>
                                </svg>
                                <svg className="icon4" xmlns="http://www.w3.org/2000/svg" width="243" height="243" viewBox="0 0 243 243" fill="none">
                                    <circle cx="121.5" cy="121.5" r="121.5" fill="#003778" fillOpacity="0.1"/>
                                </svg>
                            </div>
                            <h3>{getLocalizedText(sanatorium, "name")}</h3>
                            <p className="loc-text">{getLocalizedText(sanatorium, "location")}</p>
                            <p>{getLocalizedText(sanatorium, "description")}</p>
                        </div>
                    </div>
                    <div className="col-25 col-md-60 col-sm-60 col-xs-60" data-aos="fade-left">
                        <div className="image">
                            <img src={SANATORIUM_CARD_IMAGES + sanatorium?.sanatoriumCardImage} alt={getLocalizedText(sanatorium, "name")}/>
                        </div>
                    </div>
                </div>

                {/* Services Section - Always render row structure even if empty to match ClinicDetail behavior */}
                <div className="third-section" data-aos="fade-up">
                    <div className="header">
                        <h2>{t("sanatoriumDetail.services.title")}</h2>
                        <p>{t("sanatoriumDetail.services.description")}</p>
                    </div>
                    <div className="row" style={{marginBottom: 50}}>
                        {displayedServiceCards}
                    </div>
                    {serviceCards?.length > 4 && (
                        <div style={{textAlign: 'center'}}>
                            <button className={"clinicDetailThird"} onClick={() => setShowAllServices(!showAllServices)}>
                                {showAllServices ? t("common.showLess") : t("clinicDetail.services.button")}
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                                    <path d="M23.5291 8.03068L20.5291 11.0307C20.3884 11.1714 20.1975 11.2505 19.9985 11.2505C19.7995 11.2505 19.6086 11.1714 19.4679 11.0307C19.3271 10.8899 19.2481 10.6991 19.2481 10.5001C19.2481 10.301 19.3271 10.1102 19.4679 9.96943L21.1882 8.25005H19.9985C16.3732 8.25005 15.6307 10.0313 14.6904 12.2888C13.7219 14.6138 12.6232 17.2501 7.99849 17.2501H7.90474C7.72219 17.957 7.28807 18.5732 6.68373 18.983C6.0794 19.3928 5.34635 19.5681 4.62199 19.4761C3.89763 19.3841 3.23169 19.0311 2.749 18.4832C2.2663 17.9353 2 17.2302 2 16.5001C2 15.7699 2.2663 15.0648 2.749 14.5169C3.23169 13.969 3.89763 13.616 4.62199 13.524C5.34635 13.432 6.0794 13.6073 6.68373 14.0171C7.28807 14.4269 7.72219 15.0431 7.90474 15.7501H7.99849C11.6238 15.7501 12.3663 13.9688 13.3066 11.7113C14.2797 9.3863 15.3738 6.75005 19.9985 6.75005H21.1882L19.4679 5.03068C19.3271 4.88995 19.2481 4.69907 19.2481 4.50005C19.2481 4.30103 19.3271 4.11016 19.4679 3.96943C19.6086 3.8287 19.7995 3.74963 19.9985 3.74963C20.1975 3.74963 20.3884 3.8287 20.5291 3.96943L23.5291 6.96943C23.5988 7.03908 23.6542 7.1218 23.6919 7.21285C23.7297 7.30389 23.7491 7.40149 23.7491 7.50005C23.7491 7.59861 23.7297 7.69621 23.6919 7.78726C23.6542 7.8783 23.5988 7.96102 23.5291 8.03068Z" fill="#424242"/>
                                </svg>
                            </button>
                        </div>
                    )}
                </div>

                {/* Related Section */}
                <div className="fourth-section" data-aos="fade-up">
                    <div className="header">
                        <div>
                            <h2>{t("sanatoriumDetail.related.title")}</h2>
                            <p>{t("sanatoriumDetail.related.description")}</p>
                        </div>
                    </div>
                    {relatedSanatoriums.length > 0 ? (
                        <>
                            <div className="slider-wrapper" style={{marginBottom: '50px'}}>
                                <div className="slider-card row" ref={relatedSliderRef}>
                                    {relatedSanatoriums.map((item) => (
                                        <div key={item.id}>
                                            <SanatoriumCard item={item} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="custom-pagination">
                                {Array.from({length: maxRelatedIndex + 1}).map((_, index) => (
                                    <span
                                        key={index}
                                        className={`custom-bullet ${relatedIndex === index ? 'active' : ''}`}
                                        onClick={() => handleRelatedBulletClick(index)}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <p style={{textAlign: 'center', color: '#727272'}}>{t("common.noData")}</p>
                    )}
                </div>

                {/* Gallery Section */}
                <div className="fifth-section" data-aos="fade-up">
                    <h2>{t("clinicDetail.gallery.title")}</h2>
                    <div className="gallery">
                        <div className="gallery-slider-wrapper">
                            <div className="gallery-slider" ref={gallerySliderRef}>
                                {galleryImages.length > 0 ? (
                                    galleryImages.map((img, idx) => (
                                        <div className="gallery-slide" key={idx}>
                                            <img src={SANATORIUM_IMAGES + img} alt={`Sanatorium image ${idx + 1}`}/>
                                        </div>
                                    ))
                                ) : (
                                    <div className="gallery-slide">
                                        <img src={SANATORIUM_CARD_IMAGES + sanatorium?.sanatoriumCardImage} alt="Main Image"/>
                                    </div>
                                )}
                            </div>
                            {galleryImages.length > 1 && (
                                <>
                                    <button className="gallery-prev" onClick={handleGalleryPrev}>
                                        <HiOutlineArrowLeft />
                                    </button>
                                    <button className="gallery-next" onClick={handleGalleryNext}>
                                        <HiOutlineArrowRight />
                                    </button>
                                </>
                            )}
                        </div>
                        {galleryImages.length > 1 && (
                            <div className="gallery-pagination">
                                {galleryImages.map((_, idx) => (
                                    <span
                                        key={idx}
                                        className={`gallery-bullet ${galleryIndex === idx ? 'active' : ''}`}
                                        onClick={() => handleGalleryBulletClick(idx)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Videos Section */}
                <div className="videos-section" data-aos="fade-up">
                    <h2>{t("sanatoriumDetail.videos.title")}</h2>
                    <div className="row">
                        {sanatorium?.videos?.length > 0 ? (
                            sanatorium.videos.map((vid, idx) => (
                                <div key={idx} className="col-30 col-md-60">
                                    <div className="video-card">
                                        <iframe
                                            src={formatYoutubeUrl(vid)}
                                            title={`Sanatorium video ${idx + 1}`}
                                            frameBorder="0"
                                            allowFullScreen
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-60">
                                <p style={{textAlign: 'center', color: '#727272'}}>{t("common.noData")}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Contact Section */}
                <div className="contact" data-aos="fade-up">
                    <div className="row form-section">
                        <div className="col-30 col-md-60 col-sm-60 col-xs-60" data-aos="fade-right">
                            <div className="form">
                                <div className="form-head">
                                    <hr/>
                                    <h2>{t("contact.form.title")}</h2>
                                </div>
                                <div className="form-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col-30 col-md-60">
                                                <label>{t("contact.form.labels.name")}</label>
                                                <input placeholder={t("contact.form.placeholders.name")} value={name} onChange={(e) => setFirstName(e.target.value)} required />
                                            </div>
                                            <div className="col-30 col-md-60">
                                                <label>{t("contact.form.labels.surname")}</label>
                                                <input placeholder={t("contact.form.placeholders.surname")} value={surname} onChange={(e) => setLastName(e.target.value)} required />
                                            </div>
                                            <div className="col-60">
                                                <label>{t("contact.form.labels.email")}</label>
                                                <input type="email" placeholder={t("contact.form.placeholders.email")} value={email} onChange={(e) => setEmail(e.target.value)} required />
                                            </div>
                                            <div className="col-60">
                                                <label>{t("contact.form.labels.phone")}</label>
                                                <input type="tel" placeholder={t("contact.form.placeholders.phone")} value={phoneNumber} onChange={(e) => setPhone(e.target.value)} required />
                                            </div>
                                            <div className="col-60">
                                                <label>{t("contact.form.labels.description")}</label>
                                                <textarea rows={5} value={description} onChange={(e) => setNote(e.target.value)} required placeholder={t("contact.form.placeholders.description")} />
                                            </div>
                                            <div className="col-60">
                                                <button type="submit">{t("contact.form.button")}</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col-30 col-md-60" data-aos="fade-left">
                            <div className="map">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3603.5460616273745!2d49.85555347640196!3d40.41115175597831!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d003436b447%3A0xb8c6c13c52985f63!2sQAVO%20MMC!5e1!3m2!1sen!2saz!4v1745930590256!5m2!1sen!2saz"
                                    width="100%" height="580" style={{border: 0}} allowFullScreen="" loading="lazy" title="Google Map"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bannerAbout">
                <img src={isMobile ? mobileBanner : banner} alt="Banner" />
            </div>
        </div>
    );
}

export default SanatoriumDetail;
