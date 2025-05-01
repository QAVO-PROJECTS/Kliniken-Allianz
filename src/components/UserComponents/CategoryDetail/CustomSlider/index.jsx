import React, { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import './index.scss'
import serv1 from "/src/assets/Servis/genekoloq.png"
import serv2 from "/src/assets/Servis/ortaped.png"
import serv3 from "/src/assets/Servis/hepatoloq.png"
import serv4 from "/src/assets/Servis/heart.png"
import serv5 from "/src/assets/Servis/oftomoloq.png"
import serv6 from "/src/assets/Servis/cancer.png"
import serv7 from "/src/assets/Servis/travmatoloq.png"
import serv8 from "/src/assets/Servis/sssssssss.png"
// Kategoriler için örnek veri (ikonlar ve isimler)
const categories = [
    { name: "Ginekologiya", icon: serv1 },
    { name: "Onurğa müalicəsi", icon: serv2 },
    { name: "Hepatologiya", icon: serv3 },
    { name: "Kardiologiya", icon: serv4 },
    { name: "Oftalmologiya", icon: serv5 },
    { name: "Xərçəng müalicəsi", icon: serv6 },
    { name: "Travmatologiya", icon:serv7 },
    { name: "Fizioterapiya", icon: serv8 },
    { name: "Ginekologiya", icon: serv1 },
    { name: "Onurğa müalicəsi", icon: serv2 },
    { name: "Hepatologiya", icon: serv3 },
    { name: "Kardiologiya", icon: serv4 },
    { name: "Oftalmologiya", icon: serv5 },
    { name: "Xərçəng müalicəsi", icon: serv6 },
    { name: "Travmatologiya", icon:serv7 },
    { name: "Fizioterapiya", icon: serv8 },
    // Daha fazla kategori ekleyebilirsiniz
];

const CustomSlider = () => {
    const sliderRef = useRef(null);

    // Slider'ı sola kaydırma
    const scrollLeft = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: -200, behavior: "smooth" });
        }
    };

    // Slider'ı sağa kaydırma
    const scrollRight = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: 200, behavior: "smooth" });
        }
    };

    return (
        <div className="custom-slider">
            <button className="slider-btn left" onClick={scrollLeft}>
                <FaChevronLeft />
            </button>
            <div className="slider-container" ref={sliderRef}>
                {categories.map((category, index) => (
                    <div className="slider-item" key={index}>
                        <div className="icon"><img src={`${category.icon}`}/></div>
                        <span>{category.name}</span>
                    </div>
                ))}
            </div>
            <button className="slider-btn right" onClick={scrollRight}>
                <FaChevronRight />
            </button>
        </div>
    );
};

export default CustomSlider;