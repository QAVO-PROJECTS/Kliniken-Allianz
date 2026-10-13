import "./index.scss";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Briefcase, Building2, GraduationCap, Search, SlidersHorizontal, Star, UserRound, X } from "lucide-react";
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
        <span className="doctors-page__stars" aria-label={`${value}/5`}>
            {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} strokeWidth={1.75} className={i < value ? "is-on" : ""} aria-hidden="true" />
            ))}
        </span>
    );
}

function FilterGroup({ icon: Icon, title, onReset, resetLabel, children }) {
    return (
        <fieldset className="doctors-filter__group">
            <div className="doctors-filter__group-head">
                <legend>
                    <Icon size={16} aria-hidden="true" /> {title}
                </legend>
                <button type="button" onClick={onReset}>{resetLabel}</button>
            </div>
            <div className="doctors-filter__options">{children}</div>
        </fieldset>
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

    useEffect(() => {
        if (!filterOpen) return undefined;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e) => e.key === "Escape" && setFilterOpen(false);
        document.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prev;
            document.removeEventListener("keydown", onKey);
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
        ...filters.ratings.map((v) => ({ group: "ratings", value: v, label: `${v} ★` })),
        ...filters.areas.map((v) => ({ group: "areas", value: v, label: v })),
    ];

    const resetLabel = t("doctorsPage.filters.reset");
    const filterPanel = (
        <>
            <FilterGroup icon={Briefcase} title={t("doctorsPage.filters.experience")} onReset={() => resetGroup("experience")} resetLabel={resetLabel}>
                <div className="doctors-filter__pills">
                    {EXPERIENCE.map((year) => (
                        <label key={year} className="doctors-filter__pill">
                            <input
                                type="checkbox"
                                checked={filters.experience.includes(year)}
                                onChange={() => toggle("experience", year)}
                            />
                            <span>{year}</span>
                        </label>
                    ))}
                </div>
            </FilterGroup>

            {clinics.length > 0 && (
                <FilterGroup icon={Building2} title={t("doctorsPage.filters.clinics")} onReset={() => resetGroup("clinics")} resetLabel={resetLabel}>
                    <div className="doctors-filter__scroll">
                        {clinics.map((clinic) => {
                            const name = getLocalizedText(clinic, "name");
                            return (
                                <label key={clinic.id} className="doctors-filter__check">
                                    <input
                                        type="checkbox"
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

            <FilterGroup icon={Star} title={t("doctorsPage.filters.rating")} onReset={() => resetGroup("ratings")} resetLabel={resetLabel}>
                {RATINGS.map((stars) => (
                    <label key={stars} className="doctors-filter__check">
                        <input
                            type="checkbox"
                            checked={filters.ratings.includes(stars)}
                            onChange={() => toggle("ratings", stars)}
                        />
                        <Stars value={stars} />
                    </label>
                ))}
            </FilterGroup>

            {areas.length > 0 && (
                <FilterGroup icon={GraduationCap} title={t("doctorsPage.filters.area")} onReset={() => resetGroup("areas")} resetLabel={resetLabel}>
                    <div className="doctors-filter__scroll">
                        {areas.map((role) => (
                            <label key={role} className="doctors-filter__check">
                                <input
                                    type="checkbox"
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
                        placeholder={t("doctorsPage.searchPlaceholder")}
                        value={searchQuery}
                        onChange={onSearch}
                    />
                    <Search size={20} aria-hidden="true" />
                </label>
            </PageHeader>

            <section className="md-section">
                <div className="container doctors-page__layout">
                    <aside className="doctors-filter" aria-label={t("doctorsPage.filters.title")}>
                        <div className="doctors-filter__head">
                            <h2>{t("doctorsPage.filters.title")}</h2>
                            {activeChips.length > 0 && (
                                <button type="button" className="md-chip md-chip--ghost" onClick={clearAll}>
                                    {t("doctorsPage.filters.mobileClear")}
                                </button>
                            )}
                        </div>
                        {filterPanel}
                    </aside>

                    <div className="doctors-page__results">
                        <div className="md-toolbar">
                            <span className="md-toolbar__count">
                                {!isLoading && tx(t, "medicalPages.results", { n: filteredDoctors.length })}
                            </span>
                            <button type="button" className="btn btn--secondary btn--sm doctors-page__filter-btn" onClick={() => setFilterOpen(true)}>
                                <SlidersHorizontal size={16} aria-hidden="true" />
                                {t("doctorsPage.filters.mobileFilter")}
                                {activeChips.length > 0 && <span className="doctors-page__count">{activeChips.length}</span>}
                            </button>
                        </div>

                        {activeChips.length > 0 && (
                            <div className="md-chips doctors-page__chips" aria-label={tx(t, "medicalPages.activeFilters")}>
                                {activeChips.map((chip) => (
                                    <button
                                        type="button"
                                        key={`${chip.group}-${chip.value}`}
                                        className="md-chip"
                                        onClick={() => toggle(chip.group, chip.value)}
                                    >
                                        {chip.label}
                                        <X size={14} aria-hidden="true" />
                                    </button>
                                ))}
                                <button type="button" className="md-chip md-chip--ghost" onClick={clearAll}>
                                    {t("doctorsPage.filters.mobileClear")}
                                </button>
                            </div>
                        )}

                        {isLoading ? (
                            <SkeletonGrid count={6} ratio="4 / 5" className="md-grid--sm" />
                        ) : paginatedDoctors.length > 0 ? (
                            <>
                                <div className="md-grid md-grid--sm">
                                    {paginatedDoctors.map((item) => (
                                        <DoctorCard key={item.id} item={item} />
                                    ))}
                                </div>
                                {totalPages > 1 && (
                                    <div className="md-pagination">
                                        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setCurrentPage} />
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

            {/* Mobile filter drawer */}
            <div
                className={`doctors-drawer${filterOpen ? " is-open" : ""}`}
                aria-hidden={!filterOpen}
                inert={!filterOpen}
                onClick={() => setFilterOpen(false)}
            >
                <div
                    className="doctors-drawer__panel"
                    role="dialog"
                    aria-modal="true"
                    aria-label={t("doctorsPage.filters.title")}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="doctors-drawer__head">
                        <h2>
                            {t("doctorsPage.filters.title")}
                            {activeChips.length > 0 && <span> ({activeChips.length})</span>}
                        </h2>
                        <button type="button" className="doctors-drawer__close" onClick={() => setFilterOpen(false)} aria-label="Close">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="doctors-drawer__body">{filterOpen && filterPanel}</div>
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
