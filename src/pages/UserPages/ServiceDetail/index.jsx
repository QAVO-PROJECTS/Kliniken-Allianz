import "./index.scss";
import { Link, useParams } from "react-router-dom";
import image from "/src/assets/ServicDetailFirst.png";
import arrow from "/src/assets/arrowService.png";
import image1 from "/src/assets/Group.png";
import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi";
import ServiceDetailCard from "../../../components/UserComponents/ServicesDetailCard/index.jsx";
import { useEffect, useRef, useState } from "react";
import { useGetServiceByIdQuery, useGetClinicByIdQuery } from "../../../services/userApi.jsx";

function ServiceDetail() {
    const { id } = useParams();
    const { data: getServiceById, isLoading: serviceLoading } = useGetServiceByIdQuery(id);
    const service = getServiceById?.data;

    // Fetch clinic data for each clinicId
    const clinicQueries = service?.clinicIds?.map((clinicId) =>
        useGetClinicByIdQuery(clinicId)
    ) || [];

    // Map clinic data to card format
    const cards = clinicQueries
        .map((query) => {
            const clinic = query?.data?.data;
            if (!clinic) return null;
            return {
                name: clinic.name || "Bilinmeyen Klinik",
                description: clinic.description || "Açıklama yok",
                imageUrl: clinic.imageUrl || "/src/assets/placeholder.png",
            };
        })
        .filter(Boolean) || []; // Varsayılan olarak boş dizi

    const sliderRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleCards, setVisibleCards] = useState(4);
    const isDragging = useRef(false);
    const startPos = useRef(0);
    const currentTranslate = useRef(0);
    const prevTranslate = useRef(0);

    const maxIndex = cards ? Math.max(0, cards.length - visibleCards) : 0;

    // Handle previous button
    const handlePrev = () => {
        if (cards && currentIndex > 0 && sliderRef.current) {
            setCurrentIndex(currentIndex - 1);
            sliderRef.current.style.transform = `translateX(-${(currentIndex - 1) * (100 / visibleCards)}%)`;
        }
    };

    // Handle next button
    const handleNext = () => {
        if (cards && currentIndex < maxIndex && sliderRef.current) {
            setCurrentIndex(currentIndex + 1);
            sliderRef.current.style.transform = `translateX(-${(currentIndex + 1) * (100 / visibleCards)}%)`;
        }
    };

    // Detect screen size and set visibleCards
    useEffect(() => {
        const updateVisibleCards = () => {
            if (window.innerWidth <= 576) {
                setVisibleCards(2);
            } else {
                setVisibleCards(4);
            }
        };

        updateVisibleCards();
        window.addEventListener("resize", updateVisibleCards);
        return () => window.removeEventListener("resize", updateVisibleCards);
    }, []);

    // Update slider position when visibleCards or currentIndex changes
    useEffect(() => {
        if (!cards || cards.length === 0 || serviceLoading || clinicQueries.some((query) => query.isLoading)) {
            return;
        }
        const newMaxIndex = Math.max(0, cards.length - visibleCards);
        if (currentIndex > newMaxIndex) {
            setCurrentIndex(newMaxIndex);
            if (sliderRef.current) {
                sliderRef.current.style.transform = `translateX(-${newMaxIndex * (100 / visibleCards)}%)`;
                currentTranslate.current = -newMaxIndex * (100 / visibleCards);
                prevTranslate.current = currentTranslate.current;
            }
        }
    }, [visibleCards, currentIndex, cards, serviceLoading, clinicQueries]);

    // Handle bullet navigation
    const handleBulletClick = (index) => {
        if (cards && index <= maxIndex && sliderRef.current) {
            setCurrentIndex(index);
            sliderRef.current.style.transform = `translateX(-${index * (100 / visibleCards)}%)`;
            prevTranslate.current = -index * (100 / visibleCards);
        }
    };

    const getPositionX = (event) => {
        return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
    };

    const startDragging = (event) => {
        if (!sliderRef.current) return;
        isDragging.current = true;
        startPos.current = getPositionX(event);
        sliderRef.current.style.transition = "none";
    };

    const stopDragging = () => {
        if (!isDragging.current || !sliderRef.current) return;
        isDragging.current = false;
        sliderRef.current.style.transition = "transform 0.3s ease-in-out";

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
        if (!isDragging.current || !sliderRef.current) return;
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
                        <Link to={`/services/${id}`}>{service?.name}</Link>
                    </p>
                </div>
                <div className={"row first-section"}>
                    <div className={"col-6 col-md-12 col-sm-12 col-xs-12 second"}>
                        <div className={"content"}>
                            <h2>{service?.name}</h2>
                            <p>{service?.description}</p>
                            <button>Müraciət et</button>
                            <img src={arrow} alt="" className="arrow" />
                        </div>
                    </div>
                    <div className={"col-6 col-md-12 col-sm-12 col-xs-12 first"}>
                        <div className={"image"}>
                            <img src={image} alt="" />
                            <div className={"icons"}>
                                {/* SVG ikonları burada */}
                            </div>
                        </div>
                    </div>
                </div>
                {service?.options?.length > 0 && (
                    <div className="second-section">
                        <h2>Xüsusiyyətlər</h2>
                        <div className="row">
                            {service.options.map((opt) => (
                                <div className={"col-3"} key={opt.id}>
                                    <li>
                                        <img src={image1} alt="" /> {opt.name}
                                    </li>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className="third-section">
                    <div className="header">
                        <div className="content">
                            <h2>Etibar Edilən Sağlamlıq Mərkəzləri</h2>
                            <p>
                                Kliniken Allianz yalnız beynəlxalq standartlara cavab verən,
                                müasir və etibarlı klinikalarla əməkdaşlıq edir.
                            </p>
                        </div>
                        <div className="navigationBtn">
                            <button className="prev" onClick={handlePrev} disabled={currentIndex === 0}>
                                <HiOutlineArrowLeft />
                            </button>
                            <button className="next" onClick={handleNext} disabled={currentIndex >= maxIndex}>
                                <HiOutlineArrowRight />
                            </button>
                        </div>
                    </div>
                    {serviceLoading || clinicQueries.some((query) => query.isLoading) ? (
                        <p>Klinikler yükleniyor...</p>
                    ) : clinicQueries.some((query) => query.error) ? (
                        <p>Klinikler yüklenirken hata oluştu. Lütfen tekrar deneyin.</p>
                    ) : cards.length === 0 ? (
                        <p>Klinik bulunamadı.</p>
                    ) : (
                        <>
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
                                    {cards.map((item, index) => (
                                        <ServiceDetailCard
                                            key={index}
                                            name={item.name}
                                            desc={item.description}
                                            img={item.imageUrl}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="custom-pagination">
                                {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                                    <span
                                        key={index}
                                        className={`custom-bullet ${currentIndex === index ? "active" : ""}`}
                                        onClick={() => handleBulletClick(index)}
                                        aria-label={`Slayt ${index + 1}'e git`}
                                        role="button"
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ServiceDetail;