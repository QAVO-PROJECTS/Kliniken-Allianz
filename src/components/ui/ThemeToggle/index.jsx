import {Moon, Sun} from "lucide-react";
import {useTranslation} from "react-i18next";
import useTheme from "./useTheme.js";
import "./index.scss";

/**
 * Light / dark switch. Icon-only by default; pass `showLabel` to render the
 * action text next to the icon (used in the mobile drawer).
 */
function ThemeToggle({className = "", showLabel = false}) {
    const {theme, toggle} = useTheme();
    const {t} = useTranslation();
    const isDark = theme === "dark";
    const label = isDark ? t("theme.toLight", "Switch to light mode") : t("theme.toDark", "Switch to dark mode");
    const Icon = isDark ? Sun : Moon;
    return (
        <button
            type="button"
            className={`theme-toggle${showLabel ? " theme-toggle--labeled" : ""} ${className}`.trim()}
            onClick={toggle}
            aria-label={showLabel ? undefined : label}
            title={showLabel ? undefined : label}
        >
            <Icon key={theme} className="theme-toggle__icon" size={18} strokeWidth={1.75} aria-hidden="true"/>
            {showLabel && <span className="theme-toggle__label">{label}</span>}
        </button>
    );
}

export default ThemeToggle;
