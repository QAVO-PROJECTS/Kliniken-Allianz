import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { NEWSPAPER_IMAGES } from "../../../contants.js";
import "./index.scss";
import { useTranslation } from "react-i18next";
import { GoArrowRight } from "react-icons/go";
import { getLocalizedText } from "../../../utils/getLocalizedText.js";
import Logo from "../../../assets/Logo.png";

function BlogCard({ blog, index }) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [imgError, setImgError] = useState(false);

    const title = getLocalizedText(blog, 'title');
    const subtitle = getLocalizedText(blog, 'subtitle');

    return (
        <div className="blog-card" data-aos="fade-up">
            <div className="image" onClick={() => navigate(`/blogs/${blog?.id}`)}>
                <img 
                    src={imgError ? Logo : NEWSPAPER_IMAGES + (blog?.newsPaperImages?.[0] || blog?.newspaperImages?.[0])} 
                    alt={title}
                    onError={() => setImgError(true)}
                    className={imgError ? 'placeholder-img' : ''}
                />
            </div>
            <div className={`date`}>{blog?.createDate?.split("T")[0]}</div>
            <h5 onClick={() => navigate(`/blogs/${blog?.id}`)}>{title}</h5>
            <p>{subtitle?.slice(0, 100)}...</p>
            <button onClick={() => navigate(`/blogs/${blog?.id}`)}>
                {t("blogs.readMore", "Ətraflı oxu")} <GoArrowRight className="icon" />
            </button>
        </div>
    );
}

export default BlogCard;
