import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { Award, X, ZoomIn } from "lucide-react";
import Pagination from "../../../../components/ui/NumberedPagination/index.jsx";
import { EmptyState } from "./Feedback.jsx";
import { tx } from "./texts.js";
import "./shared.scss";

function Lightbox({ src, alt, onClose }) {
    const { t } = useTranslation();
    const closeRef = useRef(null);

    useEffect(() => {
        const opener = document.activeElement;
        closeRef.current?.focus();
        const onKey = (e) => {
            if (e.key === "Escape") onClose();
            // Single focusable control: keep Tab inside the dialog.
            if (e.key === "Tab") {
                e.preventDefault();
                closeRef.current?.focus();
            }
        };
        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
            opener?.focus?.();
        };
    }, [onClose]);

    return createPortal(
        <div className="md-lightbox" role="dialog" aria-modal="true" aria-label={alt}>
            {/* Backdrop click is a pointer shortcut; the close button and Escape cover keyboard users. */}
            <div className="md-lightbox__backdrop" onClick={onClose} aria-hidden="true" />
            <img src={src} alt={alt} />
            <button ref={closeRef} type="button" className="md-lightbox__close" onClick={onClose} aria-label={t("gallery.close")}>
                <X size={22} strokeWidth={1.75} aria-hidden="true" />
            </button>
        </div>,
        document.body
    );
}

/**
 * Paginated certificate thumbnails with a lightbox.
 * @param {string[]} images absolute URLs
 * @param {number} [pageSize]
 */
function CertificateGallery({ images = [], pageSize = 8 }) {
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(null);
    const close = useCallback(() => setOpen(null), []);
    const label = t("clinicDetail.certificates.itemText", "Sertifikat");

    if (images.length === 0) {
        return <EmptyState icon={Award} text={tx(t, "medicalPages.noCertificates")} compact />;
    }

    const totalPages = Math.ceil(images.length / pageSize);
    const current = Math.min(page, totalPages);
    const start = (current - 1) * pageSize;
    const visible = images.slice(start, start + pageSize);

    return (
        <>
            <div className="md-certs">
                {visible.map((src, i) => (
                    <button
                        type="button"
                        key={src}
                        className="md-cert"
                        onClick={() => setOpen(src)}
                        aria-label={`${label} ${start + i + 1}`}
                    >
                        <img src={src} alt="" width="300" height="400" loading="lazy" decoding="async" />
                        <span className="md-cert__overlay" aria-hidden="true">
                            <ZoomIn size={22} strokeWidth={1.75} />
                        </span>
                    </button>
                ))}
            </div>
            {totalPages > 1 && (
                <div className="md-pagination">
                    <Pagination currentPage={current} totalPages={totalPages} onPageChange={setPage} />
                </div>
            )}
            {open && <Lightbox src={open} alt={label} onClose={close} />}
        </>
    );
}

export default CertificateGallery;
