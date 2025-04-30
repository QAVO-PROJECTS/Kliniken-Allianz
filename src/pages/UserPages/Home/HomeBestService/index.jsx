import './index.scss';
import { HiOutlineArrowLeft, HiOutlineArrowRight } from 'react-icons/hi';
import { useRef, useState, useEffect } from 'react';
import ServiceDetailCard from '../../../../components/UserComponents/ServicesDetailCard/index.jsx';
import BestServCard from '../../../../components/UserComponents/Home/BestServiceCard/index.jsx';
import {useNavigate} from "react-router-dom";

function HomeBestServ() {
    const sliderRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cardsPerView, setCardsPerView] = useState(4); // Default: 4 cards for desktop
    const cards = [1, 2, 3, 4, 5, 6]; // Example: 6 cards

    // Detect screen size to set number of cards per view
    useEffect(() => {
        const updateCardsPerView = () => {
            if (window.innerWidth <= 768) {
                setCardsPerView(2); // Mobile: 2 cards
            } else {
                setCardsPerView(4); // Desktop: 4 cards
            }
        };

        updateCardsPerView(); // Initial check
        window.addEventListener('resize', updateCardsPerView);

        return () => window.removeEventListener('resize', updateCardsPerView);
    }, []);

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            sliderRef.current.style.transform = `translateX(-${(currentIndex - 1) * (100 / cardsPerView)}%)`;
        }
    };

    const handleNext = () => {
        if (currentIndex < cards.length - cardsPerView) {
            setCurrentIndex(currentIndex + 1);
            sliderRef.current.style.transform = `translateX(-${(currentIndex + 1) * (100 / cardsPerView)}%)`;
        }
    };
    const [visibleCards, setVisibleCards] = useState(4); // Default to 4 cards
    const isDragging = useRef(false);
    const startPos = useRef(0);
    const currentTranslate = useRef(0);
    const prevTranslate = useRef(0);

    const maxIndex = cards.length - visibleCards; // Dynamic maxIndex based on visibleCards

    // Detect screen size and set visibleCards
    useEffect(() => {
        const updateVisibleCards = () => {
            if (window.innerWidth <= 576) {
                setVisibleCards(2); // 2 cards on mobile
            } else {
                setVisibleCards(4); // 4 cards on desktop
            }
        };

        updateVisibleCards();
        window.addEventListener('resize', updateVisibleCards);
        return () => window.removeEventListener('resize', updateVisibleCards);
    }, []);

    // Update maxIndex whenever visibleCards changes
    useEffect(() => {
        const newMaxIndex = cards.length - visibleCards;
        if (currentIndex > newMaxIndex) {
            setCurrentIndex(newMaxIndex);
            sliderRef.current.style.transform = `translateX(-${newMaxIndex * (100 / visibleCards)}%)`;
            currentTranslate.current = -newMaxIndex * (100 / visibleCards);
            prevTranslate.current = currentTranslate.current;
        }
    }, [visibleCards, currentIndex]);

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

    return (
        <div id={'home-best-service'}>
            <div className={'container'}>
                <div className='header'>
                    <div className='content'>
                        <h2>Ən çox seçilən xidmətlər</h2>
                    </div>
                    <div className='navigationBtn'>
                        <button className='prev' onClick={handlePrev}>
                            <HiOutlineArrowLeft />
                        </button>
                        <button className='next' onClick={handleNext}>
                            <HiOutlineArrowRight />
                        </button>
                    </div>
                </div>
                <div  className="slider-wrapper"
                      onMouseDown={startDragging}
                      onMouseUp={stopDragging}
                      onMouseLeave={stopDragging}
                      onMouseMove={drag}
                      onTouchStart={startDragging}
                      onTouchEnd={stopDragging}
                      onTouchMove={drag}
                >
                    <div className='slider-card row' ref={sliderRef}>
                        {cards.map((_, index) => (
                            <BestServCard key={index} />
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

export default HomeBestServ;