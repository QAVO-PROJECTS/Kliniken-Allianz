import './index.scss'
import { NavLink, useLocation } from "react-router-dom";
import categoryIcon from '/src/assets/leftBarIcon/categoryIcon.svg'
import clinicIcon from '/src/assets/leftBarIcon/clinicIcon.svg'
import doctorIcon from '/src/assets/leftBarIcon/doctorIcon.svg'
import turIcon from '/src/assets/leftBarIcon/turIcon.svg'
import hotelIcon from '/src/assets/leftBarIcon/hotelIcon.svg'
import serhIcon from '/src/assets/leftBarIcon/serhIcon.svg'
import contactIcon from '/src/assets/leftBarIcon/contactIcon.svg'
import selectedIcon from '/src/assets/adminSelected.svg'
import logoutIcon from '/src/assets/logoutIcon.svg'

function AdminLeftBar() {
    const location = useLocation();

    const menuItems = [
        { path: "/admin/category", icon: categoryIcon, label: "Kateqoriya" },
        { path: "/admin/clinic", icon: clinicIcon, label: "Klinika" },
        { path: "/admin/doctors", icon: doctorIcon, label: "Həkim" },
        { path: "/admin/tours", icon: turIcon, label: "Xidmət paketi" },
        { path: "/admin/otel", icon: hotelIcon, label: "Otel" },
        { path: "/admin/serh", icon: serhIcon, label: "Şərh" },
        { path: "/admin/contact", icon: contactIcon, label: "Əlaqələr" },
    ];

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

            <button className="logout">
                <img src={logoutIcon} alt="" />
                Çıxış edin
            </button>
        </section>
    );
}

export default AdminLeftBar;
