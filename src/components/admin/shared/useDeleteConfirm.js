import { useCallback, useState } from "react";
import showToast from "../../../utils/toast.js";

/**
 * State for "click delete → confirm dialog → call mutation → toast".
 *
 * @param {(id: any) => {unwrap: () => Promise<any>}} deleteFn RTK Query mutation trigger
 * @param {{successMessage: string, errorMessage: string, onSuccess?: () => void}} options
 * @returns {{target: any, isOpen: boolean, ask: (item: any) => void, cancel: () => void, confirm: () => Promise<void>}}
 */
export function useDeleteConfirm(deleteFn, { successMessage, errorMessage, onSuccess } = {}) {
    const [target, setTarget] = useState(null);

    const ask = useCallback((item) => setTarget(item), []);
    const cancel = useCallback(() => setTarget(null), []);

    const confirm = useCallback(async () => {
        if (!target?.id && target?.id !== 0) {
            showToast(errorMessage, "error");
            return;
        }
        try {
            await deleteFn(target.id).unwrap();
            showToast(successMessage, "success");
            setTarget(null);
            onSuccess?.();
        } catch {
            showToast(errorMessage, "error");
        }
    }, [deleteFn, target, successMessage, errorMessage, onSuccess]);

    return { target, isOpen: target !== null, ask, cancel, confirm };
}
