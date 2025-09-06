import React, { useEffect, useState } from "react";
import "../styles/admin.css";
import { useNavigate } from "react-router-dom";

const AdminFlags = () => {
  const navigate = useNavigate();

  const [flagList, setFlagList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const getFlags = async () => {
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
      console.error("No access token found. Please log in.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/report`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }
      if (res.status === 403) {
        setError("You must be an admin to view flags.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      
      if (data && data.success && Array.isArray(data.data)) {
        setFlagList(data.data);
        setError(null);
      } else {
        setError("Failed to fetch flagged reviews.");
      }
    } catch (err) {
      console.error("Error fetching flags:", err);
      setError("Failed to fetch flagged reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFlags();
  }, [navigate]);

  const handleAdminAction = async (reportId, action) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No access token found. Please log in.");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/report/${reportId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();
      
      if (res.status === 401) {
        navigate("/login");
        return;
      } else if (res.status === 403) {
        setError("You must be an admin to perform this action.");
        return;
      } else if (res.ok) {
        // Refresh reports after successful action
        await getFlags();
        setError(null);
      } else {
        setError(data.message || "Action failed.");
      }
    } catch (err) {
      console.error("Action failed:", err);
      setError("Action failed. Please try again.");
    }
  };

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const handleRemove = (report, action) => {
    const actionText = action === "REMOVE" ? "remove this review" : "ignore this flag";
    const confirmAction = window.confirm(
      `Are you sure you want to ${actionText}?`
    );
    if (confirmAction) {
      handleAdminAction(report.id, action);
    }
  };

  const handleIgnore = (report) => {
    const confirmIgnore = window.confirm("Ignore this flag?");
    if (confirmIgnore) {
      handleAdminAction(report.id, "REJECT");
    }
  };

  const totalPages = Math.ceil(flagList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFlags = flagList.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </button>
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
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </>
    );
  };

  // No frontend role checking - let the backend handle authentication

  if (loading) {
    return (
      <div className="admin-flags">
        <h2>Flagged Reviews</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="admin-flags">
      <h2>Flagged Reviews ({flagList.length})</h2>
      {error && <p className="error-message">{error}</p>}
      
      {flagList.length === 0 ? (
        <p>No flagged reviews found.</p>
      ) : (
        <>
          <div className="flags-list">
            {currentFlags.map((report) => (
              <div className="flag-card" key={report.id}>
                <div className="flag-info">
                  <p>
                    <strong>Reported by:</strong> {report.user?.name || "Unknown User"}
                  </p>
                  <p>
                    <strong>Review Content:</strong> {report.review?.content || "No content"}
                  </p>
                  <p>
                    <strong>Reason:</strong> {report.reason}
                  </p>
                  <p>
                    <strong>Reported on:</strong> {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                  {report.status && (
                    <p>
                      <strong>Status:</strong> {report.status}
                    </p>
                  )}
                </div>
                <div className="flag-actions">
                  <button
                    onClick={() => handleRemove(report, "REMOVE")}
                    className="remove-btn"
                    disabled={report.status === "REMOVED"}
                  >
                    Remove Review
                  </button>
                  <button
                    onClick={() => handleIgnore(report)}
                    className="ignore-btn"
                    disabled={report.status === "REJECTED"}
                  >
                    Ignore Flag
                  </button>
                  <button
                    onClick={() => handleAdminAction(report.id, "APPROVE")}
                    className="approve-btn"
                    disabled={report.status === "APPROVED"}
                  >
                    Approve Report
                  </button>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="pagination">{renderPagination()}</div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminFlags;
