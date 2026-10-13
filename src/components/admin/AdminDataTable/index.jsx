import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, SearchX, Search } from "lucide-react";
import EmptyState from "../EmptyState/index.jsx";
import { useAdminT } from "../shared/adminStrings.js";

const pageList = (current, total) => {
    const pages = [];
    for (let i = 1; i <= total; i++) {
        if (i === 1 || i === total || Math.abs(i - current) <= 1) pages.push(i);
        else if (pages[pages.length - 1] !== "gap") pages.push("gap");
    }
    return pages;
};

/**
 * Admin data table: toolbar (count + search), sticky-header table, empty and
 * loading states, and client-side pagination.
 *
 * @param {{key: string, header: import('react').ReactNode, render: (row: any) => import('react').ReactNode, className?: string}[]} columns
 * @param {any[]} rows full list (already filtered by the caller if needed)
 * @param {(row: any) => string} [searchText] enables the search box; returns the searchable text of a row
 * @param {import('react').ReactNode} [toolbarEnd] extra controls next to the search box
 */
function AdminDataTable({
    columns,
    rows,
    rowKey = (row) => row.id,
    loading = false,
    searchText,
    toolbarEnd,
    title,
    pageSize = 9,
    emptyTitle,
    emptyText,
    emptyIcon,
    caption,
}) {
    const at = useAdminT();
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        const list = Array.isArray(rows) ? rows : [];
        const q = query.trim().toLocaleLowerCase();
        if (!q || !searchText) return list;
        return list.filter((row) => String(searchText(row) ?? "").toLocaleLowerCase().includes(q));
    }, [rows, query, searchText]);

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const current = Math.min(page, totalPages);
    const start = (current - 1) * pageSize;
    const visible = filtered.slice(start, start + pageSize);
    const isSearching = query.trim() !== "";

    return (
        <section className="adm-card adm-table-card">
            <div className="adm-toolbar">
                <span className="adm-toolbar__count">
                    {title}
                    <span className="badge badge--brand">{loading ? "…" : total}</span>
                    {!title && <span className="text-muted">{at("items")}</span>}
                </span>
                <div className="adm-toolbar__end">
                    {toolbarEnd}
                    {searchText && (
                        <label className="adm-search">
                            <Search size={16} aria-hidden="true" />
                            <span className="visually-hidden">{at("search")}</span>
                            <input
                                type="search"
                                name="search"
                                autoComplete="off"
                                value={query}
                                placeholder={at("search")}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setPage(1);
                                }}
                            />
                        </label>
                    )}
                </div>
            </div>

            <div className="adm-table-wrap">
                <table className="adm-table">
                    {caption && <caption className="visually-hidden">{caption}</caption>}
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th key={col.key} scope="col" className={col.className}>{col.header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading
                            ? Array.from({ length: 5 }, (_, i) => (
                                <tr key={`sk-${i}`} aria-hidden="true">
                                    {columns.map((col) => (
                                        <td key={col.key} className={col.className}>
                                            <span className={`adm-skeleton${col.className?.includes("is-thumb") ? " adm-skeleton--thumb" : ""}`} />
                                        </td>
                                    ))}
                                </tr>
                            ))
                            : visible.map((row, i) => (
                                <tr key={rowKey(row) ?? `row-${start + i}`}>
                                    {columns.map((col) => (
                                        <td key={col.key} className={col.className}>{col.render(row, start + i)}</td>
                                    ))}
                                </tr>
                            ))}
                    </tbody>
                </table>
                {!loading && total === 0 && (
                    isSearching ? (
                        <EmptyState icon={SearchX} title={at("noResults")} description={at("noResultsHint")} />
                    ) : (
                        <EmptyState icon={emptyIcon} title={emptyTitle || at("noData")} description={emptyText ?? at("noDataHint")} />
                    )
                )}
            </div>

            {!loading && total > 0 && (
                <footer className="adm-table-footer">
                    <span>{at("showing", { from: start + 1, to: Math.min(start + pageSize, total), total })}</span>
                    {totalPages > 1 && (
                        <nav className="adm-pager" aria-label="Pagination">
                            <button
                                type="button"
                                className="adm-pager__btn"
                                onClick={() => setPage(current - 1)}
                                disabled={current === 1}
                                aria-label={at("prevPage")}
                            >
                                <ChevronLeft size={16} aria-hidden="true" />
                            </button>
                            {pageList(current, totalPages).map((p, i) =>
                                p === "gap" ? (
                                    <span key={`gap-${i}`} className="adm-pager__gap">…</span>
                                ) : (
                                    <button
                                        key={p}
                                        type="button"
                                        className="adm-pager__btn"
                                        onClick={() => setPage(p)}
                                        aria-current={p === current ? "page" : undefined}
                                        aria-label={at("page", { page: p })}
                                    >
                                        {p}
                                    </button>
                                ),
                            )}
                            <button
                                type="button"
                                className="adm-pager__btn"
                                onClick={() => setPage(current + 1)}
                                disabled={current === totalPages}
                                aria-label={at("nextPage")}
                            >
                                <ChevronRight size={16} aria-hidden="true" />
                            </button>
                        </nav>
                    )}
                </footer>
            )}
        </section>
    );
}

export default AdminDataTable;
