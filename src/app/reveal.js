// Scroll-reveal without scroll listeners: an IntersectionObserver adds `is-revealed`
// to elements marked with `data-reveal` (or the legacy `data-aos`). A MutationObserver
// picks up elements rendered later by lazy routes. Under prefers-reduced-motion the
// CSS keeps everything visible, so nothing depends on this script running.
const SELECTOR = "[data-reveal], [data-aos]";

let started = false;

export function startReveal() {
    if (started || typeof window === "undefined" || !("IntersectionObserver" in window)) return;
    started = true;

    const io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add("is-revealed");
            io.unobserve(entry.target);
        }
    }, {rootMargin: "0px 0px -8% 0px", threshold: 0.12});

    const scan = (root) => {
        if (root.nodeType !== 1) return;
        if (root.matches?.(SELECTOR) && !root.classList.contains("is-revealed")) io.observe(root);
        root.querySelectorAll?.(SELECTOR).forEach((el) => {
            if (!el.classList.contains("is-revealed")) io.observe(el);
        });
    };

    scan(document.body);
    new MutationObserver((mutations) => {
        for (const m of mutations) m.addedNodes.forEach(scan);
    }).observe(document.body, {childList: true, subtree: true});
}
