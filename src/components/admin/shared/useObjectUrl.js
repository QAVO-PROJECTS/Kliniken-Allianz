import { useEffect, useState } from "react";

/**
 * Returns a blob: URL for a File/Blob and revokes it when the file changes or
 * the component unmounts. Returns `fallback` when there is no file.
 */
export function useObjectUrl(file, fallback = null) {
    const [url, setUrl] = useState(null);

    useEffect(() => {
        if (!(file instanceof Blob)) {
            setUrl(null);
            return undefined;
        }
        const next = URL.createObjectURL(file);
        setUrl(next);
        return () => URL.revokeObjectURL(next);
    }, [file]);

    return url || fallback;
}
