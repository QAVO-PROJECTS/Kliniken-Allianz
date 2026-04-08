import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import "./blogDetail.scss";
import { FiCopy } from "react-icons/fi";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import BlogDetailCard from "../../../components/UserComponents/BlogDetailCard/index.jsx";
import { useGetAllNewspaperQuery, useGetNewspaperByIdQuery } from "../../../services/userApi.jsx";
import { NEWSPAPER_IMAGES } from "../../../contants.js";
import ScrollToTop from "../../../components/ScrollToTop/index.jsx";
import AOS from "aos";
import "aos/dist/aos.css";

function BlogDetail() {
    const { t, i18n } = useTranslation();
    const language = i18n.language;
    const { id } = useParams();
    const { data: getNewspaperById } = useGetNewspaperByIdQuery(id);
    const blog = getNewspaperById?.data;
    const navigate = useNavigate();
    const { data: getAllNewspapers } = useGetAllNewspaperQuery();
    const blogs = getAllNewspapers?.data.slice(0, 2);

    // Cari dili nəzərə alaraq title və subtitle seçirik
    let title = blog?.title;
    let subtitle = blog?.subtitle;
    if (blog) {
        if (language === "en") {
            if (blog.titleEng) title = blog.titleEng;
            if (blog.subtitleEng) subtitle = blog.subtitleEng;
        } else if (language === "ru") {
            if (blog.titleRu) title = blog.titleRu;
            if (blog.subtitleRu) subtitle = blog.subtitleRu;
        } else if (language === "de") {
            if (blog.titleAlm) title = blog.titleAlm;
            if (blog.subtitleAlm) subtitle = blog.subtitleAlm;
        } else if (language === "ar") {
            if (blog.titleArab) title = blog.titleArab;
            if (blog.subtitleArab) subtitle = blog.subtitleArab;
        }
    }

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

    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    const newspaperImageList = blog?.newsPaperImages || blog?.newspaperImages || [];

    return (
        <div id="blog-detail" data-aos="fade-up">
            <ScrollToTop/>
            <div className="container" data-aos="fade-in">
                <div className="head" data-aos="fade-right">
                    <p>
                        {t("blogDetail.breadcrumb", "Ana səhifə / Bloq /")} <span>{title}</span>
                    </p>
                </div>
                <div className="blogContent" data-aos="zoom-in">
                    <div className="date">{blog?.createDate?.split("T")[0]}</div>
                    <h1>{title}</h1>
                    {newspaperImageList.length > 0 && (
                        <img src={NEWSPAPER_IMAGES + newspaperImageList[0]} alt={title} style={{ marginBottom: "96px" }} />
                    )}
                </div>
                <div className="blog-detail-content" data-aos="fade-up">
                    <div className="detail-content" data-aos="fade-up">
                        <p>{subtitle}</p>
                        {newspaperImageList.length > 1 && (
                            <img src={NEWSPAPER_IMAGES + newspaperImageList[1]} alt={title} data-aos="zoom-in" />
                        )}
                    </div>
                    <div className="title" data-aos="fade-right">
                        <div className="text">
                            <h6>{t("blogDetail.blogHeading", "Kliniken Allianz Səyahət Bloqu")}</h6>
                            <p>{t("blogDetail.authorLabel", "Müəllif")}</p>
                        </div>
                        <div className="social" data-aos="flip-up">
                            <div className="detail-icon" onClick={handleCopyLink} style={{ cursor: "pointer" }}>
                                <FiCopy /> {t("blogDetail.copyLink", "Link kopyala")}
                            </div>
                            <div className="detail-icon">
                               <a href={"#"} target="_blank" rel="noreferrer"> <FaFacebook /></a>
                            </div>
                            <div className="detail-icon">
                                <a href={"#"} target="_blank" rel="noreferrer"><FaLinkedin /></a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="blog-recommed" data-aos="fade-up">
                    <div className="recommedTitle" data-aos="zoom-in">
                        <h5>{t("blogDetail.recommendTitle", "Digər Bloqlar")}</h5>
                        <button onClick={() => navigate("/blogs")}>
                            {t("blogDetail.viewAll", "Hamısına bax")} <FaArrowRightLong />
                        </button>
                    </div>
                    <p data-aos="fade-up">
                        {t(
                            "blogDetail.recommendSubtitle",
                            "Səyahət hekayələri, faydalı məsləhətlər və unudulmaz məkanlar haqqında yazılar burada!"
                        )}
                    </p>
                    <div className="row" data-aos="fade-up">
                        {blogs && blogs.map((b) => (
                            <BlogDetailCard key={b.id} blog={b} data-aos="flip-up" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogDetail;
