import './index.scss';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';
import SectionTitle from '../../../../components/ui/SectionTitle/index.jsx';
import CommentCard from '../../../../components/cards/ReviewCard/index.jsx';
import { useGetAllCustomerViewQuery } from '../../../../api/userApi.js';
import { VIEW_CARD_IMAGES } from '../../../../config/mediaUrls.js';
import { getLocalizedText } from '../../../../i18n/getLocalizedText.js';
import testimonialsVideo from '../../../../assets/video/testimonials.mp4';
import useLazyVideo from '../useLazyVideo.js';

const MAX_ATTEMPTS = 40;
// Approximate stage size (px) used to keep avatars apart; positions are in %.
const STAGE_W = 1230;
const STAGE_H = 420;
const MIN_GAP_PX = 72;

// Small deterministic PRNG so the layout is stable across renders.
function createRandom(seed) {
    let s = seed | 0;
    return () => {
        s = (s + 0x6d2b79f5) | 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/** Scatter `count` avatar centres in the left/right gutters around the card (in %). */
function scatterAvatars(count) {
    const rand = createRandom(0x2f6b + count * 7919);
    const placed = [];
    for (let i = 0; i < count; i++) {
        const leftSide = i % 2 === 0;
        let best = null;
        for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
            const x = leftSide ? 3 + rand() * 14 : 83 + rand() * 14;
            const y = 6 + rand() * 82;
            const nearest = placed.reduce(
                (min, p) => Math.min(min, Math.hypot(((p.x - x) / 100) * STAGE_W, ((p.y - y) / 100) * STAGE_H)),
                Infinity,
            );
            if (!best || nearest > best.nearest) best = { x, y, nearest };
            if (nearest >= MIN_GAP_PX) break;
        }
        placed.push({ x: best.x, y: best.y });
    }
    return placed;
}

function HomeComment() {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const { data } = useGetAllCustomerViewQuery();
    const comments = useMemo(() => data?.data || [], [data]);
    const positions = useMemo(() => scatterAvatars(comments.length), [comments.length]);
    const reduceMotion = useMediaQuery({ query: '(prefers-reduced-motion: reduce)' });
    const videoRef = useLazyVideo({ enabled: !reduceMotion });

    return (
        <section id="home-comment" className="section home-reviews">
            {!reduceMotion && (
                <video
                    ref={videoRef}
                    className="home-reviews__bg"
                    muted
                    loop
                    playsInline
                    preload="none"
                    aria-hidden="true"
                    tabIndex={-1}
                >
                    <source src={testimonialsVideo} type="video/mp4" />
                </video>
            )}
            <div className="home-reviews__veil" aria-hidden="true" />

            <div className="container home-reviews__inner">
                <SectionTitle title={t('homeComment.title')} desc={t('homeComment.desc')} />

                <div className="home-reviews__stage" data-aos="fade-up">
                    {comments.length > 1 && (
                        <ul className="home-reviews__avatars">
                            {comments.map((comment, index) => {
                                const pos = positions[index] || { x: 0, y: 0 };
                                const name = getLocalizedText(comment, 'customerName');
                                const active = index === currentIndex;
                                return (
                                    <li
                                        key={comment.id ?? index}
                                        style={{ '--x': `${pos.x}%`, '--y': `${pos.y}%` }}
                                    >
                                        <button
                                            type="button"
                                            className={`home-reviews__avatar${active ? ' is-active' : ''}`}
                                            onClick={() => setCurrentIndex(index)}
                                            aria-label={name}
                                            aria-pressed={active}
                                        >
                                            <img
                                                src={VIEW_CARD_IMAGES + comment.profilImage}
                                                alt=""
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                    <div className="home-reviews__card">
                        <CommentCard
                            currentIndex={currentIndex}
                            setCurrentIndex={setCurrentIndex}
                            fakeComments={comments}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HomeComment;
