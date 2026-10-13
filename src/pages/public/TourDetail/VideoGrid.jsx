import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Play, X } from "lucide-react";

const getYoutubeId = (url = "") => {
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/);
    return m ? m[1] : null;
};

/** Grid of YouTube thumbnails that open an embedded player in a modal. */
function VideoGrid({ videos = [], title = "" }) {
    const { t } = useTranslation();
    const [activeId, setActiveId] = useState(null);
    const items = videos.map((url) => ({ url, id: getYoutubeId(url) })).filter((v) => v.id);

    useEffect(() => {
        if (!activeId) return undefined;
        const onKey = (e) => e.key === "Escape" && setActiveId(null);
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [activeId]);

    if (!items.length) return null;

    return (
        <>
            <div className={`video-grid${items.length === 1 ? " video-grid--single" : ""}`}>
                {items.map((v, i) => (
                    <button
                        type="button"
                        className="video-grid__item"
                        key={v.id + i}
                        onClick={() => setActiveId(v.id)}
                        aria-label={`${t("video.play", "Play video")} ${i + 1}${title ? ` — ${title}` : ""}`}
                    >
                        <img
                            src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                            alt=""
                            loading="lazy"
                            decoding="async"
                        />
                        <span className="video-grid__play" aria-hidden="true">
                            <Play size={26} strokeWidth={2} fill="currentColor" />
                        </span>
                    </button>
                ))}
            </div>

            {activeId && (
                <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setActiveId(null)}>
                    <button type="button" className="lightbox__close" onClick={() => setActiveId(null)} aria-label={t("gallery.close", "Close")}>
                        <X size={22} strokeWidth={2} />
                    </button>
                    <div className="lightbox__video" onClick={(e) => e.stopPropagation()}>
                        <iframe
                            src={`https://www.youtube.com/embed/${activeId}?autoplay=1`}
                            title={title || "video"}
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </>
    );
}

export default VideoGrid;
