import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, Quote, UserRound } from "lucide-react";
import "./index.scss";
import { getLocalizedText } from "../../../i18n/getLocalizedText.js";
import { VIEW_CARD_IMAGES } from "../../../config/mediaUrls.js";

function Avatar({ src, alt }) {
    const [failed, setFailed] = useState(false);
    return (
        <span className="review-card__avatar">
            {src && !failed ? (
                <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} />
            ) : (
                <UserRound size={22} strokeWidth={1.75} aria-hidden="true" />
            )}
        </span>
    );
}

/**
 * Testimonial slider (one review at a time).
 * Star ratings are intentionally not shown: the API's `rating` values are
 * unreliable (glowing reviews stored as 1).
 * Props: currentIndex, setCurrentIndex, fakeComments (array of customer views)
 */
function CommentCard({ currentIndex, setCurrentIndex, fakeComments }) {
    const { t } = useTranslation();
    const comments = fakeComments || [];
    const total = comments.length;
    if (!total) return null;

    const handlePrev = () => currentIndex > 0 && setCurrentIndex(currentIndex - 1);
    const handleNext = () => currentIndex < total - 1 && setCurrentIndex(currentIndex + 1);

    return (
        <div className="review-slider comment-card-container" aria-roledescription="carousel">
            <div className="review-slider__viewport">
                <div className="review-slider__track" style={{ "--i": currentIndex }}>
                    {comments.map((comment, index) => {
                        const name = getLocalizedText(comment, "customerName");
                        return (
                            <div
                                className="review-slider__slide"
                                key={comment.id ?? index}
                                aria-hidden={index !== currentIndex}
                                aria-roledescription="slide"
                                aria-label={`${index + 1} / ${total}`}
                            >
                            <figure className="review-card comment-card">
                                <span className="review-card__quote" aria-hidden="true">
                                    <Quote size={22} strokeWidth={2} />
                                </span>
                                <blockquote className="review-card__text">
                                    <p>{getLocalizedText(comment, "reviewText")}</p>
                                </blockquote>
                                <figcaption className="review-card__author">
                                    <Avatar src={comment.profilImage && VIEW_CARD_IMAGES + comment.profilImage} alt={name} />
                                    <span>
                                        <span className="review-card__name">{name}</span>
                                        <span className="review-card__country">{getLocalizedText(comment, "country")}</span>
                                    </span>
                                </figcaption>
                            </figure>
                            </div>
                        );
                    })}
                </div>
            </div>

            {total > 1 && (
                <div className="review-slider__nav navigationBtn">
                    <button
                        type="button"
                        className="review-slider__btn prev"
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        aria-label={t("pagination.prev", "Previous")}
                    >
                        <ChevronLeft size={20} strokeWidth={2} aria-hidden="true" />
                    </button>
                    <span className="review-slider__count" aria-live="polite">
                        <strong>{currentIndex + 1}</strong> / {total}
                    </span>
                    <button
                        type="button"
                        className="review-slider__btn next"
                        onClick={handleNext}
                        disabled={currentIndex === total - 1}
                        aria-label={t("pagination.next", "Next")}
                    >
                        <ChevronRight size={20} strokeWidth={2} aria-hidden="true" />
                    </button>
                </div>
            )}
        </div>
    );
}

export default CommentCard;
