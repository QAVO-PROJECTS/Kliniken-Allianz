import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../Pagination/index.scss";
import { getPageRange } from "../Pagination/pageRange.js";

/**
 * Compact prev / pages / next pagination.
 * Props: currentPage, totalPages, onPageChange, [align="center"], [className]
 */
function NumberedPagination({ currentPage, totalPages, onPageChange, align = "center", className = "" }) {
    const { t } = useTranslation();
    if (!totalPages || totalPages <= 1) return null;

    const go = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) onPageChange(page);
    };

    return (
        <nav
            className={`pager pager--${align} pagination-container ${className}`.trim()}
            aria-label={t("pagination.label", "Pagination")}
        >
            <button
                type="button"
                className="pager__btn pager__btn--nav"
                onClick={() => go(currentPage - 1)}
                disabled={currentPage <= 1}
                aria-label={t("pagination.prev", "Previous")}
            >
                <ChevronLeft size={18} strokeWidth={1.75} aria-hidden="true" />
            </button>
            {getPageRange(currentPage, totalPages).map((page) =>
                typeof page === "string" ? (
                    <span key={page} className="pager__dots" aria-hidden="true">…</span>
                ) : (
                    <button
                        key={page}
                        type="button"
                        className={`pager__btn${currentPage === page ? " is-active active" : ""}`}
                        aria-current={currentPage === page ? "page" : undefined}
                        aria-label={`${t("pagination.page", "Page")} ${page}`}
                        onClick={() => go(page)}
                    >
                        {page}
                    </button>
                ),
            )}
            <button
                type="button"
                className="pager__btn pager__btn--nav"
                onClick={() => go(currentPage + 1)}
                disabled={currentPage >= totalPages}
                aria-label={t("pagination.next", "Next")}
            >
                <ChevronRight size={18} strokeWidth={1.75} aria-hidden="true" />
            </button>
        </nav>
    );
}

export default NumberedPagination;
