import { useCallback, useEffect, useRef, useState } from 'react';

const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Scroll-snap carousel state for a horizontal track.
 *
 * The track is a native overflow-x scroller (touch swipe, trackpad and
 * keyboard scrolling work out of the box); slide widths come from CSS, so
 * slides-per-view is responsive without JS. The hook measures the track to
 * expose the current page, page count and prev/next/goTo helpers, and adds
 * click-and-drag for mouse users. Works in RTL (negative scrollLeft).
 *
 * @param {number} count number of slides (re-measures when it changes)
 */
export default function useCarousel(count = 0) {
    const trackRef = useRef(null);
    const [state, setState] = useState({ index: 0, pages: 1 });

    const getMetrics = useCallback(() => {
        const track = trackRef.current;
        const first = track?.children[0];
        if (!track || !first) return null;
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        const step = first.getBoundingClientRect().width + gap;
        if (!step) return null;
        const count = track.children.length;
        // Fully visible slides (a partial "peek" slide does not count).
        const perView = Math.max(1, Math.floor((track.clientWidth + gap) / step + 0.05));
        // Paginate by screenful: arrows/dots move `perView` slides at a time.
        const pages = Math.max(1, Math.ceil(count / perView));
        const maxStart = Math.max(0, count - perView);
        const rtl = getComputedStyle(track).direction === 'rtl';
        return { track, step, perView, pages, maxStart, rtl };
    }, []);

    const measure = useCallback(() => {
        const m = getMetrics();
        if (!m) {
            setState((s) => (s.index === 0 && s.pages === 1 ? s : { index: 0, pages: 1 }));
            return;
        }
        const { track, step, perView, pages } = m;
        const scrolled = Math.abs(track.scrollLeft);
        const atEnd = scrolled + track.clientWidth >= track.scrollWidth - 2;
        const index = atEnd ? pages - 1 : Math.min(pages - 1, Math.round(scrolled / (step * perView)));
        setState((s) => (s.index === index && s.pages === pages ? s : { index, pages }));
    }, [getMetrics]);

    const goTo = useCallback((target) => {
        const m = getMetrics();
        if (!m) return;
        const page = Math.max(0, Math.min(m.pages - 1, target));
        const start = Math.min(page * m.perView, m.maxStart);
        m.track.scrollTo({
            left: (m.rtl ? -1 : 1) * start * m.step,
            behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        });
    }, [getMetrics]);

    // Keep state in sync with scroll position and size changes.
    useEffect(() => {
        const track = trackRef.current;
        if (!track) return undefined;
        let frame = 0;
        const onScroll = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(measure);
        };
        track.addEventListener('scroll', onScroll, { passive: true });
        const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onScroll) : null;
        ro?.observe(track);
        if (!ro) window.addEventListener('resize', onScroll);
        return () => {
            cancelAnimationFrame(frame);
            track.removeEventListener('scroll', onScroll);
            ro?.disconnect();
            if (!ro) window.removeEventListener('resize', onScroll);
        };
    }, [measure]);

    useEffect(() => {
        const frame = requestAnimationFrame(measure);
        return () => cancelAnimationFrame(frame);
    }, [count, measure]);

    // Click-and-drag for mouse users (touch/pen use native scrolling).
    useEffect(() => {
        const track = trackRef.current;
        if (!track) return undefined;
        let startX = 0;
        let startScroll = 0;
        let pointerDown = false;
        let dragged = false;

        const onDown = (e) => {
            if (e.pointerType !== 'mouse' || e.button !== 0) return;
            pointerDown = true;
            dragged = false;
            startX = e.clientX;
            startScroll = track.scrollLeft;
        };
        const onMove = (e) => {
            if (!pointerDown) return;
            const dx = e.clientX - startX;
            if (!dragged && Math.abs(dx) > 6) {
                dragged = true;
                track.classList.add('is-dragging');
            }
            if (dragged) track.scrollLeft = startScroll - dx;
        };
        const onUp = () => {
            if (!pointerDown) return;
            pointerDown = false;
            if (!dragged) return;
            track.classList.remove('is-dragging');
            // Snap to the nearest slide (not page) after a drag.
            const m = getMetrics();
            if (!m) return;
            const start = Math.min(m.maxStart, Math.round(Math.abs(track.scrollLeft) / m.step));
            track.scrollTo({
                left: (m.rtl ? -1 : 1) * start * m.step,
                behavior: prefersReducedMotion() ? 'auto' : 'smooth',
            });
        };
        // Swallow the click that ends a drag so cards don't navigate.
        const onClick = (e) => {
            if (dragged) {
                e.preventDefault();
                e.stopPropagation();
                dragged = false;
            }
        };
        const onDragStart = (e) => e.preventDefault();

        track.addEventListener('pointerdown', onDown);
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        track.addEventListener('click', onClick, true);
        track.addEventListener('dragstart', onDragStart);
        return () => {
            track.removeEventListener('pointerdown', onDown);
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
            track.removeEventListener('click', onClick, true);
            track.removeEventListener('dragstart', onDragStart);
        };
    }, [getMetrics, goTo]);

    const { index, pages } = state;
    return {
        trackRef,
        index,
        pages,
        canPrev: index > 0,
        canNext: index < pages - 1,
        prev: () => goTo(index - 1),
        next: () => goTo(index + 1),
        goTo,
    };
}
