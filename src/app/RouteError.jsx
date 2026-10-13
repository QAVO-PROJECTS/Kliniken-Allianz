import {isRouteErrorResponse, Link, useRouteError} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {AlertTriangle, Home, RotateCw} from "lucide-react";

const isChunkLoadError = (error) =>
    /dynamically imported module|Importing a module script failed|ChunkLoadError|Loading chunk/i.test(String(error?.message || error));

/** Friendly error page used as the router's errorElement. */
function RouteError({fullscreen = false}) {
    const error = useRouteError();
    const {t} = useTranslation(undefined, {useSuspense: false});

    const isNotFound = isRouteErrorResponse(error) && error.status === 404;
    const staleBuild = isChunkLoadError(error);

    let title = t("errorPage.title", "Something went wrong");
    let text = t("errorPage.text", "An unexpected error occurred. Please reload the page or return to the home page.");
    if (isNotFound) {
        title = t("errorPage.notFoundTitle", "Page not found");
        text = t("errorPage.notFoundText", "The page you are looking for does not exist or has been moved.");
    } else if (staleBuild) {
        title = t("errorPage.updateTitle", "A new version is available");
        text = t("errorPage.updateText", "The site has been updated. Please reload the page to continue.");
    }

    const details = import.meta.env.DEV && error && !isNotFound
        ? (error.stack || error.message || error.statusText || String(error))
        : null;

    return (
        <main className={`route-error${fullscreen ? " route-error--fullscreen" : ""}`}>
            <div className="route-error__card" role="alert">
                <span className="route-error__icon" aria-hidden="true">
                    <AlertTriangle size={30} strokeWidth={1.75}/>
                </span>
                <h1 className="route-error__title">{title}</h1>
                <p className="route-error__text">{text}</p>
                {details && <pre className="route-error__details">{details}</pre>}
                <div className="route-error__actions">
                    <button type="button" className="btn btn--primary" onClick={() => window.location.reload()}>
                        <RotateCw size={18} strokeWidth={2} aria-hidden="true"/>
                        {t("errorPage.reload", "Reload")}
                    </button>
                    {/* A plain <a> also works when the router itself failed to render. */}
                    {fullscreen ? (
                        <a href="/" className="btn btn--secondary">
                            <Home size={18} strokeWidth={2} aria-hidden="true"/>
                            {t("errorPage.home", "Home")}
                        </a>
                    ) : (
                        <Link to="/" className="btn btn--secondary">
                            <Home size={18} strokeWidth={2} aria-hidden="true"/>
                            {t("errorPage.home", "Home")}
                        </Link>
                    )}
                </div>
            </div>
        </main>
    );
}

export default RouteError;
