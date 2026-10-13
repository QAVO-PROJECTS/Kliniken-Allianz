import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, MapPin, Search } from "lucide-react";
import { useGetAllSanatoriumQuery } from "../../../api/userApi.js";
import { getLocalizedText } from "../../../i18n/getLocalizedText.js";
import PageHeader from "../../../components/ui/PageHeader/index.jsx";
import SanatoriumCard from "../../../components/cards/SanatoriumCard/index.jsx";
import CtaBand from "../Contact/CtaBand.jsx";
import { EmptyState, SkeletonGrid } from "../Tours/ListingStates.jsx";
import "../Tours/listing.scss";

function SanatoriumsPage() {
    const { t } = useTranslation();
    const { data, isLoading } = useGetAllSanatoriumQuery();
    const [searchTerm, setSearchTerm] = useState("");
    const [location, setLocation] = useState("");

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

    return (
        <div className="sanatoriums-page">
            <PageHeader
                title={t("navbar.sanatoriums")}
                subtitle={t("adminPanel.sanatoriumPage.headers.subtitle")}
                crumbs={[{ label: t("navbar.sanatoriums") }]}
            >
                <div className="header-filters">
                    <label className="search-field">
                        <span className="visually-hidden">{t("navbar.search")}</span>
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t("adminPanel.sanatoriumPage.search.placeholder")}
                        />
                        <Search size={20} strokeWidth={2} aria-hidden="true" />
                    </label>
                    {locations.length > 1 && (
                        <label className="select-field">
                            <span className="visually-hidden">{t("adminPanel.sanatoriumPage.filter.placeholder")}</span>
                            <MapPin className="select-field__icon" size={18} strokeWidth={2} aria-hidden="true" />
                            <select value={location} onChange={(e) => setLocation(e.target.value)}>
                                <option value="">{t("adminPanel.sanatoriumPage.filter.allLocations")}</option>
                                {locations.map((loc) => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                            <ChevronDown className="select-field__chevron" size={18} strokeWidth={2} aria-hidden="true" />
                        </label>
                    )}
                </div>
            </PageHeader>

            <section className="listing">
                <div className="container">
                    <div className="listing-toolbar">
                        <div>
                            <h2>{t("adminPanel.sanatoriumPage.headers.title")}</h2>
                        </div>
                        {!isLoading && (
                            <span className="listing-toolbar__count" aria-live="polite">
                                {t("listing.count", "{{count}} results", { count: sanatoriums.length })}
                            </span>
                        )}
                    </div>

                    {isLoading ? (
                        <SkeletonGrid count={8} className="listing-grid--4" />
                    ) : sanatoriums.length > 0 ? (
                        <div className="listing-grid listing-grid--4">
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
                                    <button
                                        type="button"
                                        className="btn btn--secondary"
                                        onClick={() => { setSearchTerm(""); setLocation(""); }}
                                    >
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
