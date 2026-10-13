import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../Pagination/index.scss";
import "./pagination.scss";
import { getPageRange } from "../Pagination/pageRange.js";

/**
 * Blog list pagination: labelled prev / next on the sides, pages in the middle.
 * Props: currentPage, totalPosts, postsPerPage, onPageChange
 */
function BlogPagination({ currentPage, totalPosts, postsPerPage, onPageChange }) {
    const { t } = useTranslation();
    const totalPages = Math.max(1, Math.ceil(totalPosts / postsPerPage));
    if (totalPages <= 1) return null;

    const go = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) onPageChange(page);
    };

    return (
        <nav className="pager pager--center blog-pagination" aria-label={t("pagination.label", "Pagination")}>
            <button
                type="button"
                className="pager__btn pager__btn--labeled blog-pagination__button prev"
                onClick={() => go(currentPage - 1)}
                disabled={currentPage <= 1}
                aria-label={t("pagination.prev", "Əvvələ")}
            >
                <ArrowLeft size={18} strokeWidth={2} aria-hidden="true" />
                <span className="pager__label">{t("pagination.prev", "Əvvələ")}</span>
            </button>

            <ul className="pager__list">
                {getPageRange(currentPage, totalPages).map((page) => (
                    <li key={page}>
                        {typeof page === "string" ? (
                            <span className="pager__dots" aria-hidden="true">…</span>
                        ) : (
                            <button
                                type="button"
                                className={`pager__btn${page === currentPage ? " is-active active" : ""}`}
                                aria-current={page === currentPage ? "page" : undefined}
                                aria-label={`${t("pagination.page", "Page")} ${page}`}
                                onClick={() => go(page)}
                            >
                                {page}
                            </button>
                        )}
                    </li>
                ))}
            </ul>

            <button
                type="button"
                className="pager__btn pager__btn--labeled blog-pagination__button next"
                onClick={() => go(currentPage + 1)}
                disabled={currentPage >= totalPages}
                aria-label={t("pagination.next", "Sonra")}
            >
                <span className="pager__label">{t("pagination.next", "Sonra")}</span>
                <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
            </button>
        </nav>
    );
}

export default BlogPagination;
