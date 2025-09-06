import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react'
import Navbar from './Navbar';
import '../styles/home.css'
import '../styles/searchbar.css'
import BookThumbnail from './BookThumbnail';
import GenreThumbnail from './GenreThumbnail';
import Footer from './Footer';
import Searchbar from './Searchbar';

const HomePage = () => {

  const scrollRef = useRef(null);
  const scrollRef2 = useRef(null);

  let applyListeners

  useEffect(() => {
    getBooks();
    getGenres();
    const addScrollListener = (element) => {
      if (!element) return;

      const handleWheel = (e) => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        element.scrollBy({
          left: e.deltaY,
          behavior: "smooth",
        });
      };

      element.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        element.removeEventListener("wheel", handleWheel);
      };
    };

    let cleanup1, cleanup2;

    applyListeners = () => {
      if (cleanup1) cleanup1();
      if (cleanup2) cleanup2();

      if (scrollRef.current && scrollRef.current.scrollWidth > scrollRef.current.clientWidth) {
        cleanup1 = addScrollListener(scrollRef.current);
      }
      if (scrollRef2.current && scrollRef2.current.scrollWidth > scrollRef2.current.clientWidth) {
        cleanup2 = addScrollListener(scrollRef2.current);
      }
    };

    applyListeners();

    window.addEventListener("resize", applyListeners);

    return () => {
      if (cleanup1) cleanup1();
      if (cleanup2) cleanup2();
      window.removeEventListener("resize", applyListeners);
    };
  }, []);



  let latest = [
    {
      title: "title",
      author: "author",
      rating: 1,
      image: "/samplePoster.png"
    },
    {
      title: "title",
      author: "author",
      rating: 1,
      image: "/samplePoster.png"
    },
    {
      title: "title",
      author: "author",
      rating: 1,
      image: "/samplePoster.png"
    },
    {
      title: "title",
      author: "author",
      rating: 1,
      image: "/samplePoster.png"
    },
    {
      title: "title",
      author: "author",
      rating: 1,
      image: "/samplePoster.png"
    },
    {
      title: "title",
      author: "author",
      rating: 1,
      image: "/samplePoster.png"
    },
    {
      title: "title",
      author: "author",
      rating: 1,
      image: "/samplePoster.png"
    },
    {
      title: "title",
      author: "author",
      rating: 1,
      image: "/samplePoster.png"
    },

  ]

  const [books, setBooks] = useState([])
  const [genres, setGenres] = useState([])

  let genre = [
    {
      name: "fiction",
      posters: [
        "/samplePoster.png",
        "/samplePoster.png",
        "/samplePoster.png",
        "/samplePoster.png",
      ]
    },
    {
      name: "fiction",
      posters: [
        "/samplePoster.png",
        "/samplePoster.png",
        "/samplePoster.png",
        "/samplePoster.png",
      ]
    },
    {
      name: "fiction",
      posters: [
        "/samplePoster.png",
        "/samplePoster.png",
        "/samplePoster.png",
        "/samplePoster.png",
      ]
    },
    {
      name: "fiction",
      posters: [
        "/samplePoster.png",
        "/samplePoster.png",
        "/samplePoster.png",
        "/samplePoster.png",
      ]
    },
    {
      name: "fiction",
      posters: [
        "/samplePoster.png",
        "/samplePoster.png",
        "/samplePoster.png",
        "/samplePoster.png",
      ]
    },
    {
      name: "fiction",
      posters: [
        "/samplePoster.png",
        "/samplePoster.png",
        "/samplePoster.png",
        "/samplePoster.png",
      ]
    },
    {
      name: "fiction",
      posters: [
        "/samplePoster.png",
        "/samplePoster.png",
        "/samplePoster.png",
        "/samplePoster.png",
      ]
    },
  ]


  const getGenres = async () => {
    try {
      // const response = await fetch(`http://localhost:3000/api/book/categories`)
      const response = await fetch(`${API_BASE_URL}/api/book/categories?page=1&limit=8`);
      const data = await response.json();
      const categories = data.data.slice(0,8);

      // STEP 1: Set initial state with placeholders
      const structuredGenres = categories.map(category => ({
        name: category.name,
        // Provide an array of placeholders or a generic loading image URL
        posters: ["/samplePoster.png", "/samplePoster.png", "/samplePoster.png", "/samplePoster.png"]
      }));

      setGenres(structuredGenres); // This will update the UI with placeholders immediately

      // STEP 2: Fetch the actual posters and update the state
      const updatedGenres = await Promise.all(
        categories.map(async (category, index) => {
          const bookResponse = await fetch(`${API_BASE_URL}/api/book?category=${category.name}&page=1&limit=4`);
          const bookData = await bookResponse.json();
          const posters = bookData.data.map(book => book.image);
          // console.log(bookData)
          // Merge the new posters with the existing genre object
          return {
            ...structuredGenres[index],
            posters: posters.concat(
              // Fill the rest of the array with placeholders if not enough posters are returned
              new Array(4 - posters.length).fill("/samplePoster.png")
            )
          };
        })
      );

      setGenres(updatedGenres); // This will re-render the UI with the actual posters

    } catch (error) {

    }
  }

  const getBooks = async () => {
    try {
      // works but only one book here
      // const response = await fetch(`/api/book/trending?page=1&limit=8`)
      const response = await fetch(`${API_BASE_URL}/api/book?page=1&limit=8`)
      response.json().then(data => {
        console.log(data.data)
        setBooks(data.data)
      })

      const reviewR = await fetch(`${API_BASE_URL}/api/review?bookId=cmf5c0wnv0000f1d4rglqqbs7`)
      reviewR.json().then(data=>{
        console.log(data)
      })

      applyListeners()
    } catch (error) {

    }
  }


  // FIX THIS LATER
  // make the genre selection take to the books page filtered to the selected genre



  // const getLatestBooks = async () => {
  //   const response = await fetch(`/api/book`);
  //   const data = await response.json();
  //   setLatestBooks(data.data);
  // }
  // const getGenre = async () => {
  //   const response = await fetch(`/api/book/categories`);
  //   const data = await response.json();
  //   setGenre(data.data);
  // }

  // const [latestBooks, setLatestBooks] = useState([]);
  // const [genre, setGenre] = useState([]);
  // useEffect(() => {
  //   getLatestBooks();
  //   getGenre();
  // }, []);



  return (
    <div>
      <Navbar />

      <section className="heroSection">
        <div className="hwrap">
          <h1>Your Next Favorite Book Awaits</h1>
          <p>Discover honest reviews, share your thoughts, and join a community of book lovers.</p>
        </div>
        <div className="filter"></div>
      </section>


      <Searchbar />

      <section className="latest">
        <div className="sectionTitle">
          <h3>Latest</h3>
          <Link to="/books" ><p className='more'>more</p> </Link>
        </div>
        <div className="display" ref={scrollRef}>
          {
            books.length == 0 ?
              latest.map((book, idx) => (
                <BookThumbnail book={book} key={idx} />
              )) :
              books.map((book, idx) => (
                <BookThumbnail book={book} key={idx} />
              ))
          }
        </div>
        <div></div>
      </section>


      <section className="Genre">
        <div className="sectionTitle">
          <h3>Genre</h3>
          <Link to="/books" ><p className='more'>more</p> </Link>
        </div>
        <div className="display" ref={scrollRef2}>
          {
            genres.length == 0
              ? genre.map((gen, idx) => (

                <GenreThumbnail genre={gen} key={idx} />
              ))
              : genres.map((gen, idx) => (

                <GenreThumbnail genre={gen} key={idx} />
              ))

          }
        </div>
        <div></div>
      </section>

      <Footer />

    </div>
  )
}

export default HomePage