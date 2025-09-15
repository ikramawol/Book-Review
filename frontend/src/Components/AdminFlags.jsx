import React, { useEffect, useState } from "react";
import "../styles/admin.css";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../config';

const statusColors = {
  APPROVED: "#68d391",
  REMOVED: "#e53e3e",
  REJECTED: "#718096",
  PENDING: "#FFD77A"
};

const statusBg = {
  APPROVED: "rgba(104,211,145,0.18)",
  REMOVED: "rgba(229,62,62,0.18)",
  REJECTED: "rgba(113,128,150,0.18)",
  PENDING: "rgba(255,215,122,0.18)"
};

const AdminFlags = () => {
  const navigate = useNavigate();
  const [flagList, setFlagList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const getFlags = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/report`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data)) {
        setFlagList(data.data);
        setError(null);
      } else {
        setError("Failed to fetch flagged reviews.");
      }
    } catch (err) {
      setError("Failed to fetch flagged reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFlags();
  }, [navigate]);

  const filteredFlags = flagList.filter(
    (report) =>
      report.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      report.status?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-flags-card">
      <h2 style={{ marginBottom: 18 }}>Flagged Reviews</h2>
      <div className="flags-header-row">
        <input
          className="flags-search"
          type="text"
          placeholder="Search reporter or status..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="flags-table-list">
        <div className="flags-table-head">
          <div>No</div>
          <div>Reporter</div>
          <div>Status</div>
          <div>Date</div>
          <div>Details</div>
        </div>
        {loading ? (
          <div className="flags-table-row" style={{ textAlign: "center" }}>Loading...</div>
        ) : filteredFlags.length === 0 ? (
          <div className="flags-table-row" style={{ textAlign: "center" }}>No flagged reviews found.</div>
        ) : (
          filteredFlags.map((report, idx) => (
            <div className="flags-table-row" key={report.id}>
              <div>{idx + 1}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <img
                  src={report.user?.profile || "/default-profile.png"}
                  alt="profile"
                  className="flag-profile"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #C9AA71"
                  }}
                />
                <span>{report.user?.name || "Unknown User"}</span>
              </div>
              <div>
                <span
                  style={{
                    background: statusBg[report.status] || "#FFD77A",
                    color: statusColors[report.status] || "#222",
                    padding: "6px 18px",
                    borderRadius: "12px",
                    fontWeight: 600,
                    fontSize: "1rem"
                  }}
                >
                  {report.status || "PENDING"}
                </span>
              </div>
              <div>{new Date(report.createdAt).toLocaleDateString()}</div>
              <div>
                <button
                  className="flags-details-btn"
                  onClick={() => navigate(`/admin/flags/${report.id}`)}
                >
                  Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminFlags;
