import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Compass, House } from "lucide-react";
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
        { to: "/contact", label: t("navbar.contact") },
    ];

    return (
        <section className="not-found" aria-labelledby="not-found-title">
            <div className="container not-found__inner">
                <span className="not-found__icon" aria-hidden="true">
                    <Compass size={32} strokeWidth={1.75} />
                </span>

                <p className="eyebrow">{t("notFound.eyebrow", "Error 404")}</p>
                <h1 id="not-found-title">{t("notFound.title", "We can’t find that page")}</h1>
                <p className="not-found__desc">
                    {t("notFound.desc", "The link may be broken or the page may have moved. Let’s get you back on track.")}
                </p>

                <div className="not-found__actions">
                    <Link to="/" className="btn btn--primary btn--lg">
                        <House size={18} strokeWidth={1.75} aria-hidden="true" />
                        {t("notFound.home", "Back to home")}
                    </Link>
                    <button type="button" className="btn btn--secondary btn--lg" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} strokeWidth={1.75} className="not-found__back" aria-hidden="true" />
                        {t("notFound.back", "Previous page")}
                    </button>
                </div>

                <nav className="not-found__links" aria-labelledby="not-found-popular">
                    <h2 id="not-found-popular">{t("notFound.popular", "Popular pages")}</h2>
                    <ul>
                        {links.map((l) => (
                            <li key={l.to}>
                                <Link to={l.to}>{l.label}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </section>
    );
}

export default NotFound;
