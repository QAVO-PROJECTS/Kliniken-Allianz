import './index.scss';
import banner1 from '/src/assets/banner1.png';
import banner2 from '/src/assets/banner2.png';
import banner3 from '/src/assets/banner3.png';
import {useTranslation} from 'react-i18next';
import glass from "/src/assets/glassButton.png"
import React, {useState, useEffect} from 'react';

function HomeBanner() {
    const {t} = useTranslation();
    const [currentSlide, setCurrentSlide] = useState(0);
    
    const slides = [
        {
            img: banner1,
            title: t("homeBanner.slides.0.title"),
            desc: t("homeBanner.slides.0.description")
        },
        {
            img: banner2,
            title: t("homeBanner.slides.1.title"),
            desc: t("homeBanner.slides.1.description")
        },
        {
            img: banner3,
            title: t("homeBanner.slides.2.title"),
            desc: t("homeBanner.slides.2.description")
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [slides.length]);

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
                        style={{backgroundImage: `url(${slide.img})`}}
                    />
                ))}
            </div>
            <div className="video-overlay"></div>
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