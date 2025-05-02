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
                            <div className={"icons"}>
                                <div className={"icon3"}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="57" height="57" viewBox="0 0 57 57"
                                         fill="none">
                                        <path opacity="0.5"
                                              d="M23.75 40.375C23.75 52.25 43.9375 53.4375 43.9375 40.375V30.875"
                                              stroke="#CACACA"/>
                                        <path opacity="0.5" d="M43.9375 27.2886H43.9612V27.3123H43.9375V27.2886Z"
                                              stroke="#47D1D6" stroke-opacity="0.78" stroke-linejoin="round"/>
                                        <path
                                            d="M47.5 27.3125C47.5 29.28 45.905 30.875 43.9375 30.875C41.97 30.875 40.375 29.28 40.375 27.3125C40.375 25.345 41.97 23.75 43.9375 23.75C45.905 23.75 47.5 25.345 47.5 27.3125Z"
                                            stroke="#47D1D6" stroke-opacity="0.78"/>
                                        <path
                                            d="M17.8125 11.875V11.875C15.0448 11.875 13.661 11.875 12.7887 12.7193C12.7652 12.742 12.742 12.7652 12.7193 12.7887C11.875 13.661 11.875 15.0448 11.875 17.8125V28.5C11.875 34.0353 11.875 36.803 13.5635 38.5477C13.609 38.5947 13.6553 38.641 13.7023 38.6865C15.447 40.375 18.2147 40.375 23.75 40.375V40.375C29.2853 40.375 32.053 40.375 33.7977 38.6865C33.8447 38.641 33.891 38.5947 33.9365 38.5477C35.625 36.803 35.625 34.0353 35.625 28.5V16.625C35.625 14.992 35.625 14.1755 35.3156 13.5481C35.0235 12.9558 34.5442 12.4765 33.9519 12.1844C33.3245 11.875 32.508 11.875 30.875 11.875V11.875M17.8125 11.875C17.8125 13.1867 18.8758 14.25 20.1875 14.25C21.4992 14.25 22.5625 13.1867 22.5625 11.875C22.5625 10.5633 21.4992 9.5 20.1875 9.5C18.8758 9.5 17.8125 10.5633 17.8125 11.875ZM30.875 11.875C30.875 13.1867 29.8117 14.25 28.5 14.25C27.1883 14.25 26.125 13.1867 26.125 11.875C26.125 10.5633 27.1883 9.5 28.5 9.5C29.8117 9.5 30.875 10.5633 30.875 11.875Z"
                                            stroke="#37DEA1" stroke-opacity="0.51"/>
                                    </svg>
                                </div>
                                <div className={"icon2"}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"
                                         fill="none">
                                        <path
                                            d="M25 43.5325C14.5833 39.5835 6.25 30.4731 6.25 19.4559C6.25 13.3077 10.9187 8.3335 16.675 8.3335C20.0875 8.3335 23.1062 10.0844 25 12.7904C26.8937 10.0844 29.9312 8.3335 33.325 8.3335C39.0812 8.3335 43.75 13.3077 43.75 19.4559C43.75 28.7737 35.4167 39.5835 25 43.5325Z"
                                            stroke="#E9E9E9" stroke-opacity="0.78" stroke-width="2.375"
                                            stroke-linecap="round" stroke-linejoin="round"/>
                                        <path opacity="0.5"
                                              d="M42.7087 25H37.7463C37.5888 25 37.4378 24.9374 37.3264 24.8261L34.9578 22.4575C34.6713 22.1709 34.1882 22.2493 34.0069 22.6118L31.6187 27.3882C31.4375 27.7507 30.9544 27.8291 30.6678 27.5425L28.6209 25.4956C28.3615 25.2362 27.9312 25.2718 27.7179 25.5703L23.6825 31.2199C23.3852 31.6361 22.7359 31.5067 22.6208 31.0083L20.1394 20.2552C20.0171 19.7253 19.3059 19.625 19.0418 20.1004L15.0283 27.3246C14.8194 27.7007 14.2924 27.7366 14.0343 27.3925L11.8694 24.506C11.6526 24.217 11.2301 24.1869 10.9746 24.4424L9.54923 25.8678C9.43788 25.9791 9.28686 26.0417 9.12939 26.0417H7.29199"
                                              stroke="#37DEA1" stroke-opacity="0.51" stroke-width="2.375"
                                              stroke-linecap="round"/>
                                    </svg>
                                </div>
                                <div className={"icon4"}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="51" height="51" viewBox="0 0 51 51"
                                         fill="none">
                                        <path
                                            d="M45.6875 25.5C45.6875 37.2361 37.2361 45.6875 25.5 45.6875C13.7639 45.6875 5.3125 37.2361 5.3125 25.5C5.3125 13.7639 13.7639 5.3125 25.5 5.3125C37.2361 5.3125 45.6875 13.7639 45.6875 25.5Z"
                                            stroke="#83EFC8" stroke-opacity="0.51" stroke-width="1.95833"/>
                                        <path opacity="0.5"
                                              d="M22.0533 16.8502C21.8511 17.3383 21.8511 17.9572 21.8511 19.1948V21.7336C21.8511 21.789 21.8511 21.8167 21.8339 21.8339C21.8167 21.8511 21.789 21.8511 21.7336 21.8511H19.1948C17.9572 21.8511 17.3383 21.8511 16.8502 22.0533C16.1993 22.3229 15.6822 22.84 15.4126 23.4908C15.2104 23.979 15.2104 24.5978 15.2104 25.8354C15.2104 27.0731 15.2104 27.6919 15.4126 28.1801C15.6822 28.8309 16.1993 29.348 16.8502 29.6176C17.3383 29.8198 17.9572 29.8198 19.1948 29.8198H21.7336C21.789 29.8198 21.8167 29.8198 21.8339 29.837C21.8511 29.8542 21.8511 29.8819 21.8511 29.9373V32.4761C21.8511 33.7137 21.8511 34.3326 22.0533 34.8207C22.3229 35.4716 22.84 35.9887 23.4908 36.2583C23.979 36.4605 24.5978 36.4604 25.8354 36.4604C27.0731 36.4604 27.6919 36.4605 28.1801 36.2583C28.8309 35.9887 29.348 35.4716 29.6176 34.8207C29.8198 34.3326 29.8198 33.7137 29.8198 32.4761V29.9373C29.8198 29.8819 29.8198 29.8542 29.837 29.837C29.8542 29.8198 29.8819 29.8198 29.9373 29.8198H32.4761C33.7137 29.8198 34.3326 29.8198 34.8207 29.6176C35.4716 29.348 35.9887 28.8309 36.2583 28.1801C36.4605 27.6919 36.4604 27.0731 36.4604 25.8354C36.4604 24.5978 36.4605 23.979 36.2583 23.4908C35.9887 22.84 35.4716 22.3229 34.8207 22.0533C34.3326 21.8511 33.7137 21.8511 32.4761 21.8511H29.9373C29.8819 21.8511 29.8542 21.8511 29.837 21.8339C29.8198 21.8167 29.8198 21.789 29.8198 21.7336V19.1948C29.8198 17.9572 29.8198 17.3383 29.6176 16.8502C29.348 16.1993 28.8309 15.6822 28.1801 15.4126C27.6919 15.2104 27.0731 15.2104 25.8354 15.2104C24.5978 15.2104 23.979 15.2104 23.4908 15.4126C22.84 15.6822 22.3229 16.1993 22.0533 16.8502Z"
                                              stroke="#83EFC8" stroke-opacity="0.51" stroke-width="1.95833"/>
                                    </svg>
                                </div>
                            </div>
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