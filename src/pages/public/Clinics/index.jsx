import "./index.scss";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Building2, Search } from "lucide-react";
import { getLocalizedText } from "../../../i18n/getLocalizedText.js";
import { useGetAllClinicQuery } from "../../../api/userApi.js";
import ClinicGridCard from "../../../components/cards/ClinicGridCard/index.jsx";
import PageHeader from "../../../components/ui/PageHeader/index.jsx";
import SectionTitle from "../../../components/ui/SectionTitle/index.jsx";
import CtaBand from "./shared/CtaBand.jsx";
import { EmptyState, SkeletonGrid } from "./shared/Feedback.jsx";
import { tx } from "./shared/texts.js";

function ClinicsPage({ isGermany }) {
    const { t, i18n } = useTranslation();
    const { data, isLoading } = useGetAllClinicQuery();
    const [searchTerm, setSearchTerm] = useState("");

    const title = isGermany ? t("navbar.germanyClinics") : t("navbar.clinics");

    const clinics = useMemo(() => {
        const q = searchTerm.trim().toLowerCase();
        return (data?.data || []).filter((clinic) => {
            const isGermanClinic = clinic.location === "Almaniya";
            if (isGermany !== isGermanClinic) return false;
            if (!q) return true;
            return getLocalizedText(clinic, "name").toLowerCase().includes(q);
        });
        // i18n.language: localized names change with the language
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, searchTerm, isGermany, i18n.language]);

    return (
        <div className="clinics-page">
            <PageHeader title={title} crumbs={[{ label: title }]}>
                <label className="search-field">
                    <span className="visually-hidden">{t("navbar.search")}</span>
                    <input
                        type="search"
                        name="q"
                        autoComplete="off"
                        enterKeyHint="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t("adminPanel.clinicPage.search.placeholder")}
                    />
                    <Search size={20} strokeWidth={1.75} aria-hidden="true" />
                </label>
            </PageHeader>

            <section className="md-section" aria-labelledby="clinics-list-title">
                <div className="container">
                    <SectionTitle
                        align="start"
                        className="clinics-page__title"
                        title={<span id="clinics-list-title">{t("adminPanel.clinicPage.headers.title")}</span>}
                        desc={t("adminPanel.clinicPage.headers.subtitle")}
                    />

                    <div className="md-toolbar">
                        <p className="md-toolbar__count" aria-live="polite">
                            {!isLoading && tx(t, "medicalPages.results", { n: clinics.length })}
                        </p>
                    </div>

                    {isLoading ? (
                        <SkeletonGrid count={8} ratio="4 / 3" />
                    ) : clinics.length > 0 ? (
                        <div className="md-grid">
                            {clinics.map((item, i) => (
                                <div key={item.id} className="md-grid__item" data-reveal style={{ "--reveal-delay": `${(i % 4) * 60}ms` }}>
                                    <ClinicGridCard item={item} bare />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={Building2}
                            title={t("adminPanel.clinicPage.noClinicFound").replace(/\s*\p{Extended_Pictographic}/gu, "")}
                        >
                            {searchTerm && (
                                <button type="button" className="btn btn--secondary btn--sm" onClick={() => setSearchTerm("")}>
                                    {t("doctorsPage.filters.reset")}
                                </button>
                            )}
                        </EmptyState>
                    )}
                </div>
            </section>

            <CtaBand />
        </div>
    );
}

export default ClinicsPage;
