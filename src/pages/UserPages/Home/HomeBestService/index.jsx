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
                <div className='slider-wrapper'>
                    <div className='slider-card row' ref={sliderRef}>
                        {cards.map((_, index) => (
                            <BestServCard key={index} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeBestServ;