import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { NEWSPAPER_IMAGES } from "../../../contants.js";
import "./newBlog.scss";
import { FaArrowRightLong } from "react-icons/fa6";
import AOS from "aos";
import "aos/dist/aos.css";
import { getLocalizedText } from "../../../utils/getLocalizedText.js";
import Logo from "../../../assets/Logo.png";

function NewBlog({ latestBlog }) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    if (!latestBlog) return null;

    const title = getLocalizedText(latestBlog, 'title');
    const subtitle = getLocalizedText(latestBlog, 'subtitle');

    return (
        <div className="newBlog" data-aos="fade-up">
            <div className="container" data-aos="fade-in">
                <div className="title" data-aos="fade-right">
                    <div />
                    <h2>{t("blogs.new", "Ən Yeni")}</h2>
                </div>
                {latestBlog ? (
                    <div className="row" data-aos="fade-up">
                        <div className="col-30 col-md-60 col-sm-60 col-xs-60" data-aos="flip-left">
                            <div className="image-container" onClick={() => navigate(`/blogs/${latestBlog.id}`)}>
                                <img 
                                    src={imgError ? Logo : NEWSPAPER_IMAGES + (latestBlog.newsPaperImages?.[0] || latestBlog.newspaperImages?.[0])} 
                                    alt={title} 
                                    onError={() => setImgError(true)}
                                    className={imgError ? 'placeholder-img' : ''}
                                />
                            </div>
                        </div>
                        <div className="col-30 col-md-60 col-sm-60 col-xs-60" data-aos="flip-right">
                            <div className="text">
                                <div className="date" data-aos="fade-up">
                                    {latestBlog.createDate?.split("T")[0]}
                                </div>
                                <h1 data-aos="fade-up" onClick={() => navigate(`/blogs/${latestBlog.id}`)}>
                                    {title}
                                </h1>
                                <p data-aos="fade-up">
                                    {subtitle?.slice(0, 200)}...
                                </p>
                                <div 
                                    className="read-more-btn"
                                    data-aos="fade-up"
                                    onClick={() => navigate(`/blogs/${latestBlog.id}`)}>
                                    {t("blogs.readMore", "Ətraflı oxu")} <FaArrowRightLong />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default NewBlog;
