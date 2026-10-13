import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, Expand, Images, X } from "lucide-react";

/** Hero gallery: main image + thumbnails, with a keyboard-friendly lightbox. */
function MediaGallery({ images = [], alt = "", badge }) {
    const { t } = useTranslation();
    const [active, setActive] = useState(0);
    const [open, setOpen] = useState(false);
    const count = images.length;

    useEffect(() => setActive(0), [images.length, images[0]]); // eslint-disable-line react-hooks/exhaustive-deps

    const go = useCallback((dir) => setActive((i) => (i + dir + count) % count), [count]);

    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => {
            if (e.key === "Escape") setOpen(false);
            if (e.key === "ArrowRight") go(1);
            if (e.key === "ArrowLeft") go(-1);
        };
        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [open, go]);

    if (!count) return <div className="media-gallery__main media-gallery__main--empty skeleton" aria-hidden="true" />;

    return (
        <div className="media-gallery">
            <button
                type="button"
                className="media-gallery__main"
                onClick={() => setOpen(true)}
                aria-label={t("gallery.open", "Open photo gallery")}
            >
                <img src={images[active]} alt={alt} fetchPriority="high" />
                {badge && <span className="media-gallery__badge">{badge}</span>}
                <span className="media-gallery__zoom" aria-hidden="true">
                    <Expand size={18} strokeWidth={2} />
                </span>
                {count > 1 && (
                    <span className="media-gallery__count">
                        <Images size={16} strokeWidth={2} aria-hidden="true" />
                        <span dir="ltr">{active + 1} / {count}</span>
                    </span>
                )}
            </button>

            {count > 1 && (
                <div className="media-gallery__thumbs" role="list">
                    {images.map((src, i) => (
                        <button
                            type="button"
                            role="listitem"
                            key={src + i}
                            className={`media-gallery__thumb${i === active ? " is-active" : ""}`}
                            onClick={() => setActive(i)}
                            aria-label={`${t("gallery.photo", "Photo")} ${i + 1}`}
                            aria-current={i === active ? "true" : undefined}
                        >
                            <img src={src} alt="" loading="lazy" decoding="async" />
                        </button>
                    ))}
                </div>
            )}

            {open && (
                <div className="lightbox" role="dialog" aria-modal="true" aria-label={alt} onClick={() => setOpen(false)}>
                    <button type="button" className="lightbox__close" onClick={() => setOpen(false)} aria-label={t("gallery.close", "Close")}>
                        <X size={22} strokeWidth={2} />
                    </button>
                    {count > 1 && (
                        <>
                            <button
                                type="button"
                                className="lightbox__nav lightbox__nav--prev"
                                onClick={(e) => { e.stopPropagation(); go(-1); }}
                                aria-label={t("gallery.prev", "Previous photo")}
                            >
                                <ChevronLeft size={26} strokeWidth={2} />
                            </button>
                            <button
                                type="button"
                                className="lightbox__nav lightbox__nav--next"
                                onClick={(e) => { e.stopPropagation(); go(1); }}
                                aria-label={t("gallery.next", "Next photo")}
                            >
                                <ChevronRight size={26} strokeWidth={2} />
                            </button>
                        </>
                    )}
                    <img src={images[active]} alt={alt} onClick={(e) => e.stopPropagation()} />
                    {count > 1 && <span className="lightbox__counter" dir="ltr">{active + 1} / {count}</span>}
                </div>
            )}
        </div>
    );
}

export default MediaGallery;
