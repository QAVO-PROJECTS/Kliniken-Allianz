import './index.scss'
import logo from "../../../assets/Logo.png"
import { NavLink, useLocation } from "react-router-dom";
import {TbLogs} from "react-icons/tb";
import {FaClinicMedical, FaHotel} from "react-icons/fa";
import { MdOutlineMiscellaneousServices} from "react-icons/md";
import {RiContactsBook2Fill} from "react-icons/ri";
import {FaUserDoctor} from "react-icons/fa6";

function AdminLeftBar() {
    const location = useLocation();

    return (
        <section id="adminLeftBar">
            <img src={logo} alt="logo" />
            <li className={location.pathname === "/admin/category" ? "selected" : ""}>
                <TbLogs className="icon" />
                <NavLink to="/admin/category">
                    Kateqoriya
                </NavLink>
            </li>
            <li className={location.pathname === "/admin/clinic" ? "selected" : ""}>
                <FaClinicMedical className="icon" />
                <NavLink to="/admin/clinic">
                    Xəstəxana
                </NavLink>
            </li>
            <li className={location.pathname === "/admin/contact" ? "selected" : ""}>
                <RiContactsBook2Fill className="icon" />
                <NavLink to="/admin/contact">
                    Əlaqə
                </NavLink>
            </li>
            <li className={location.pathname === "/admin/doctors" ? "selected" : ""}>
                <FaUserDoctor className="icon" />
                <NavLink to="/admin/doctors">
                    Həkimlər
                </NavLink>
            </li>
            <li className={location.pathname === "/admin/service" ? "selected" : ""}>
                <MdOutlineMiscellaneousServices className="icon" />
                <NavLink to="/admin/service">
                    Xidmətlər
                </NavLink>
            </li>
            <li className={location.pathname === "/admin/otel" ? "selected" : ""}>
                <FaHotel className="icon" />
                <NavLink to="/admin/otel">
                    Otellər
                </NavLink>
            </li>

        </section>
    );
}

export default AdminLeftBar;
