import {useTranslation} from "react-i18next";

/** Small centered spinner shown while a lazy route chunk is loading. */
function RouteFallback({fullscreen = false}) {
    const {t} = useTranslation(undefined, {useSuspense: false});
    return (
        <div className={`route-fallback${fullscreen ? " route-fallback--fullscreen" : ""}`} role="status" aria-live="polite">
            <span className="route-spinner" aria-hidden="true"/>
            <span className="visually-hidden">{t("common.loading", "Loading...")}</span>
        </div>
    );
}

export default RouteFallback;
