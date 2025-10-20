import './index.scss';
import { HiOutlineArrowLeft, HiOutlineArrowRight } from 'react-icons/hi';
import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import BestServCard from '../../../../components/UserComponents/Home/BestServiceCard/index.jsx';
import image from '../../../../assets/BestService1.jpg';
import image2 from '../../../../assets/BestService2.jpg';
import image3 from '../../../../assets/BestService3.jpg';
import image4 from '../../../../assets/BestService4.jpg';
import image5 from '../../../../assets/BestService5.jpg';
import image6 from '../../../../assets/BestService6.jpg';
import icon1 from '../../../../assets/Servis/cancer.png';
import icon2 from '../../../../assets/Servis/heart.png';
import icon3 from '../../../../assets/Servis/sssssssss.png';
import icon4 from '../../../../assets/Servis/oftomoloq.png';
import icon5 from '../../../../assets/Servis/hepatoloq.png';
import icon6 from '../../../../assets/Servis/travmatoloq.png';
import {useGetAllServiceQuery} from "../../../../services/userApi.jsx";

function HomeBestServ() {
    const { t } = useTranslation();
    const sliderRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleCards, setVisibleCards] = useState(4);
    const isDragging = useRef(false);
    const startPos = useRef(0);
    const currentTranslate = useRef(0);
    const prevTranslate = useRef(0);
    const {data:getAllService} = useGetAllServiceQuery()
    const cardss = getAllService?.data
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
        const newMaxIndex = cardss?.length - visibleCards;
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
            currentTranslate.current = -index * (100 / visibleCards);
            prevTranslate.current = currentTranslate.current;
        }
    };

    const getPositionX = (event) => {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
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
            const newIndex = currentIndex - 1;
            setCurrentIndex(newIndex);
            sliderRef.current.style.transform = `translateX(-${newIndex * (100 / visibleCards)}%)`;
            currentTranslate.current = -newIndex * (100 / visibleCards);
            prevTranslate.current = currentTranslate.current;
        }
    };

    const handleNext = () => {
        if (currentIndex < maxIndex) {
            const newIndex = currentIndex + 1;
            setCurrentIndex(newIndex);
            sliderRef.current.style.transform = `translateX(-${newIndex * (100 / visibleCards)}%)`;
            currentTranslate.current = -newIndex * (100 / visibleCards);
            prevTranslate.current = currentTranslate.current;
        }
    };

    return (
        <div id="home-best-service">
            <div className="container">
                <div className="header">
                    <div className="content">
                        <h2>{t('homeBestServ.title')}</h2>
                        <p>Pasiyentlərin ən çox üstünlük verdiyi tibbi xidmətlərlə tanış olun.</p>
                    </div>
                    <div className="navigationBtn">
                        <button className="prev" onClick={handlePrev} aria-label={t('homeBestServ.prevButton')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="10" viewBox="0 0 13 10" fill="none">
                                <path d="M0.941032 4.69043L5.31603 0.31543C5.39818 0.23328 5.5096 0.187128 5.62578 0.187128C5.74196 0.187128 5.85338 0.23328 5.93553 0.31543C6.01768 0.397581 6.06383 0.509002 6.06383 0.62518C6.06383 0.741359 6.01768 0.85278 5.93553 0.934931L2.30691 4.56268L11.7508 4.56268C11.8668 4.56268 11.9781 4.60877 12.0601 4.69082C12.1422 4.77287 12.1883 4.88415 12.1883 5.00018C12.1883 5.11621 12.1422 5.22749 12.0601 5.30954C11.9781 5.39159 11.8668 5.43768 11.7508 5.43768L2.30691 5.43768L5.93553 9.06543C6.01768 9.14758 6.06383 9.259 6.06383 9.37518C6.06383 9.49136 6.01768 9.60278 5.93553 9.68493C5.85338 9.76708 5.74196 9.81323 5.62578 9.81323C5.5096 9.81323 5.39818 9.76708 5.31603 9.68493L0.941032 5.30993C0.900289 5.26929 0.867964 5.22101 0.845908 5.16786C0.823852 5.11471 0.8125 5.05773 0.8125 5.00018C0.8125 4.94263 0.823852 4.88565 0.845908 4.8325C0.867964 4.77935 0.900289 4.73107 0.941032 4.69043Z" fill="#003778"/>
                            </svg>
                        </button>
                        <button className="next" onClick={handleNext} aria-label={t('homeBestServ.nextButton')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="10" viewBox="0 0 13 10" fill="none">
                                <path d="M12.059 5.30957L7.68397 9.68457C7.60182 9.76672 7.4904 9.81287 7.37422 9.81287C7.25804 9.81287 7.14662 9.76672 7.06447 9.68457C6.98232 9.60242 6.93617 9.491 6.93617 9.37482C6.93617 9.25864 6.98232 9.14722 7.06447 9.06507L10.6931 5.43732L1.24922 5.43732C1.13319 5.43732 1.02191 5.39123 0.939858 5.30918C0.857811 5.22713 0.811718 5.11585 0.811718 4.99982C0.811718 4.88379 0.857811 4.77251 0.939858 4.69046C1.02191 4.60841 1.13319 4.56232 1.24922 4.56232L10.6931 4.56232L7.06447 0.93457C6.98232 0.852419 6.93617 0.740999 6.93617 0.62482C6.93617 0.508641 6.98232 0.397221 7.06447 0.31507C7.14662 0.232919 7.25804 0.186767 7.37422 0.186767C7.4904 0.186767 7.60182 0.232919 7.68397 0.31507L12.059 4.69007C12.0997 4.73071 12.132 4.77899 12.1541 4.83214C12.1761 4.88529 12.1875 4.94227 12.1875 4.99982C12.1875 5.05737 12.1761 5.11435 12.1541 5.1675C12.132 5.22065 12.0997 5.26893 12.059 5.30957Z" fill="#003778"/>
                            </svg>
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
                        {cardss?.map((item) => (
                            <BestServCard
                                id={item.id}
                                name={item.name}
                                desc={item.description}
                                img={item.serviceImages[0]}
                                imgAlt={t('homeBestServ.cardImgAlt', { name: item.name })}
                                icon={item.serviceCardImage}
                                iconAlt={t('homeBestServ.cardIconAlt', { name: item.name })}
                            />
                        ))}
                    </div>
                </div>
                <div className="custom-pagination">
                    {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                        <span
                            key={index}
                            className={`custom-bullet ${currentIndex === index ? 'active' : ''}`}
                            onClick={() => handleBulletClick(index)}
                            aria-label={t('homeBestServ.slideAriaLabel', { slideNumber: index + 1 })}
                            role="button"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HomeBestServ;