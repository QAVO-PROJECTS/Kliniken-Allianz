import "./index.scss";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pause, Play, Stethoscope } from "lucide-react";
import { useGetAllCategoryQuery } from "../../../../api/userApi.js";
import { getLocalizedText } from "../../../../i18n/getLocalizedText.js";
import HomeServiceCard from "../../../../components/cards/ServiceCard/index.jsx";
import SectionTitle from "../../../../components/ui/SectionTitle/index.jsx";
import { EmptyState, SkeletonGrid } from "../../Clinics/shared/Feedback.jsx";
import { tx } from "../../Clinics/shared/texts.js";
import videoSrc from "../../../../assets/video/HomeVideo.mp4";
import videoPoster from "../../../../assets/video/HomeVideo-poster.jpg";

/**
 * Decorative muted loop. Downloads only once it scrolls into view, never
 * autoplays under reduced motion, and has a pause/play control (WCAG 2.2.2).
 */
function LazyVideo() {
    const { t } = useTranslation();
    const ref = useRef(null);
    const [paused, setPaused] = useState(
        () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    );
    const pausedRef = useRef(paused);
    useEffect(() => {
        pausedRef.current = paused;
    }, [paused]);

    useEffect(() => {
        const video = ref.current;
        if (!video) return undefined;
        const start = () => {
            if (pausedRef.current) return;
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

    const toggle = () => {
        const video = ref.current;
        if (!video) return;
        if (paused) {
            if (!video.src) video.src = videoSrc;
            video.play?.().catch(() => {});
        } else {
            video.pause();
        }
        setPaused(!paused);
    };

    const label = paused ? tx(t, "medicalPages.playVideo") : tx(t, "medicalPages.pauseVideo");

    return (
        <>
            <video
                ref={ref}
                className="services-grid__video"
                poster={videoPoster}
                muted
                loop
                playsInline
                preload="none"
                aria-hidden="true"
                tabIndex={-1}
            />
            <button type="button" className="services-grid__video-toggle" onClick={toggle} aria-label={label}>
                {paused ? (
                    <Play size={18} strokeWidth={1.75} aria-hidden="true" />
                ) : (
                    <Pause size={18} strokeWidth={1.75} aria-hidden="true" />
                )}
            </button>
        </>
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
        <section className="md-section services-grid" aria-labelledby="services-grid-title">
            <div className="container">
                <SectionTitle
                    align="start"
                    className="services-grid__title"
                    title={<span id="services-grid-title">{t("homeServices.title")}</span>}
                    desc={t("homeServices.description")}
                />

                <div className="md-toolbar">
                    <p className="md-toolbar__count" aria-live="polite">
                        {!isLoading && tx(t, "medicalPages.results", { n: categories.length })}
                    </p>
                </div>

                {isLoading ? (
                    <SkeletonGrid count={8} ratio="16 / 7" className="md-grid--sm" />
                ) : categories.length > 0 ? (
                    <div className="md-grid md-grid--sm services-grid__grid">
                        {!query && (
                            <div className="services-grid__media" data-reveal>
                                <LazyVideo />
                            </div>
                        )}
                        {categories.map((cat, i) => (
                            <div key={cat.id} className="md-grid__item" data-reveal style={{ "--reveal-delay": `${(i % 4) * 50}ms` }}>
                                <HomeServiceCard
                                    bare
                                    id={cat.id}
                                    name={getLocalizedText(cat, "name")}
                                    desc={tx(t, "medicalPages.servicesCount", { n: cat.services?.length || 0 })}
                                    icon={cat.categoryImage}
                                />
                            </div>
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
