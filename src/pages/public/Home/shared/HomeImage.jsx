import { useState } from 'react';
import { ImageOff } from 'lucide-react';

/**
 * <img> for API media that degrades to a composed fallback block when the
 * file is missing or fails to load (no broken-image icons on the page).
 * Pass width/height (or size it with CSS aspect-ratio) to avoid layout shift.
 */
function HomeImage({ src, alt = '', fallbackIcon: Icon = ImageOff, iconSize = 28, className = '', ...rest }) {
    const [failedSrc, setFailedSrc] = useState(null);

    if (!src || failedSrc === src) {
        return (
            <span className={`home-img-fallback ${className}`.trim()} aria-hidden="true">
                <Icon size={iconSize} strokeWidth={1.75} />
            </span>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className || undefined}
            loading="lazy"
            decoding="async"
            onError={() => setFailedSrc(src)}
            {...rest}
        />
    );
}

export default HomeImage;
