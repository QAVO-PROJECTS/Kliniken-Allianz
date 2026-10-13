import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Building2, ChevronLeft, ChevronRight } from "lucide-react";
import "./shared.scss";

/**
 * Hero gallery: one large image with prev/next controls plus a thumbnail strip.
 * Images that fail to load are dropped; with none left a quiet placeholder shows.
 * @param {string[]} images absolute image URLs
 * @param {string} alt base alt text
 * @param {import("react").ComponentType} [placeholderIcon] lucide icon for the empty state
 */
function MediaGallery({ images = [], alt = "", placeholderIcon: PlaceholderIcon = Building2 }) {
    const { t } = useTranslation();
    const [active, setActive] = useState(0);
    const [failed, setFailed] = useState(() => new Set());

    const list = images.filter((src) => src && !failed.has(src));
    const count = list.length;
    const index = Math.min(active, Math.max(count - 1, 0));
    const markFailed = (src) => setFailed((prev) => new Set(prev).add(src));

    if (count === 0) {
        return (
            <div className="md-gallery md-gallery--empty" aria-hidden="true">
                <PlaceholderIcon size={44} strokeWidth={1.75} />
            </div>
        );
    }

    const go = (dir) => setActive((index + dir + count) % count);
    const label = (i) => (count > 1 ? `${alt} (${i + 1}/${count})` : alt);

    return (
        <div className="md-gallery">
            <div className="md-gallery__main">
                <img
                    key={list[index]}
                    src={list[index]}
                    alt={label(index)}
                    width="1600"
                    height="1000"
                    fetchPriority="high"
                    decoding="async"
                    onError={() => markFailed(list[index])}
                />
                {count > 1 && (
                    <>
                        <button
                            type="button"
                            className="md-gallery__nav md-gallery__nav--prev"
                            onClick={() => go(-1)}
                            aria-label={t("gallery.prev")}
                        >
                            <ChevronLeft size={22} strokeWidth={1.75} className="md-flip-rtl" aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            className="md-gallery__nav md-gallery__nav--next"
                            onClick={() => go(1)}
                            aria-label={t("gallery.next")}
                        >
                            <ChevronRight size={22} strokeWidth={1.75} className="md-flip-rtl" aria-hidden="true" />
                        </button>
                    </>
                )}
            </div>
            {count > 1 && (
                <div className="md-gallery__thumbs">
                    {list.map((src, i) => (
                        <button
                            type="button"
                            key={src}
                            aria-pressed={i === index}
                            aria-label={label(i)}
                            className="md-gallery__thumb"
                            onClick={() => setActive(i)}
                        >
                            <img
                                src={src}
                                alt=""
                                width="112"
                                height="84"
                                loading="lazy"
                                decoding="async"
                                onError={() => markFailed(src)}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MediaGallery;
