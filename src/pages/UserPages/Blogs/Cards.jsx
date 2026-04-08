import React, { useState, useEffect } from 'react';
import "./cards.scss";
import BlogCard from "../../../components/UserComponents/BlogCard/index.jsx";
import BlogPagination from "../../../components/UserComponents/BlogPagination/index.jsx";
import { useGetAllNewspaperQuery } from "../../../services/userApi.jsx";
import { useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";

function Cards() {
    const { data: getAllNewspapers } = useGetAllNewspaperQuery();
    const blogs = getAllNewspapers?.data || [];

    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 4;

    // Hal-hazırki səhifəyə uyğun bloglar
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = blogs.slice(indexOfFirstPost, indexOfLastPost);

    const { t } = useTranslation();

    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    return (
        <div style={{ paddingBottom: "120px" }} data-aos="fade-up">
            <div className="container" data-aos="fade-in">
                <div className="row gy-5" style={{ margin: "60px auto" }} data-aos="zoom-in">
                    <div className="row" style={{ margin: "0 auto", width: "100%" }}>
                        {currentPosts.map((blog, index) => (
                            <div key={blog?.id} className="col-15 col-md-30 col-sm-60">
                                <BlogCard index={index} blog={blog} data-aos="flip-up" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pagination - həm mobil həm desktop */}
                <div style={{ justifyContent: 'center', marginTop: "40px", display: 'flex' }} data-aos="fade-up">
                    <BlogPagination
                        currentPage={currentPage}
                        totalPosts={blogs.length}
                        postsPerPage={postsPerPage}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </div>
            </div>
        </div>
    );
}

export default Cards;
