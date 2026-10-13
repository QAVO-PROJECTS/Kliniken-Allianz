import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, CalendarDays, Check, Eye, Facebook, Link2, Linkedin, Newspaper, Twitter, X } from "lucide-react";
import { useGetAllNewspaperQuery, useGetNewspaperByIdQuery } from "../../../api/userApi.js";
import { getLocalizedText } from "../../../i18n/getLocalizedText.js";
import { formatDate, isoDate } from "../../../components/cards/formatDate.js";
import PageHeader from "../../../components/ui/PageHeader/index.jsx";
import BlogCard from "../../../components/cards/BlogCard/index.jsx";
import showToast from "../../../utils/toast.js";
import Logo from "../../../assets/Logo.png";
import VideoGrid from "../TourDetail/VideoGrid.jsx";
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
            <span className={`blog-fallback ${className}`.trim()}>
                <img src={Logo} alt="" loading="lazy" decoding="async" />
            </span>
        );
    }
    return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} {...rest} />;
}

function BlogDetail() {
    const { t, i18n } = useTranslation();
    const { id } = useParams();
    const { data, isLoading, isError } = useGetNewspaperByIdQuery(id);
    const { data: allData } = useGetAllNewspaperQuery();
    const [copied, setCopied] = useState(false);
    const [preview, setPreview] = useState(null);

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
        if (!preview) return undefined;
        const onKey = (e) => e.key === "Escape" && setPreview(null);
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [preview]);

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

    return (
        <div className="blog-detail">
            <PageHeader
                title={title || " "}
                crumbs={[{ label: t("navbar.blog"), to: "/blogs" }, { label: t("navbar.blogSingular") }]}
            >
                {blog && (
                    <div className="post-meta blog-detail__meta">
                        {blog.createDate && (
                            <span><CalendarDays size={16} strokeWidth={2} aria-hidden="true" /><time dateTime={isoDate(blog.createDate)}>{formatDate(blog.createDate, i18n.language)}</time></span>
                        )}
                        {Number(blog.viewCount) > 0 && (
                            <span><Eye size={16} strokeWidth={2} aria-hidden="true" />{t("blogs.views", "{{count}} views", { count: blog.viewCount })}</span>
                        )}
                    </div>
                )}
            </PageHeader>

            <article className="article">
                <div className="article__hero">
                    {isLoading ? (
                        <div className="skeleton article__hero-img" aria-hidden="true" />
                    ) : (
                        <button
                            type="button"
                            className="article__hero-btn"
                            onClick={() => images[0] && setPreview(images[0])}
                            aria-label={t("gallery.open", "Open photo gallery")}
                            disabled={!images[0]}
                        >
                            <BlogImage src={images[0]} alt={title} className="article__hero-img" fetchPriority="high" />
                        </button>
                    )}
                </div>

                <div className="article__container">
                    <div className="article__share" aria-label={t("blogDetail.share", "Share")}>
                        <span className="article__share-label">{t("blogDetail.share", "Share")}</span>
                        <button type="button" className="share-btn share-btn--copy" onClick={copyLink}>
                            {copied ? <Check size={16} strokeWidth={2.5} /> : <Link2 size={16} strokeWidth={2} />}
                            {copied ? t("blogDetail.copied", "Copied") : t("blogDetail.copyLink")}
                        </button>
                        <a className="share-btn" href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`} target="_blank" rel="noopener noreferrer" aria-label="X / Twitter">
                            <Twitter size={18} strokeWidth={2} />
                        </a>
                        <a className="share-btn" href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <Facebook size={18} strokeWidth={2} />
                        </a>
                        <a className="share-btn" href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <Linkedin size={18} strokeWidth={2} />
                        </a>
                    </div>

                    {isLoading ? (
                        <div className="detail-skeleton" aria-hidden="true">
                            <div className="skeleton detail-skeleton__line" />
                            <div className="skeleton detail-skeleton__line" />
                            <div className="skeleton detail-skeleton__line detail-skeleton__line--short" />
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
                        <div className="article__block">
                            <h2>{t("clinicDetail.gallery.title", "Gallery")}</h2>
                            <div className="article__gallery">
                                {images.slice(1).map((src, i) => (
                                    <button type="button" key={src} className="article__gallery-item" onClick={() => setPreview(src)}>
                                        <BlogImage src={src} alt={`${title} — ${i + 2}`} loading="lazy" decoding="async" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {videos.length > 0 && (
                        <div className="article__block">
                            <h2>{t("blogDetail.videos.title", "Videos")}</h2>
                            <VideoGrid videos={videos} title={title} />
                        </div>
                    )}
                </div>
            </article>

            {related.length > 0 && (
                <section className="section section--subtle blog-detail__related">
                    <div className="container">
                        <div className="listing-toolbar">
                            <div>
                                <h2>{t("blogDetail.recommendTitle")}</h2>
                                <p>{t("blogDetail.recommendSubtitle")}</p>
                            </div>
                            <Link to="/blogs" className="btn btn--secondary btn--sm">
                                {t("blogDetail.viewAll")}
                                <ArrowRight size={16} strokeWidth={2} className="blogs-arrow" aria-hidden="true" />
                            </Link>
                        </div>
                        <div className="listing-grid listing-grid--3">
                            {related.map((b, i) => (
                                <BlogCard key={b.id} blog={b} index={i} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {preview && (
                <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setPreview(null)}>
                    <button type="button" className="lightbox__close" onClick={() => setPreview(null)} aria-label={t("gallery.close", "Close")}>
                        <X size={22} strokeWidth={2} />
                    </button>
                    <img src={preview} alt={title} onClick={(e) => e.stopPropagation()} />
                </div>
            )}
        </div>
    );
}

export default BlogDetail;
