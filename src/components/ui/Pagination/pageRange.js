/**
 * Page numbers to render, with '…' gaps. Always shows first/last page and a
 * window of `siblings` pages around the current one.
 * e.g. getPageRange(6, 12) → [1, '…', 5, 6, 7, '…', 12]
 */
export function getPageRange(current, total, siblings = 1) {
    const size = siblings * 2 + 5; // first, last, current, 2 gaps
    if (total <= size) return Array.from({ length: total }, (_, i) => i + 1);

    const start = Math.max(current - siblings, 2);
    const end = Math.min(current + siblings, total - 1);
    const showLeftGap = start > 3;
    const showRightGap = end < total - 2;

    if (!showLeftGap) {
        const count = siblings * 2 + 3;
        return [...Array.from({ length: count }, (_, i) => i + 1), 'gap-r', total];
    }
    if (!showRightGap) {
        const count = siblings * 2 + 3;
        return [1, 'gap-l', ...Array.from({ length: count }, (_, i) => total - count + 1 + i)];
    }
    return [1, 'gap-l', ...Array.from({ length: end - start + 1 }, (_, i) => start + i), 'gap-r', total];
}
