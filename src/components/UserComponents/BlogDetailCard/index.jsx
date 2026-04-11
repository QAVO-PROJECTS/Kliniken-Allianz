import React from 'react';
import './index.scss';
import { FiArrowUpRight } from "react-icons/fi";
import { NEWSPAPER_IMAGES } from "../../../contants.js";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getLocalizedText } from "../../../utils/getLocalizedText.js";
import Logo from "../../../assets/Logo.png";
import defaultBlogImg from "../../../assets/doktor.jpg";

function BlogDetailCard({ blog }) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [imgError, setImgError] = React.useState(false);

    const title = getLocalizedText(blog, 'title');
    const subtitle = getLocalizedText(blog, 'subtitle');

    return (
        <div className={"col-20 col-md-30 col-sm-60 col-xs-60"}>
            <div className={"blog-detail-card-premium"}>
                <div className="image-stack">
                    <div className="bg-image">
                        <img 
                            src={imgError || !(blog?.newsPaperImages?.[0] || blog?.newspaperImages?.[0]) ? defaultBlogImg : NEWSPAPER_IMAGES + (blog?.newsPaperImages?.[0] || blog?.newspaperImages?.[0])} 
                            alt={title} 
                            onError={() => setImgError(true)}
                        />
                    </div>
                    <div className="dots-pattern">
                        {[...Array(25)].map((_, i) => <div key={i} className="dot" />)}
                    </div>
                    <div className="fg-image">
                        <img 
                            src={imgError || !(blog?.newsPaperImages?.[1] || blog?.newspaperImages?.[1]) ? (imgError || !(blog?.newsPaperImages?.[0] || blog?.newspaperImages?.[0]) ? defaultBlogImg : defaultBlogImg) : NEWSPAPER_IMAGES + (blog?.newsPaperImages?.[1] || blog?.newspaperImages?.[1])} 
                            alt={title} 
                            onError={() => setImgError(true)}
                        />
                    </div>
                </div>
                <div className={"detail-card-content"}>
                    <h5>{title}</h5>
                    <p>{subtitle?.slice(0, 150)}...</p>
                    <div className="btn-container">
                        <button onClick={() => navigate(`/blogs/${blog?.id}`)}>
                            {t("blogDetailCard.button", "Dahasına bax")} <FiArrowUpRight className={"iconn"} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogDetailCard;
