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
    const cards = [
        {
            name: t('homeBestServ.cards.cancer.name'),
            description: t('homeBestServ.cards.cancer.description'),
            imageUrl: image,
            icon: icon1,
        },
        {
            name: t('homeBestServ.cards.kardiologiya.name'),
            description: t('homeBestServ.cards.kardiologiya.description'),
            imageUrl: image2,
            icon: icon2,
        },
        {
            name: t('homeBestServ.cards.realibitasiya.name'),
            description: t('homeBestServ.cards.realibitasiya.description'),
            imageUrl: image3,
            icon: icon3,
        },
        {
            name: t('homeBestServ.cards.oftamologiya.name'),
            description: t('homeBestServ.cards.oftamologiya.description'),
            imageUrl: image4,
            icon: icon4,
        },
        {
            name: t('homeBestServ.cards.hepatologiya.name'),
            description: t('homeBestServ.cards.hepatologiya.description'),
            imageUrl: image5,
            icon: icon5,
        },
        {
            name: t('homeBestServ.cards.travmatologiya.name'),
            description: t('homeBestServ.cards.travmatologiya.description'),
            imageUrl: image6,
            icon: icon6,
        },
    ];
    const maxIndex = cards.length - visibleCards;

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
                    </div>
                    <div className="navigationBtn">
                        <button className="prev" onClick={handlePrev} aria-label={t('homeBestServ.prevButton')}>
                            <HiOutlineArrowLeft />
                        </button>
                        <button className="next" onClick={handleNext} aria-label={t('homeBestServ.nextButton')}>
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