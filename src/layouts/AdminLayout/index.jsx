import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminLeftBar from "../../components/admin/AdminSidebar/index.jsx";
import AdminNavbar from "../../components/admin/AdminNavbar/index.jsx";
import "../../styles/_admin.scss";

const SIDEBAR_ID = "admin-sidebar";

function AdminPage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { pathname } = useLocation();

    // Close the mobile drawer on navigation and on Escape.
    useEffect(() => {
        setMenuOpen(false);
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        if (!menuOpen) return undefined;
        const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [menuOpen]);

    return (
        <div className="adm-shell">
            <AdminLeftBar id={SIDEBAR_ID} open={menuOpen} onClose={() => setMenuOpen(false)} />
            {menuOpen && <div className="adm-backdrop" onClick={() => setMenuOpen(false)} aria-hidden="true" />}
            <div className="adm-main">
                <AdminNavbar onMenuClick={() => setMenuOpen(true)} menuOpen={menuOpen} menuId={SIDEBAR_ID} />
                <main className="adm-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminPage;
