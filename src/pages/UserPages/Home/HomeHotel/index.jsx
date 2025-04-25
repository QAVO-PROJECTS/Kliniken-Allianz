import './index.scss';
import HotelCard from '../../../../components/UserComponents/Home/HotelCard/index.jsx';
import { useRef, useState } from 'react';

function HomeHotel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const sliderRef = useRef(null);
    const isDragging = useRef(false);
    const startPos = useRef(0);
    const currentTranslate = useRef(0);
    const prevTranslate = useRef(0);

    const cards = [1, 2, 3, 4, 5, 6];
    const visibleCards = 4;
    const maxIndex = cards.length - visibleCards;

    const handleBulletClick = (index) => {
        if (index <= maxIndex) {
            setCurrentIndex(index);
            sliderRef.current.style.transform = `translateX(-${index * 25}%)`;
            prevTranslate.current = -index * 25;
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
        sliderRef.current.style.transition = 'none'; // Disable transition during drag
    };

    const stopDragging = () => {
        if (!isDragging.current) return;
        isDragging.current = false;
        sliderRef.current.style.transition = 'transform 0.3s ease-in-out';

        // Snap to the nearest slide
        const movedBy = currentTranslate.current - prevTranslate.current;
        let newIndex = currentIndex;

        if (movedBy < -10 && currentIndex < maxIndex) {
            newIndex += 1; // Move to next slide
        } else if (movedBy > 10 && currentIndex > 0) {
            newIndex -= 1; // Move to previous slide
        }

        setCurrentIndex(newIndex);
        currentTranslate.current = -newIndex * 25;
        prevTranslate.current = currentTranslate.current;
        sliderRef.current.style.transform = `translateX(${currentTranslate.current}%)`;
    };

    const drag = (event) => {
        if (!isDragging.current) return;
        const currentPosition = getPositionX(event);
        const movedBy = currentPosition - startPos.current;

        // Convert pixel movement to percentage (based on slider width)
        const sliderWidth = sliderRef.current.offsetWidth / visibleCards;
        const movePercentage = (movedBy / sliderWidth) * 25;

        currentTranslate.current = prevTranslate.current + movePercentage;
        sliderRef.current.style.transform = `translateX(${currentTranslate.current}%)`;
    };

    return (
        <div id="home-hotel">
            <div className="container">
                <div className={"head"}>
                    <h2>Klinikalara Yaxın Otel Seçimləri</h2>
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
                        {cards.map((_, index) => (
                            <HotelCard key={index} />
                        ))}
                    </div>
                </div>
                <div className="custom-pagination">
                    {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                        <span
                            key={index}
                            className={`custom-bullet ${currentIndex === index ? 'active' : ''}`}
                            onClick={() => handleBulletClick(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            role="button"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HomeHotel;