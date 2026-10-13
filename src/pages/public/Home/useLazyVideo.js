import { useEffect, useRef } from 'react';

/**
 * Plays a muted, looping <video preload="none"> only while it is on screen.
 * Nothing is downloaded until the element approaches the viewport.
 * Returns a ref for the <video> element.
 */
export default function useLazyVideo({ enabled = true, rootMargin = '200px 0px' } = {}) {
    const ref = useRef(null);

    useEffect(() => {
        const video = ref.current;
        if (!video || !enabled) return undefined;
        const play = () => video.play().catch(() => {});

        if (typeof IntersectionObserver === 'undefined') {
            play();
            return undefined;
        }
        const io = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) play();
            else video.pause();
        }, { rootMargin });
        io.observe(video);
        return () => io.disconnect();
    }, [enabled, rootMargin]);

    return ref;
}
