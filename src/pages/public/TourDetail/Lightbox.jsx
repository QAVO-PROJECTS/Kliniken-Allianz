import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const FOCUSABLE = 'button:not([disabled]), [href], iframe, [tabindex]:not([tabindex="-1"])';

/**
 * Full-screen viewer for photos and videos. Rendered in a portal so transformed
 * ancestors (scroll reveal) can't trap the fixed overlay. Focus moves to the close
 * button, stays inside the dialog and returns to the trigger on close.
 *
 * @param {string} label         accessible name of the dialog
 * @param {() => void} onClose
 * @param {() => void} [onPrev]  with onNext: shows arrows + keyboard paging
 * @param {() => void} [onNext]
 * @param {string} [counter]     e.g. "2 / 5"
 */
function Lightbox({ label, onClose, onPrev, onNext, counter, children }) {
    const { t } = useTranslation();
    const rootRef = useRef(null);
    const closeRef = useRef(null);
    const handlers = useRef({ onClose, onPrev, onNext });
    handlers.current = { onClose, onPrev, onNext };

    useEffect(() => {
        const trigger = document.activeElement;
        closeRef.current?.focus();
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const onKey = (e) => {
            const h = handlers.current;
            if (e.key === "Escape") {
                h.onClose();
            } else if ((e.key === "ArrowRight" || e.key === "ArrowLeft") && h.onPrev && h.onNext) {
                const rtl = document.documentElement.dir === "rtl";
                const forward = (e.key === "ArrowRight") !== rtl;
                if (forward) h.onNext();
                else h.onPrev();
            } else if (e.key === "Tab" && rootRef.current) {
                const items = [...rootRef.current.querySelectorAll(FOCUSABLE)];
                if (!items.length) return;
                const first = items[0];
                const last = items[items.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
            if (trigger && typeof trigger.focus === "function") trigger.focus();
        };
    }, []);

    const paged = Boolean(onPrev && onNext);

    return createPortal(
        <div
            ref={rootRef}
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={label}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <button ref={closeRef} type="button" className="lightbox__close" onClick={onClose} aria-label={t("gallery.close", "Close")}>
                <X size={22} strokeWidth={1.75} aria-hidden="true" />
            </button>
            {paged && (
                <>
                    <button
                        type="button"
                        className="lightbox__nav lightbox__nav--prev"
                        onClick={onPrev}
                        aria-label={t("gallery.prev", "Previous photo")}
                    >
                        <ChevronLeft size={26} strokeWidth={1.75} aria-hidden="true" />
                    </button>
                    <button
                        type="button"
                        className="lightbox__nav lightbox__nav--next"
                        onClick={onNext}
                        aria-label={t("gallery.next", "Next photo")}
                    >
                        <ChevronRight size={26} strokeWidth={1.75} aria-hidden="true" />
                    </button>
                </>
            )}
            {children}
            {counter && <span className="lightbox__counter" dir="ltr" aria-live="polite">{counter}</span>}
        </div>,
        document.body
    );
}

export default Lightbox;
