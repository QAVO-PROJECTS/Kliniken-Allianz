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

    return (
        <section id="adminLeftBar">
           <div style={{
               width: '100%',
           }}>
               <li className={location.pathname === "/admin/category" ? "selected" : ""}>
                   {location.pathname === "/admin/category" && (
                       <img src={selectedIcon} className={"selectedIcon"} alt="" />
                   )}
                   <div className={'linkk'}>
                       <img  src={categoryIcon} className="icon" />
                       <NavLink to="/admin/category">
                           Kateqoriya
                       </NavLink>
                   </div>
               </li>
               <li className={location.pathname === "/admin/clinic" ? "selected" : ""}>
                   {location.pathname === "/admin/clinic" && (
                       <img src={selectedIcon} className={"selectedIcon"} alt="" />
                   )}
                   <div className={'linkk'}>
                       <img src={clinicIcon} className="icon" />
                       <NavLink to="/admin/clinic">
                           Klinika
                       </NavLink>
                   </div>
               </li>
               <li className={location.pathname === "/admin/doctors" ? "selected" : ""}>
                   {location.pathname === "/admin/doctors" && (
                       <img src={selectedIcon} className={"selectedIcon"} alt="" />
                   )}
                   <div className={'linkk'}>
                       <img src={doctorIcon} className="icon" />
                       <NavLink to="/admin/doctors">
                           Həkim
                       </NavLink>
                   </div>
               </li>
               <li className={location.pathname === "/admin/service" ? "selected" : ""}>
                   {location.pathname === "/admin/service" && (
                       <img src={selectedIcon} className={"selectedIcon"} alt="" />
                   )}
                   <div className={'linkk'}>
                       <img src={turIcon} className="icon" />
                       <NavLink to="/admin/service">
                           Xidmət paketi
                       </NavLink>
                   </div>
               </li>
               <li className={location.pathname === "/admin/otel" ? "selected" : ""}>
                   {location.pathname === "/admin/otel" && (
                       <img src={selectedIcon} className={"selectedIcon"} alt="" />
                   )}
                   <div className={'linkk'}>
                       <img src={hotelIcon} className="icon" />
                       <NavLink to="/admin/otel">
                           Otel
                       </NavLink>
                   </div>
               </li>
               <li className={location.pathname === "/admin/serh" ? "selected" : ""}>
                   {location.pathname === "/admin/serh" && (
                       <img src={selectedIcon} className={"selectedIcon"} alt="" />
                   )}
                   <div className={'linkk'}>
                       <img src={serhIcon} className="icon" />
                       <NavLink to="/admin/serh">
                           Şərh
                       </NavLink>
                   </div>
               </li>
               <li className={location.pathname === "/admin/contact" ? "selected" : ""}>
                   {location.pathname === "/admin/contact" && (
                       <img src={selectedIcon} className={"selectedIcon"} alt="" />
                   )}
                   <div className={'linkk'}>
                       <img src={contactIcon} className="icon" />
                       <NavLink to="/admin/contact">
                           Əlaqələr
                       </NavLink>
                   </div>
               </li>




           </div>
            <button className={'logout'}>
                <img src={logoutIcon} alt="" />
                Çıxış edin
            </button>
        </section>
    );
}

export default AdminLeftBar;
