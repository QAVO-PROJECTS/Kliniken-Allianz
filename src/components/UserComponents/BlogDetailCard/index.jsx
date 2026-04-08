import React from 'react';
import './index.scss';
import { FiArrowUpRight } from "react-icons/fi";
import { NEWSPAPER_IMAGES } from "../../../contants.js";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function BlogDetailCard({ blog }) {
    const { t, i18n } = useTranslation();
    const language = i18n.language;
    let title = blog?.title;
    let subtitle = blog?.subtitle;

    if (blog) {
        if (language === "en") {
            if (blog?.titleEng) title = blog?.titleEng;
            if (blog?.subtitleEng) subtitle = blog?.subtitleEng;
        } else if (language === "ru") {
            if (blog?.titleRu) title = blog?.titleRu;
            if (blog?.subtitleRu) subtitle = blog?.subtitleRu;
        } else if (language === "de") {
            if (blog?.titleAlm) title = blog?.titleAlm;
            if (blog?.subtitleAlm) subtitle = blog?.subtitleAlm;
        } else if (language === "ar") {
            if (blog?.titleArab) title = blog?.titleArab;
            if (blog?.subtitleArab) subtitle = blog?.subtitleArab;
        }
    }

    const navigate = useNavigate();

    return (
        <div className={"col-30 col-md-30 col-sm-60"}>
            <div className={"blog-detail-card"}>
                <div className={"detail-image"}>
                    <img src={NEWSPAPER_IMAGES + (blog?.newsPaperImages?.[0] || blog?.newspaperImages?.[0])} alt={title} />
                </div>
                <div className={"detail-card-content"}>
                    <h5>{title}</h5>
                    <p>{subtitle?.slice(0, 150)}...</p>
                    <button onClick={() => navigate(`/blogs/${blog?.id}`)}>
                        {t("blogDetailCard.button", "Dahasına bax")} <FiArrowUpRight className={"iconn"} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BlogDetailCard;
