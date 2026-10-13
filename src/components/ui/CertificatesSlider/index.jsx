import '../Pagination/index.scss';
import './index.scss';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CardCertificateCategory from "../../cards/CertificateCard/index.jsx";

/**
 * Horizontally scrollable (scroll-snap) row of certificate tiles.
 * Props: cards = [{ id, image }], [text="Sertifikat"]
 */
function CertificateSlider({ cards = [], text = "Sertifikat" }) {
    const { t } = useTranslation();
    const trackRef = useRef(null);
    const [edges, setEdges] = useState({ start: true, end: true });

    // Edge detection with an IntersectionObserver on the first / last tile
    // (no scroll listener). Works in RTL without scrollLeft maths.
    useEffect(() => {
        const track = trackRef.current;
        if (!track || typeof IntersectionObserver === 'undefined') return undefined;
        const items = track.querySelectorAll('.cert-slider__item');
        if (!items.length) return undefined;
        const first = items[0];
        const last = items[items.length - 1];
        const io = new IntersectionObserver((entries) => {
            setEdges((prev) => {
                const next = { ...prev };
                entries.forEach((entry) => {
                    if (entry.target === first) next.start = entry.isIntersecting;
                    if (entry.target === last) next.end = entry.isIntersecting;
                });
                return next;
            });
        }, { root: track, threshold: 0.95 });
        io.observe(first);
        if (last !== first) io.observe(last);
        return () => io.disconnect();
    }, [cards.length]);

    const scrollBy = (dir) => {
        const el = trackRef.current;
        if (!el) return;
        const rtl = getComputedStyle(el).direction === 'rtl';
        el.scrollBy({ left: dir * (rtl ? -1 : 1) * el.clientWidth * 0.8, behavior: 'smooth' });
    };

    if (!cards.length) return null;

    return (
        <div className="cert-slider">
            <div className="cert-slider__track" ref={trackRef} tabIndex={0} role="region" aria-label={text}>
                {cards.map((card, index) => (
                    <div key={card.id ?? index} className="cert-slider__item">
                        <CardCertificateCategory bare image={card.image} number={index + 1} text={text} />
                    </div>
                ))}
            </div>
            {!(edges.start && edges.end) && (
                <div className="cert-slider__nav">
                    <button type="button" className="pager__btn pager__btn--nav" onClick={() => scrollBy(-1)} disabled={edges.start} aria-label={t("pagination.prev", "Previous")}>
                        <ChevronLeft size={18} strokeWidth={1.75} aria-hidden="true" />
                    </button>
                    <button type="button" className="pager__btn pager__btn--nav" onClick={() => scrollBy(1)} disabled={edges.end} aria-label={t("pagination.next", "Next")}>
                        <ChevronRight size={18} strokeWidth={1.75} aria-hidden="true" />
                    </button>
                </div>
            )}
        </div>
    );
}

export default CertificateSlider;
