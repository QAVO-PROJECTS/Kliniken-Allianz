import React, { useEffect } from 'react';
import "./oldBlog.scss";
import HorizontalBlogCard from "../../../components/UserComponents/HorizontalBlogCard/index.jsx";
import { useTranslation } from 'react-i18next';
import { useGetAllNewspaperQuery } from "../../../services/userApi.jsx";
import { NEWSPAPER_IMAGES } from "../../../contants.js";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";

function OldBlog() {
    const { t, i18n } = useTranslation();
    const language = i18n.language;
    const { data: getAllNewspapers } = useGetAllNewspaperQuery();
    const newspapersData = getAllNewspapers?.data;

    // Siyahıdakı ilk blogu featured olaraq götürürük (və ya başqa məntiq)
    const featuredBlog = newspapersData && newspapersData.length > 0 ? newspapersData[0] : null;

    // Featured blog üçün title və context-in cari dili nəzərə alınaraq seçilməsi
    let featuredTitle = "";
    let featuredSubtitle = "";
    if (featuredBlog) {
        featuredTitle = featuredBlog?.title;
        featuredSubtitle = featuredBlog?.subtitle;
        if (language === "en") {
            if (featuredBlog?.titleEng) featuredTitle = featuredBlog?.titleEng;
            if (featuredBlog?.subtitleEng) featuredSubtitle = featuredBlog?.subtitleEng;
        } else if (language === "ru") {
            if (featuredBlog?.titleRu) featuredTitle = featuredBlog?.titleRu;
            if (featuredBlog?.subtitleRu) featuredSubtitle = featuredBlog?.subtitleRu;
        } else if (language === "de") {
            if (featuredBlog?.titleAlm) featuredTitle = featuredBlog?.titleAlm;
            if (featuredBlog?.subtitleAlm) featuredSubtitle = featuredBlog?.subtitleAlm;
        } else if (language === "ar") {
            if (featuredBlog?.titleArab) featuredTitle = featuredBlog?.titleArab;
            if (featuredBlog?.subtitleArab) featuredSubtitle = featuredBlog?.subtitleArab;
        }
    }

    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);
    const navigate = useNavigate();

    return (
        <div className="oldBlog" data-aos="fade-up">
            <div className="container" data-aos="fade-in">
                <div className="title" data-aos="zoom-in">
                    <div></div>
                    <h2>{t("oldBlog.title", "Öncəki bloqlar")}</h2>
                </div>
                <div className="row">
                    {featuredBlog && (
                        <div className="col-35 col-md-60" data-aos="flip-left">
                            <div
                                className="image"
                                style={{
                                    backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%), url("${NEWSPAPER_IMAGES + (featuredBlog?.newsPaperImages?.[0] || featuredBlog?.newspaperImages?.[0])}")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                                data-aos="fade-up"
                                onClick={() => navigate(`/blogs/${featuredBlog.id}`)}>
                                <div className="text" data-aos="fade-right">
                                    <div className="date">{featuredBlog.createDate?.split("T")[0]}</div>
                                    <h2>{featuredTitle}</h2>
                                    <p>{featuredSubtitle?.slice(0, 200)}...</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="col-25 col-md-60 d-none d-lg-block" data-aos="fade-right">
                        <div className="blogs">
                            <div className="cards">
                                {newspapersData?.slice(1, 6).map(blog => (
                                    <HorizontalBlogCard key={blog.id} blog={blog} data-aos="flip-up" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OldBlog;
