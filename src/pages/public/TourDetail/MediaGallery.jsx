import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { ImageOff, Images } from "lucide-react";
import Lightbox from "./Lightbox.jsx";

/**
 * Detail-page gallery. Desktop: one large photo plus up to two stacked photos
 * (bento); phones: a swipeable scroll-snap row with every photo. Any photo opens
 * the lightbox. Nothing is overlaid on the photos; broken files show a quiet
 * placeholder instead of the browser's broken-image icon.
 *
 * @param {string[]} images
 * @param {string} alt       base alt text (usually the item name)
 * @param {boolean} [loading]
 */
function MediaGallery({ images = [], alt = "", loading = false }) {
    const { t } = useTranslation();
    const [failed, setFailed] = useState(() => new Set());
    const [openAt, setOpenAt] = useState(null);
    const count = images.length;

    const markFailed = useCallback((src) => setFailed((prev) => new Set(prev).add(src)), []);
    const go = (dir) => setOpenAt((i) => (i + dir + count) % count);

    if (loading) {
        return (
            <div className="media-gallery media-gallery--trio" aria-hidden="true">
                <div className="media-gallery__grid">
                    <div className="media-gallery__item skeleton" />
                    <div className="media-gallery__item skeleton" />
                    <div className="media-gallery__item skeleton" />
                </div>
            </div>
        );
    }

    if (!count) {
        return (
            <div className="media-gallery media-gallery--single">
                <div className="media-gallery__grid">
                    <div className="media-gallery__item">
                        <span className="media-gallery__placeholder">
                            <ImageOff size={36} strokeWidth={1.75} aria-hidden="true" />
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    const layout = count >= 3 ? "trio" : count === 2 ? "duo" : "single";
    const photoLabel = (i) => `${t("gallery.photo", "Photo")} ${i + 1} / ${count}`;

    return (
        <div className={`media-gallery media-gallery--${layout}`}>
            <ul className="media-gallery__grid">
                {images.map((src, i) => (
                    <li className="media-gallery__item" key={src + i}>
                        <button
                            type="button"
                            className="media-gallery__tile"
                            onClick={() => setOpenAt(i)}
                            aria-label={`${t("gallery.open", "Open photo gallery")}: ${photoLabel(i)}`}
                        >
                            {failed.has(src) ? (
                                <span className="media-gallery__placeholder">
                                    <ImageOff size={32} strokeWidth={1.75} aria-hidden="true" />
                                </span>
                            ) : (
                                <img
                                    src={src}
                                    alt={i === 0 ? alt : `${alt}, ${photoLabel(i)}`}
                                    width="1200"
                                    height="800"
                                    decoding="async"
                                    loading={i < 3 ? "eager" : "lazy"}
                                    fetchPriority={i === 0 ? "high" : undefined}
                                    onError={() => markFailed(src)}
                                />
                            )}
                        </button>
                    </li>
                ))}
            </ul>

            {count > 3 && (
                <button type="button" className="btn btn--secondary btn--sm media-gallery__all" onClick={() => setOpenAt(0)}>
                    <Images size={18} strokeWidth={1.75} aria-hidden="true" />
                    {t("gallery.open", "Open photo gallery")}
                    <span className="tabular">({count})</span>
                </button>
            )}

            {openAt !== null && (
                <Lightbox
                    label={alt || t("gallery.open", "Open photo gallery")}
                    onClose={() => setOpenAt(null)}
                    onPrev={count > 1 ? () => go(-1) : undefined}
                    onNext={count > 1 ? () => go(1) : undefined}
                    counter={count > 1 ? `${openAt + 1} / ${count}` : undefined}
                >
                    {failed.has(images[openAt]) ? (
                        <span className="lightbox__placeholder">
                            <ImageOff size={48} strokeWidth={1.75} aria-hidden="true" />
                        </span>
                    ) : (
                        <img className="lightbox__img" src={images[openAt]} alt={`${alt}, ${photoLabel(openAt)}`} />
                    )}
                </Lightbox>
            )}
        </div>
    );
}

export default MediaGallery;
