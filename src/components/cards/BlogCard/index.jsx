import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, CalendarDays, Eye, ImageOff } from 'lucide-react';
import './index.scss';
import { NEWSPAPER_IMAGES } from '../../../config/mediaUrls.js';
import { getLocalizedText } from '../../../i18n/getLocalizedText.js';
import { formatDate, isoDate } from '../formatDate.js';

const firstImage = (blog, i = 0) => blog?.newsPaperImages?.[i] || blog?.newspaperImages?.[i];

/**
 * Blog post card.
 * Props: blog; [compact] smaller variant without excerpt; [className]
 * (`index` is accepted for backwards compatibility.)
 */
// eslint-disable-next-line no-unused-vars
function BlogCard({ blog, index, compact = false, className = '' }) {
    const { t, i18n } = useTranslation();
    const [imgError, setImgError] = useState(false);

    const title = getLocalizedText(blog, 'title');
    const excerpt = getLocalizedText(blog, 'subtitle');
    const image = firstImage(blog);

    return (
        <Link
            to={`/blogs/${blog?.id}`}
            className={`blog-card${compact ? ' blog-card--compact' : ''} ${className}`.trim()}
        >
            <div className="blog-card__media">
                {image && !imgError ? (
                    <img
                        src={NEWSPAPER_IMAGES + image}
                        alt={title}
                        width="640"
                        height="400"
                        loading="lazy"
                        decoding="async"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="blog-card__placeholder" aria-hidden="true">
                        <ImageOff size={32} strokeWidth={1.75} />
                    </div>
                )}
            </div>
            <div className="blog-card__body">
                <div className="blog-card__meta">
                    {blog?.createDate && (
                        <span>
                            <CalendarDays size={15} strokeWidth={1.75} aria-hidden="true" />
                            <time dateTime={isoDate(blog.createDate)}>{formatDate(blog.createDate, i18n.language)}</time>
                        </span>
                    )}
                    {Number(blog?.viewCount) > 0 && (
                        <span>
                            <Eye size={15} strokeWidth={1.75} aria-hidden="true" />
                            <span className="tabular">{blog.viewCount}</span>
                        </span>
                    )}
                </div>
                <h3 className="blog-card__title">{title}</h3>
                {!compact && excerpt && <p className="blog-card__excerpt">{excerpt}</p>}
                <span className="blog-card__more">
                    {compact ? t('blogDetailCard.button', 'Dahasına bax') : t('blogCard.readMore', 'Ətraflı oxu')}
                    <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
                </span>
            </div>
        </Link>
    );
}

export default BlogCard;
