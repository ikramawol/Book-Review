import React, { useState } from 'react'
import '../App.css'
import '../styles/books.css'
import Navbar from './Navbar'
import Searchbar from './searchbar'
import BookThumbnail from './BookThumbnail'
import Footer from './Footer'

const BooksPage = () => {

  let latest = [
    {
      name: "Just for the summer",
      author: " Abby Jimenez",
      rating: 4,
      poster: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1742475239i/195820807.jpg"
    },
    {
      name: "Atomic Habits",
      author: " James Clear",
      rating: 5,
      poster: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655988385i/40121378.jpg"
    },
    {
      name: "ONYX Storm",
      author: "Rebecca Yarros",
      rating: 3,
      poster: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1720446357i/209439446.jpg"
    },
    {
      name: "A Court of Thorns and Roses",
      author: "Sarah J. Maas",
      rating: 5,
      poster: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1620324329i/50659467.jpg"
    },
    {
      name: "A Court of Thorns and Roses",
      author: "Sarah J. Maas",
      rating: 5,
      poster: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1620324329i/50659467.jpg"
    },
    {
      name: "A Court of Thorns and Roses",
      author: "Sarah J. Maas",
      rating: 5,
      poster: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1620324329i/50659467.jpg"
    },
    {
      name: "A Court of Thorns and Roses",
      author: "Sarah J. Maas",
      rating: 5,
      poster: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1620324329i/50659467.jpg"
    },
    {
      name: "A Court of Thorns and Roses",
      author: "Sarah J. Maas",
      rating: 5,
      poster: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1620324329i/50659467.jpg"
    },
  ]

  const [filter, setFilter] = useState({
    sortby: "date",
    genre: "romance",
    rating: [1, 5],
    year: [1950, 2015]
  })

  // Handle select changes for sortby and genre
  const handleSelectChange = (field, value) => {
    setFilter((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle rating change (array)
  const handleRatingChange = (index, value) => {
    setFilter((prev) => {
      const newRating = [...prev.rating];
      newRating[index] = Number(value);
      return { ...prev, rating: newRating };
    });
  };

  // Handle year change (array)
  const handleYearChange = (index, value) => {
    setFilter((prev) => {
      const newYear = [...prev.year];
      newYear[index] = Number(value);
      return { ...prev, year: newYear };
    });
  };

  const requsetFilteredBooks = () => {
    console.log((filter))
  }

  return (
    <div className='bookspage'>
      <Navbar />

      <div className="navgap"></div>

      <Searchbar />

      <div className="booksGrid">

        <div className="filters">

          {/* Sort By */}
          <div className="sortby">
            <p>Sort by</p>
            <select
              name="sort"
              id="sortBy"
              value={filter.sortby}
              onChange={(e) => handleSelectChange("sortby", e.target.value)}
            >
              <option value="date">Date</option>
              <option value="alpha">A-Z</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          {/* Genre */}
          <div className="filterGenre">
            <p>Genre</p>
            <select
              name="sortgenre"
              id="filterGenre"
              value={filter.genre}
              onChange={(e) => handleSelectChange("genre", e.target.value)}
            >
              <option value="romance">Romance</option>
              <option value="mystery">Mystery</option>
              <option value="horror">Horror</option>
            </select>
          </div>

          {/* Rating */}
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

          {/* Year */}
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

          <button className='filterBtn' onClick={requsetFilteredBooks}>Filter</button>

        </div>
        <div className="booksList">
          {latest.map((book) => (
            <BookThumbnail book={book} />
          ))}
        </div>
      </div>

      <Footer />

    </div>
  )
}

export default BooksPage