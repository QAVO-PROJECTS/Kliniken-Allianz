import './index.scss';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';
import { ArrowRight } from 'lucide-react';
import heroWebm from '../../../../assets/video/hero.webm';
import heroMp4 from '../../../../assets/video/hero.mp4';
import heroPoster from '../../../../assets/video/hero-poster.jpg';
import banner1 from '../../../../assets/banner1.png';
import banner2 from '../../../../assets/banner2.png';
import banner3 from '../../../../assets/banner3.png';

// Slide 0 is the video (poster image on mobile / reduced motion).
const SLIDE_MEDIA = [heroPoster, banner1, banner2, banner3];
const VIDEO_SLIDE_MS = 9000;
const IMAGE_SLIDE_MS = 6000;

function HomeBanner() {
    const { t } = useTranslation();
    const loading = useSelector((state) => state.ui.loading);
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const reduceMotion = useMediaQuery({ query: '(prefers-reduced-motion: reduce)' });
    const showVideo = !isMobile && !reduceMotion;
    const [current, setCurrent] = useState(0);
    const videoRef = useRef(null);

    const slides = SLIDE_MEDIA.map((img, i) => ({
        img,
        title: t(`homeBanner.slides.${i}.title`),
        desc: t(`homeBanner.slides.${i}.description`),
    }));

    // Auto-advance (paused while the global loader is visible or motion is reduced).
    useEffect(() => {
        if (loading || reduceMotion) return undefined;
        const timer = setTimeout(
            () => setCurrent((c) => (c + 1) % SLIDE_MEDIA.length),
            current === 0 ? VIDEO_SLIDE_MS : IMAGE_SLIDE_MS,
        );
        return () => clearTimeout(timer);
    }, [current, loading, reduceMotion]);

    // Only play the video while its slide is visible.
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        if (current === 0 && !loading) video.play().catch(() => {});
        else video.pause();
    }, [current, loading, showVideo]);

    const scrollToClinics = () => {
        const element = document.getElementById('home-clinic');
        if (!element) return;
        const top = element.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
    };

    const slide = slides[current];

    return (
        <section id="home-banner" className="home-hero">
            <div className="home-hero__media" aria-hidden="true">
                {slides.map((s, i) => (
                    <div key={i} className={`home-hero__slide${i === current ? ' is-active' : ''}`}>
                        {i === 0 && showVideo ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="metadata"
                                poster={heroPoster}
                            >
                                <source src={heroWebm} type="video/webm" />
                                <source src={heroMp4} type="video/mp4" />
                            </video>
                        ) : (
                            <img
                                src={s.img}
                                alt=""
                                decoding="async"
                                loading={i === 0 ? 'eager' : 'lazy'}
                                fetchPriority={i === 0 ? 'high' : 'low'}
                            />
                        )}
                    </div>
                ))}
            </div>
            <div className="home-hero__overlay" aria-hidden="true" />

            <div className="container home-hero__inner">
                <div className="home-hero__content" key={current}>
                    <h1>{slide.title}</h1>
                    <p>{slide.desc}</p>
                </div>
                <div className="home-hero__actions">
                    <button type="button" className="btn btn--light btn--lg" onClick={scrollToClinics}>
                        {t('homeBanner.button')}
                        <ArrowRight size={20} strokeWidth={2} aria-hidden="true" />
                    </button>
                    <Link to="/contact" className="btn btn--lg home-hero__ghost">
                        {t('navbar.contact')}
                    </Link>
                </div>
                <div className="home-hero__dots">
                    {slides.map((s, i) => (
                        <button
                            key={i}
                            type="button"
                            className={`home-hero__dot${i === current ? ' is-active' : ''}`}
                            onClick={() => setCurrent(i)}
                            aria-label={t('homeClinic.slideAriaLabel', { slideNumber: i + 1, defaultValue: `Slide ${i + 1}` })}
                            aria-current={i === current ? 'true' : undefined}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default HomeBanner;
