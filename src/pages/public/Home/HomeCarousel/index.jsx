import './index.scss';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionTitle from '../../../../components/ui/SectionTitle/index.jsx';
import useCarousel from '../useCarousel.js';

const MAX_DOTS = 8;

/**
 * Section shell shared by the home clinic / hotel / tour sliders:
 * start-aligned SectionTitle + arrows (+ optional "view all" link),
 * a scroll-snap track and pagination dots.
 *
 * `perView` = { lg, md, sm } slides visible at ≥992px / ≥576px / <576px
 * (fractions give a "peek" of the next card).
 */
function HomeCarousel({
    id,
    className = '',
    title,
    desc,
    eyebrow,
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
                <div className="home-carousel__header">
                    <SectionTitle title={title} desc={desc} eyebrow={eyebrow} align="start" />
                    <div className="home-carousel__controls">
                        {viewAll && (
                            <Link to={viewAll.to} className="btn btn--secondary btn--sm home-carousel__all">
                                {viewAll.label}
                                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
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
                                    <ChevronLeft size={20} strokeWidth={2} aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    className="home-carousel__arrow"
                                    onClick={next}
                                    disabled={!canNext}
                                    aria-label={t('homeClinic.nextButton', 'Next slide')}
                                >
                                    <ChevronRight size={20} strokeWidth={2} aria-hidden="true" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div
                    className="home-carousel__track"
                    ref={trackRef}
                    role="region"
                    aria-roledescription="carousel"
                    aria-label={label || title}
                    tabIndex={0}
                >
                    {items.map((item, i) => (
                        <div className="home-carousel__slide" key={getKey(item, i)}>
                            {renderItem(item, i)}
                        </div>
                    ))}
                </div>

                {pages > MAX_DOTS && (
                    <div className="home-carousel__progress" aria-hidden="true">
                        <span style={{ width: `${((index + 1) / pages) * 100}%` }} />
                    </div>
                )}
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
