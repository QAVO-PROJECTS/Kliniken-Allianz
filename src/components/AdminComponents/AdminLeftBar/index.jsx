import './index.scss'
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import categoryIcon from '/src/assets/leftBarIcon/categoryIcon.svg'
import clinicIcon from '/src/assets/leftBarIcon/clinicIcon.svg'
import doctorIcon from '/src/assets/leftBarIcon/doctorIcon.svg'
import turIcon from '/src/assets/leftBarIcon/turIcon.svg'
import hotelIcon from '/src/assets/leftBarIcon/hotelIcon.svg'
import serhIcon from '/src/assets/leftBarIcon/serhIcon.svg'
import contactIcon from '/src/assets/leftBarIcon/contactIcon.svg'
import selectedIcon from '/src/assets/adminSelected.svg'
import logoutIcon from '/src/assets/logoutIcon.svg'
import {useTranslation} from "react-i18next";

function AdminLeftBar() {
    const location = useLocation();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const menuItems = [
        { path: "/admin/category", icon: categoryIcon, label: t("adminPanel.leftBar.menu.category") },
        { path: "/admin/clinic", icon: clinicIcon, label: t("adminPanel.leftBar.menu.clinic") },
        { path: "/admin/doctors", icon: doctorIcon, label: t("adminPanel.leftBar.menu.doctor") },
        { path: "/admin/tours", icon: turIcon, label: t("adminPanel.leftBar.menu.tours") },
        { path: "/admin/otel", icon: hotelIcon, label: t("adminPanel.leftBar.menu.hotel") },
        { path: "/admin/serh", icon: serhIcon, label: t("adminPanel.leftBar.menu.comment") },
        { path: "/admin/contact", icon: contactIcon, label: t("adminPanel.leftBar.menu.contact") },
    ];
    const handleLogout = () => {
        // Bütün cookieləri sil
        document.cookie.split(";").forEach(cookie => {
            const name = cookie.split("=")[0].trim();
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });

        // Əlavə olaraq localStorage / sessionStorage təmizlənməsi (əgər istifadə olunursa)
        localStorage.clear();
        sessionStorage.clear();

        // Login səhifəsinə yönləndir
        navigate("/");
    };
    return (
        <section id="adminLeftBar">
            <div style={{ width: '100%' }}>
                {menuItems.map((item, index) => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <li key={index} className={isActive ? "selected" : ""}>
                            {isActive && (
                                <img src={selectedIcon} className="selectedIcon" alt="" />
                            )}
                            <div className="linkk">
                                <img src={item.icon} className="icon" alt="" />
                                <NavLink to={item.path}>{item.label}</NavLink>
                            </div>
                        </li>
                    );
                })}
            </div>

            <button className="logout" onClick={handleLogout}>
                <img src={logoutIcon} alt="" />
                {t("adminPanel.leftBar.buttons.logout")}
            </button>
        </section>
    );
}

export default AdminLeftBar;
