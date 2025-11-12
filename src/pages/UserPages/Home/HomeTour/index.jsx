import './index.scss';
import HotelCard from '../../../../components/UserComponents/Home/HotelCard/index.jsx';
import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {useGetAllOtelsQuery, useGetAllToursQuery} from "../../../../services/userApi.jsx";
import TourCard from "../../../../components/UserComponents/TourCard/index.jsx";

function HomeTour() {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleCards, setVisibleCards] = useState(4);
    const sliderRef = useRef(null);
    const isDragging = useRef(false);
    const startPos = useRef(0);
    const currentTranslate = useRef(0);
    const prevTranslate = useRef(0);
const {data:getAllOtels} = useGetAllToursQuery()
    const cardss = getAllOtels?.data

    const maxIndex = cardss?.length - visibleCards;

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
        const newMaxIndex = Math.max(cardss?.length - visibleCards, 0);
        if (currentIndex > newMaxIndex) {
            setCurrentIndex(newMaxIndex);
            const translate = -newMaxIndex * (100 / visibleCards);
            if (sliderRef.current) {
                sliderRef.current.style.transform = `translateX(${translate}%)`;
                currentTranslate.current = translate;
                prevTranslate.current = translate;
            }
        }
    }, [visibleCards, cardss?.length]);

    // 🔹 pagination klik
    const handleBulletClick = (index) => {
        if (!sliderRef.current) return;
        setCurrentIndex(index);
        const translate = -index * (100 / visibleCards);
        sliderRef.current.style.transition = 'transform 0.3s ease-in-out';
        sliderRef.current.style.transform = `translateX(${translate}%)`;
        prevTranslate.current = translate;
        currentTranslate.current = translate;
    };

    // 🔹 Drag funksiyaları
    const getPositionX = (event) =>
        event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;

    const startDragging = (event) => {
        isDragging.current = true;
        startPos.current = getPositionX(event);
        if (sliderRef.current) sliderRef.current.style.transition = 'none';
    };

    const stopDragging = () => {
        if (!isDragging.current) return;
        isDragging.current = false;
        if (!sliderRef.current) return;

        sliderRef.current.style.transition = 'transform 0.3s ease-in-out';
        const movedBy = currentTranslate.current - prevTranslate.current;
        let newIndex = currentIndex;

        if (movedBy < -10 && currentIndex < maxIndex) newIndex += 1;
        else if (movedBy > 10 && currentIndex > 0) newIndex -= 1;

        setCurrentIndex(newIndex);
        const translate = -newIndex * (100 / visibleCards);
        sliderRef.current.style.transform = `translateX(${translate}%)`;
        currentTranslate.current = translate;
        prevTranslate.current = translate;
    };

    const drag = (event) => {
        if (!isDragging.current || !sliderRef.current) return;
        const currentPosition = getPositionX(event);
        const movedBy = currentPosition - startPos.current;
        const sliderWidth = sliderRef.current.offsetWidth / visibleCards;
        const movePercentage = (movedBy / sliderWidth) * (100 / visibleCards);
        currentTranslate.current = prevTranslate.current + movePercentage;
        sliderRef.current.style.transform = `translateX(${currentTranslate.current}%)`;
    };
    return (
        <div id="home-tour">
            <div className="container">
                <div className="head">
                    <h2>Tibbi Tur Paketləri</h2>
                    <p>Müalicə, yerləşmə və transfer daxil tam tibbi tur paketləri.</p>
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
                        {cardss?.map((item) => (
                            <TourCard
                                id={item.id}
                               item={item}
                            />
                        ))}
                    </div>
                </div>
                <div className="custom-pagination">
                    {Array.from({ length: maxIndex + 1 }    ).map((_, index) => (
                        <span
                            key={index}
                            className={`custom-bullet ${currentIndex === index ? 'active' : ''}`}
                            onClick={() => handleBulletClick(index)}
                            aria-label={t('homeHotel.slideAriaLabel', { slideNumber: index + 1 })}
                            role="button"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HomeTour;