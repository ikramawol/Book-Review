import React, { useState } from "react";
import "../styles/admin.css";

const flaggedReviews = Array.from({ length: 48 }, (_, i) => ({
  id: i + 1,
  user: `User${i + 1}`,
  book: `Book ${i + 1}`,
  comment: `Comment example ${i + 1}`,
  reason: i % 2 === 0 ? "Offensive language" : "Spam content",
}));

const AdminFlags = () => {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const handleRemove = (id) => {
    const confirmRemove = window.confirm("Are you sure you want to remove this review?");
    if (confirmRemove) {
      console.log(`Removed review ID: ${id}`);
    }
  };

  const handleIgnore = (id) => {
    const confirmIgnore = window.confirm("Ignore this flag?");
    if (confirmIgnore) {
      console.log(`Ignored flag for review ID: ${id}`);
    }
  };

  const totalPages = Math.ceil(flaggedReviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFlags = flaggedReviews.slice(startIndex, startIndex + itemsPerPage);

  const renderPagination = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return (
      <>
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
        {pages.map((page, index) =>
          page === "..." ? (
            <span key={index}>...</span>
          ) : (
            <span
              key={index}
              className={currentPage === page ? "active-page" : ""}
              onClick={() => setCurrentPage(page)}
              style={{ cursor: "pointer" }}
            >
              {page}
            </span>
          )
        )}
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
      </>
    );
  };

  return (
    <div className="admin-flags">
      <h2>Flagged Reviews ({flaggedReviews.length})</h2>
      <div className="flags-list">
        {currentFlags.map((review) => (
          <div className="flag-card" key={review.id}>
            <p><strong>User:</strong> {review.user}</p>
            <p><strong>Book:</strong> {review.book}</p>
            <p><strong>Comment:</strong> {review.comment}</p>
            <p><strong>Reason:</strong> {review.reason}</p>
            <div className="flag-actions">
              <button onClick={() => handleRemove(review.id)} className="remove-btn">Remove Review</button>
              <button onClick={() => handleIgnore(review.id)} className="ignore-btn">Ignore</button>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">{renderPagination()}</div>
    </div>
  );
};

export default AdminFlags;
