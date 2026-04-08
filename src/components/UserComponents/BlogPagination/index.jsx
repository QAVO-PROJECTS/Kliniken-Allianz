import React from 'react';
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import './pagination.scss';
import { useTranslation } from 'react-i18next';

function BlogPagination({ currentPage, totalPosts, postsPerPage, onPageChange }) {
    const { t } = useTranslation();

    const totalPages = Math.max(1, Math.ceil(totalPosts / postsPerPage));

    // Bütün səhifə nömrələrini hazırlayırıq
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    // Dinamik ellipsis əlavə etmək üçün səhifə nömrələrini göstəririk
    let pageNumbersToDisplay = [];
    if (totalPages <= 7) {
        pageNumbersToDisplay = pages;
    } else {
        if (currentPage <= 4) {
            pageNumbersToDisplay = [1, 2, 3, 4, 5, '...', totalPages];
        } else if (currentPage >= totalPages - 3) {
            pageNumbersToDisplay = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        } else {
            pageNumbersToDisplay = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
        }
    }

    // Keçid funksiyaları
    const handlePrev = (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePageClick = (e, page) => {
        e.preventDefault();
        onPageChange(page);
    };

    return (
        <div className="blog-pagination">
            <a
                href="#"
                className={`blog-pagination__button prev ${currentPage === 1 ? 'disabled' : ''}`}
                onClick={handlePrev}
            >
                <FiArrowLeft /> {t("pagination.prev", "Əvvələ")}
            </a>

            <ul className="blog-pagination__list">
                {pageNumbersToDisplay.map((page, index) => {
                    if (page === '...') {
                        return (
                            <li key={index}>
                                <span className="blog-pagination__dots">...</span>
                            </li>
                        );
                    }
                    return (
                        <li key={page}>
                            <a
                                href="#"
                                className={`blog-pagination__link ${page === currentPage ? 'active' : ''}`}
                                onClick={(e) => handlePageClick(e, page)}
                            >
                                {page}
                            </a>
                        </li>
                    );
                })}
            </ul>

            <a
                href="#"
                className={`blog-pagination__button next ${currentPage === totalPages ? 'disabled' : ''}`}
                onClick={handleNext}
            >
                {t("pagination.next", "Sonra")} <FiArrowRight />
            </a>
        </div>
    );
}

export default BlogPagination;
