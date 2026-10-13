import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Award, X, ZoomIn } from 'lucide-react';
import './index.scss';

function Lightbox({ image, alt, onClose }) {
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
        <div className="cert-lightbox" role="dialog" aria-modal="true" aria-label={alt} onClick={onClose}>
            <img src={image} alt={alt} onClick={(e) => e.stopPropagation()} />
            <button type="button" className="cert-lightbox__close" onClick={onClose} aria-label="Close" autoFocus>
                <X size={22} strokeWidth={2} />
            </button>
        </div>,
        document.body,
    );
}

/** Certificate thumbnail (number + label) that opens a lightbox on click. */
export default function CertificateTile({ image, number, text }) {
    const [open, setOpen] = useState(false);
    const label = [text, number].filter(Boolean).join(' ');
    const padded = number !== undefined && number !== null ? String(number).padStart(2, '0') : null;

    return (
        <>
            <button type="button" className="cert-tile" onClick={() => setOpen(true)} aria-label={label || 'Certificate'}>
                <img src={image} alt="" loading="lazy" decoding="async" />
                <span className="cert-tile__shade" aria-hidden="true" />
                <span className="cert-tile__zoom" aria-hidden="true"><ZoomIn size={18} strokeWidth={2} /></span>
                <span className="cert-tile__info" aria-hidden="true">
                    {padded && <span className="cert-tile__number">{padded}</span>}
                    {text && (
                        <span className="cert-tile__text">
                            <Award size={14} strokeWidth={2} />
                            {text}
                        </span>
                    )}
                </span>
            </button>
            {open && <Lightbox image={image} alt={label || 'Certificate'} onClose={() => setOpen(false)} />}
        </>
    );
}
