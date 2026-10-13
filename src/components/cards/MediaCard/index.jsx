import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ImageOff } from "lucide-react";
import "./index.scss";

/** Intrinsic size for the <img> attributes, derived from the CSS aspect-ratio ("4 / 3"). */
const sizeFromRatio = (ratio) => {
    const [w, h] = String(ratio || "4 / 3").split("/").map((n) => Number(n.trim()));
    if (!w || !h) return { width: 640, height: 480 };
    return { width: 640, height: Math.round((640 * h) / w) };
};

/**
 * Generic image-on-top card used by clinic / sanatorium / tour / hotel / doctor cards.
 *
 * @param {string}  [to]          internal route: renders a <Link>
 * @param {string}  [href]        external URL: renders an <a target=_blank>
 * @param {string}  image         image URL
 * @param {string}  [imageAlt]
 * @param {string}  [ratio]       CSS aspect-ratio of the media, default "4 / 3"
 * @param {React.ReactNode} [badge]   small label shown in the body above the title (never on the photo)
 * @param {React.ReactNode} [overlay] extra content shown at the top of the body (never on the photo)
 * @param {React.ReactNode} title
 * @param {{icon?: React.ComponentType, text: React.ReactNode}[]} [meta]
 * @param {React.ReactNode} [children] extra body content
 * @param {React.ReactNode|false} [footer] replaces the arrow at the end of the footer row (meta sits at its start); false hides it
 * @param {string}  [className]
 */
function MediaCard({
    to,
    href,
    image,
    imageAlt = "",
    ratio,
    badge,
    overlay,
    title,
    meta = [],
    children,
    footer,
    className = "",
    ...rest
}) {
    const [failed, setFailed] = useState(false);
    const showImage = image && !failed;
    const metaItems = meta.filter((m) => m && m.text);
    const { width, height } = sizeFromRatio(ratio);

    const content = (
        <>
            <div className="mcard__media" style={ratio ? { aspectRatio: ratio } : undefined}>
                {showImage ? (
                    <img
                        src={image}
                        alt={imageAlt}
                        width={width}
                        height={height}
                        loading="lazy"
                        decoding="async"
                        onError={() => setFailed(true)}
                    />
                ) : (
                    <div className="mcard__placeholder" aria-hidden="true">
                        <ImageOff size={28} strokeWidth={1.75} />
                    </div>
                )}
            </div>

            <div className="mcard__body">
                {overlay && <div className="mcard__overlay">{overlay}</div>}
                {badge && <span className="mcard__badge">{badge}</span>}
                <h3 className="mcard__title">{title}</h3>
                {children}
                {(metaItems.length > 0 || footer !== false) && (
                    <div className="mcard__footer">
                        {metaItems.length > 0 && (
                            <div className="mcard__meta">
                                {metaItems.map(({ icon: Icon, text }, i) => (
                                    <span key={i}>
                                        {Icon && <Icon size={16} strokeWidth={1.75} aria-hidden="true" />}
                                        <span className="mcard__meta-text">{text}</span>
                                    </span>
                                ))}
                            </div>
                        )}
                        {footer !== false && (footer ?? (
                            <span className="mcard__arrow" aria-hidden="true">
                                <ArrowRight size={18} strokeWidth={1.75} />
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </>
    );

    const cls = `mcard ${className}`.trim();

    if (to) {
        return <Link to={to} className={cls} {...rest}>{content}</Link>;
    }
    if (href) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...rest}>
                {content}
            </a>
        );
    }
    return <article className={`${cls} mcard--static`} {...rest}>{content}</article>;
}

export default MediaCard;
