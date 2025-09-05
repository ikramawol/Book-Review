import React, { useEffect, useState } from 'react';
import '../App.css';
import '../styles/books.css';
import Navbar from './Navbar';
import Searchbar from './Searchbar';
import BookThumbnail from './BookThumbnail';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';

const BooksPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [booksList, setBooksList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const location = useLocation();
  const { genreSelected } = location.genreSelected || {};
  console.log("genre selected empity if nothing is selected",genreSelected)


  const [filter, setFilter] = useState({
    sortby: 'date',
    genre: genreSelected || '',
    rating: [1, 5],
    year: [1900, 2025],
    search: '', // <-- add this
  });

  const itemsPerPage = 12;


  // Fetch books from API based on current page and filters
  // FIX THIS LATER 
  // figure out how the query parameters are bing used its not working rn
    // make the search by name or author work
  // add a filter button so its not calling on every input change
  const getListPageOfBooks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        sortby: filter.sortby,
        category: filter.genre,
        minRating: filter.rating[0],
        maxRating: filter.rating[1],
        publishedFrom: `${filter.year[0]}-01-01`, // <-- change here
        publishedTo: `${filter.year[1]}-12-31`,   // <-- change here
        search: filter.search,

      });
      console.log("query paraameters",params)

      const response = await fetch(`/api/book?${params}`);
      const result = await response.json();

      if (result.success) {
        console.log( "fetch results for books with params",result)
        setBooksList(result.data);
        setTotalPages(result.pagination.totalPages);
      } else {
        console.log("problem")
        setBooksList([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getListPageOfBooks();
  }, [currentPage, filter]);

  useEffect(() => {
    // Fetch categories from backend
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/category');
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories); // Adjust if your response shape is different
        }
      } catch (err) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const handleSelectChange = (field, value) => {
    setFilter((prev) => ({
      ...prev,
      [field]: value,
    }));
    setCurrentPage(1); // reset to first page when filter changes
  };

  const handleRatingChange = (index, value) => {
    setFilter((prev) => {
      const newRating = [...prev.rating];
      newRating[index] = Number(value);
      return { ...prev, rating: newRating };
    });
    setCurrentPage(1);
  };

  const handleYearChange = (index, value) => {
    setFilter((prev) => {
      const newYear = [...prev.year];
      newYear[index] = Number(value);
      return { ...prev, year: newYear };
    });
    setCurrentPage(1);
  };

  const handleSearch = (query) => {
    setFilter(prev => ({ ...prev, search: query }));
    setCurrentPage(1);
  };

  const renderPagination = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
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
    <div className="bookspage">
      <Navbar />
      <div className="navgap"></div>
      <Searchbar onSearch={handleSearch} />

      <div className="booksGrid">
        {/* Filters */}
        <div className="filters">
          <div className="sortby">
            <p>Sort by</p>
            <select
              value={filter.sortby}
              onChange={(e) => handleSelectChange('sortby', e.target.value)}
            >
              <option value="date">Date</option>
              <option value="alpha">A-Z</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          <div className="filterGenre">
            <p>Genre</p>
            <select
              value={filter.genre}
              onChange={(e) => handleSelectChange('genre', e.target.value)}
            >
              <option value="">All</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filterRating">
            <p>Rating</p>
            <div className="inputFlex">
              <input
                type="number"
                min={1}
                max={5}
                value={filter.rating[0]}
                onChange={(e) => handleRatingChange(0, e.target.value)}
              />
              <p>~</p>
              <input
                type="number"
                min={1}
                max={5}
                value={filter.rating[1]}
                onChange={(e) => handleRatingChange(1, e.target.value)}
              />
            </div>
          </div>

          <div className="filterYear">
            <p>Year</p>
            <div className="inputFlex">
              <input
                type="number"
                value={filter.year[0]}
                onChange={(e) => handleYearChange(0, e.target.value)}
              />
              <p>~</p>
              <input
                type="number"
                value={filter.year[1]}
                onChange={(e) => handleYearChange(1, e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Books List */}
        <div className="booksList">
          {loading ? (
            <p>Loading...</p>
          ) : booksList.length > 0 ? (
            booksList.map((book) => (
              <BookThumbnail
                key={book.id}
                book={{
                  id: book.id,
                  name: book.title,
                  author: book.author,
                  image: book.image,
                  description: book.description,
                  rating: book.averageRating
                }}
              />
            ))
          ) : (
            <p>No books available</p>
          )}
        </div>

        <div className="lazyGap"></div>

        <div className="pagination">{renderPagination()}</div>
      </div>

      <Footer />
    </div>
  );
};

export default BooksPage;


