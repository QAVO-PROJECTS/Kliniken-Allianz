import './index.scss'
import {HiOutlineArrowLeft, HiOutlineArrowRight} from "react-icons/hi";
import {useRef, useState} from "react";
import ServiceDetailCard from "../../../../components/UserComponents/ServicesDetailCard/index.jsx";
import BestServCard from "../../../../components/UserComponents/Home/BestServiceCard/index.jsx";

function HomeBestServ() {
    const sliderRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const cards = [1, 2, 3, 4, 5, 6]; // Example: 5 cards, adjust based on your data

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
        <div id={"home-best-service"}>
            <div className={"container"}>
                <div className="header">
                    <div className="content">
                        <h2>Ən çox seçilən xidmətlər</h2>

                    </div>
                    <div className="navigationBtn">
                        <button className="prev" onClick={handlePrev}>
                            <HiOutlineArrowLeft/>
                        </button>
                        <button className="next" onClick={handleNext}>
                            <HiOutlineArrowRight/>
                        </button>
                    </div>
                </div>
                <div className="slider-wrapper">
                    <div className="slider-card row" ref={sliderRef}>
                        {cards.map((_, index) => (
                            <BestServCard key={index}/>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}

export default HomeBestServ;