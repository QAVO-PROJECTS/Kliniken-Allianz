import image from "/src/assets/icons/1.svg";
import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi";
import { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./index.scss";

function CommentCard({ currentIndex, setCurrentIndex, fakeComments }) {
    const { t } = useTranslation();
    const sliderRef = useRef(null);

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < fakeComments.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    // currentIndex değiştiğinde slider'ı güncelle
    useEffect(() => {
        if (sliderRef.current) {
            sliderRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
    }, [currentIndex]);

    return (
        <div className="comment-card-container">
            <div className="comment-card-slider" ref={sliderRef}>
                {fakeComments.map((comment, index) => (
                    <div className="comment-card" key={index}>
                        <div className="quote-icon">
                            <img src={image} alt="quote icon" />
                        </div>
                        <p>{t(`translation.comments.${index}.text`)}</p>
                        <div className="comment-author">
                            <div className="text">
                                <div className="image">
                                    <img src={comment.image} alt="author" />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="22" viewBox="0 0 21 22" fill="none">
                        <path d="M4.94103 10.6907L9.31603 6.31567C9.39818 6.23352 9.5096 6.18737 9.62578 6.18737C9.74196 6.18737 9.85338 6.23352 9.93553 6.31567C10.0177 6.39783 10.0638 6.50925 10.0638 6.62542C10.0638 6.7416 10.0177 6.85302 9.93553 6.93517L6.30691 10.5629L15.7508 10.5629C15.8668 10.5629 15.9781 10.609 16.0601 10.6911C16.1422 10.7731 16.1883 10.8844 16.1883 11.0004C16.1883 11.1165 16.1422 11.2277 16.0601 11.3098C15.9781 11.3918 15.8668 11.4379 15.7508 11.4379L6.30691 11.4379L9.93553 15.0657C10.0177 15.1478 10.0638 15.2592 10.0638 15.3754C10.0638 15.4916 10.0177 15.603 9.93553 15.6852C9.85338 15.7673 9.74196 15.8135 9.62578 15.8135C9.5096 15.8135 9.39818 15.7673 9.31603 15.6852L4.94103 11.3102C4.90029 11.2695 4.86796 11.2213 4.84591 11.1681C4.82385 11.115 4.8125 11.058 4.8125 11.0004C4.8125 10.9429 4.82385 10.8859 4.84591 10.8327C4.86796 10.7796 4.90029 10.7313 4.94103 10.6907Z" fill="#003778"/>
                    </svg>
                </button>
                <button
                    className="next"
                    onClick={handleNext}
                    disabled={currentIndex === fakeComments.length - 1}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="22" viewBox="0 0 21 22" fill="none">
                        <path d="M16.059 11.3093L11.684 15.6843C11.6018 15.7665 11.4904 15.8126 11.3742 15.8126C11.258 15.8126 11.1466 15.7665 11.0645 15.6843C10.9823 15.6022 10.9362 15.4908 10.9362 15.3746C10.9362 15.2584 10.9823 15.147 11.0645 15.0648L14.6931 11.4371L5.24922 11.4371C5.13319 11.4371 5.02191 11.391 4.93986 11.3089C4.85781 11.2269 4.81172 11.1156 4.81172 10.9996C4.81172 10.8835 4.85781 10.7723 4.93986 10.6902C5.02191 10.6082 5.13319 10.5621 5.24922 10.5621L14.6931 10.5621L11.0645 6.93433C10.9823 6.85218 10.9362 6.74075 10.9362 6.62458C10.9362 6.5084 10.9823 6.39698 11.0645 6.31483C11.1466 6.23268 11.258 6.18652 11.3742 6.18652C11.4904 6.18652 11.6018 6.23268 11.684 6.31483L16.059 10.6898C16.0997 10.7305 16.132 10.7787 16.1541 10.8319C16.1761 10.885 16.1875 10.942 16.1875 10.9996C16.1875 11.0571 16.1761 11.1141 16.1541 11.1673C16.132 11.2204 16.0997 11.2687 16.059 11.3093Z" fill="#003778"/>
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default CommentCard;