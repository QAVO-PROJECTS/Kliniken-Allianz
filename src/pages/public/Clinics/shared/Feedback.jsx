import "./shared.scss";

/** Centered icon + text block for empty lists. `icon` is a lucide component. */
export function EmptyState({ icon: Icon, title, text, children, compact = false }) {
    return (
        <div className={`md-empty${compact ? " md-empty--compact" : ""}`} role="status">
            {Icon && (
                <span className="md-empty__icon" aria-hidden="true">
                    <Icon size={compact ? 22 : 28} strokeWidth={1.75} />
                </span>
            )}
            {title && <p className="md-empty__title">{title}</p>}
            {text && <p className="md-empty__text">{text}</p>}
            {children}
        </div>
    );
}

/** Shimmering placeholder cards shown while a query loads. */
export function SkeletonGrid({ count = 6, ratio = "4 / 3", className = "" }) {
    return (
        <div className={`md-grid ${className}`.trim()} aria-hidden="true">
            {Array.from({ length: count }).map((_, i) => (
                <div className="md-skel-card" key={i}>
                    <div className="md-skel" style={{ aspectRatio: ratio }} />
                    <div className="md-skel-card__body">
                        <div className="md-skel md-skel--line" />
                        <div className="md-skel md-skel--line md-skel--short" />
                    </div>
                </div>
            ))}
        </div>
    );
}

/** Generic skeleton block. */
export function SkeletonBlock({ height = 16, width = "100%", radius, className = "" }) {
    return (
        <div
            className={`md-skel ${className}`.trim()}
            style={{ height, width, borderRadius: radius }}
            aria-hidden="true"
        />
    );
}
