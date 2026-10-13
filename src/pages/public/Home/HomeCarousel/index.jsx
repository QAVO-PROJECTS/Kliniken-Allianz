import './index.scss';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionTitle from '../../../../components/ui/SectionTitle/index.jsx';
import useCarousel from '../useCarousel.js';

const MAX_DOTS = 8;

/**
 * Scroll-snap strip with a start-aligned SectionTitle, arrows (+ optional
 * "view all" link) and pagination dots. The track is a native scroller, so
 * touch, trackpad and keyboard (focus the track, then Arrow keys) all work.
 *
 * `perView` = { lg, md, sm } slides visible at ≥992px / ≥576px / <576px
 * (fractions give a "peek" of the next item).
 */
function HomeCarousel({
    id,
    className = '',
    title,
    desc,
    items = [],
    renderItem,
    getKey = (item, i) => item?.id ?? i,
    viewAll,
    perView = { lg: 3, md: 2, sm: 1.15 },
    label,
}) {
    const { t } = useTranslation();
    const { trackRef, index, pages, canPrev, canNext, prev, next, goTo } = useCarousel(items.length);
    const style = {
        '--per-view-lg': perView.lg,
        '--per-view-md': perView.md,
        '--per-view-sm': perView.sm,
    };

    return (
        <section id={id} className={`section home-carousel ${className}`.trim()} style={style}>
            <div className="container">
                <div className="home-head">
                    <SectionTitle title={title} desc={desc} align="start" />
                    {(viewAll || pages > 1) && (
                        <div className="home-carousel__controls">
                            {viewAll && (
                                <Link to={viewAll.to} className="btn btn--secondary home-more">
                                    {viewAll.label}
                                    <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true" />
                                </Link>
                            )}
                            {pages > 1 && (
                                <div className="home-carousel__arrows">
                                    <button
                                        type="button"
                                        className="home-carousel__arrow"
                                        onClick={prev}
                                        disabled={!canPrev}
                                        aria-label={t('homeClinic.prevButton', 'Previous slide')}
                                    >
                                        <ChevronLeft size={20} strokeWidth={1.75} aria-hidden="true" />
                                    </button>
                                    <button
                                        type="button"
                                        className="home-carousel__arrow"
                                        onClick={next}
                                        disabled={!canNext}
                                        aria-label={t('homeClinic.nextButton', 'Next slide')}
                                    >
                                        <ChevronRight size={20} strokeWidth={1.75} aria-hidden="true" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <ul
                    className="home-carousel__track"
                    ref={trackRef}
                    aria-roledescription="carousel"
                    aria-label={label || title}
                    tabIndex={0}
                    data-reveal
                >
                    {items.map((item, i) => (
                        <li className="home-carousel__slide" key={getKey(item, i)}>
                            {renderItem(item, i)}
                        </li>
                    ))}
                </ul>

                {pages > 1 && pages <= MAX_DOTS && (
                    <div className="home-carousel__dots">
                        {Array.from({ length: pages }, (_, i) => (
                            <button
                                key={i}
                                type="button"
                                className={`home-carousel__dot${i === index ? ' is-active' : ''}`}
                                onClick={() => goTo(i)}
                                aria-label={t('homeClinic.slideAriaLabel', { slideNumber: i + 1, defaultValue: `Slide ${i + 1}` })}
                                aria-current={i === index ? 'true' : undefined}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default HomeCarousel;
