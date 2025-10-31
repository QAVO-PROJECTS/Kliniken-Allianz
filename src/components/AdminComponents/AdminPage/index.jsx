import {Outlet, useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import AdminLeftBar from "../AdminLeftBar/index.jsx";
import {RiLogoutBoxLine} from "react-icons/ri";
import  image1 from "/src/assets/profile.webp"
import './index.scss'
import AdminNavbar from "../AdminNavbar/index.jsx";
function AdminPage() {
    const navigate = useNavigate();

    const handleLogout = () => {
        Cookies.remove('klinikenToken');
        navigate('/');
    };

    return (
        <section id="adminPage">
            <div className={"adminPage"}>
                <AdminNavbar/>
                <div className={'row'}>
                    <div className={'col-10'} style={{
                        padding:"8px 0 0px 0"
                    }}>
                        <AdminLeftBar/>
                    </div>
                    <div className={'col-50'} style={{
                        padding:"8px 0px 0px 8px"
                    }}>
                        <div className="adminRightBar">
                                <Outlet/>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AdminPage;