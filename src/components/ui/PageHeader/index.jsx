import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./index.scss";

/**
 * Page hero used at the top of every public listing/detail page.
 *
 * @param {string} title
 * @param {string} [subtitle]
 * @param {{label: string, to?: string}[]} [crumbs] trail after "Home"; the last item is the current page
 * @param {React.ReactNode} [children] extra content under the title (e.g. a search field)
 */
function PageHeader({ title, subtitle, crumbs = [], children }) {
    const { t } = useTranslation();
    const trail = [{ label: t("contact.breadcrumb.home"), to: "/" }, ...crumbs];

    return (
        <header className="page-header">
            <div className="container page-header__inner">
                <nav className="page-header__crumbs" aria-label="Breadcrumb">
                    <ol>
                        {trail.map((crumb, i) => {
                            const isLast = i === trail.length - 1;
                            return (
                                <li key={`${crumb.label}-${i}`}>
                                    {crumb.to && !isLast ? (
                                        <Link to={crumb.to}>{crumb.label}</Link>
                                    ) : (
                                        <span aria-current={isLast ? "page" : undefined}>{crumb.label}</span>
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                </nav>
                <h1 className="page-header__title">{title}</h1>
                {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
                {children && <div className="page-header__extra">{children}</div>}
            </div>
        </header>
    );
}

export default PageHeader;
