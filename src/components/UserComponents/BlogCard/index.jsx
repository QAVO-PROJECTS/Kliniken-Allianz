import React from 'react';
import "./index.scss";
import { NEWSPAPER_IMAGES } from "../../../contants.js";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function BlogCard({ index, blog }) {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const language = i18n.language;

    // Cari dili nəzərə alaraq title və subtitle seçirik
    let title = blog?.title;
    let subtitle = blog?.subtitle;

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

    return (
            <div className={"blog-card"}>
                <div className={"image"} onClick={() => navigate(`/blogs/${blog?.id}`)}>
                    <img src={NEWSPAPER_IMAGES + (blog?.newspaperImages?.[0] || blog?.newsPaperImages?.[0])} alt={title} />
                </div>
                <div className={"date"} style={{ backgroundColor: "#FCDDEC", color: "#D80027" }}>
                    {blog?.createDate?.split("T")[0]}
                </div>
                <h5>{title}</h5>
                <p>{subtitle}</p>
                <button onClick={() => navigate(`/blogs/${blog?.id}`)}>
                    {t("blogCard.readMore", "Ətraflı oxu")}<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.0916 2.75795C10.0319 2.69705 9.96061 2.64864 9.882 2.61555C9.80339 2.58245 9.71897 2.56533 9.63368 2.56519C9.54838 2.56504 9.46391 2.58187 9.38518 2.61469C9.30645 2.64752 9.23504 2.69568 9.17512 2.75638C9.11519 2.81707 9.06794 2.88909 9.03612 2.96823C9.0043 3.04737 8.98855 3.13205 8.98978 3.21733C8.99101 3.30262 9.0092 3.38681 9.0433 3.46499C9.07739 3.54318 9.1267 3.6138 9.18836 3.67274L13.9301 8.35853L2.56757 8.35853C2.39708 8.35853 2.23356 8.42625 2.11301 8.54681C1.99245 8.66737 1.92472 8.83089 1.92472 9.00138C1.92472 9.17188 1.99245 9.33539 2.11301 9.45595C2.23356 9.57651 2.39708 9.64424 2.56757 9.64424L13.9288 9.64424L9.18836 14.3281C9.07025 14.4485 9.00422 14.6106 9.00451 14.7793C9.0048 14.948 9.07139 15.1098 9.18991 15.2299C9.30844 15.3499 9.4694 15.4185 9.63807 15.421C9.80675 15.4234 9.96963 15.3594 10.0916 15.2429L15.8316 9.57224C15.9073 9.4975 15.9673 9.40851 16.0082 9.31041C16.0492 9.21231 16.0703 9.10705 16.0703 9.00074C16.0703 8.89443 16.0492 8.78917 16.0082 8.69107C15.9673 8.59297 15.9073 8.50398 15.8316 8.42924L10.0916 2.75795Z" fill="#2F2F2F"/>
</svg>

                </button>
            </div>
    );
}

export default BlogCard;
