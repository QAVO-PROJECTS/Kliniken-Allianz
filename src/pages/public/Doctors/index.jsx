import "./index.scss";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, SlidersHorizontal, Star, UserRound, X } from "lucide-react";
import { getLocalizedText } from "../../../i18n/getLocalizedText.js";
import DoctorCard from "../../../components/cards/DoctorCard/index.jsx";
import Pagination from "../../../components/ui/Pagination/index.jsx";
import PageHeader from "../../../components/ui/PageHeader/index.jsx";
import { useGetAllClinicQuery, useGetAllDoctorsQuery } from "../../../api/userApi.js";
import CtaBand from "../Clinics/shared/CtaBand.jsx";
import { EmptyState, SkeletonGrid } from "../Clinics/shared/Feedback.jsx";
import { tx } from "../Clinics/shared/texts.js";

const ITEMS_PER_PAGE = 9;
const EXPERIENCE = [1, 2, 3, 4, 5, "5+"];
const RATINGS = [5, 4, 3, 2, 1];
const EMPTY_FILTERS = { experience: [], clinics: [], ratings: [], areas: [] };

function Stars({ value }) {
    return (
        <span className="doctors-page__stars">
            <span aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} strokeWidth={1.75} className={i < value ? "is-on" : ""} />
                ))}
            </span>
            <span className="visually-hidden">{value} / 5</span>
        </span>
    );
}

/** One filter group: heading + per-group reset, options in a labelled role=group. */
function FilterGroup({ id, title, onReset, resetLabel, canReset, children }) {
    const headingId = `${id}-title`;
    return (
        <div className="doctors-filter__group">
            <div className="doctors-filter__group-head">
                <h3 id={headingId}>{title}</h3>
                {canReset && (
                    <button type="button" onClick={onReset} aria-label={`${resetLabel}: ${title}`}>
                        {resetLabel}
                    </button>
                )}
            </div>
            <div className="doctors-filter__options" role="group" aria-labelledby={headingId}>
                {children}
            </div>
        </div>
    );
}

function DoctorsPage() {
    const { t, i18n } = useTranslation();
    const { data: doctorsData, isLoading } = useGetAllDoctorsQuery();
    const { data: clinicsData } = useGetAllClinicQuery();
    const doctors = useMemo(() => doctorsData?.data || [], [doctorsData]);
    const clinics = clinicsData?.data || [];

    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [filterOpen, setFilterOpen] = useState(false);
    const resultsRef = useRef(null);
    const drawerCloseRef = useRef(null);
    const filterBtnRef = useRef(null);

    // Any change to the criteria jumps back to page 1.
    const toggle = (group, val) => {
        setFilters((prev) => ({
            ...prev,
            [group]: prev[group].includes(val) ? prev[group].filter((v) => v !== val) : [...prev[group], val],
        }));
        setCurrentPage(1);
    };
    const resetGroup = (group) => {
        setFilters((prev) => ({ ...prev, [group]: [] }));
        setCurrentPage(1);
    };
    const clearAll = () => {
        setFilters(EMPTY_FILTERS);
        setCurrentPage(1);
    };
    const onSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };
    const changePage = (p) => {
        setCurrentPage(p);
        resultsRef.current?.scrollIntoView({ block: "start" });
    };

    // Drawer: lock page scroll, close on Escape, move focus in and back out.
    useEffect(() => {
        if (!filterOpen) return undefined;
        const trigger = filterBtnRef.current;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        drawerCloseRef.current?.focus();
        const onKey = (e) => e.key === "Escape" && setFilterOpen(false);
        document.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prev;
            document.removeEventListener("keydown", onKey);
            trigger?.focus();
        };
    }, [filterOpen]);

    const lang = i18n.language;
    const areas = useMemo(
        () => [...new Set(doctors.map((d) => getLocalizedText(d, "role")).filter(Boolean))],
        // lang: role names are localized
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [doctors, lang]
    );

    const filteredDoctors = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return doctors.filter((doc) => {
            const exp = Number(doc.experience);
            const expMatch =
                filters.experience.length === 0 ||
                filters.experience.some((v) => (v === "5+" ? exp >= 5 : exp === v));
            const clinicNames = doc.clinics?.map((c) => getLocalizedText(c, "name")) || [];
            const clinicMatch =
                filters.clinics.length === 0 || clinicNames.some((c) => filters.clinics.includes(c));
            const ratingMatch =
                filters.ratings.length === 0 || filters.ratings.includes(Math.round(Number(doc.rate)));
            const areaMatch =
                filters.areas.length === 0 || filters.areas.includes(getLocalizedText(doc, "role"));
            const fullName = `${getLocalizedText(doc, "name")} ${getLocalizedText(doc, "surName")}`.toLowerCase();
            const searchMatch = !q || fullName.includes(q);
            return expMatch && clinicMatch && ratingMatch && areaMatch && searchMatch;
        });
        // lang: names/roles are localized
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [doctors, filters, searchQuery, lang]);

    const totalPages = Math.ceil(filteredDoctors.length / ITEMS_PER_PAGE);
    const page = Math.min(currentPage, Math.max(totalPages, 1));
    const paginatedDoctors = filteredDoctors.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const activeChips = [
        ...filters.experience.map((v) => ({ group: "experience", value: v, label: `${v} ${t("doctorsPage.filters.experienceSuffix")}` })),
        ...filters.clinics.map((v) => ({ group: "clinics", value: v, label: v })),
        ...filters.ratings.map((v) => ({
            group: "ratings",
            value: v,
            label: (
                <>
                    <span className="md-num">{v}</span>
                    <Star size={13} strokeWidth={1.75} className="doctors-page__chip-star" aria-hidden="true" />
                    <span className="visually-hidden">/ 5</span>
                </>
            ),
        })),
        ...filters.areas.map((v) => ({ group: "areas", value: v, label: v })),
    ];

    const resetLabel = t("doctorsPage.filters.reset");

    // Rendered twice (sidebar and drawer); `prefix` keeps ids unique.
    const renderFilters = (prefix) => (
        <>
            <FilterGroup
                id={`${prefix}-exp`}
                title={t("doctorsPage.filters.experience")}
                onReset={() => resetGroup("experience")}
                resetLabel={resetLabel}
                canReset={filters.experience.length > 0}
            >
                <div className="doctors-filter__pills">
                    {EXPERIENCE.map((year) => (
                        <label key={year} className="doctors-filter__pill">
                            <input
                                type="checkbox"
                                name="experience"
                                value={year}
                                checked={filters.experience.includes(year)}
                                onChange={() => toggle("experience", year)}
                            />
                            <span className="md-num">{year}</span>
                        </label>
                    ))}
                </div>
            </FilterGroup>

            {clinics.length > 0 && (
                <FilterGroup
                    id={`${prefix}-clinic`}
                    title={t("doctorsPage.filters.clinics")}
                    onReset={() => resetGroup("clinics")}
                    resetLabel={resetLabel}
                    canReset={filters.clinics.length > 0}
                >
                    <div className="doctors-filter__scroll">
                        {clinics.map((clinic) => {
                            const name = getLocalizedText(clinic, "name");
                            return (
                                <label key={clinic.id} className="doctors-filter__check">
                                    <input
                                        type="checkbox"
                                        name="clinic"
                                        value={name}
                                        checked={filters.clinics.includes(name)}
                                        onChange={() => toggle("clinics", name)}
                                    />
                                    <span>{name}</span>
                                </label>
                            );
                        })}
                    </div>
                </FilterGroup>
            )}

            <FilterGroup
                id={`${prefix}-rating`}
                title={t("doctorsPage.filters.rating")}
                onReset={() => resetGroup("ratings")}
                resetLabel={resetLabel}
                canReset={filters.ratings.length > 0}
            >
                {RATINGS.map((stars) => (
                    <label key={stars} className="doctors-filter__check">
                        <input
                            type="checkbox"
                            name="rating"
                            value={stars}
                            checked={filters.ratings.includes(stars)}
                            onChange={() => toggle("ratings", stars)}
                        />
                        <Stars value={stars} />
                    </label>
                ))}
            </FilterGroup>

            {areas.length > 0 && (
                <FilterGroup
                    id={`${prefix}-area`}
                    title={t("doctorsPage.filters.area")}
                    onReset={() => resetGroup("areas")}
                    resetLabel={resetLabel}
                    canReset={filters.areas.length > 0}
                >
                    <div className="doctors-filter__scroll">
                        {areas.map((role) => (
                            <label key={role} className="doctors-filter__check">
                                <input
                                    type="checkbox"
                                    name="area"
                                    value={role}
                                    checked={filters.areas.includes(role)}
                                    onChange={() => toggle("areas", role)}
                                />
                                <span>{role}</span>
                            </label>
                        ))}
                    </div>
                </FilterGroup>
            )}
        </>
    );

    return (
        <div className="doctors-page">
            <PageHeader
                title={t("doctorsPage.title")}
                subtitle={t("doctorsPage.header.desc")}
                crumbs={[{ label: t("doctorsPage.breadcrumbDoctors") }]}
            >
                <label className="search-field">
                    <span className="visually-hidden">{t("navbar.search")}</span>
                    <input
                        type="search"
                        name="q"
                        autoComplete="off"
                        enterKeyHint="search"
                        placeholder={t("doctorsPage.searchPlaceholder")}
                        value={searchQuery}
                        onChange={onSearch}
                    />
                    <Search size={20} strokeWidth={1.75} aria-hidden="true" />
                </label>
            </PageHeader>

            <section className="md-section md-section--flush-top">
                <div className="container doctors-page__layout">
                    <aside className="doctors-filter" aria-labelledby="doctors-filter-title">
                        <div className="doctors-filter__head">
                            <h2 id="doctors-filter-title">{t("doctorsPage.filters.title")}</h2>
                            {activeChips.length > 0 && (
                                <button type="button" className="md-chip md-chip--ghost" onClick={clearAll}>
                                    {t("doctorsPage.filters.mobileClear")}
                                </button>
                            )}
                        </div>
                        {renderFilters("side")}
                    </aside>

                    <div className="doctors-page__results" ref={resultsRef}>
                        <div className="md-toolbar">
                            <p className="md-toolbar__count" aria-live="polite">
                                {!isLoading && tx(t, "medicalPages.results", { n: filteredDoctors.length })}
                            </p>
                            <button
                                ref={filterBtnRef}
                                type="button"
                                className="btn btn--secondary btn--sm doctors-page__filter-btn"
                                onClick={() => setFilterOpen(true)}
                                aria-haspopup="dialog"
                                aria-expanded={filterOpen}
                            >
                                <SlidersHorizontal size={16} strokeWidth={1.75} aria-hidden="true" />
                                {t("doctorsPage.filters.mobileFilter")}
                                {activeChips.length > 0 && <span className="doctors-page__count md-num">{activeChips.length}</span>}
                            </button>
                        </div>

                        {activeChips.length > 0 && (
                            <ul className="md-chips doctors-page__chips" aria-label={tx(t, "medicalPages.activeFilters")}>
                                {activeChips.map((chip) => (
                                    <li key={`${chip.group}-${chip.value}`}>
                                        <button type="button" className="md-chip" onClick={() => toggle(chip.group, chip.value)}>
                                            {chip.label}
                                            <X size={14} strokeWidth={1.75} aria-hidden="true" />
                                        </button>
                                    </li>
                                ))}
                                <li>
                                    <button type="button" className="md-chip md-chip--ghost" onClick={clearAll}>
                                        {t("doctorsPage.filters.mobileClear")}
                                    </button>
                                </li>
                            </ul>
                        )}

                        {isLoading ? (
                            <SkeletonGrid count={6} ratio="4 / 5" className="md-grid--sm" />
                        ) : paginatedDoctors.length > 0 ? (
                            <>
                                <div className="md-grid md-grid--sm">
                                    {paginatedDoctors.map((item, i) => (
                                        <div key={item.id} className="md-grid__item" data-reveal style={{ "--reveal-delay": `${(i % 3) * 60}ms` }}>
                                            <DoctorCard item={item} bare />
                                        </div>
                                    ))}
                                </div>
                                {totalPages > 1 && (
                                    <div className="md-pagination">
                                        <Pagination currentPage={page} totalPages={totalPages} onPageChange={changePage} align="center" />
                                    </div>
                                )}
                            </>
                        ) : (
                            <EmptyState icon={UserRound} title={t("doctorsPage.noDoctors")}>
                                {(activeChips.length > 0 || searchQuery) && (
                                    <button
                                        type="button"
                                        className="btn btn--secondary btn--sm"
                                        onClick={() => {
                                            clearAll();
                                            setSearchQuery("");
                                        }}
                                    >
                                        {t("doctorsPage.filters.mobileClear")}
                                    </button>
                                )}
                            </EmptyState>
                        )}
                    </div>
                </div>
            </section>

            {/* Mobile filter drawer (bottom sheet) */}
            <div className={`doctors-drawer${filterOpen ? " is-open" : ""}`} inert={!filterOpen}>
                {/* Backdrop click is a pointer shortcut; Escape and the close button cover keyboard users. */}
                <div className="doctors-drawer__backdrop" onClick={() => setFilterOpen(false)} aria-hidden="true" />
                <div className="doctors-drawer__panel" role="dialog" aria-modal="true" aria-labelledby="doctors-drawer-title">
                    <div className="doctors-drawer__head">
                        <h2 id="doctors-drawer-title">
                            {t("doctorsPage.filters.title")}
                            {activeChips.length > 0 && <span className="md-num"> ({activeChips.length})</span>}
                        </h2>
                        <button
                            ref={drawerCloseRef}
                            type="button"
                            className="doctors-drawer__close"
                            onClick={() => setFilterOpen(false)}
                            aria-label={t("gallery.close")}
                        >
                            <X size={20} strokeWidth={1.75} aria-hidden="true" />
                        </button>
                    </div>
                    <div className="doctors-drawer__body">{filterOpen && renderFilters("drawer")}</div>
                    <div className="doctors-drawer__foot">
                        <button type="button" className="btn btn--secondary" onClick={clearAll}>
                            {t("doctorsPage.filters.mobileClear")}
                        </button>
                        <button type="button" className="btn btn--primary" onClick={() => setFilterOpen(false)}>
                            {t("doctorsPage.filters.mobileApply")}
                        </button>
                    </div>
                </div>
            </div>

            <CtaBand />
        </div>
    );
}

export default DoctorsPage;
