import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

/**
 * Header of every admin page: optional breadcrumb, h1 title, description and
 * right-aligned actions (content-language switch, primary "Add" button...).
 *
 * @param {string} title
 * @param {string} [description]
 * @param {{label: string, to?: string}[]} [crumbs] the last item is the current page
 * @param {import('react').ReactNode} [actions]
 */
function AdminPageHeader({ title, description, crumbs, actions }) {
    return (
        <header className="adm-page-header">
            {crumbs?.length > 0 && (
                <nav className="adm-crumbs" aria-label="Breadcrumb">
                    <ol>
                        {crumbs.map((crumb, i) => {
                            const isLast = i === crumbs.length - 1;
                            return (
                                <li key={`${crumb.label}-${i}`}>
                                    {crumb.to && !isLast ? (
                                        <Link to={crumb.to}>{crumb.label}</Link>
                                    ) : (
                                        <span aria-current={isLast ? "page" : undefined}>{crumb.label}</span>
                                    )}
                                    {!isLast && <ChevronRight size={14} aria-hidden="true" />}
                                </li>
                            );
                        })}
                    </ol>
                </nav>
            )}
            <div className="adm-page-header__row">
                <div className="adm-page-header__text">
                    <h1>{title}</h1>
                    {description && <p>{description}</p>}
                </div>
                {actions && <div className="adm-page-header__actions">{actions}</div>}
            </div>
        </header>
    );
}

export default AdminPageHeader;
