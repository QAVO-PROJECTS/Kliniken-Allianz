import { NEWSPAPER_IMAGES } from "../../../config/mediaUrls.js";

/** API dates arrive as "dd.mm.yyyy" (or ISO); returns a timestamp for sorting. */
export const blogTime = (value) => {
    if (!value) return 0;
    const m = /^(\d{1,2})\.(\d{1,2})\.(\d{4})/.exec(value);
    if (m) return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1])).getTime();
    const time = new Date(value).getTime();
    return Number.isNaN(time) ? 0 : time;
};

export const blogImages = (blog) => blog?.newsPaperImages || blog?.newspaperImages || [];

export const blogImageUrl = (blog, index = 0) => {
    const img = blogImages(blog)[index];
    return img ? NEWSPAPER_IMAGES + img : null;
};

export const sortBlogs = (list = []) => [...list].sort((a, b) => blogTime(b.createDate) - blogTime(a.createDate));

/**
 * Column span (of 6) for item `index` in a grid of `count` cards, so rows are
 * always full and not all the same: leftovers become rows of two wide cards
 * (span 3) ahead of the rows of three (span 2).
 */
export const gridSpan = (index, count) => {
    const remainder = count % 3;
    const wide = remainder === 1 ? Math.min(4, count) : remainder === 2 ? 2 : 0;
    return index < wide ? 3 : 2;
};
