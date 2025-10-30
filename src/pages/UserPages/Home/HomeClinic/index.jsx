import './index.scss';
import { useRef, useState, useEffect } from 'react';
import ServiceDetailCard from '../../../../components/UserComponents/ServicesDetailCard/index.jsx';
import { HiOutlineArrowLeft, HiOutlineArrowRight } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import image from "/src/assets/ServiceDetailCard.png"
import {useGetAllClinicQuery} from "../../../../services/userApi.jsx";
import ClinicCard from "../../../../components/UserComponents/ClinicCard/index.jsx";
import {useMediaQuery} from "react-responsive";

function HomeClinic() {
    const { t, i18n } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleCards, setVisibleCards] = useState(3);
    const sliderRef = useRef(null);
    const isDragging = useRef(false);
    const startPos = useRef(0);
    const currentTranslate = useRef(0);
    const prevTranslate = useRef(0);
    const {data:getAllClinic} = useGetAllClinicQuery()
    const cardss = getAllClinic?.data || [];
const isMobile = useMediaQuery({maxWidth:768})
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
                setVisibleCards(3);
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

                <div className={'row'}>
                    <div className={"col-25 col-md-60 col-sm-60 col-xs-60"}>
                        <div className="content">
                            <h2>Etibar Edilən Sağlamlıq Mərkəzləri</h2>
                            <p>Kliniken Allianz yalnız beynəlxalq standartlara cavab verən, müasir və etibarlı klinikalarla əməkdaşlıq edir.</p>
                            {isMobile ? ('') : (<button className={'headBtn'}><span>Daha çox</span></button>)}
                        </div>
                    </div>
                    <div className={'col-35 col-md-60 col-sm-60 col-xs-60'}>
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
                                    <ClinicCard
                                        key={index}
                                        id={item.id}
                                        name={"Universitätsklinikum"}
                                        desc={"Frankfurt, Almaniya"}
                                        img={image}
                                        imgAlt={t('homeClinic.cardImgAlt', { name: getLocalizedText(item, 'name') })}
                                    />
                                ))}
                            </div>
                        </div>
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
                {isMobile ?  (<button className={'headBtn'}><span>Daha çox</span></button>) : ('')}
                <div className="header">

                    <div className="navigationBtn">
                        <button className="prev" onClick={handlePrev} aria-label={t('homeClinic.prevButton')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                                <path d="M5.44103 10.6904L9.81603 6.31543C9.89818 6.23328 10.0096 6.18713 10.1258 6.18713C10.242 6.18713 10.3534 6.23328 10.4355 6.31543C10.5177 6.39758 10.5638 6.509 10.5638 6.62518C10.5638 6.74136 10.5177 6.85278 10.4355 6.93493L6.80691 10.5627L16.2508 10.5627C16.3668 10.5627 16.4781 10.6088 16.5601 10.6908C16.6422 10.7729 16.6883 10.8841 16.6883 11.0002C16.6883 11.1162 16.6422 11.2275 16.5601 11.3095C16.4781 11.3916 16.3668 11.4377 16.2508 11.4377L6.80691 11.4377L10.4355 15.0654C10.5177 15.1476 10.5638 15.259 10.5638 15.3752C10.5638 15.4914 10.5177 15.6028 10.4355 15.6849C10.3534 15.7671 10.242 15.8132 10.1258 15.8132C10.0096 15.8132 9.89818 15.7671 9.81603 15.6849L5.44103 11.3099C5.40029 11.2693 5.36796 11.221 5.34591 11.1679C5.32385 11.1147 5.3125 11.0577 5.3125 11.0002C5.3125 10.9426 5.32385 10.8857 5.34591 10.8325C5.36796 10.7793 5.40029 10.7311 5.44103 10.6904Z" fill="#003778"/>
                            </svg>
                        </button>
                        <button className="next" onClick={handleNext} aria-label={t('homeClinic.nextButton')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                                <path d="M16.559 11.3096L12.184 15.6846C12.1018 15.7667 11.9904 15.8129 11.8742 15.8129C11.758 15.8129 11.6466 15.7667 11.5645 15.6846C11.4823 15.6024 11.4362 15.491 11.4362 15.3748C11.4362 15.2586 11.4823 15.1472 11.5645 15.0651L15.1931 11.4373L5.74922 11.4373C5.63319 11.4373 5.52191 11.3912 5.43986 11.3092C5.35781 11.2271 5.31172 11.1159 5.31172 10.9998C5.31172 10.8838 5.35781 10.7725 5.43986 10.6905C5.52191 10.6084 5.63319 10.5623 5.74922 10.5623L15.1931 10.5623L11.5645 6.93457C11.4823 6.85242 11.4362 6.741 11.4362 6.62482C11.4362 6.50864 11.4823 6.39722 11.5645 6.31507C11.6466 6.23292 11.758 6.18677 11.8742 6.18677C11.9904 6.18677 12.1018 6.23292 12.184 6.31507L16.559 10.6901C16.5997 10.7307 16.632 10.779 16.6541 10.8321C16.6761 10.8853 16.6875 10.9423 16.6875 10.9998C16.6875 11.0574 16.6761 11.1143 16.6541 11.1675C16.632 11.2207 16.5997 11.2689 16.559 11.3096Z" fill="#003778"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeClinic;