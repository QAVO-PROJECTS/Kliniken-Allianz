import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Compass, House, MessageCircle } from "lucide-react";
import "./index.scss";

function NotFound() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const links = [
        { to: "/clinics", label: t("navbar.clinics") },
        { to: "/doctors", label: t("navbar.doctors") },
        { to: "/tours", label: t("navbar.tours") },
        { to: "/sanatoriums", label: t("navbar.sanatoriums") },
        { to: "/blogs", label: t("navbar.blog") },
    ];

    return (
        <section className="not-found">
            <div className="container not-found__inner">
                <div className="not-found__art" aria-hidden="true">
                    <span className="not-found__digit">4</span>
                    <span className="not-found__compass">
                        <Compass size={72} strokeWidth={1.5} />
                    </span>
                    <span className="not-found__digit">4</span>
                </div>

                <span className="eyebrow">{t("notFound.eyebrow", "Error 404")}</span>
                <h1>{t("notFound.title", "We can’t find that page")}</h1>
                <p>
                    {t(
                        "notFound.desc",
                        "The link may be broken or the page may have moved. Let’s get you back on track."
                    )}
                </p>

                <div className="not-found__actions">
                    <Link to="/" className="btn btn--primary btn--lg">
                        <House size={18} strokeWidth={2} aria-hidden="true" />
                        {t("notFound.home", "Back to home")}
                    </Link>
                    <button type="button" className="btn btn--secondary btn--lg" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} strokeWidth={2} className="not-found__back" aria-hidden="true" />
                        {t("notFound.back", "Previous page")}
                    </button>
                </div>

                <nav className="not-found__links" aria-label={t("notFound.popular", "Popular pages")}>
                    <span>{t("notFound.popular", "Popular pages")}:</span>
                    <ul>
                        {links.map((l) => (
                            <li key={l.to}><Link to={l.to}>{l.label}</Link></li>
                        ))}
                    </ul>
                </nav>

                <Link to="/contact" className="not-found__help">
                    <MessageCircle size={16} strokeWidth={2} aria-hidden="true" />
                    {t("notFound.help", "Need help? Contact our team")}
                </Link>
            </div>
        </section>
    );
}

export default NotFound;
