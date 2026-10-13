import { useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import "./shared.scss";

/**
 * Hero gallery: one large image plus a strip of thumbnails.
 * @param {string[]} images absolute image URLs
 * @param {string} alt base alt text
 */
function MediaGallery({ images = [], alt = "" }) {
    const [active, setActive] = useState(0);
    const count = images.length;
    const index = Math.min(active, Math.max(count - 1, 0));

    if (count === 0) {
        return (
            <div className="md-gallery md-gallery--empty" aria-hidden="true">
                <ImageOff size={40} strokeWidth={1.5} />
            </div>
        );
    }

    const go = (dir) => setActive((index + dir + count) % count);

    return (
        <div className="md-gallery">
            <div className="md-gallery__main">
                <img
                    key={images[index]}
                    src={images[index]}
                    alt={count > 1 ? `${alt} — ${index + 1}/${count}` : alt}
                    fetchPriority="high"
                    decoding="async"
                />
                {count > 1 && (
                    <>
                        <button type="button" className="md-gallery__nav md-gallery__nav--prev" onClick={() => go(-1)} aria-label="Previous image">
                            <ChevronLeft size={22} className="md-flip-rtl" />
                        </button>
                        <button type="button" className="md-gallery__nav md-gallery__nav--next" onClick={() => go(1)} aria-label="Next image">
                            <ChevronRight size={22} className="md-flip-rtl" />
                        </button>
                        <span className="md-gallery__counter">{index + 1} / {count}</span>
                    </>
                )}
            </div>
            {count > 1 && (
                <div className="md-gallery__thumbs" role="tablist">
                    {images.map((src, i) => (
                        <button
                            type="button"
                            role="tab"
                            key={src + i}
                            aria-selected={i === index}
                            aria-label={`${alt} ${i + 1}`}
                            className={`md-gallery__thumb${i === index ? " is-active" : ""}`}
                            onClick={() => setActive(i)}
                        >
                            <img src={src} alt="" loading="lazy" decoding="async" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MediaGallery;
