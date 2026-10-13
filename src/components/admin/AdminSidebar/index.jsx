import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LogOut, X } from "lucide-react";
import logo from "../../../assets/Logo.png";
import { ADMIN_NAV, findNavItem } from "../shared/navItems.js";
import { useAdminT } from "../shared/adminStrings.js";
import { useLogout } from "../shared/useLogout.js";

/**
 * Admin sidebar. Static on desktop; an off-canvas drawer below 992px
 * (`open` / `onClose` are controlled by AdminLayout).
 */
function AdminLeftBar({ open = false, onClose, id }) {
    const { t } = useTranslation();
    const at = useAdminT();
    const { pathname } = useLocation();
    const logout = useLogout();
    const active = findNavItem(pathname);

    return (
        <aside id={id} className={`adm-sidebar${open ? " is-open" : ""}`} aria-label={at("adminPanel")}>
            <div className="adm-sidebar__brand">
                <NavLink to="/admin/category" onClick={onClose} aria-label="Kliniken Allianz">
                    <img src={logo} alt="Kliniken Allianz" width="101" height="34" />
                </NavLink>
                <button type="button" className="adm-icon-btn adm-sidebar__close" onClick={onClose} aria-label={at("closeMenu")}>
                    <X size={20} aria-hidden="true" />
                </button>
            </div>

            <nav className="adm-sidebar__nav">
                {ADMIN_NAV.map((group) => (
                    <div key={group.groupKey} className="adm-sidebar__group">
                        <div className="adm-sidebar__group-label">{at(group.groupKey)}</div>
                        <ul className="adm-sidebar__list">
                            {group.items.map(({ path, icon: Icon, labelKey }) => {
                                const isActive = active?.path === path;
                                return (
                                    <li key={path}>
                                        <NavLink
                                            to={path}
                                            className={`adm-sidebar__link${isActive ? " is-active" : ""}`}
                                            aria-current={isActive ? "page" : undefined}
                                            onClick={onClose}
                                        >
                                            <Icon size={18} strokeWidth={1.85} aria-hidden="true" />
                                            <span>{t(labelKey)}</span>
                                        </NavLink>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            <div className="adm-sidebar__footer">
                <button type="button" className="adm-sidebar__link adm-sidebar__logout" onClick={logout}>
                    <LogOut size={18} strokeWidth={1.85} aria-hidden="true" />
                    <span>{t("adminPanel.leftBar.buttons.logout")}</span>
                </button>
            </div>
        </aside>
    );
}

export default AdminLeftBar;
