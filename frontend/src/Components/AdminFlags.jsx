import React, { useEffect, useState } from "react";
import "../styles/admin.css";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../config';

const statusColors = {
  APPROVED: "#68d391",
  REMOVED: "#e53e3e",
  REJECTED: "#718096",
  PENDING: "#C9AA71"
};

const AdminFlags = () => {
  const navigate = useNavigate();
  const [flagList, setFlagList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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
        <div className="flags-table-container">
          <table className="flags-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Reporter</th>
                <th>Reported Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {flagList.map((report, idx) => (
                <tr
                  key={report.id}
                  className="flag-row"
                  onClick={() => navigate(`/admin/flags/${report.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{idx + 1}</td>
                  <td style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
                  </td>
                  <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span
                      className="flag-status"
                      style={{
                        background: statusColors[report.status] || "#C9AA71",
                        color: "#181818",
                        padding: "6px 14px",
                        borderRadius: "8px",
                        fontWeight: 600
                      }}
                    >
                      {report.status || "PENDING"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminFlags;
