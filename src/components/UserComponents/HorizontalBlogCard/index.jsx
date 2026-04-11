import React, { useState } from 'react';
import "./index.scss";
import { MdOutlineWatchLater } from "react-icons/md";
import { NEWSPAPER_IMAGES } from "../../../contants.js";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getLocalizedText } from "../../../utils/getLocalizedText.js";
import Logo from "../../../assets/Logo.png";

function HorizontalBlogCard({ blog }) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [imgError, setImgError] = useState(false);

    const title = getLocalizedText(blog, 'title');

    return (
        <div className="blogs-card" onClick={() => navigate(`/blogs/${blog.id}`)}>
            <div className="blogsimage">
                <img 
                    src={imgError ? Logo : NEWSPAPER_IMAGES + (blog.newsPaperImages?.[0] || blog.newspaperImages?.[0])} 
                    alt={title} 
                    onError={() => setImgError(true)}
                    className={imgError ? 'placeholder-img' : ''}
                />
            </div>
            <div className="content">
                <h6>{title}</h6>
                <p>
                    <MdOutlineWatchLater /> {blog?.createDate?.split("T")[0]}
                </p>
            </div>
        </div>
    );
}

export default HorizontalBlogCard;
