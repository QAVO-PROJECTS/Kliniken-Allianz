import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import './index.scss';

function Lightbox({ image, alt, onClose }) {
    const { t } = useTranslation();

    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && onClose();
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [onClose]);

    return createPortal(
        // Backdrop click closes; Escape and the close button are the keyboard paths.
        <div className="cert-lightbox" role="dialog" aria-modal="true" aria-label={alt} onClick={onClose}>
            <img src={image} alt={alt} onClick={(e) => e.stopPropagation()} />
            <button
                type="button"
                className="cert-lightbox__close"
                onClick={onClose}
                aria-label={t('common.close', 'Close')}
                autoFocus
            >
                <X size={22} strokeWidth={1.75} aria-hidden="true" />
            </button>
        </div>,
        document.body,
    );
}

/**
 * Certificate thumbnail that opens a lightbox on click. The image speaks for
 * itself: `text` and `number` only feed the accessible name (no labels on the photo).
 */
export default function CertificateTile({ image, number, text }) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const buttonRef = useRef(null);
    const label = [text, number].filter((v) => v !== undefined && v !== null && v !== '').join(' ')
        || t('certificate.label', 'Certificate');

    const close = () => {
        setOpen(false);
        buttonRef.current?.focus();
    };

    return (
        <>
            <button ref={buttonRef} type="button" className="cert-tile" onClick={() => setOpen(true)} aria-label={label}>
                <img src={image} alt="" width="300" height="400" loading="lazy" decoding="async" />
            </button>
            {open && <Lightbox image={image} alt={label} onClose={close} />}
        </>
    );
}
