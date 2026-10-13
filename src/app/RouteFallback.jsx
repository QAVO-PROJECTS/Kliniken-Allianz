import {useTranslation} from "react-i18next";

/**
 * Calm page-shaped placeholder shown while a lazy route chunk is loading
 * (a heading band and a few content blocks that gently pulse; static under reduced motion).
 */
function RouteFallback({fullscreen = false}) {
    const {t} = useTranslation(undefined, {useSuspense: false});
    return (
        <div className={`route-fallback${fullscreen ? " route-fallback--fullscreen" : ""}`} role="status" aria-live="polite">
            <div className="route-fallback__skeleton" aria-hidden="true">
                <span className="route-skel route-skel--title"/>
                <span className="route-skel route-skel--line"/>
                <div className="route-fallback__grid">
                    <span className="route-skel route-skel--block"/>
                    <span className="route-skel route-skel--block"/>
                    <span className="route-skel route-skel--block"/>
                </div>
            </div>
            <span className="visually-hidden">{t("common.loading", "Loading…")}</span>
        </div>
    );
}

export default RouteFallback;
