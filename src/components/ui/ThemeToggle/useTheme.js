import {useCallback, useEffect, useSyncExternalStore} from "react";

const STORAGE_KEY = "theme";
const QUERY = "(prefers-color-scheme: dark)";

const readSaved = () => {
    try {
        const v = localStorage.getItem(STORAGE_KEY);
        return v === "light" || v === "dark" ? v : null;
    } catch {
        return null;
    }
};

// One shared store, so every toggle on the page (navbar + mobile drawer) stays in sync.
let saved = typeof window !== "undefined" ? readSaved() : null;
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());

const subscribe = (listener) => {
    listeners.add(listener);
    const mq = window.matchMedia(QUERY);
    mq.addEventListener("change", listener);
    return () => {
        listeners.delete(listener);
        mq.removeEventListener("change", listener);
    };
};

const getSystem = () => (window.matchMedia(QUERY).matches ? "dark" : "light");
const getSnapshot = () => saved || getSystem();
const getServerSnapshot = () => "light";

/** Keeps the browser UI color (address bar on mobile) in step with the page background. */
const syncThemeColor = () => {
    const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg-page").trim();
    if (!bg) return;
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", bg));
};

/** Resolved theme ("light" | "dark"): the saved choice, otherwise the OS preference. */
export default function useTheme() {
    const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    useEffect(() => {
        syncThemeColor();
    }, [theme]);

    const toggle = useCallback(() => {
        const system = getSystem();
        const next = getSnapshot() === "dark" ? "light" : "dark";
        // Choosing the OS value again clears the override so the site follows the system later.
        const store = next === system ? null : next;
        try {
            if (store) localStorage.setItem(STORAGE_KEY, store);
            else localStorage.removeItem(STORAGE_KEY);
        } catch { /* storage unavailable: theme still applies for this session */ }
        if (store) document.documentElement.setAttribute("data-theme", store);
        else document.documentElement.removeAttribute("data-theme");
        saved = store;
        emit();
    }, []);

    return {theme, toggle};
}
