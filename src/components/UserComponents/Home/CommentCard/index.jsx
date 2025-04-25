import image from "/src/assets/icons/“ 1.svg"
import image1 from "/src/assets/commentCardImage.jpg"
import {HiOutlineArrowLeft, HiOutlineArrowRight} from "react-icons/hi";
import {useRef, useState} from "react";
function CommentCard({ name, country, text }) {
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
        <div className="comment-card">
            <div className="quote-icon">
                <img src={image} />
            </div>
            <p>{text}</p>
            <div className="comment-author">
               <div className={"text"}>
                   <div className={"image"}>
                       <img src={image1} />
                   </div>
                   <div>
                       <h6 className="name">{name}</h6>
                       <span className="country">{country}</span>
                   </div>
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
        </div>
    );
}

export default CommentCard;