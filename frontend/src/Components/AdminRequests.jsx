import React, { useState } from "react";
import "../styles/admin.css";

const unsuspensionRequests = Array.from({ length: 35 }, (_, i) => ({
  id: i + 1,
  user: `User${i + 1}`,
  suspensionReason: i % 2 === 0 ? "Inappropriate language" : "Spam comments",
  userNote: "I apologize and will not repeat this behavior.",
}));

const AdminRequests = () => {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const handleApprove = (id) => {
    const confirmApprove = window.confirm("Approve this unsuspension request?");
    if (confirmApprove) {
      console.log(`Approved unsuspension for user ID: ${id}`);
    }
  };

  const handleReject = (id) => {
    const confirmReject = window.confirm("Reject this unsuspension request?");
    if (confirmReject) {
      console.log(`Rejected unsuspension for user ID: ${id}`);
    }
  };

  const totalPages = Math.ceil(unsuspensionRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRequests = unsuspensionRequests.slice(startIndex, startIndex + itemsPerPage);

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
    <div className="admin-requests">
      <h2>Unsuspension Requests ({unsuspensionRequests.length})</h2>
      <div className="request-list">
        {currentRequests.map((request) => (
          <div className="request-card" key={request.id}>
            <p><strong>User:</strong> {request.user}</p>
            <p><strong>Suspension Reason:</strong> {request.suspensionReason}</p>
            <p><strong>User Note:</strong> {request.userNote}</p>
            <div className="request-actions">
              <button onClick={() => handleApprove(request.id)} className="approve-btn">Approve</button>
              <button onClick={() => handleReject(request.id)} className="reject-btn">Reject</button>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">{renderPagination()}</div>
    </div>
  );
};

export default AdminRequests;
