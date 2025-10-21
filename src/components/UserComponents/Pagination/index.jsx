import "./index.scss";

function Pagination({ currentPage, totalPages, onPageChange }) {
    const pages = [];

    // Dinamik səhifə nömrələrini hesablamaq
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 ||
            i === totalPages ||
            (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
            pages.push(i);
        } else if (
            (i === 2 && currentPage > 3) ||
            (i === totalPages - 1 && currentPage < totalPages - 2)
        ) {
            pages.push("...");
        }
    }

    return (
        <div className="custom-pagination">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(1)}
                className="nav-btn"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M10.9938 11.25L11.875 10.3688L9.0125 7.5L11.875 4.63125L10.9937 3.75L7.24375 7.5L10.9938 11.25Z" fill="#333333"/>
                    <path d="M6.87656 11.25L7.75781 10.3688L4.89531 7.5L7.75781 4.63125L6.87656 3.75L3.12656 7.5L6.87656 11.25Z" fill="#333333"/>
                </svg>
            </button>

            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="nav-btn"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M9.43125 11.25L10.3125 10.3688L7.45 7.5L10.3125 4.63125L9.43125 3.75L5.68125 7.5L9.43125 11.25Z" fill="black"/>
                </svg>
            </button>

            {pages.map((page, index) =>
                    page === "..." ? (
                        <span key={index} className="dots">
            ...
          </span>
                    ) : (
                        <button
                            key={index}
                            className={`page-btn ${currentPage === page ? "active" : ""}`}
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </button>
                    )
            )}

            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="nav-btn"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M6.50625 3.75L5.625 4.63125L8.4875 7.5L5.625 10.3687L6.50625 11.25L10.2562 7.5L6.50625 3.75Z" fill="black"/>
                </svg>
            </button>

            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(totalPages)}
                className="nav-btn"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M4.00625 3.75L3.125 4.63125L5.9875 7.5L3.125 10.3687L4.00625 11.25L7.75625 7.5L4.00625 3.75Z" fill="black"/>
                    <path d="M8.12344 3.75L7.24219 4.63125L10.1047 7.5L7.24219 10.3687L8.12344 11.25L11.8734 7.5L8.12344 3.75Z" fill="black"/>
                </svg>
            </button>
        </div>
    );
}

export default Pagination;
