import { SearchX } from "lucide-react";
import "./listing.scss";

/** Placeholder cards shown while a listing is loading. */
export function SkeletonGrid({ count = 8, className = "" }) {
    return (
        <div className={`listing-grid ${className}`.trim()} aria-hidden="true">
            {Array.from({ length: count }).map((_, i) => (
                <div className="skeleton-card" key={i}>
                    <div className="skeleton skeleton-card__media" />
                    <div className="skeleton-card__body">
                        <div className="skeleton skeleton-card__line skeleton-card__line--title" />
                        <div className="skeleton skeleton-card__line" />
                        <div className="skeleton skeleton-card__line skeleton-card__line--short" />
                    </div>
                </div>
            ))}
        </div>
    );
}

/** Friendly "nothing found" block with an optional action. */
export function EmptyState({ title, text, action, icon: Icon = SearchX }) {
    return (
        <div className="empty-state" role="status">
            <span className="empty-state__icon">
                <Icon size={28} strokeWidth={1.75} aria-hidden="true" />
            </span>
            {title && <h3>{title}</h3>}
            {text && <p>{text}</p>}
            {action}
        </div>
    );
}
