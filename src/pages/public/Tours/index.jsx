import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { useGetAllToursQuery } from "../../../api/userApi.js";
import { getLocalizedText } from "../../../i18n/getLocalizedText.js";
import PageHeader from "../../../components/ui/PageHeader/index.jsx";
import TourCard from "../../../components/cards/TourCard/index.jsx";
import CtaBand from "../Contact/CtaBand.jsx";
import { EmptyState, SkeletonGrid } from "./ListingStates.jsx";
import { useQueryParam } from "./useQueryParam.js";
import "./listing.scss";

function ToursPage() {
    const { t } = useTranslation();
    const { data, isLoading } = useGetAllToursQuery();
    const [searchTerm, setSearchTerm] = useQueryParam("q");

    const query = searchTerm.trim().toLowerCase();
    const tours = useMemo(
        () => (data?.data || []).filter((tour) => getLocalizedText(tour, "name").toLowerCase().includes(query)),
        [data, query]
    );

    return (
        <div className="tours-page">
            <PageHeader
                title={t("navbar.tours")}
                subtitle={t("toursPage.headerDesc")}
                crumbs={[{ label: t("navbar.tours") }]}
            >
                <form className="header-filters" role="search" onSubmit={(e) => e.preventDefault()}>
                    <label className="search-field">
                        <span className="visually-hidden">{t("navbar.search")}</span>
                        <input
                            type="search"
                            name="q"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t("toursPage.searchPlaceholder")}
                            autoComplete="off"
                            enterKeyHint="search"
                            spellCheck={false}
                        />
                        <Search size={20} strokeWidth={1.75} aria-hidden="true" />
                    </label>
                </form>
            </PageHeader>

            <section className="listing" aria-labelledby="tours-listing-title">
                <div className="container">
                    <div className="listing-toolbar">
                        <h2 id="tours-listing-title">{t("toursPage.headerTitle")}</h2>
                        <span className="listing-toolbar__count" aria-live="polite">
                            {!isLoading && t("listing.count", "{{count}} results", { count: tours.length })}
                        </span>
                    </div>

                    {isLoading ? (
                        <SkeletonGrid count={6} className="listing-grid--3" />
                    ) : tours.length > 0 ? (
                        <div className="listing-grid listing-grid--3" data-reveal>
                            {tours.map((item) => (
                                <TourCard key={item.id} item={item} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            title={t("toursPage.noData")}
                            text={query ? t("listing.tryAnother", "Try a different search term.") : undefined}
                            action={
                                query && (
                                    <button type="button" className="btn btn--secondary" onClick={() => setSearchTerm("")}>
                                        {t("listing.clearSearch", "Clear search")}
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

export default ToursPage;
