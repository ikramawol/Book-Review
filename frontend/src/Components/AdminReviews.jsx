import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';


const AdminReviews = ({ pageswitch }) => {
  const navigate = useNavigate();
  const itemsPerPage = 5; // books per page

  const [books, setBooks] = useState([]); // raw data
  const [filteredBooks, setFilteredBooks] = useState([]); // filtered/search results
  const [currentPage, setCurrentPage] = useState(1);
  const [searchType, setSearchType] = useState('Book');
  const [query, setQuery] = useState('');

  useEffect(() => {
    getBooks();
  }, []);

  const getBooks = async (query) => {
    try {
      let uri;
      if (query) {
        let encodedQuery = encodeURIComponent(query);
        uri = `${API_BASE_URL}/api/book/search?q=${encodedQuery}`;
      } else {
        uri = `${API_BASE_URL}/api/book`;
      }

      const response = await fetch(uri);
      const result = await response.json();
      console.log("admin review page books list", result);

      if (result.data) {
        setBooks(result.data);
        setFilteredBooks(result.data); // keep filtered in sync
      }
    } catch (error) {
      console.error("Failed to fetch books", error);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      console.log("search 🔍");
      getBooks(value); // fetch filtered data from backend
      setCurrentPage(1);
    } else if (value.length === 0) {
      getBooks(); // reset when input is cleared
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBooks = filteredBooks.slice(startIndex, startIndex + itemsPerPage);

  const handleRowClick = (book) => {
    navigate(`${API_BASE_URL}/admin/reviews`, { state: { book } });
  };

  // Render pagination with ellipsis
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

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
          page === '...' ? (
            <span key={index}>...</span>
          ) : (
            <span
              key={index}
              className={currentPage === page ? 'active-page' : ''}
              onClick={() => setCurrentPage(page)}
              style={{ cursor: 'pointer', margin: '0 4px' }}
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

  return (
    <section className="admin-reviews">
      {/* Search bar */}
      <div className="searchBar">
        <select
          name="searchType"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="Book">Book</option>
          <option value="Author">Author</option>
        </select>
        <input
          type="text"
          placeholder={`Search by ${searchType}`}
          value={query}
          onChange={handleSearch}
        />
      </div>

      {/* Table */}
      <table className="reviews-table">
        <thead>
          <tr>
            <th>book title</th>
            <th>author</th>
            <th>rating</th>
            <th>reviews</th>
          </tr>
        </thead>
        <tbody>
          {currentBooks.length > 0 ? (
            currentBooks.map((book) => (
              <tr key={book.id} onClick={() => handleRowClick(book)}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.averageRating}</td>
                <td>{book.reviews}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>
                No books found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">{renderPagination()}</div>
    </section>
  );
};

export default AdminReviews;
