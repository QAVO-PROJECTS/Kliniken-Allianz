import '../Pagination/index.scss';
import './index.scss';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CardCertificateCategory from "../../cards/CertificateCard/index.jsx";

/**
 * Horizontally scrollable (scroll-snap) row of certificate tiles.
 * Props: cards = [{ id, image }], [text="Sertifikat"]
 */
function CertificateSlider({ cards = [], text = "Sertifikat" }) {
    const trackRef = useRef(null);
    const [edges, setEdges] = useState({ start: true, end: true });

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return undefined;
        const update = () => {
            const max = el.scrollWidth - el.clientWidth;
            const pos = Math.abs(el.scrollLeft); // scrollLeft is negative in RTL
            setEdges({ start: pos <= 2, end: pos >= max - 2 });
        };
        update();
        el.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        return () => {
            el.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
        };
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
            <div className="cert-slider__track" ref={trackRef} tabIndex={0} aria-label={text}>
                {cards.map((card, index) => (
                    <div key={card.id ?? index} className="cert-slider__item">
                        <CardCertificateCategory bare image={card.image} number={index + 1} text={text} />
                    </div>
                ))}
            </div>
            {!(edges.start && edges.end) && (
                <div className="cert-slider__nav">
                    <button type="button" className="pager__btn pager__btn--nav" onClick={() => scrollBy(-1)} disabled={edges.start} aria-label="Previous">
                        <ChevronLeft size={18} strokeWidth={2} aria-hidden="true" />
                    </button>
                    <button type="button" className="pager__btn pager__btn--nav" onClick={() => scrollBy(1)} disabled={edges.end} aria-label="Next">
                        <ChevronRight size={18} strokeWidth={2} aria-hidden="true" />
                    </button>
                </div>
            )}
        </div>
    );
}

export default CertificateSlider;
