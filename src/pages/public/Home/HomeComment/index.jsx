import './index.scss';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SectionTitle from '../../../../components/ui/SectionTitle/index.jsx';
import { useGetAllCustomerViewQuery } from '../../../../api/userApi.js';
import { VIEW_CARD_IMAGES } from '../../../../config/mediaUrls.js';
import { getLocalizedText } from '../../../../i18n/getLocalizedText.js';
import { noDash } from '../shared/text.js';

const initials = (name = '') =>
    name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();

/** Photo when it loads, otherwise the reviewer's initials (no generic avatar icon). */
function Avatar({ src, name }) {
    const [failedSrc, setFailedSrc] = useState(null);
    return (
        <span className="home-reviews__avatar" aria-hidden="true">
            {src && failedSrc !== src
                ? <img src={src} alt="" width={48} height={48} loading="lazy" decoding="async" onError={() => setFailedSrc(src)} />
                : initials(name)}
        </span>
    );
}

/** Layout family: one large quote at a time, clamped to three lines. */
function HomeComment() {
    const { t } = useTranslation();
    const { data } = useGetAllCustomerViewQuery();
    const comments = useMemo(() => (data?.data || []).filter((c) => getLocalizedText(c, 'reviewText')), [data]);
    const [index, setIndex] = useState(0);
    const [expanded, setExpanded] = useState(false);
    const [clamped, setClamped] = useState(false);
    const textRef = useRef(null);

    const total = comments.length;
    const current = comments[Math.min(index, total - 1)];
    const text = current ? noDash(getLocalizedText(current, 'reviewText')).trim() : '';
    const name = current ? getLocalizedText(current, 'customerName') : '';
    const country = current ? getLocalizedText(current, 'country') : '';

    const go = (next) => {
        setIndex(next);
        setExpanded(false);
    };

    // Show the "Show more" toggle only when the quote really overflows three lines.
    useLayoutEffect(() => {
        const el = textRef.current;
        if (!el || expanded) return;
        setClamped(el.scrollHeight - el.clientHeight > 2);
    }, [text, expanded]);

    useEffect(() => {
        const el = textRef.current;
        if (!el || typeof ResizeObserver === 'undefined') return undefined;
        const ro = new ResizeObserver(() => {
            if (!el.classList.contains('is-expanded')) setClamped(el.scrollHeight - el.clientHeight > 2);
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, [total]);

    if (!total) return null;

    return (
        <section id="home-comment" className="section section--subtle home-reviews">
            <div className="container">
                <SectionTitle title={t('homeComment.title')} desc={t('homeComment.desc')} align="start" />

                <figure className="home-reviews__quote" data-reveal>
                    <blockquote key={current.id ?? index} className="home-reviews__body">
                        <p
                            ref={textRef}
                            id="home-review-text"
                            className={`home-reviews__text${expanded ? ' is-expanded' : ''}`}
                        >
                            {`“${text}”`}
                        </p>
                    </blockquote>
                    {(clamped || expanded) && (
                        <button
                            type="button"
                            className="home-reviews__toggle"
                            onClick={() => setExpanded((v) => !v)}
                            aria-expanded={expanded}
                            aria-controls="home-review-text"
                        >
                            {expanded ? t('common.showLess', 'Show less') : t('common.showMore', 'Show more')}
                        </button>
                    )}

                    <div className="home-reviews__footer">
                        <figcaption className="home-reviews__author">
                            <Avatar src={current.profilImage && VIEW_CARD_IMAGES + current.profilImage} name={name} />
                            <span>
                                <span className="home-reviews__name">{name}</span>
                                {country && <span className="home-reviews__country">{country}</span>}
                            </span>
                        </figcaption>

                        {total > 1 && (
                            <div className="home-reviews__nav">
                                <button
                                    type="button"
                                    className="home-reviews__btn"
                                    onClick={() => go(index - 1)}
                                    disabled={index === 0}
                                    aria-label={t('pagination.prev', 'Previous')}
                                >
                                    <ChevronLeft size={20} strokeWidth={1.75} aria-hidden="true" />
                                </button>
                                <span className="home-reviews__count" aria-live="polite">
                                    <strong>{index + 1}</strong> / {total}
                                </span>
                                <button
                                    type="button"
                                    className="home-reviews__btn"
                                    onClick={() => go(index + 1)}
                                    disabled={index === total - 1}
                                    aria-label={t('pagination.next', 'Next')}
                                >
                                    <ChevronRight size={20} strokeWidth={1.75} aria-hidden="true" />
                                </button>
                            </div>
                        )}
                    </div>
                </figure>
            </div>
        </section>
    );
}

export default HomeComment;
