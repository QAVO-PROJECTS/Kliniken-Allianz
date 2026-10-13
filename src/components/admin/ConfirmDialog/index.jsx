import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { Trash2 } from "lucide-react";
import { useAdminT } from "../shared/adminStrings.js";

/**
 * Destructive-action confirmation dialog (delete).
 * Closes on Escape / backdrop click; focuses the cancel button on open.
 */
function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel,
    cancelLabel,
    loadingLabel,
    loading = false,
    onConfirm,
    onCancel,
}) {
    const at = useAdminT();
    const titleId = useId();
    const descId = useId();
    const cancelRef = useRef(null);
    const stateRef = useRef({ loading, onCancel });
    stateRef.current = { loading, onCancel };

    useEffect(() => {
        if (!open) return undefined;
        const previous = document.activeElement;
        cancelRef.current?.focus();
        const onKey = (e) => {
            if (e.key === "Escape" && !stateRef.current.loading) stateRef.current.onCancel?.();
        };
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("keydown", onKey);
            if (previous instanceof HTMLElement) previous.focus();
        };
    }, [open]);

    if (!open) return null;

    return createPortal(
        <div className="adm-modal-backdrop" data-theme="light" onClick={() => !loading && onCancel?.()}>
            <div
                className="adm-modal"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descId}
                onClick={(e) => e.stopPropagation()}
            >
                <span className="adm-modal__icon" aria-hidden="true">
                    <Trash2 size={22} strokeWidth={1.85} />
                </span>
                <h2 id={titleId}>{title}</h2>
                <p id={descId}>{description ?? at("deleteHint")}</p>
                <div className="adm-modal__actions">
                    <button ref={cancelRef} type="button" className="btn btn--secondary" onClick={onCancel} disabled={loading}>
                        {cancelLabel || at("cancel")}
                    </button>
                    <button type="button" className="btn btn--danger" onClick={onConfirm} disabled={loading}>
                        {loading ? (loadingLabel || at("deleting")) : (confirmLabel || at("delete"))}
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    );
}

export default ConfirmDialog;
