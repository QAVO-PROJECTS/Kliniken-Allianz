import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * A string value kept in the URL query (?key=value) so filtered listings can be
 * shared and survive reloads. Updates replace the history entry.
 */
export function useQueryParam(key) {
    const [params, setParams] = useSearchParams();
    const value = params.get(key) || "";
    const setValue = useCallback(
        (next) => {
            setParams(
                (prev) => {
                    const copy = new URLSearchParams(prev);
                    if (next) copy.set(key, next);
                    else copy.delete(key);
                    return copy;
                },
                { replace: true, preventScrollReset: true }
            );
        },
        [key, setParams]
    );
    return [value, setValue];
}
