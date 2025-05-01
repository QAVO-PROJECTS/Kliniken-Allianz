import image from "/src/assets/icons/1.svg";
import image1 from "/src/assets/commentCardImage.jpg";
import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi";
import { useRef, useState } from "react";
import "./index.scss";

function CommentCard({ name, country, text }) {
    const sliderRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Fake data for multiple comment cards
    const fakeComments = [
        { name: "John Doe", country: "USA", text: "This is an amazing platform!" },
        { name: "Jane Smith", country: "Canada", text: "Really helpful and easy to use." },
        { name: "Ali Yılmaz", country: "Turkey", text: "Fantastic experience!" },
        { name: "Emma Brown", country: "UK", text: "Highly recommend to everyone." },
        { name: "Carlos Rivera", country: "Spain", text: "Great service and support." },
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
                        <p>{comment.text}</p>
                        <div className="comment-author">
                            <div className="text">
                                <div className="image">
                                    <img src={image1} alt="author" />
                                </div>
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "start",
                                }}>
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