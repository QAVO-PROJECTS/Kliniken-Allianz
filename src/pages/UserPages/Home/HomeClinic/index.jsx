import "./index.scss"
import {HiOutlineArrowLeft, HiOutlineArrowRight} from "react-icons/hi";
import {useRef, useState} from "react";
import ServiceDetailCard from "../../../../components/UserComponents/ServicesDetailCard/index.jsx";
function HomeClinic() {
    const sliderRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const cards = [1, 2, 3, 4,5,6]; // Example: 5 cards, adjust based on your data

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
    return (
        <div id={"home-clinic"}>
            <div className="container">
                <div className="header">
                    <div className="content">
                        <h2>Xidmətin Göstərildiyi Sağlamlıq Mərkəzləri</h2>
                        <p>
                            Kliniken Allianz yalnız beynəlxalq standartlara cavab verən,
                            müasir və etibarlı klinikalarla əməkdaşlıq edir. Seçilmiş
                            klinikalar pasiyentlərə rahatlıq və peşəkar müalicə təklif edir.
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
                <div className="slider-wrapper">
                    <div className="slider-card row" ref={sliderRef}>
                        {cards.map((_, index) => (
                            <ServiceDetailCard  key={index}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeClinic;