import "./index.scss";
import { Link } from "react-router-dom";
import image from "/src/assets/ServicDetailFirst.png";
import arrow from "/src/assets/arrowService.png";
import image1 from "/src/assets/Group.png";
import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi";
import ServiceDetailCard from "../../../components/UserComponents/ServicesDetailCard/index.jsx";
import {useEffect, useRef, useState} from "react";
import image2 from "../../../assets/ServisDetailCard2.png";
import image11 from "../../../assets/ServiceDetailCard.png";
import image3 from "../../../assets/ServisDetailCard3.png";
import image4 from "../../../assets/ServisDetailCard4.png";
import image5 from "../../../assets/ServisDetailCard5.png";
import image6 from "../../../assets/ServisDetailCard6.png";

function ServiceDetail() {
    const sliderRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const cards = [{
        name: "Universitätsklinikum",
        description: "Frankfurt, Almaniya",
        imageUrl: image11,
    },
        {
            name: "Cleveland Clinic",
            description: "ABŞ",
            imageUrl: image2,
        },
        {
            name: "Anadolu Sağlık",
            description: "Türkiye",
            imageUrl: image3,
        },
        {
            name: "Bumrungrad",
            description: "Tailand",
            imageUrl: image4,
        },
        {
            name: "Hospital Universitario",
            description: "Madrid, İspaniya",
            imageUrl:image5,
        }, {
            name: "Singapore Hospital",
            description: "Sinqapur",
            imageUrl: image6,
        }]; // Example: 5 cards, adjust based on your data
    const isDragging = useRef(false);
    const startPos = useRef(0);
    const currentTranslate = useRef(0);
    const prevTranslate = useRef(0);
    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            sliderRef.current.style.transform = `translateX(-${(currentIndex - 1) * 25}%)`;
        }
    };

    const handleNext = () => {
        if (currentIndex < cards.length - 4) { // Show 4 cards at a time
            setCurrentIndex(currentIndex + 1);
            sliderRef.current.style.transform = `translateX(-${(currentIndex + 1) * 25}%)`;
        }
    };
    const [visibleCards, setVisibleCards] = useState(4); // Default to 4 cards

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
        <div id={"serviceDetail"}>
            <div className={"container"}>
                <div className={"head"}>
                    <p data-aos="fade-up" data-aos-delay="100">
                        <Link to={"/"}>Ana səhifə</Link>

                        <div className={"dot active"}></div>
                        <Link to={"/services/:id"}>Xidmətlər</Link>
                    </p>
                </div>
                <div className={"row first-section"}>
                    <div className={"col-6 col-md-12 col-sm-12 col-xs-12 second"}>
                        <div className={"content"}>
                            <h2>Ürək-Damar Cərrahiyyəsi</h2>
                            <p>
                                Ürək və damar xəstəlikləri dünya üzrə ən geniş yayılmış sağlamlıq
                                problemlərindəndir. Kliniken Allianz olaraq, bu sahədə
                                ixtisaslaşmış, beynəlxalq təcrübəyə malik həkimlər və yüksək
                                texnologiyalı klinikalarla əməkdaşlıq edirik.
                            </p>
                            <button>Müraciət et</button>
                            <img src={arrow} alt="" className="arrow" />
                        </div>
                    </div>
                    <div className={"col-6 col-md-12 col-sm-12 col-xs-12 first"}>
                        <div className={"image"}>
                            <img src={image} alt="" />
                        </div>
                    </div>
                </div>
                <div className={"second-section"}>
                    <h2>Ürək-Damar Cərrahiyyəsi</h2>
                    <div className={"row"}>
                        <div className={"col-5 col-md-12 col-sm-12 col-xs-12"}>
                            <li>
                                <img src={image1} alt="" /> Online Konsultasiya İmkanı
                            </li>
                            <li>
                                <img src={image1} alt="" /> Online Konsultasiya İmkanı
                            </li>
                            <li>
                                <img src={image1} alt="" /> Online Konsultasiya İmkanı
                            </li>
                        </div>
                        <div className={"col-5 col-md-12 col-sm-12 col-xs-12"}>
                            <li>
                                <img src={image1} alt="" /> Online Konsultasiya İmkanı
                            </li>
                            <li>
                                <img src={image1} alt="" /> Online Konsultasiya İmkanı
                            </li>
                            <li>
                                <img src={image1} alt="" /> Online Konsultasiya İmkanı
                            </li>
                        </div>
                    </div>
                </div>
                <div className="third-section">
                    <div className="header">
                        <div className="content">
                            <h2>Etibar Edilən Sağlamlıq Mərkəzləri</h2>
                            <p>
                                Kliniken Allianz yalnız beynəlxalq standartlara cavab verən, müasir və etibarlı klinikalarla əməkdaşlıq edir.
                            </p>
                        </div>
                        <div className="navigationBtn">
                            <button className="prev" onClick={handlePrev}>
                                <HiOutlineArrowLeft />
                            </button>
                            <button className="next" onClick={handleNext}>
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
                         onTouchMove={drag}>
                        <div className="slider-card row" ref={sliderRef}>
                            {cards.map((item, index) => (
                                    <ServiceDetailCard  key={index} name={item.name} desc={item.description} img={item.imageUrl} />
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
        </div>
    );
}

export default ServiceDetail;