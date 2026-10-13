import { useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { useAdminT } from "../shared/adminStrings.js";
import { useObjectUrl } from "../shared/useObjectUrl.js";

/**
 * Click-or-drop file picker. Calls `onFiles(File[])` with the chosen files
 * (only the first one unless `multiple`).
 */
export function Dropzone({ onFiles, multiple = false, accept = "image/*", title, hint, compact = false, label }) {
    const at = useAdminT();
    const [dragging, setDragging] = useState(false);

    const emit = (fileList) => {
        const files = Array.from(fileList || []).filter((f) => {
            if (!accept || accept === "*") return true;
            return accept.split(",").some((rule) => {
                const r = rule.trim();
                if (r.endsWith("/*")) return f.type.startsWith(r.slice(0, -1));
                if (r.startsWith(".")) return f.name.toLowerCase().endsWith(r.toLowerCase());
                return f.type === r;
            });
        });
        if (files.length) onFiles(multiple ? files : [files[0]]);
    };

    return (
        <label
            className={`adm-dropzone${dragging ? " is-dragging" : ""}${compact ? " adm-dropzone--compact" : ""}`}
            onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                emit(e.dataTransfer.files);
            }}
        >
            <input
                type="file"
                accept={accept}
                multiple={multiple}
                aria-label={label || title || at("uploadHint")}
                onChange={(e) => {
                    emit(e.target.files);
                    e.target.value = "";
                }}
            />
            <span className="adm-dropzone__icon" aria-hidden="true">
                <UploadCloud size={22} strokeWidth={1.75} />
            </span>
            {title ? (
                <span className="adm-dropzone__title">{title}</span>
            ) : (
                <span className="adm-dropzone__title">
                    <strong>{at("uploadAction")}</strong> {at("uploadRest")}
                </span>
            )}
            <span className="adm-dropzone__hint">{hint || at("uploadHint")}</span>
        </label>
    );
}

/**
 * Thumbnail card for a File (preview URL created/revoked automatically) or a
 * remote image `src`. Shows a remove button when `onRemove` is given.
 */
export function FilePreview({ file, src, name, badge, onRemove, single = false, video = false }) {
    const at = useAdminT();
    const url = useObjectUrl(file, src);
    const caption = name ?? file?.name;
    const isVideo = video || file?.type?.startsWith("video/");
    return (
        <figure className={`adm-preview${single ? " adm-preview--single" : ""}`}>
            {url && (isVideo
                ? <video src={url} muted playsInline preload="metadata" />
                : <img src={url} alt={caption || ""} loading="lazy" decoding="async" />)}
            {badge && <span className="adm-preview__badge">{badge}</span>}
            {caption && <figcaption className="adm-preview__name" title={caption}>{caption}</figcaption>}
            {onRemove && (
                <button type="button" className="adm-preview__remove" onClick={onRemove} aria-label={`${at("remove")}${caption ? `: ${caption}` : ""}`}>
                    <X size={14} strokeWidth={2.25} aria-hidden="true" />
                </button>
            )}
        </figure>
    );
}

/** Responsive grid wrapper for <FilePreview> items. */
export function PreviewGrid({ children }) {
    return <div className="adm-previews">{children}</div>;
}
