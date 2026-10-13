import BlogCard from '../BlogCard/index.jsx';
import CardSlot from '../CardSlot.jsx';

/**
 * "More posts" card on the blog detail page (compact BlogCard in a legacy column).
 * Props: blog; [bare]; [wrapperClassName]
 */
function BlogDetailCard({ blog, bare = false, wrapperClassName = 'col-20 col-md-30 col-sm-60 col-xs-60' }) {
    return (
        <CardSlot bare={bare} className={wrapperClassName}>
            <BlogCard blog={blog} compact />
        </CardSlot>
    );
}

export default BlogDetailCard;
