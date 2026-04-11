import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { NEWSPAPER_IMAGES } from "../../../contants.js";
import HorizontalBlogCard from "../../../components/UserComponents/HorizontalBlogCard/index.jsx";
import "./oldBlog.scss";
import AOS from "aos";
import "aos/dist/aos.css";
import { getLocalizedText } from "../../../utils/getLocalizedText.js";
import Logo from "../../../assets/Logo.png";

function OldBlog({ featuredBlog, horizontalBlogs }) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [mainImgError, setMainImgError] = useState(false);

    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    const featuredTitle = getLocalizedText(featuredBlog, 'title');
    const featuredSubtitle = getLocalizedText(featuredBlog, 'subtitle');

    return (
        <div className="oldBlog" data-aos="fade-up">
            <div className="container" data-aos="fade-in">
                <div className="title" data-aos="fade-right">
                    <div />
                    <h2>{t("blogs.featured", "Önə Çıxanlar")}</h2>
                </div>
                <div className="row">
                    {featuredBlog && (
                        <div className="col-35 col-md-60 col-sm-60 col-xs-60" data-aos="flip-left">
                            <div
                                className={`image-main ${mainImgError ? 'has-placeholder' : ''}`}
                                style={{
                                    backgroundImage: mainImgError ? `none` : `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%), url("${NEWSPAPER_IMAGES + (featuredBlog?.newsPaperImages?.[0] || featuredBlog?.newspaperImages?.[0])}")`,
                                    backgroundColor: mainImgError ? '#f8f9fa' : 'transparent',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: mainImgError ? 'contain' : 'cover',
                                    backgroundPosition: 'center',
                                }}
                                data-aos="fade-up"
                                onClick={() => navigate(`/blogs/${featuredBlog.id}`)}>
                                {mainImgError && <img src={Logo} alt="Placeholder" className="center-placeholder" />}
                                <div className="text-overlay" data-aos="fade-right">
                                    <div className="date">{featuredBlog.createDate?.split("T")[0]}</div>
                                    <h2>{featuredTitle}</h2>
                                    <p>{featuredSubtitle?.slice(0, 150)}...</p>
                                </div>
                                {/* Hidden img to trigger onError */}
                                <img 
                                    src={NEWSPAPER_IMAGES + (featuredBlog?.newsPaperImages?.[0] || featuredBlog?.newspaperImages?.[0])}
                                    style={{ display: 'none' }}
                                    onError={() => setMainImgError(true)}
                                    alt=""
                                />
                            </div>
                        </div>
                    )}
                    <div className="col-25 col-md-60 col-sm-60 col-xs-60" data-aos="fade-right">
                        <div className="side-blogs-container">
                            <div className="cards-list">
                                {horizontalBlogs.map(blog => (
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
