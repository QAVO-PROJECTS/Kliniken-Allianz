import { useEffect, useId, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, CalendarDays, Check, Eye, Facebook, ImageOff, Link2, Linkedin, Newspaper, Share2, Twitter } from "lucide-react";
import { useGetAllNewspaperQuery, useGetNewspaperByIdQuery } from "../../../api/userApi.js";
import { getLocalizedText } from "../../../i18n/getLocalizedText.js";
import { formatDate, isoDate } from "../../../components/cards/formatDate.js";
import PageHeader from "../../../components/ui/PageHeader/index.jsx";
import HorizontalBlogCard from "../../../components/cards/HorizontalBlogCard/index.jsx";
import showToast from "../../../utils/toast.js";
import VideoGrid from "../TourDetail/VideoGrid.jsx";
import Lightbox from "../TourDetail/Lightbox.jsx";
import { toParagraphs } from "../TourDetail/carMessage.js";
import { EmptyState } from "../Tours/ListingStates.jsx";
import { blogImages, sortBlogs } from "../Blogs/blogUtils.js";
import { NEWSPAPER_IMAGES } from "../../../config/mediaUrls.js";
import "../Tours/listing.scss";
import "../TourDetail/detailShared.scss";
import "../Blogs/blogs.scss";
import "./blogDetail.scss";

const isYoutube = (text = "") => /youtu\.be\/|youtube\.com\//.test(text);

function BlogImage({ src, alt, className = "", ...rest }) {
    const [failed, setFailed] = useState(false);
    useEffect(() => setFailed(false), [src]);
    if (!src || failed) {
        return (
            <span className={`blog-fallback ${className}`.trim()} aria-hidden="true">
                <ImageOff size={36} strokeWidth={1.75} />
            </span>
        );
    }
    return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} {...rest} />;
}

function BlogDetail() {
    const { t, i18n } = useTranslation();
    const { id } = useParams();
    const uid = useId();
    const { data, isLoading, isError } = useGetNewspaperByIdQuery(id);
    const { data: allData } = useGetAllNewspaperQuery();
    const [copied, setCopied] = useState(false);
    const [preview, setPreview] = useState(null);
    const [canShare, setCanShare] = useState(false);

    const blog = data?.data;
    const title = getLocalizedText(blog, "title");
    const subtitle = getLocalizedText(blog, "subtitle");
    const images = blogImages(blog).map((img) => NEWSPAPER_IMAGES + img);
    const videos = blog?.newspaperVideos || blog?.newsPaperVideos || blog?.videos || [];
    const subtitleIsVideo = isYoutube(subtitle);
    const paragraphs = subtitleIsVideo || subtitle === title ? [] : toParagraphs(subtitle);
    const related = sortBlogs((allData?.data || []).filter((b) => b.id !== id)).slice(0, 3);

    const pageUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareUrl = encodeURIComponent(pageUrl);
    const shareText = encodeURIComponent(title);

    useEffect(() => {
        setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
    }, []);

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(pageUrl);
            setCopied(true);
            showToast(t("blogDetail.copySuccess"), "success");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            showToast(t("contact.errorToast"), "error");
        }
    };

    const nativeShare = async () => {
        try {
            await navigator.share({ title, url: pageUrl });
        } catch {
            // dismissed by the user: nothing to do
        }
    };

    if (!isLoading && (isError || !blog)) {
        return (
            <div className="blog-detail">
                <PageHeader title={t("navbar.blogSingular")} crumbs={[{ label: t("navbar.blog"), to: "/blogs" }]} />
                <div className="container detail-page">
                    <EmptyState
                        icon={Newspaper}
                        title={t("common.noData", "No data")}
                        action={<Link to="/blogs" className="btn btn--primary">{t("blogDetail.viewAll")}</Link>}
                    />
                </div>
            </div>
        );
    }

    const shareLinks = [
        { key: "x", label: "X (Twitter)", icon: Twitter, href: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}` },
        { key: "facebook", label: "Facebook", icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}` },
        { key: "linkedin", label: "LinkedIn", icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}` },
    ];

    return (
        <div className="blog-detail">
            <PageHeader
                title={title || " "}
                crumbs={[{ label: t("navbar.blog"), to: "/blogs" }, { label: t("navbar.blogSingular") }]}
            >
                {blog && (
                    <div className="post-meta blog-detail__meta">
                        {blog.createDate && (
                            <span>
                                <CalendarDays size={16} strokeWidth={1.75} aria-hidden="true" />
                                <time dateTime={isoDate(blog.createDate)}>{formatDate(blog.createDate, i18n.language)}</time>
                            </span>
                        )}
                        {Number(blog.viewCount) > 0 && (
                            <span>
                                <Eye size={16} strokeWidth={1.75} aria-hidden="true" />
                                {t("blogs.views", "{{count}} views", { count: blog.viewCount })}
                            </span>
                        )}
                    </div>
                )}
            </PageHeader>

            <article className="article container">
                <div className="article__hero">
                    {isLoading ? (
                        <div className="skeleton article__hero-img" aria-hidden="true" />
                    ) : images[0] ? (
                        <button
                            type="button"
                            className="article__hero-btn"
                            onClick={() => setPreview(images[0])}
                            aria-label={t("gallery.open", "Open photo gallery")}
                        >
                            <BlogImage src={images[0]} alt={title} className="article__hero-img" width="1200" height="675" fetchPriority="high" />
                        </button>
                    ) : null}
                </div>

                <div className="article__layout">
                    <div className="article__main">
                        {isLoading ? (
                            <div className="detail-skeleton" role="status" aria-busy="true">
                                <span className="visually-hidden">{t("common.loading", "Loading…")}</span>
                                <div className="skeleton detail-skeleton__line" aria-hidden="true" />
                                <div className="skeleton detail-skeleton__line" aria-hidden="true" />
                                <div className="skeleton detail-skeleton__line detail-skeleton__line--short" aria-hidden="true" />
                            </div>
                        ) : (
                            <div className="article__body">
                                {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                            </div>
                        )}

                        {subtitleIsVideo && (
                            <div className="article__block">
                                <VideoGrid videos={[subtitle.trim()]} title={title} />
                            </div>
                        )}

                        {images.length > 1 && (
                            <section className="article__block" aria-labelledby={`${uid}-gallery`}>
                                <h2 id={`${uid}-gallery`}>{t("clinicDetail.gallery.title", "Gallery")}</h2>
                                <ul className="article__gallery">
                                    {images.slice(1).map((src, i) => (
                                        <li key={src}>
                                            <button
                                                type="button"
                                                className="article__gallery-item"
                                                onClick={() => setPreview(src)}
                                                aria-label={`${t("gallery.open", "Open photo gallery")}: ${t("gallery.photo", "Photo")} ${i + 2}`}
                                            >
                                                <BlogImage
                                                    src={src}
                                                    alt={`${title}, ${t("gallery.photo", "Photo")} ${i + 2}`}
                                                    width="600"
                                                    height="450"
                                                    loading="lazy"
                                                    decoding="async"
                                                />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {videos.length > 0 && (
                            <section className="article__block" aria-labelledby={`${uid}-videos`}>
                                <h2 id={`${uid}-videos`}>{t("blogDetail.videos.title", "Videos")}</h2>
                                <VideoGrid videos={videos} title={title} />
                            </section>
                        )}
                    </div>

                    <aside className="article__aside">
                        <div className="article__share" role="group" aria-labelledby={`${uid}-share`}>
                            <h2 id={`${uid}-share`} className="article__aside-title">{t("blogDetail.share", "Share")}</h2>
                            <div className="article__share-row">
                                <button type="button" className="share-btn share-btn--wide" onClick={copyLink}>
                                    {copied ? (
                                        <Check size={18} strokeWidth={1.75} aria-hidden="true" />
                                    ) : (
                                        <Link2 size={18} strokeWidth={1.75} aria-hidden="true" />
                                    )}
                                    <span aria-live="polite">{copied ? t("blogDetail.copied", "Copied") : t("blogDetail.copyLink")}</span>
                                </button>
                                {canShare && (
                                    <button
                                        type="button"
                                        className="share-btn"
                                        onClick={nativeShare}
                                        aria-label={t("blogDetail.share", "Share")}
                                    >
                                        <Share2 size={18} strokeWidth={1.75} aria-hidden="true" />
                                    </button>
                                )}
                                {shareLinks.map(({ key, label, icon: Icon, href }) => (
                                    <a
                                        key={key}
                                        className="share-btn"
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`${t("blogDetail.share", "Share")}: ${label}`}
                                    >
                                        <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {related.length > 0 && (
                            <nav className="article__related" aria-labelledby={`${uid}-related`}>
                                <h2 id={`${uid}-related`} className="article__aside-title">{t("blogDetail.recommendTitle")}</h2>
                                <ul>
                                    {related.map((b) => (
                                        <li key={b.id}>
                                            <HorizontalBlogCard blog={b} />
                                        </li>
                                    ))}
                                </ul>
                                <Link to="/blogs" className="article__all">
                                    {t("blogDetail.viewAll")}
                                    <ArrowRight size={16} strokeWidth={1.75} className="blogs-arrow" aria-hidden="true" />
                                </Link>
                            </nav>
                        )}
                    </aside>
                </div>
            </article>

            {preview && (
                <Lightbox label={title} onClose={() => setPreview(null)}>
                    <img className="lightbox__img" src={preview} alt={title} />
                </Lightbox>
            )}
        </div>
    );
}

export default BlogDetail;
