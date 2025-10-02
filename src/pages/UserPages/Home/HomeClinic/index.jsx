import './index.scss';
import { useRef, useState, useEffect } from 'react';
import ServiceDetailCard from '../../../../components/UserComponents/ServicesDetailCard/index.jsx';
import { HiOutlineArrowLeft, HiOutlineArrowRight } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';

import {useGetAllClinicQuery} from "../../../../services/userApi.jsx";

function HomeClinic() {
    const { t, i18n } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleCards, setVisibleCards] = useState(4);
    const sliderRef = useRef(null);
    const isDragging = useRef(false);
    const startPos = useRef(0);
    const currentTranslate = useRef(0);
    const prevTranslate = useRef(0);
    const {data:getAllClinic} = useGetAllClinicQuery()
    const cardss = getAllClinic?.data || [];

    // Dil bazlı metin seçimi
    const getLocalizedText = (item, field) => {
        switch (i18n.language) {
            case 'en':
                return field === 'name' ? item.nameEng : item.descriptionEng;
            case 'ru':
                return field === 'name' ? item.nameRu : item.descriptionRu;
            default: // 'tr' veya varsayılan
                return field === 'name' ? item.name : item.description;
        }
    };

    const maxIndex = Math.max(0, cardss.length - visibleCards);

    useEffect(() => {
        const updateVisibleCards = () => {
            if (window.innerWidth <= 576) {
                setVisibleCards(2);
            } else {
                setVisibleCards(4);
            }
        };

        updateVisibleCards();
        window.addEventListener('resize', updateVisibleCards);
        return () => window.removeEventListener('resize', updateVisibleCards);
    }, []);

    useEffect(() => {
        const newMaxIndex = Math.max(0, cardss.length - visibleCards);
        if (currentIndex > newMaxIndex) {
            setCurrentIndex(newMaxIndex);
            sliderRef.current.style.transform = `translateX(-${newMaxIndex * (100 / visibleCards)}%)`;
            currentTranslate.current = -newMaxIndex * (100 / visibleCards);
            prevTranslate.current = currentTranslate.current;
        }
    }, [visibleCards, currentIndex, cardss.length]);

    const handleBulletClick = (index) => {
        if (index <= maxIndex) {
            setCurrentIndex(index);
            sliderRef.current.style.transform = `translateX(-${index * (100 / visibleCards)}%)`;
            prevTranslate.current = -index * (100 / visibleCards);
        }
    };

    const getPositionX = (event) => {
        return event.type.includes('mouse')
            ? event.pageX
            : event.touches[0].clientX;
    };

    const startDragging = (event) => {
        isDragging.current = true;
        startPos.current = getPositionX(event);
        sliderRef.current.style.transition = 'none';
    };

    const stopDragging = () => {
        if (!isDragging.current) return;
        isDragging.current = false;
        sliderRef.current.style.transition = 'transform 0.3s ease-in-out';

        const movedBy = currentTranslate.current - prevTranslate.current;
        let newIndex = currentIndex;

        if (movedBy < -10 && currentIndex < maxIndex) {
            newIndex += 1;
        } else if (movedBy > 10 && currentIndex > 0) {
            newIndex -= 1;
        }

        setCurrentIndex(newIndex);
        currentTranslate.current = -newIndex * (100 / visibleCards);
        prevTranslate.current = currentTranslate.current;
        sliderRef.current.style.transform = `translateX(${currentTranslate.current}%)`;
    };

    const drag = (event) => {
        if (!isDragging.current) return;
        const currentPosition = getPositionX(event);
        const movedBy = currentPosition - startPos.current;

        const sliderWidth = sliderRef.current.offsetWidth / visibleCards;
        const movePercentage = (movedBy / sliderWidth) * (100 / visibleCards);

        currentTranslate.current = prevTranslate.current + movePercentage;
        sliderRef.current.style.transform = `translateX(${currentTranslate.current}%)`;
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            sliderRef.current.style.transform = `translateX(-${(currentIndex - 1) * (100 / visibleCards)}%)`;
            currentTranslate.current = -(currentIndex - 1) * (100 / visibleCards);
            prevTranslate.current = currentTranslate.current;
        }
    };

    const handleNext = () => {
        if (currentIndex < maxIndex) {
            setCurrentIndex(currentIndex + 1);
            sliderRef.current.style.transform = `translateX(-${(currentIndex + 1) * (100 / visibleCards)}%)`;
            currentTranslate.current = -(currentIndex + 1) * (100 / visibleCards);
            prevTranslate.current = currentTranslate.current;
        }
    };

    return (
        <div id="home-clinic">
            <div className="container">
                <div className="header">
                    <div className="content">
                        <h2>{t('homeClinic.title')}</h2>
                        <p>{t('homeClinic.description')}</p>
                    </div>
                    <div className="navigationBtn">
                        <button className="prev" onClick={handlePrev} aria-label={t('homeClinic.prevButton')}>
                            <HiOutlineArrowLeft />
                        </button>
                        <button className="next" onClick={handleNext} aria-label={t('homeClinic.nextButton')}>
                            <HiOutlineArrowRight />
                        </button>
                    </div>
                </div>
                <div
                    className="slider-wrapper"
                    onMouseDown={startDragging}
                    onMouseUp={stopDragging}
                    onMouseLeave={stopDragging}
                    onMouseMove={drag}
                    onTouchStart={startDragging}
                    onTouchEnd={stopDragging}
                    onTouchMove={drag}
                >
                    <div className="slider-card row" ref={sliderRef}>
                        {cardss.map((item, index) => (
                            <ServiceDetailCard
                                key={index}
                                id={item.id}
                                name={getLocalizedText(item, 'name')}
                                desc={getLocalizedText(item, 'desc')}
                                img={item.clinicCardImage}
                                imgAlt={t('homeClinic.cardImgAlt', { name: getLocalizedText(item, 'name') })}
                            />
                        ))}
                    </div>
                </div>
                <div className="custom-pagination">
                    {Array.from({ length: Math.max(1, maxIndex + 1) }).map((_, index) => (
                        <span
                            key={index}
                            className={`custom-bullet ${currentIndex === index ? 'active' : ''}`}
                            onClick={() => handleBulletClick(index)}
                            aria-label={t('homeClinic.slideAriaLabel', { slideNumber: index + 1 })}
                            role="button"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HomeClinic;