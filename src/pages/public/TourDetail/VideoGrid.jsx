import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Play } from "lucide-react";
import Lightbox from "./Lightbox.jsx";

const getYoutubeId = (url = "") => {
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/);
    return m ? m[1] : null;
};

/** Grid of YouTube thumbnails that open an embedded player in a dialog. */
function VideoGrid({ videos = [], title = "" }) {
    const { t } = useTranslation();
    const [activeId, setActiveId] = useState(null);
    const items = videos.map((url) => ({ url, id: getYoutubeId(url) })).filter((v) => v.id);

    if (!items.length) return null;

    const playLabel = (i) => `${t("video.play", "Play video")} ${i + 1}${title ? `: ${title}` : ""}`;

    return (
        <>
            <div className={`video-grid${items.length === 1 ? " video-grid--single" : ""}`}>
                {items.map((v, i) => (
                    <button
                        type="button"
                        className="video-grid__item"
                        key={v.id + i}
                        onClick={() => setActiveId(v.id)}
                        aria-label={playLabel(i)}
                    >
                        <img
                            src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                            alt=""
                            width="480"
                            height="360"
                            loading="lazy"
                            decoding="async"
                        />
                        <span className="video-grid__play" aria-hidden="true">
                            <Play size={24} strokeWidth={1.75} fill="currentColor" />
                        </span>
                    </button>
                ))}
            </div>

            {activeId && (
                <Lightbox label={title || t("video.play", "Play video")} onClose={() => setActiveId(null)}>
                    <div className="lightbox__video">
                        <iframe
                            src={`https://www.youtube.com/embed/${activeId}?autoplay=1`}
                            title={title || t("video.play", "Play video")}
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </Lightbox>
            )}
        </>
    );
}

export default VideoGrid;
