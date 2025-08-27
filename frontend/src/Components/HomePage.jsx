import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React, { useEffect, useRef } from 'react'
import Navbar from './Navbar';
import '../styles/home.css'
import '../styles/searchbar.css'
import BookThumbnail from './BookThumbnail';
import GenreThumbnail from './GenreThumbnail';
import Footer from './Footer';
import Searchbar from './searchbar';

const HomePage = () => {

  const scrollRef = useRef(null);
const scrollRef2 = useRef(null);

useEffect(() => {
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

  const applyListeners = () => {
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
      name : "Just for the summer",
      author : " Abby Jimenez",
      rating: 4,
      poster : "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1742475239i/195820807.jpg"
    },
    {
      name : "Atomic Habits",
      author : " James Clear",
      rating: 5,
      poster : "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655988385i/40121378.jpg"
    },
    {
      name : "ONYX Storm",
      author : "Rebecca Yarros",
      rating: 3,
      poster : "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1720446357i/209439446.jpg"
    },
    {
      name : "A Court of Thorns and Roses",
      author : "Sarah J. Maas",
      rating: 5,
      poster : "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1620324329i/50659467.jpg"
    },
    {
      name : "A Court of Thorns and Roses",
      author : "Sarah J. Maas",
      rating: 5,
      poster : "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1620324329i/50659467.jpg"
    },
    {
      name : "A Court of Thorns and Roses",
      author : "Sarah J. Maas",
      rating: 5,
      poster : "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1620324329i/50659467.jpg"
    },
    {
      name : "A Court of Thorns and Roses",
      author : "Sarah J. Maas",
      rating: 5,
      poster : "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1620324329i/50659467.jpg"
    },
    {
      name : "A Court of Thorns and Roses",
      author : "Sarah J. Maas",
      rating: 5,
      poster : "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1620324329i/50659467.jpg"
    },
  ]

  let genre = [
    {
      name: "fiction",
      posters: [
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1742475239i/195820807.jpg",
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655988385i/40121378.jpg",
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1720446357i/209439446.jpg",
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1620324329i/50659467.jpg",
      ]
    },
    {
      name: "fiction",
      posters: [
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1742475239i/195820807.jpg",
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655988385i/40121378.jpg",
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1720446357i/209439446.jpg",
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1620324329i/50659467.jpg",
      ]
    },
    {
      name: "fiction",
      posters: [
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1742475239i/195820807.jpg",
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655988385i/40121378.jpg",
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1720446357i/209439446.jpg",
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1620324329i/50659467.jpg",
      ]
    },
    {
      name: "fiction",
      posters: [
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1742475239i/195820807.jpg",
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655988385i/40121378.jpg",
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1720446357i/209439446.jpg",
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1620324329i/50659467.jpg",
      ]
    },
    {
      name: "fiction",
      posters: [
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1742475239i/195820807.jpg",
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655988385i/40121378.jpg",
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1720446357i/209439446.jpg",
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1620324329i/50659467.jpg",
      ]
    },
    {
      name: "fiction",
      posters: [
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1742475239i/195820807.jpg",
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655988385i/40121378.jpg",
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1720446357i/209439446.jpg",
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1620324329i/50659467.jpg",
      ]
    },
    {
      name: "fiction",
      posters: [
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1742475239i/195820807.jpg",
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655988385i/40121378.jpg",
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1720446357i/209439446.jpg",
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1620324329i/50659467.jpg",
      ]
    },
  ]

  return (
    <div>
      <Navbar/>

      <section className="heroSection">
        <div className="hwrap">
          <h1>Your Next Favorite Book Awaits</h1>
          <p>Discover honest reviews, share your thoughts, and join a community of book lovers.</p>
        </div>
        <div className="filter"></div>
      </section>


      <Searchbar/>
      
      <section className="latest">
        <div className="sectionTitle">
          <h3>Latest</h3>
           <Link to="/books" ><p className='more'>more</p> </Link>
        </div>
        <div className="display" ref={scrollRef}>
          {latest.map((book)=>(
            <BookThumbnail book={book}/>
          ))}
        </div>
        <div></div>
      </section>
      
      
      <section className="Genre">
        <div className="sectionTitle">
          <h3>Genre</h3>
           <Link to="/books" ><p className='more'>more</p> </Link>
        </div>
        <div className="display" ref={scrollRef2}>
          {genre.map((gen)=>(
            
            <GenreThumbnail genre={gen}/>
          ))}
        </div>
        <div></div>
      </section>

      <Footer/>

    </div>
  )
}

export default HomePage