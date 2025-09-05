import React, { useEffect, useState } from "react";
import "../styles/admin.css";
import { data } from "react-router-dom";

const flaggedReviews = Array.from({ length: 48 }, (_, i) => ({
  id: i + 1,
  user: `User${i + 1}`,
  book: `Book ${i + 1}`,
  comment: `Comment example ${i + 1}`,
  reason: i % 2 === 0 ? "Offensive language" : "Spam content",
}));

const AdminFlags = () => {

  // FIX THIS LATER
  // get the list of requests from the backend
  // handle the approve and reject functions

  const [flagList,setFlagList] = useState([])

  useEffect(() => {
    getFlags();
  }, []);

  const getFlags = async () => {

    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        console.error('No access token found. Please log in.')
        return
      }
      const response = await fetch(`/api/report/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        // body: JSON.stringify({
        //     content: message,
        //     rating: myrating
        // })
      })
      const result = await response.json();
      setFlagList(result.data)
      console.log("admin flag page review list", result);
    } catch (error) {

    }
  }
  
  const removeFlag = async (review,action) => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      console.error('No access token found. Please log in.')
      return
    }
    
    const res = await fetch(`/api/report?id=${review.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ action }),
    });

    const data = await res.json();
    console.log(data)
    
  }

  const ignoreFlag = async () => {
    
  }

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  
  const handleRemove = (id,action) => {
    const confirmRemove = window.confirm(`Are you sure you want to ${action.toLowerCase()} this review?`);
    if (confirmRemove) {
      console.log(`Removed review ID: ${id}`);
      removeFlag(id,action)
    }
  };

  const handleIgnore = (id) => {
    const confirmIgnore = window.confirm("Ignore this flag?");
    if (confirmIgnore) {
      console.log(`Ignored flag for review ID: ${id}`);
    }
  };

  const totalPages = Math.ceil(flagList.length / itemsPerPage);
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
      <h2>Flagged Reviews ({flagList.length})</h2>
      <div className="flags-list">
        {flagList.length > 0 && flagList.map((review) => (
          <div className="flag-card" key={review.id}>
            <p><strong>User:</strong> {review.user.name }</p>
            {/* <p><strong>Book:</strong> {review.book}</p> */}
            <p><strong>Comment:</strong> {review.review.content}</p>
            <p><strong>Reason:</strong> {review.reason}</p>
            <div className="flag-actions">
              <button onClick={() => handleRemove(review,'REMOVE')} className="remove-btn">Remove Review</button>
              <button onClick={() => handleRemove(review,'IGNORE')} className="ignore-btn">Ignore</button>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">{renderPagination()}</div>
    </div>
  );
};

export default AdminFlags;
