import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Phone, ShieldCheck } from "lucide-react";

/** Section heading inside the detail main column: one h2, optional one-line intro. */
export function SectionHead({ id, title, desc }) {
    return (
        <div className="detail-section__head">
            <h2 id={id}>{title}</h2>
            {desc && <p>{desc}</p>}
        </div>
    );
}

/**
 * Booking summary in the sticky aside (desktop) / under the gallery (phones).
 *
 * @param {string} [title]        hidden on phones (the page header shows it)
 * @param {string} [price]        shown as-is; "Price on request" when empty
 * @param {string} [priceSuffix]  e.g. "AZN / day"
 * @param {{icon: React.ComponentType, label: string, value: React.ReactNode}[]} facts
 * @param {() => void} onApply    scrolls to the enquiry form
 */
export function BookingCard({ title, price, priceSuffix, facts = [], onApply, ariaLabel }) {
    const { t } = useTranslation();
    const phone = t("contact.contactCard.mobile.value");

    return (
        <aside className="booking-card" aria-label={ariaLabel || t("tourDetail.bookingAria", "Booking summary")}>
            {title && <h2 className="booking-card__title">{title}</h2>}

            <div className="booking-card__price">
                <span className="booking-card__price-label">{t("tourDetail.priceLabel", "Price")}</span>
                {price ? (
                    <p className="booking-card__price-value">
                        <strong dir="ltr">{price}</strong>
                        {priceSuffix && <span>{priceSuffix}</span>}
                    </p>
                ) : (
                    <p className="booking-card__price-value booking-card__price-value--request">
                        <strong>{t("tourDetail.priceOnRequest", "Price on request")}</strong>
                    </p>
                )}
            </div>

            {facts.length > 0 && (
                <dl className="fact-list">
                    {facts.map(({ icon: Icon, label, value }) => (
                        <div className="fact-list__row" key={label}>
                            <span className="fact-list__icon">
                                <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                            </span>
                            <dt>{label}</dt>
                            <dd>{value}</dd>
                        </div>
                    ))}
                </dl>
            )}

            <div className="booking-card__actions">
                <button type="button" className="btn btn--primary btn--lg btn--block" onClick={onApply}>
                    {t("toursPage.applyButton")}
                </button>
                <a href={`tel:${phone.replace(/\s+/g, "")}`} className="btn btn--secondary btn--block">
                    <Phone size={18} strokeWidth={1.75} aria-hidden="true" />
                    <span dir="ltr">{phone}</span>
                </a>
            </div>
            <p className="booking-card__note">
                <ShieldCheck size={18} strokeWidth={1.75} aria-hidden="true" />
                {t("tourDetail.freeConsultation", "Free consultation, no obligation")}
            </p>
        </aside>
    );
}

/**
 * Two-column check list for included services. Long lists show a preview and a
 * show-all toggle so the page doesn't turn into a wall of rows.
 */
export function IncludeList({ items = [], getLabel, preview = 10 }) {
    const listId = useId();
    const [expanded, setExpanded] = useState(false);
    const visible = expanded ? items : items.slice(0, preview);

    return (
        <>
            <ul className="include-list" id={listId}>
                {visible.map((item, i) => (
                    <li key={item?.id || i}>
                        <span className="include-list__icon">
                            <Check size={16} strokeWidth={1.75} aria-hidden="true" />
                        </span>
                        <span>{getLabel(item)}</span>
                    </li>
                ))}
            </ul>
            {items.length > preview && (
                <ShowMore
                    expanded={expanded}
                    onToggle={() => setExpanded((v) => !v)}
                    controls={listId}
                    total={items.length}
                />
            )}
        </>
    );
}

/** "View all (N)" / "Show less" toggle under a truncated list or grid. */
export function ShowMore({ expanded, onToggle, controls, total }) {
    const { t } = useTranslation();
    return (
        <div className="show-more">
            <button
                type="button"
                className="btn btn--secondary btn--sm"
                onClick={onToggle}
                aria-expanded={expanded}
                aria-controls={controls}
            >
                {expanded ? (
                    t("common.showLess", "Show less")
                ) : (
                    <>
                        {t("clinicDetail.services.button")}
                        <span className="tabular">({total})</span>
                    </>
                )}
            </button>
        </div>
    );
}

/** Text-shaped placeholder for the main column while the item loads. */
export function DetailSkeleton() {
    const { t } = useTranslation();
    return (
        <div className="detail-skeleton" role="status" aria-busy="true">
            <span className="visually-hidden">{t("common.loading", "Loading…")}</span>
            <div className="skeleton detail-skeleton__title" aria-hidden="true" />
            <div className="skeleton detail-skeleton__line" aria-hidden="true" />
            <div className="skeleton detail-skeleton__line" aria-hidden="true" />
            <div className="skeleton detail-skeleton__line detail-skeleton__line--short" aria-hidden="true" />
        </div>
    );
}
