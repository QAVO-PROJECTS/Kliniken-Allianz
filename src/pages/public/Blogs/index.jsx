import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, CalendarDays, Eye, Newspaper } from "lucide-react";
import { useGetAllNewspaperQuery } from "../../../api/userApi.js";
import { getLocalizedText } from "../../../i18n/getLocalizedText.js";
import { formatDate, isoDate } from "../../../components/cards/formatDate.js";
import PageHeader from "../../../components/ui/PageHeader/index.jsx";
import BlogCard from "../../../components/cards/BlogCard/index.jsx";
import BlogPagination from "../../../components/ui/BlogPagination/index.jsx";
import CtaBand from "../Contact/CtaBand.jsx";
import { EmptyState, SkeletonGrid } from "../Tours/ListingStates.jsx";
import Logo from "../../../assets/Logo.png";
import { blogImageUrl, sortBlogs } from "./blogUtils.js";
import "../Tours/listing.scss";
import "./blogs.scss";

const PER_PAGE = 6;

function FeaturedPost({ blog }) {
    const { t, i18n } = useTranslation();
    const [failed, setFailed] = useState(false);
    const title = getLocalizedText(blog, "title");
    const subtitle = getLocalizedText(blog, "subtitle");
    const src = blogImageUrl(blog);

    return (
        <article className="featured-post">
            <Link to={`/blogs/${blog.id}`} className="featured-post__media" tabIndex={-1} aria-hidden="true">
                {src && !failed ? (
                    <img src={src} alt="" onError={() => setFailed(true)} fetchPriority="high" />
                ) : (
                    <span className="blog-fallback"><img src={Logo} alt="" /></span>
                )}
            </Link>
            <div className="featured-post__body">
                <span className="badge badge--brand">{t("blogs.new", "Latest")}</span>
                <h2 className="featured-post__title">
                    <Link to={`/blogs/${blog.id}`}>{title}</Link>
                </h2>
                <div className="post-meta">
                    {blog.createDate && (
                        <span><CalendarDays size={16} strokeWidth={2} aria-hidden="true" /><time dateTime={isoDate(blog.createDate)}>{formatDate(blog.createDate, i18n.language)}</time></span>
                    )}
                    {Number(blog.viewCount) > 0 && (
                        <span><Eye size={16} strokeWidth={2} aria-hidden="true" />{t("blogs.views", "{{count}} views", { count: blog.viewCount })}</span>
                    )}
                </div>
                {subtitle && <p className="featured-post__excerpt">{subtitle}</p>}
                <Link to={`/blogs/${blog.id}`} className="btn btn--primary featured-post__cta">
                    {t("blogs.readMore", "Read more")}
                    <ArrowRight size={18} strokeWidth={2} className="blogs-arrow" aria-hidden="true" />
                </Link>
            </div>
        </article>
    );
}

function Blogs() {
    const { t } = useTranslation();
    const { data, isLoading } = useGetAllNewspaperQuery();
    const [page, setPage] = useState(1);

    const blogs = useMemo(() => sortBlogs(data?.data || []), [data]);
    const [featured, ...rest] = blogs;
    const pageCount = Math.max(1, Math.ceil(rest.length / PER_PAGE));
    const current = Math.min(page, pageCount);
    const visible = rest.slice((current - 1) * PER_PAGE, current * PER_PAGE);

    const changePage = (p) => {
        setPage(p);
        document.getElementById("all-articles")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <div className="blogs-page">
            <PageHeader
                title={t("navbar.blog")}
                subtitle={t("blogDetail.recommendSubtitle")}
                crumbs={[{ label: t("navbar.blog") }]}
            />

            <section className="listing">
                <div className="container">
                    {isLoading ? (
                        <>
                            <div className="featured-post featured-post--skeleton" aria-hidden="true">
                                <div className="skeleton featured-post__media" />
                                <div className="featured-post__body">
                                    <div className="skeleton skeleton-card__line skeleton-card__line--short" />
                                    <div className="skeleton skeleton-card__line skeleton-card__line--title" />
                                    <div className="skeleton skeleton-card__line" />
                                    <div className="skeleton skeleton-card__line" />
                                </div>
                            </div>
                            <SkeletonGrid count={3} className="listing-grid--3 blogs-page__grid" />
                        </>
                    ) : !featured ? (
                        <EmptyState icon={Newspaper} title={t("common.noData", "No data")} />
                    ) : (
                        <>
                            <FeaturedPost blog={featured} />

                            {rest.length > 0 && (
                                <div className="blogs-page__all" id="all-articles">
                                    <div className="listing-toolbar">
                                        <h2>{t("blogs.allArticles", "All articles")}</h2>
                                        <span className="listing-toolbar__count">
                                            {t("listing.count", "{{count}} results", { count: blogs.length })}
                                        </span>
                                    </div>
                                    <div className="listing-grid listing-grid--3 blogs-page__grid">
                                        {visible.map((blog, i) => (
                                            <BlogCard key={blog.id} blog={blog} index={i} />
                                        ))}
                                    </div>
                                    {pageCount > 1 && (
                                        <div className="blogs-page__pagination">
                                            <BlogPagination
                                                currentPage={current}
                                                totalPosts={rest.length}
                                                postsPerPage={PER_PAGE}
                                                onPageChange={changePage}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            <CtaBand />
        </div>
    );
}

export default Blogs;
