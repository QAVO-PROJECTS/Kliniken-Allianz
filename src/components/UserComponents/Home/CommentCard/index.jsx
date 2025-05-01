// src/components/CommentCard.js
import image from "/src/assets/icons/1.svg";
import image1 from "/src/assets/commentCardImage.jpg";
import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation hook
import "./index.scss";

function CommentCard() {
    const { t } = useTranslation(); // Initialize translation hook
    const sliderRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Fake data for multiple comment cards (excluding text, which will come from i18n)
    const fakeComments = [
        { name: "John Doe", country: "USA" },
        { name: "Jane Smith", country: "Canada" },
        { name: "Ali Yılmaz", country: "Turkey" },
        { name: "Emma Brown", country: "UK" },
        { name: "Carlos Rivera", country: "Spain" },
        { name: "Maria Petrova", country: "Russia" },
    ];

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            sliderRef.current.style.transform = `translateX(-${(currentIndex - 1) * 100}%)`;
        }
    };

    const handleNext = () => {
        if (currentIndex < fakeComments.length - 1) {
            setCurrentIndex(currentIndex + 1);
            sliderRef.current.style.transform = `translateX(-${(currentIndex + 1) * 100}%)`;
        }
    };

    return (
        <div className="comment-card-container">
            <div className="comment-card-slider" ref={sliderRef}>
                {fakeComments.map((comment, index) => (
                    <div className="comment-card" key={index}>
                        <div className="quote-icon">
                            <img src={image} alt="quote icon" />
                        </div>
                        <p>{t(`translation.comments.${index}.text`)}</p> {/* Access translated text */}
                        <div className="comment-author">
                            <div className="text">
                                <div className="image">
                                    <img src={image1} alt="author" />
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "start",
                                    }}
                                >
                                    <h6 className="name">{comment.name}</h6>
                                    <span className="country">{comment.country}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="navigationBtn">
                <button
                    className="prev"
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                >
                    <HiOutlineArrowLeft />
                </button>
                <button
                    className="next"
                    onClick={handleNext}
                    disabled={currentIndex === fakeComments.length - 1}
                >
                    <HiOutlineArrowRight />
                </button>
            </div>
        </div>
    );
}

export default CommentCard;