import "./index.scss";
import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Stethoscope } from "lucide-react";
import { useGetAllCategoryQuery } from "../../../../api/userApi.js";
import { getLocalizedText } from "../../../../i18n/getLocalizedText.js";
import HomeServiceCard from "../../../../components/cards/ServiceCard/index.jsx";
import SectionTitle from "../../../../components/ui/SectionTitle/index.jsx";
import { EmptyState, SkeletonGrid } from "../../Clinics/shared/Feedback.jsx";
import { tx } from "../../Clinics/shared/texts.js";
import videoSrc from "../../../../assets/video/HomeVideo.mp4";
import videoPoster from "../../../../assets/video/HomeVideo-poster.jpg";

/** Muted looping video that only downloads once it scrolls into view. */
function LazyVideo({ label }) {
    const ref = useRef(null);

    useEffect(() => {
        const video = ref.current;
        if (!video) return undefined;
        const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        if (reduce) return undefined;
        const start = () => {
            if (!video.src) video.src = videoSrc;
            video.play?.().catch(() => {});
        };
        if (!("IntersectionObserver" in window)) {
            start();
            return undefined;
        }
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) start();
                else if (video.src) video.pause();
            },
            { rootMargin: "200px" }
        );
        io.observe(video);
        return () => io.disconnect();
    }, []);

    return (
        <video
            ref={ref}
            className="services-grid__video"
            poster={videoPoster}
            muted
            loop
            playsInline
            preload="none"
            aria-label={label}
        />
    );
}

function ServicesGrid({ query = "", onClear }) {
    const { t, i18n } = useTranslation();
    const { data, isLoading } = useGetAllCategoryQuery();

    const categories = useMemo(() => {
        const q = query.trim().toLowerCase();
        const list = data?.data || [];
        if (!q) return list;
        return list.filter(
            (cat) =>
                getLocalizedText(cat, "name").toLowerCase().includes(q) ||
                cat.services?.some((s) => getLocalizedText(s, "name").toLowerCase().includes(q))
        );
        // i18n.language: names are localized
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, query, i18n.language]);

    return (
        <section className="md-section services-grid">
            <div className="container">
                <SectionTitle align="start" title={t("homeServices.title")} desc={t("homeServices.description")} />

                {isLoading ? (
                    <SkeletonGrid count={8} ratio="16 / 9" />
                ) : categories.length > 0 ? (
                    <div className="md-grid services-grid__grid">
                        {!query && (
                            <div className="services-grid__media">
                                <LazyVideo label={t("homeServices.videoAlt")} />
                            </div>
                        )}
                        {categories.map((cat) => (
                            <HomeServiceCard
                                key={cat.id}
                                id={cat.id}
                                name={getLocalizedText(cat, "name")}
                                desc={tx(t, "medicalPages.servicesCount", { n: cat.services?.length || 0 })}
                                icon={cat.categoryImage}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState icon={Stethoscope} title={tx(t, "medicalPages.noServices")}>
                        {query && onClear && (
                            <button type="button" className="btn btn--secondary btn--sm" onClick={onClear}>
                                {t("doctorsPage.filters.reset")}
                            </button>
                        )}
                    </EmptyState>
                )}
            </div>
        </section>
    );
}

export default ServicesGrid;
