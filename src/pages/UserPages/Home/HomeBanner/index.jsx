import './index.scss';
import banner1 from '/src/assets/banner1.png';
import banner2 from '/src/assets/banner2.png';
import banner3 from '/src/assets/banner3.png';
import bgvideo from '/src/assets/bgVideo.webm';
import { useTranslation } from 'react-i18next';
import glass from "/src/assets/glassButton.png"
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from "react-redux";

function HomeBanner() {
    const { t } = useTranslation();
    const [currentSlide, setCurrentSlide] = useState(0);
    const videoRef = useRef(null);
    const loading = useSelector((state) => state.ui.loading);

    const slides = [
        {
            type: 'video',
            src: bgvideo,
            title: t("homeBanner.slides.0.title"),
            desc: t("homeBanner.slides.0.description")
        },
        {
            type: 'image',
            img: banner1,
            title: t("homeBanner.slides.1.title"),
            desc: t("homeBanner.slides.1.description")
        },
        {
            type: 'image',
            img: banner2,
            title: t("homeBanner.slides.2.title"),
            desc: t("homeBanner.slides.2.description")
        },
        {
            type: 'image',
            img: banner3,
            title: t("homeBanner.slides.3.title"),
            desc: t("homeBanner.slides.3.description")
        }
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    useEffect(() => {
        let timer;
        const currentSlideData = slides[currentSlide];

        if (currentSlideData.type === 'image' && !loading) {
            timer = setInterval(nextSlide, 4000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [currentSlide, slides.length, loading]);

    const handleVideoEnd = () => {
        nextSlide();
    };

    useEffect(() => {
        if (slides[currentSlide].type === 'video' && videoRef.current && !loading) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
        }
    }, [currentSlide, loading]);

    const handleScroll = () => {
        const element = document.getElementById('home-clinic');
        if (element) {
            const offset = -100;
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: elementPosition + offset,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div id={'home-banner'}>
            <div className="carousel-container">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                        style={slide.type === 'image' ? { backgroundImage: `url(${slide.img})` } : {}}
                    >
                        {slide.type === 'video' && (
                            <video
                                ref={videoRef}
                                src={slide.src}
                                muted
                                playsInline
                                onEnded={handleVideoEnd}
                                className="banner-video"
                            />
                        )}
                    </div>
                ))}
            </div>
            <div className="video-overlay"></div>

            <div className="carousel-dots">
                {slides.map((_, index) => (
                    <div
                        key={index}
                        className={`dot ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => setCurrentSlide(index)}
                    />
                ))}
            </div>

            <div className={'container'}>
                <div className={'row'}>
                    <div className={'col-60 col-md-60 col-sm-60 col-xs-60'}>
                        <div
                            className={'content'}
                            key={currentSlide}
                            data-aos="fade-right"
                            data-aos-delay="50"
                        >
                            <h1>{slides[currentSlide].title}</h1>
                            <p data-aos="fade-right" data-aos-delay="100">{slides[currentSlide].desc}</p>
                            <div className={"muraciet"} onClick={handleScroll} data-aos="fade-up" data-aos-delay="150">
                                {t("homeBanner.button")}
                                <div className={'glass-image'}>
                                    <img src={glass} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeBanner;