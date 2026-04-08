import React from 'react';
import "./index.scss";
import { MdOutlineWatchLater } from "react-icons/md";
import { NEWSPAPER_IMAGES } from "../../../contants.js";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function HorizontalBlogCard({ blog }) {
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const language = i18n.language;

    // Cari dili nəzərə alaraq title seçirik (Horizontal cardda adətən title göstərilir)
    let title = blog?.title;
    if (language === "en" && blog?.titleEng) {
        title = blog?.titleEng;
    } else if (language === "ru" && blog?.titleRu) {
        title = blog?.titleRu;
    } else if (language === "de" && blog?.titleAlm) {
        title = blog?.titleAlm;
    } else if (language === "ar" && blog?.titleArab) {
        title = blog?.titleArab;
    }

    return (
        <div className="blogs-card" onClick={() => navigate(`/blogs/${blog.id}`)}>
            <div className="blogsimage">
                <img src={NEWSPAPER_IMAGES + (blog.newsPaperImages?.[0] || blog.newspaperImages?.[0])} alt={title} />
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
