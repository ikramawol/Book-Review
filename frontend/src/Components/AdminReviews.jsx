import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminReviews = ({pageswitch}) => {
  const navigate = useNavigate();
  const itemsPerPage = 15; // Variable for how many books per page

  const [books, setBooks] = useState([]); // All books
  const [filteredBooks, setFilteredBooks] = useState([]); // Filtered books for search
  const [currentPage, setCurrentPage] = useState(1);
  const [searchType, setSearchType] = useState('Book');
  const [query, setQuery] = useState('');

  // Fetch books (Mock for now, replace with API)
  useEffect(() => {
    const fetchBooks = async () => {
      const mockBooks = Array.from({ length: 120 }, (_, i) => ({
        id: i + 1,
        title: `Book Title ${i + 1}`,
        author: `Author ${i + 1}`,
        rating: (Math.random() * 2 + 3).toFixed(1),
        reviews: Math.floor(Math.random() * 200),
      }));
      setBooks(mockBooks);
      setFilteredBooks(mockBooks);
    };
    fetchBooks();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === '') {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter((book) =>
        searchType === 'Book'
          ? book.title.toLowerCase().includes(value.toLowerCase())
          : book.author.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredBooks(filtered);
      setCurrentPage(1);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBooks = filteredBooks.slice(startIndex, startIndex + itemsPerPage);

  const handleRowClick = (id) => {
    navigate(`/admin/reviews/${id}`);
  };

  // Render pagination with ellipsis
  const renderPagination = () => {
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
              style={{ cursor: 'pointer' }}
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
              <tr key={book.id} onClick={() => handleRowClick(book.id)}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.rating}</td>
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
