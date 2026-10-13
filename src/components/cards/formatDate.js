/**
 * Formats API dates for display. Accepts ISO strings ("2026-04-28T10:00:00")
 * and the "dd.mm.yyyy" format some endpoints return. Falls back to the raw value.
 */
export function formatDate(value, locale) {
    if (!value) return '';
    let date = null;
    const dotted = /^(\d{1,2})\.(\d{1,2})\.(\d{4})/.exec(value);
    if (dotted) {
        date = new Date(Number(dotted[3]), Number(dotted[2]) - 1, Number(dotted[1]));
    } else {
        const parsed = new Date(value);
        if (!Number.isNaN(parsed.getTime())) date = parsed;
    }
    if (!date) return String(value).split('T')[0];
    try {
        return new Intl.DateTimeFormat(locale || undefined, { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
    } catch {
        return date.toLocaleDateString();
    }
}

/** Machine-readable yyyy-mm-dd for <time dateTime>. */
export function isoDate(value) {
    if (!value) return undefined;
    const dotted = /^(\d{1,2})\.(\d{1,2})\.(\d{4})/.exec(value);
    if (dotted) return `${dotted[3]}-${dotted[2].padStart(2, '0')}-${dotted[1].padStart(2, '0')}`;
    return String(value).split('T')[0];
}
