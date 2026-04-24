import React from 'react';
import NewBlog from "./NewBlog.jsx";
import OldBlog from "./OldBlog.jsx";
import Cards from "./Cards.jsx";
import ScrollToTop from "../../../components/ScrollToTop/index.jsx";
import { useGetAllNewspaperQuery } from "../../../services/userApi.jsx";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import banner from "/src/assets/AboutBanner.png";
import mobileBanner from "../../../assets/MobileBanner.png";
import "./blogs.scss";

function Blogs() {
    const { t } = useTranslation();
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const { data: getAllNewspapers, isLoading } = useGetAllNewspaperQuery();
    
    const blogs = [...(getAllNewspapers?.data || [])].sort(
        (a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
    );

    if (isLoading) return null;

    const latestBlog = blogs.length > 0 ? blogs[0] : null;
    const featuredBlog = blogs.length > 1 ? blogs[1] : null;
    const horizontalBlogs = blogs.slice(2, 7);
    const paginatedBlogs = blogs.slice(6);

    return (
        <div id="blogs-page">
            <ScrollToTop/>
            
            <div className="container">
                <div className="head">
                    <h1>{t("navbar.blog")}</h1>
                    <p data-aos="fade-up" data-aos-delay="100">
                        <Link to="/">{t("contact.breadcrumb.home")}</Link>
                        <div className="dot">•</div>
                        <span>{t("navbar.blog")}</span>
                    </p>
                </div>
            </div>

            <div className="bannerAbout">
                <img
                    src={isMobile ? mobileBanner : banner}
                    alt="Banner"
                />
            </div>

            <NewBlog latestBlog={latestBlog} />
            <OldBlog featuredBlog={featuredBlog} horizontalBlogs={horizontalBlogs} allBlogsCount={blogs.length} />
            <Cards paginatedBlogs={paginatedBlogs} totalBlogs={blogs.length} />
        </div>
    );
}

export default Blogs;
