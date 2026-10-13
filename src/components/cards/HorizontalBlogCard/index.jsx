import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CalendarDays, ImageOff } from 'lucide-react';
import './index.scss';
import { NEWSPAPER_IMAGES } from '../../../config/mediaUrls.js';
import { getLocalizedText } from '../../../i18n/getLocalizedText.js';
import { formatDate, isoDate } from '../formatDate.js';

/** Compact horizontal blog teaser (thumbnail + title + date). Props: blog */
function HorizontalBlogCard({ blog }) {
    const { i18n } = useTranslation();
    const [imgError, setImgError] = useState(false);
    const title = getLocalizedText(blog, 'title');
    const image = blog?.newsPaperImages?.[0] || blog?.newspaperImages?.[0];

    return (
        <Link to={`/blogs/${blog?.id}`} className="hblog-card blogs-card">
            <span className="hblog-card__thumb">
                {image && !imgError ? (
                    <img
                        src={NEWSPAPER_IMAGES + image}
                        alt=""
                        width="96"
                        height="80"
                        loading="lazy"
                        decoding="async"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <ImageOff size={22} strokeWidth={1.75} aria-hidden="true" />
                )}
            </span>
            <span className="hblog-card__body">
                <span className="hblog-card__title">{title}</span>
                {blog?.createDate && (
                    <span className="hblog-card__date">
                        <CalendarDays size={14} strokeWidth={1.75} aria-hidden="true" />
                        <time dateTime={isoDate(blog.createDate)}>{formatDate(blog.createDate, i18n.language)}</time>
                    </span>
                )}
            </span>
        </Link>
    );
}

export default HorizontalBlogCard;
