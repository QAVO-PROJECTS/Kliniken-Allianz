import './index.scss';
import { useEffect, useRef, useState } from 'react';
import CardCertificateCategory from "../UserComponents/CategoryDetail/CertCard/index.jsx";

function CertificateSlider({ cards }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleCards, setVisibleCards] = useState(4);
    const sliderRef = useRef(null);
    const isDragging = useRef(false);
    const startPos = useRef(0);
    const currentTranslate = useRef(0);
    const prevTranslate = useRef(0);
    const animationRef = useRef(null);
    const hasMoved = useRef(false);

    const maxIndex = cards.length - visibleCards;

    // ✅ resize ilə görünən kart sayı
    useEffect(() => {
        const updateVisibleCards = () => {
            if (window.innerWidth <= 576) setVisibleCards(2);
            else setVisibleCards(4);
        };
        updateVisibleCards();
        window.addEventListener('resize', updateVisibleCards);
        return () => window.removeEventListener('resize', updateVisibleCards);
    }, []);

    const getPositionX = (e) => (e.type.includes('mouse') ? e.pageX : e.touches[0].clientX);

    const startDragging = (e) => {
        isDragging.current = true;
        hasMoved.current = false;
        startPos.current = getPositionX(e);
        sliderRef.current.style.transition = 'none';
        animationRef.current = requestAnimationFrame(animation);
    };

    const animation = () => {
        if (isDragging.current) requestAnimationFrame(animation);
    };

    const stopDragging = () => {
        cancelAnimationFrame(animationRef.current);
        if (!isDragging.current) return;
        isDragging.current = false;
        sliderRef.current.style.transition = 'transform 0.3s ease-in-out';

        const movedBy = currentTranslate.current - prevTranslate.current;
        let newIndex = currentIndex;

        if (movedBy < -10 && currentIndex < maxIndex) newIndex += 1;
        else if (movedBy > 10 && currentIndex > 0) newIndex -= 1;

        setCurrentIndex(newIndex);
        currentTranslate.current = -newIndex * (100 / visibleCards);
        prevTranslate.current = currentTranslate.current;
        sliderRef.current.style.transform = `translateX(${currentTranslate.current}%)`;
    };

    const drag = (e) => {
        if (!isDragging.current) return;
        const currentPosition = getPositionX(e);
        const movedBy = currentPosition - startPos.current;

        if (Math.abs(movedBy) > 5) hasMoved.current = true; // ✅ fərqləndir: drag varsa click işləməsin

        const sliderWidth = sliderRef.current.offsetWidth / visibleCards;
        const movePercentage = (movedBy / sliderWidth) * (100 / visibleCards);
        currentTranslate.current = prevTranslate.current + movePercentage;
        sliderRef.current.style.transform = `translateX(${currentTranslate.current}%)`;
    };

    const handleBulletClick = (index) => {
        setCurrentIndex(index);
        sliderRef.current.style.transition = 'transform 0.3s ease-in-out';
        sliderRef.current.style.transform = `translateX(-${index * (100 / visibleCards)}%)`;
        currentTranslate.current = -index * (100 / visibleCards);
        prevTranslate.current = currentTranslate.current;
    };

    const handleCardClick = (card) => {
        if (hasMoved.current) return; // ✅ sürükləndisə click event-in qarşısını al
        // Burda clickdə nə olacaqsa onu yaz:
        console.log('Sertifikata klikləndi:', card);
    };

    return (
        <div id="certificate-slider">
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
                    {cards.map((card, index) => (
                        <div
                            key={card.id}
                            className="slider-item"
                            onClick={() => handleCardClick(card)}
                        >
                            <CardCertificateCategory
                                image={card.image}
                                number={index + 1}
                                text="Sertifikat"
                                data-aos="zoom-in"
                                data-aos-delay={index * 100}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="custom-pagination">
                {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                    <span
                        key={index}
                        className={`custom-bullet ${currentIndex === index ? 'active' : ''}`}
                        onClick={() => handleBulletClick(index)}
                    />
                ))}
            </div>
        </div>
    );
}

export default CertificateSlider;
