import "./index.scss";
import { Link } from "react-router-dom";
import image from "/src/assets/ServicDetailFirst.png";
import arrow from "/src/assets/arrowService.png";
import image1 from "/src/assets/Group.png";
import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi";
import ServiceDetailCard from "../../../components/UserComponents/ServicesDetailCard/index.jsx";
import { useRef, useState } from "react";

function ServiceDetail() {
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
        <div id={"serviceDetail"}>
            <div className={"container"}>
                <div className={"head"}>
                    <p data-aos="fade-up" data-aos-delay="100">
                        <Link to={"/"}>Ana səhifə</Link>
                        <div className={"dot"}></div>
                        <Link to={"/services"}>Xidmətlər</Link>
                        <div className={"dot active"}></div>
                        <Link to={"/services/:id"}>Xidmətlər</Link>
                    </p>
                </div>
                <div className={"row first-section"}>
                    <div className={"col-6"}>
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
                    <div className={"col-6"}>
                        <div className={"image"}>
                            <img src={image} alt="" />
                        </div>
                    </div>
                </div>
                <div className={"second-section"}>
                    <h2>Ürək-Damar Cərrahiyyəsi</h2>
                    <div className={"row"}>
                        <div className={"col-5"}>
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
                        <div className={"col-5"}>
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
        </div>
    );
}

export default ServiceDetail;