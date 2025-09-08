import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../config';
import "../styles/admin.css";

const statusColors = {
  APPROVED: "#68d391",
  REMOVED: "#e53e3e",
  REJECTED: "#718096",
  PENDING: "#C9AA71"
};

const FlagView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const fetchReport = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/report/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data && data.success && data.data) {
        setReport(data.data);
        setError(null);
      } else {
        setError("Failed to fetch report details.");
      }
    } catch (err) {
      setError("Failed to fetch report details.");
    }
  };

  useEffect(() => {
    fetchReport();
  }, [id]);

  const handleAdminAction = async (action) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/report/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (res.ok) {
        fetchReport();
        setError(null);
      } else {
        setError(data.message || "Action failed.");
      }
    } catch (err) {
      setError("Action failed. Please try again.");
    }
  };

  if (!report) {
    return (
      <div className="admin-flags">
        <h2>Flag Details</h2>
        {error ? <p className="error-message">{error}</p> : <p>Loading...</p>}
      </div>
    );
  }

  return (
    <div className="admin-flags">
      <h2>Flag Details</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="flag-card" style={{ maxWidth: 600, margin: "0 auto" }}>
        <div className="flag-info">
          <p>
            <strong>Reporter:</strong>
            <span style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "8px" }}>
              <img
                src={report.user?.profile || "/default-profile.png"}
                alt="profile"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #C9AA71"
                }}
              />
              {report.user?.name || "Unknown User"}
            </span>
          </p>
          <p>
            <strong>Reported on:</strong> {new Date(report.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong>Status:</strong>
            <span
              className="flag-status"
              style={{
                background: statusColors[report.status] || "#C9AA71",
                color: "#181818",
                padding: "6px 14px",
                borderRadius: "8px",
                fontWeight: 600,
                marginLeft: "8px"
              }}
            >
              {report.status || "PENDING"}
            </span>
          </p>
          <p>
            <strong>Reason:</strong> {report.reason}
          </p>
          <p>
            <strong>Review Content:</strong> {report.review?.content || "No content"}
          </p>
          <p>
            <strong>Message:</strong> {report.message || "No message"}
          </p>
        </div>
        <div className="flag-actions">
          <button
            onClick={() => handleAdminAction("REMOVE")}
            className="remove-btn"
            disabled={report.status === "REMOVED"}
          >
            Remove Review
          </button>
          <button
            onClick={() => handleAdminAction("REJECT")}
            className="ignore-btn"
            disabled={report.status === "REJECTED"}
          >
            Ignore Flag
          </button>
          <button
            onClick={() => handleAdminAction("APPROVE")}
            className="approve-btn"
            disabled={report.status === "APPROVED"}
          >
            Approve Report
          </button>
        </div>
      </div>
      <button
        style={{
          marginTop: "24px",
          background: "#C9AA71",
          color: "#181818",
          padding: "10px 24px",
          borderRadius: "8px",
          fontWeight: 600,
          border: "none",
          cursor: "pointer"
        }}
        onClick={() => navigate("/admin/flags")}
      >
        Back to Flags
      </button>
    </div>
  );
};

export default FlagView;