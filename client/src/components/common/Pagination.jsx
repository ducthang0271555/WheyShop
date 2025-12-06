import React from 'react';

const Pagination = ({ paginationInfo, currentPage, onPageChange }) => {
    if (!paginationInfo || paginationInfo.total_pages <= 1) {
        return null;
    }

    return (
        <div className="pagination-container">
            <button
                className="pagination-btn"
                disabled={!paginationInfo.has_prev}
                onClick={() => onPageChange(currentPage - 1)}
            >
                &laquo; Trước
            </button>

            {[...Array(paginationInfo.total_pages)].map((_, index) => {
                const pageNum = index + 1;
                return (
                    <button
                        key={pageNum}
                        className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                        onClick={() => onPageChange(pageNum)}
                    >
                        {pageNum}
                    </button>
                );
            })}

            <button
                className="pagination-btn"
                disabled={!paginationInfo.has_next}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Sau &raquo;
            </button>
        </div>
    );
};

export default Pagination;