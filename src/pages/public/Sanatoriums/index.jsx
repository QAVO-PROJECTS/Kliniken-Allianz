import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapPin, Search } from "lucide-react";
import { useGetAllSanatoriumQuery } from "../../../api/userApi.js";
import { getLocalizedText } from "../../../i18n/getLocalizedText.js";
import PageHeader from "../../../components/ui/PageHeader/index.jsx";
import SanatoriumCard from "../../../components/cards/SanatoriumCard/index.jsx";
import CtaBand from "../Contact/CtaBand.jsx";
import { EmptyState, SkeletonGrid } from "../Tours/ListingStates.jsx";
import { useQueryParam } from "../Tours/useQueryParam.js";
import "../Tours/listing.scss";

function SanatoriumsPage() {
    const { t } = useTranslation();
    const { data, isLoading } = useGetAllSanatoriumQuery();
    const [searchTerm, setSearchTerm] = useQueryParam("q");
    const [location, setLocation] = useQueryParam("city");
    const [, setParams] = useSearchParams();

    const all = useMemo(() => data?.data || [], [data]);
    const locations = useMemo(
        () => [...new Set(all.map((item) => getLocalizedText(item, "location")).filter(Boolean))],
        [all]
    );

    const query = searchTerm.trim().toLowerCase();
    const sanatoriums = all.filter((item) => {
        const matchesName = getLocalizedText(item, "name").toLowerCase().includes(query);
        const matchesLocation = !location || getLocalizedText(item, "location") === location;
        return matchesName && matchesLocation;
    });
    const filtered = Boolean(query || location);

    // One URL update for both params (two sequential updates would overwrite each other).
    const clearFilters = () => setParams({}, { replace: true, preventScrollReset: true });

    return (
        <div className="sanatoriums-page">
            <PageHeader
                title={t("navbar.sanatoriums")}
                subtitle={t("adminPanel.sanatoriumPage.headers.subtitle")}
                crumbs={[{ label: t("navbar.sanatoriums") }]}
            >
                <form className="header-filters" role="search" onSubmit={(e) => e.preventDefault()}>
                    <label className="search-field">
                        <span className="visually-hidden">{t("navbar.search")}</span>
                        <input
                            type="search"
                            name="q"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t("adminPanel.sanatoriumPage.search.placeholder")}
                            autoComplete="off"
                            enterKeyHint="search"
                            spellCheck={false}
                        />
                        <Search size={20} strokeWidth={1.75} aria-hidden="true" />
                    </label>
                    {locations.length > 1 && (
                        <div
                            className="filter-chips"
                            role="group"
                            aria-label={t("adminPanel.sanatoriumPage.filter.placeholder")}
                        >
                            <button
                                type="button"
                                className="filter-chip"
                                aria-pressed={!location}
                                onClick={() => setLocation("")}
                            >
                                {t("adminPanel.sanatoriumPage.filter.allLocations")}
                            </button>
                            {locations.map((loc) => (
                                <button
                                    type="button"
                                    key={loc}
                                    className="filter-chip"
                                    aria-pressed={location === loc}
                                    onClick={() => setLocation(location === loc ? "" : loc)}
                                >
                                    <MapPin size={16} strokeWidth={1.75} aria-hidden="true" />
                                    {loc}
                                </button>
                            ))}
                        </div>
                    )}
                </form>
            </PageHeader>

            <section className="listing" aria-labelledby="sanatoriums-listing-title">
                <div className="container">
                    <div className="listing-toolbar">
                        <h2 id="sanatoriums-listing-title">{t("adminPanel.sanatoriumPage.headers.title")}</h2>
                        <span className="listing-toolbar__count" aria-live="polite">
                            {!isLoading && t("listing.count", "{{count}} results", { count: sanatoriums.length })}
                        </span>
                    </div>

                    {isLoading ? (
                        <SkeletonGrid count={8} className="listing-grid--4" />
                    ) : sanatoriums.length > 0 ? (
                        <div className="listing-grid listing-grid--4" data-reveal>
                            {sanatoriums.map((item) => (
                                <SanatoriumCard key={item.id} item={item} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            title={t("adminPanel.sanatoriumPage.noSanatoriumFound")}
                            text={filtered ? t("listing.tryAnother", "Try a different search term.") : undefined}
                            action={
                                filtered && (
                                    <button type="button" className="btn btn--secondary" onClick={clearFilters}>
                                        {t("listing.clearFilters", "Clear filters")}
                                    </button>
                                )
                            }
                        />
                    )}
                </div>
            </section>

            <CtaBand />
        </div>
    );
}

export default SanatoriumsPage;
