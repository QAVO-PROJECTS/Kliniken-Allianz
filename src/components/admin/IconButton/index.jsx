import { Link } from "react-router-dom";

/**
 * Compact icon-only button with an accessible name and a CSS tooltip.
 * Renders a <Link> when `to` is given.
 *
 * @param {import('react').ComponentType} icon lucide-react icon component
 * @param {string} label accessible name + tooltip text
 * @param {'default'|'danger'|'brand'} [variant]
 * @param {boolean} [outline]
 */
function IconButton({ icon: Icon, label, to, onClick, variant = "default", outline = false, size = 18, tooltip = true, className = "", ...rest }) {
    const cls = [
        "adm-icon-btn",
        variant !== "default" && `adm-icon-btn--${variant}`,
        outline && "adm-icon-btn--outline",
        className,
    ].filter(Boolean).join(" ");
    const common = {
        className: cls,
        "aria-label": label,
        "data-tooltip": tooltip ? label : undefined,
        ...rest,
    };
    const content = <Icon size={size} strokeWidth={1.85} aria-hidden="true" />;

    if (to) {
        return <Link to={to} {...common}>{content}</Link>;
    }
    return (
        <button type="button" onClick={onClick} {...common}>
            {content}
        </button>
    );
}

export default IconButton;
