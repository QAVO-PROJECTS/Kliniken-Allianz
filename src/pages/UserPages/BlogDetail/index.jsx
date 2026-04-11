import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import "./blogDetail.scss";
import { FiCopy } from "react-icons/fi";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";
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

    const handleImageError = (imgKey) => {
        setImgErrors(prev => ({ ...prev, [imgKey]: true }));
    };

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
                        {subtitle && subtitle !== title && <p>{subtitle}</p>}
                        
                        {newspaperImageList.length > 1 && (
                            <div className="blog-gallery" data-aos="fade-up">
                                {newspaperImageList.slice(1).map((img, index) => (
                                    <div key={index} className="gallery-item">
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
            </div>
        </div>
    );
}

export default BlogDetail;
