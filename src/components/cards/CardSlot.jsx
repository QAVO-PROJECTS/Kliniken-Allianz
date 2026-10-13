/**
 * Legacy grid wrapper. Cards historically rendered their own `.col-*` column;
 * pages that lay cards out with CSS grid can pass `bare` to drop it.
 */
function CardSlot({ bare = false, className, children }) {
    if (bare) return children;
    return <div className={`${className} card-slot`}>{children}</div>;
}

export default CardSlot;
