import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronRight, LogOut, Menu } from "lucide-react";
import LanguageDiv2 from "../LanguageSwitcher/index.jsx";
import IconButton from "../IconButton/index.jsx";
import { findNavItem } from "../shared/navItems.js";
import { useAdminT } from "../shared/adminStrings.js";
import { useLogout } from "../shared/useLogout.js";

/** Admin top bar: menu toggle (mobile), current section, UI language, user + logout. */
function AdminNavbar({ onMenuClick, menuOpen = false, menuId }) {
    const { t } = useTranslation();
    const at = useAdminT();
    const { pathname } = useLocation();
    const logout = useLogout();
    const section = findNavItem(pathname);

    return (
        <header className="adm-topbar">
            <IconButton
                icon={Menu}
                label={at("openMenu")}
                tooltip={false}
                className="adm-topbar__menu"
                onClick={onMenuClick}
                aria-expanded={menuOpen}
                aria-controls={menuId}
                size={20}
            />
            <div className="adm-topbar__title">
                <span className="adm-topbar__root">{at("adminPanel")}</span>
                {section && <ChevronRight size={14} className="adm-topbar__sep" aria-hidden="true" />}
                {section && <strong>{t(section.labelKey)}</strong>}
            </div>
            <div className="adm-topbar__right">
                <LanguageDiv2 />
                <span className="adm-topbar__divider" aria-hidden="true" />
                <div className="adm-user">
                    <span className="adm-user__avatar" aria-hidden="true">A</span>
                    <span className="adm-user__meta">
                        <strong>Admin</strong>
                        <span>{at("administrator")}</span>
                    </span>
                </div>
                <IconButton icon={LogOut} label={t("adminPanel.leftBar.buttons.logout")} onClick={logout} variant="danger" />
            </div>
        </header>
    );
}

export default AdminNavbar;
