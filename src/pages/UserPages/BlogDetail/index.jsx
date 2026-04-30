import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import "./blogDetail.scss";
import { FiCopy } from "react-icons/fi";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";
import { HiOutlineArrowLeft, HiOutlineArrowRight } from 'react-icons/hi';
import BlogDetailCard from "../../../components/UserComponents/BlogDetailCard/index.jsx";
import { useGetAllNewspaperQuery, useGetNewspaperByIdQuery } from "../../../services/userApi.jsx";
import { NEWSPAPER_IMAGES } from "../../../contants.js";
import ScrollToTop from "../../../components/ScrollToTop/index.jsx";
import AOS from "aos";
import "aos/dist/aos.css";
import { getLocalizedText } from "../../../utils/getLocalizedText.js";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import banner from "/src/assets/AboutBanner.png";
import mobileBanner from "../../../assets/MobileBanner.png";
import Logo from "../../../assets/Logo.png"; // Using Logo as placeholder
import defaultBlogImg from "../../../assets/doktor.jpg";

function BlogDetail() {
    const { t } = useTranslation();
    const { id } = useParams();
    const { data: getNewspaperById, isLoading } = useGetNewspaperByIdQuery(id);
    const blog = getNewspaperById?.data;
    const navigate = useNavigate();
    const { data: getAllNewspapers } = useGetAllNewspaperQuery();
    
    const [imgErrors, setImgErrors] = useState({});
    const [videoIndex, setVideoIndex] = useState(0);
    const [activeVideo, setActiveVideo] = useState(null);
    const [activeImage, setActiveImage] = useState(null);

    const handleImageError = (imgKey) => {
        setImgErrors(prev => ({ ...prev, [imgKey]: true }));
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

    const videos = Array.isArray(blog?.newspaperVideos) ? blog.newspaperVideos : 
                   Array.isArray(blog?.newsPaperVideos) ? blog.newsPaperVideos : 
                   Array.isArray(blog?.videos) ? blog.videos : [];

    const relatedBlogs = (getAllNewspapers?.data || [])
        .filter((b) => b.id !== id)
        .sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime())
        .slice(0, 3);

    const isMobile = useMediaQuery({ maxWidth: 768 });
    const currentUrl = encodeURIComponent(window.location.href);

    useEffect(() => {
        if (id) {
            setImgErrors({}); // Reset errors on ID change
            AOS.init({ duration: 1000 });
            window.scrollTo(0, 0);
        }
    }, [id]);

    if (isLoading) return null;

    const title = getLocalizedText(blog, 'title');
    const subtitle = getLocalizedText(blog, 'subtitle');
    const newspaperImageList = blog?.newsPaperImages || blog?.newspaperImages || [];

    // Copy link handler
    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                alert(t("blogDetail.copySuccess", "Link kopyalandı!"));
            })
            .catch((err) => {
                console.error("Copy failed", err);
            });
    };

    return (
        <div id="blog-detail">
            <ScrollToTop/>
            
            <div className="container">
                <div className="head">
                    <h1>{t("navbar.blogSingular")}</h1>
                    <p data-aos="fade-up" data-aos-delay="100">
                        <Link to="/">{t("contact.breadcrumb.home")}</Link>
                        <span className="dot">•</span>
                        <Link to="/blogs">{t("navbar.blog")}</Link>
                    </p>
                </div>
            </div>

            <div className="bannerAbout">
                <img
                    src={isMobile ? mobileBanner : banner}
                    alt="Banner"
                />
            </div>

            <div className="container main-content" data-aos="fade-in">
                <div className="blogContent" data-aos="zoom-in">
                    <div className="category-tag">
                        <span>{t("navbar.blogSingular")} /</span>
                    </div>
                    <h1>{title}</h1>
                    <div className="detail-main-img">
                        <img 
                            src={newspaperImageList.length > 0 && !imgErrors['main'] ? NEWSPAPER_IMAGES + newspaperImageList[0] : (imgErrors['main'] ? Logo : defaultBlogImg)} 
                            alt={title} 
                            onError={() => handleImageError('main')}
                            className={imgErrors['main'] ? 'placeholder-img' : ''}
                            onClick={() => !imgErrors['main'] && setActiveImage(NEWSPAPER_IMAGES + newspaperImageList[0])}
                        />
                    </div>
                    
                    <div className="social-links-row" data-aos="fade-up">
                        <div className="detail-icon copy-link" onClick={handleCopyLink}>
                            <FiCopy /> <span>{t("blogDetail.copyLink", "Link kopyala")}</span>
                        </div>
                        <div className="detail-icon">
                            <a href={`https://twitter.com/intent/tweet?url=${currentUrl}`} target="_blank" rel="noreferrer"><FaTwitter /></a>
                        </div>
                        <div className="divider"></div>
                        <div className="detail-icon">
                            <a href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`} target="_blank" rel="noreferrer"><FaFacebook /></a>
                        </div>
                        <div className="detail-icon">
                            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`} target="_blank" rel="noreferrer"><FaLinkedin /></a>
                        </div>
                    </div>
                </div>

                <div className="blog-detail-content" data-aos="fade-up">
                    <div className="detail-content" data-aos="fade-up">
                        {subtitle && subtitle !== title && (
                            subtitle.includes("youtube.com") || subtitle.includes("youtu.be") ? (
                                <div className="embedded-video-main">
                                    <iframe
                                        width="100%"
                                        height="450"
                                        src={formatYoutubeUrl(subtitle)}
                                        title="video"
                                        frameBorder="0"
                                        allow="autoplay; fullscreen"
                                        allowFullScreen
                                    />
                                </div>
                            ) : (
                                <p>{subtitle}</p>
                            )
                        )}
                        
                        {newspaperImageList.length > 1 && (
                            <div className="blog-gallery" data-aos="fade-up">
                                {newspaperImageList.slice(1).map((img, index) => (
                                    <div key={index} className="gallery-item" onClick={() => !imgErrors[`sub${index}`] && setActiveImage(NEWSPAPER_IMAGES + img)}>
                                        <img 
                                            src={imgErrors[`sub${index}`] ? Logo : NEWSPAPER_IMAGES + img} 
                                            alt={`${title} - ${index + 1}`} 
                                            onError={() => handleImageError(`sub${index}`)}
                                            data-aos="zoom-in" 
                                            className={imgErrors[`sub${index}`] ? 'placeholder-img' : ''}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    </div>

                    {videos.length > 0 && (
                        <div className="videos-section" data-aos="fade-up">
                            <h2>
                                {t("blogDetail.videos.title", "Videolar")}
                            </h2>

                            <div className="gallery">
                                <div className="gallery-slider-wrapper">
                                    <div className="gallery-slider" style={{ transform: `translateX(-${videoIndex * 100}%)` }}>
                                        {videos.map((vid, idx) => {
                                            const embedUrl = formatYoutubeUrl(vid);
                                            const videoId = vid.includes("watch?v=")
                                                ? vid.split("watch?v=")[1].split("&")[0]
                                                : vid.includes("youtu.be/")
                                                    ? vid.split("youtu.be/")[1].split("?")[0]
                                                    : null;

                                            return (
                                                <div className="gallery-slide" key={idx} onClick={() => setActiveVideo(embedUrl)}>
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
                                    {videos.length > 1 && (
                                        <>
                                            <button className="gallery-prev" onClick={() => setVideoIndex(i => Math.max(0, i - 1))}>
                                                <HiOutlineArrowLeft color={'white'} />
                                            </button>
                                            <button className="gallery-next" onClick={() => setVideoIndex(i => Math.min(videos.length - 1, i + 1))}>
                                                <HiOutlineArrowRight color={'white'} />
                                            </button>
                                        </>
                                    )}
                                </div>
                                {videos.length > 1 && (
                                    <div className="gallery-pagination">
                                        {videos.map((_, idx) => (
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
                        </div>
                    )}

                  
                <div className="blog-recommed" data-aos="fade-up">
                    <div className="recommedTitle" data-aos="zoom-in">
                        <h5>{t("blogDetail.recommendTitle", "Digər Bloqlar")}</h5>
                        <button onClick={() => navigate("/blogs")}>
                            {t("blogDetail.viewAll", "Hamısına bax")} <FaArrowRightLong />
                        </button>
                    </div>
                    <p className="recommend-subtitle" data-aos="fade-up">
                        {t(
                            "blogDetail.recommendSubtitle",
                            "Səyahət hekayələri, faydalı məsləhətlər və unudulmaz məkanlar haqqında yazılar burada!"
                        )}
                    </p>
                    <div className="row" data-aos="fade-up">
                        {relatedBlogs && relatedBlogs.map((b) => (
                            <BlogDetailCard key={b.id} blog={b} data-aos="flip-up" />
                        ))}
                    </div>
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

                
            </div>
        </div>
    );
}

export default BlogDetail;
