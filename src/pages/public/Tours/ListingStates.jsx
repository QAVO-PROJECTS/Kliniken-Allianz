import { useTranslation } from "react-i18next";
import { SearchX } from "lucide-react";
import "./listing.scss";

/** Placeholder cards (shaped like MediaCard) shown while a listing is loading. */
export function SkeletonGrid({ count = 8, className = "" }) {
    const { t } = useTranslation();
    return (
        <div className={`listing-grid ${className}`.trim()} role="status" aria-busy="true">
            <span className="visually-hidden">{t("common.loading", "Loading…")}</span>
            {Array.from({ length: count }).map((_, i) => (
                <div className="skeleton-card" key={i} aria-hidden="true">
                    <div className="skeleton skeleton-card__media" />
                    <div className="skeleton-card__body">
                        <div className="skeleton skeleton-card__line skeleton-card__line--title" />
                        <div className="skeleton skeleton-card__line" />
                        <div className="skeleton skeleton-card__line skeleton-card__line--short" />
                        <div className="skeleton-card__foot">
                            <div className="skeleton" />
                            <div className="skeleton" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

/** Composed "nothing found" block: icon, heading, one sentence, optional action. */
export function EmptyState({ title, text, action, icon: Icon = SearchX }) {
    return (
        <div className="empty-state" role="status">
            <span className="empty-state__icon">
                <Icon size={26} strokeWidth={1.75} aria-hidden="true" />
            </span>
            {title && <h3>{title}</h3>}
            {text && <p>{text}</p>}
            {action}
        </div>
    );
}
