import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./index.scss";
import { getPageRange } from "./pageRange.js";

/**
 * Pill pagination with first / prev / pages / next / last.
 * Props: currentPage, totalPages, onPageChange, [align="end"|"center"|"start"], [className]
 */
function Pagination({ currentPage, totalPages, onPageChange, align = "end", className = "" }) {
    const { t } = useTranslation();
    if (!totalPages || totalPages <= 1) return null;

    const go = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) onPageChange(page);
    };
    const atStart = currentPage <= 1;
    const atEnd = currentPage >= totalPages;

    return (
        <nav
            className={`pager pager--${align} custom-paginationn ${className}`.trim()}
            aria-label={t("pagination.label", "Pagination")}
        >
            <button type="button" className="pager__btn pager__btn--nav" disabled={atStart} onClick={() => go(1)} aria-label={t("pagination.first", "First page")}>
                <ChevronsLeft size={18} strokeWidth={1.75} aria-hidden="true" />
            </button>
            <button type="button" className="pager__btn pager__btn--nav" disabled={atStart} onClick={() => go(currentPage - 1)} aria-label={t("pagination.prev", "Previous")}>
                <ChevronLeft size={18} strokeWidth={1.75} aria-hidden="true" />
            </button>

            {getPageRange(currentPage, totalPages).map((page) =>
                typeof page === "string" ? (
                    <span key={page} className="pager__dots" aria-hidden="true">…</span>
                ) : (
                    <button
                        key={page}
                        type="button"
                        className={`pager__btn${page === currentPage ? " is-active active" : ""}`}
                        aria-current={page === currentPage ? "page" : undefined}
                        aria-label={`${t("pagination.page", "Page")} ${page}`}
                        onClick={() => go(page)}
                    >
                        {page}
                    </button>
                ),
            )}

            <button type="button" className="pager__btn pager__btn--nav" disabled={atEnd} onClick={() => go(currentPage + 1)} aria-label={t("pagination.next", "Next")}>
                <ChevronRight size={18} strokeWidth={1.75} aria-hidden="true" />
            </button>
            <button type="button" className="pager__btn pager__btn--nav" disabled={atEnd} onClick={() => go(totalPages)} aria-label={t("pagination.last", "Last page")}>
                <ChevronsRight size={18} strokeWidth={1.75} aria-hidden="true" />
            </button>
        </nav>
    );
}

export default Pagination;
