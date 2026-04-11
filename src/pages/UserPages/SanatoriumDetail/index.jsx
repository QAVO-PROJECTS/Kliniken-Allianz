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
import SanatoriumCardMain from "../../../components/UserComponents/SanatoriumCardMain/index.jsx";
import DNA3D from "../../../components/UserComponents/DNA3D/index.jsx";

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
    const [videoIndex, setVideoIndex] = useState(0);
    const [activeVideo, setActiveVideo] = useState(null);

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
                                <div className="icon4">
                                    <DNA3D rotation={45} />
                                </div>
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

                <div className="third-section" data-aos="fade-up">
                    <div className="header">
                        <h2>{t("sanatoriumDetail.services.title")}</h2>
                        <p>{t("sanatoriumDetail.services.description")}</p>
                    </div>

                    {sanatorium?.services?.length > 0 ? (
                        <ul className="services-list">
                            {sanatorium.services
                                .slice(0, showAllServices ? undefined : 4)
                                .map((item) => (
                                    <li key={item.id} className="services-list-item">
                                        <span className="services-dot" />
                                        <span>{getLocalizedText(item, "name")}</span>
                                    </li>
                                ))
                            }
                        </ul>
                    ) : (
                        <p style={{color: '#727272'}}>{t("common.noData")}</p>
                    )}

                    {sanatorium?.services?.length > 4 && (
                        <div style={{textAlign: 'center', marginTop: '16px'}}>
                            <button className="clinicDetailThird" onClick={() => setShowAllServices(!showAllServices)}>
                                {showAllServices ? t("common.showLess") : t("clinicDetail.services.button")}
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
                                            <SanatoriumCardMain item={item} />
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
                                        <HiOutlineArrowLeft  color={'white'} />
                                    </button>
                                    <button className="gallery-next" onClick={handleGalleryNext}>
                                        <HiOutlineArrowRight  color={'white'} />
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
                {/* Videos Section */}
                <div className="videos-section" data-aos="fade-up">
                    <h2>{t("sanatoriumDetail.videos.title")}</h2>

                    {sanatorium?.videos?.length > 0 ? (
                        <>
                            <div className="gallery">
                                <div className="gallery-slider-wrapper">
                                    <div className="gallery-slider" style={{transform: `translateX(-${videoIndex * 100}%)`}}>
                                        {sanatorium.videos.map((vid, idx) => {
                                            const embedUrl = formatYoutubeUrl(vid);
                                            const videoId = vid.includes("watch?v=")
                                                ? vid.split("watch?v=")[1].split("&")[0]
                                                : vid.includes("youtu.be/")
                                                    ? vid.split("youtu.be/")[1].split("?")[0]
                                                    : null;

                                            return (
                                                <div className="gallery-slide" key={idx} onClick={() => setActiveVideo(embedUrl)} style={{cursor: 'pointer'}}>
                                                    <img
                                                        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                                                        onError={(e) => { e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`; }}
                                                        alt={`video-${idx}`}
                                                    />
                                                    <div className="video-play-overlay">
                                                        <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <circle cx="30" cy="30" r="30" fill="rgba(0,0,0,0.45)"/>
                                                            <polygon points="24,18 46,30 24,42" fill="white"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {sanatorium.videos.length > 1 && (
                                        <>
                                            <button className="gallery-prev" onClick={() => setVideoIndex(i => Math.max(0, i - 1))}>
                                                <HiOutlineArrowLeft  color={'white'} />
                                            </button>
                                            <button className="gallery-next" onClick={() => setVideoIndex(i => Math.min(sanatorium.videos.length - 1, i + 1))}>
                                                <HiOutlineArrowRight  color={'white'} />
                                            </button>
                                        </>
                                    )}
                                </div>
                                {sanatorium.videos.length > 1 && (
                                    <div className="gallery-pagination">
                                        {sanatorium.videos.map((_, idx) => (
                                            <span
                                                key={idx}
                                                className={`gallery-bullet ${videoIndex === idx ? 'active' : ''}`}
                                                onClick={() => setVideoIndex(idx)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {activeVideo && (
                                <div className="video-modal" onClick={() => setActiveVideo(null)}>
                                    <div className="video-modal-inner" onClick={(e) => e.stopPropagation()}>
                                        <button className="video-modal-close" onClick={() => setActiveVideo(null)}>✕</button>
                                        <iframe
                                            src={activeVideo + "?autoplay=1"}
                                            title="video"
                                            frameBorder="0"
                                            allow="autoplay; fullscreen"
                                            allowFullScreen
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <p style={{textAlign: 'center', color: '#727272'}}>{t("common.noData")}</p>
                    )}
                </div>

                {/*/!* Contact Section *!/*/}
                {/*<div className="contact" data-aos="fade-up">*/}
                {/*    <div className="row form-section">*/}
                {/*        <div className="col-30 col-md-60 col-sm-60 col-xs-60" data-aos="fade-right">*/}
                {/*            <div className="form">*/}
                {/*                <div className="form-head">*/}
                {/*                    <hr/>*/}
                {/*                    <h2>{t("contact.form.title")}</h2>*/}
                {/*                </div>*/}
                {/*                <div className="form-body">*/}
                {/*                    <form onSubmit={handleSubmit}>*/}
                {/*                        <div className="row">*/}
                {/*                            <div className="col-30 col-md-60">*/}
                {/*                                <label>{t("contact.form.labels.name")}</label>*/}
                {/*                                <input placeholder={t("contact.form.placeholders.name")} value={name} onChange={(e) => setFirstName(e.target.value)} required />*/}
                {/*                            </div>*/}
                {/*                            <div className="col-30 col-md-60">*/}
                {/*                                <label>{t("contact.form.labels.surname")}</label>*/}
                {/*                                <input placeholder={t("contact.form.placeholders.surname")} value={surname} onChange={(e) => setLastName(e.target.value)} required />*/}
                {/*                            </div>*/}
                {/*                            <div className="col-60">*/}
                {/*                                <label>{t("contact.form.labels.email")}</label>*/}
                {/*                                <input type="email" placeholder={t("contact.form.placeholders.email")} value={email} onChange={(e) => setEmail(e.target.value)} required />*/}
                {/*                            </div>*/}
                {/*                            <div className="col-60">*/}
                {/*                                <label>{t("contact.form.labels.phone")}</label>*/}
                {/*                                <input type="tel" placeholder={t("contact.form.placeholders.phone")} value={phoneNumber} onChange={(e) => setPhone(e.target.value)} required />*/}
                {/*                            </div>*/}
                {/*                            <div className="col-60">*/}
                {/*                                <label>{t("contact.form.labels.description")}</label>*/}
                {/*                                <textarea rows={5} value={description} onChange={(e) => setNote(e.target.value)} required placeholder={t("contact.form.placeholders.description")} />*/}
                {/*                            </div>*/}
                {/*                            <div className="col-60">*/}
                {/*                                <button type="submit">{t("contact.form.button")}</button>*/}
                {/*                            </div>*/}
                {/*                        </div>*/}
                {/*                    </form>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*        <div className="col-30 col-md-60" data-aos="fade-left">*/}
                {/*            <div className="map">*/}
                {/*                <iframe*/}
                {/*                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3603.5460616273745!2d49.85555347640196!3d40.41115175597831!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d003436b447%3A0xb8c6c13c52985f63!2sQAVO%20MMC!5e1!3m2!1sen!2saz!4v1745930590256!5m2!1sen!2saz"*/}
                {/*                    width="100%" height="580" style={{border: 0}} allowFullScreen="" loading="lazy" title="Google Map"*/}
                {/*                />*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
            <div className="bannerAbout">
                <img src={isMobile ? mobileBanner : banner} alt="Banner" />
            </div>
        </div>
    );
}

export default SanatoriumDetail;
