import "./shared.scss";

/** Composed empty state: icon, title, short text and an optional action. `icon` is a lucide component. */
export function EmptyState({ icon: Icon, title, text, children, compact = false }) {
    return (
        <div className={`md-empty${compact ? " md-empty--compact" : ""}`} role="status">
            {Icon && (
                <span className="md-empty__icon" aria-hidden="true">
                    <Icon size={compact ? 20 : 26} strokeWidth={1.75} />
                </span>
            )}
            <div>
                {title && <p className="md-empty__title">{title}</p>}
                {text && <p className="md-empty__text">{text}</p>}
            </div>
            {children}
        </div>
    );
}

/** Placeholder cards with the same silhouette as the media cards they stand in for. */
export function SkeletonGrid({ count = 6, ratio = "4 / 3", className = "", meta = true }) {
    return (
        <div className={`md-grid ${className}`.trim()} aria-hidden="true">
            {Array.from({ length: count }).map((_, i) => (
                <div className="md-skel-card" key={i}>
                    <div className="md-skel" style={{ aspectRatio: ratio }} />
                    <div className="md-skel-card__body">
                        <div className="md-skel md-skel--title" />
                        {meta && <div className="md-skel md-skel--line md-skel--short" />}
                    </div>
                </div>
            ))}
        </div>
    );
}

/** Generic skeleton block (lines default to a pill shape; pass `variant="block"` or `"hero"` for media). */
export function SkeletonBlock({ height, width = "100%", variant, className = "" }) {
    const cls = ["md-skel", variant && `md-skel--${variant}`, className].filter(Boolean).join(" ");
    return <div className={cls} style={{ height, width }} aria-hidden="true" />;
}
