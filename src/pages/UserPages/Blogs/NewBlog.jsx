import React, { useEffect } from 'react';
import "./newBlog.scss";
import { GoArrowRight } from "react-icons/go";
import { useTranslation } from 'react-i18next';
import { useGetAllNewspaperQuery } from "../../../services/userApi.jsx";
import { NEWSPAPER_IMAGES } from "../../../contants.js";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

function NewBlog() {
    const { t, i18n } = useTranslation();
    const language = i18n.language;
    const { data: getAllNewspapers } = useGetAllNewspaperQuery();
    const newspapersData = getAllNewspapers?.data;

    // Siyahıda ən sonuncu element "Ən Yeni" blog kimi qəbul olunur
    const latestBlog = newspapersData && newspapersData.length > 0 ? newspapersData[newspapersData.length - 1] : null;
    const navigate = useNavigate();

    // Əgər ən son blog varsa, cari dili nəzərə alaraq title və context seçirik:
    let title = "";
    let subtitle = "";
    if (latestBlog) {
        title = latestBlog?.title;
        subtitle = latestBlog?.subtitle;
        if (language === "en") {
            if (latestBlog?.titleEng) title = latestBlog?.titleEng;
            if (latestBlog?.subtitleEng) subtitle = latestBlog?.subtitleEng;
        } else if (language === "ru") {
            if (latestBlog?.titleRu) title = latestBlog?.titleRu;
            if (latestBlog?.subtitleRu) subtitle = latestBlog?.subtitleRu;
        } else if (language === "de") {
            if (latestBlog?.titleAlm) title = latestBlog?.titleAlm;
            if (latestBlog?.subtitleAlm) subtitle = latestBlog?.subtitleAlm;
        } else if (language === "ar") {
            if (latestBlog?.titleArab) title = latestBlog?.titleArab;
            if (latestBlog?.subtitleArab) subtitle = latestBlog?.subtitleArab;
        }
    }

    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    return (
        <div className="newBlog" data-aos="fade-up">
            <div className="container" data-aos="fade-in">
                <div className="head" data-aos="fade-right">
                    <p>
                        {t("newBlog.breadcrumb", "Ana səhifə /")} <span>{t("newBlog.pageTitle", "Bloq")}</span>
                    </p>
                </div>
                <div className="title" data-aos="zoom-in">
                    <div></div>
                    <h2>{t("newBlog.title", "Ən Yeni")}</h2>
                </div>
                {latestBlog ? (
                    <div className="row" data-aos="fade-up">
                        <div className="col-30 col-md-60" data-aos="flip-left">
                            <div className="image" onClick={() => navigate(`/blogs/${latestBlog.id}`)}>
                                <img src={NEWSPAPER_IMAGES + (latestBlog.newsPaperImages?.[0] || latestBlog.newspaperImages?.[0])} alt={title} />
                            </div>
                        </div>
                        <div className="col-30 col-md-60" data-aos="flip-right">
                            <div className="text">
                                <div className="date" data-aos="fade-up">
                                    {latestBlog.createDate?.split("T")[0]}
                                </div>
                                <h3 data-aos="fade-up">{title}</h3>
                                <p data-aos="fade-up">
                                    {subtitle?.slice(0, 300)} ...
                                </p>
                                <div style={{ textAlign: "end" }} data-aos="zoom-in">
                                    <button onClick={() => navigate(`/blogs/${latestBlog.id}`)}>
                                        {t("newBlog.readMore", "Ətraflı oxu")} <GoArrowRight className="icon" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p data-aos="fade-up">{t("newBlog.noBlog", "Hal-hazırda heç bir bloq yoxdur")}</p>
                )}
            </div>
        </div>
    );
}

export default NewBlog;
