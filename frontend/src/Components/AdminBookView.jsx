import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useRef } from 'react'
import '../styles/book.css'
import Navbar from './Navbar';
import BookThumbnail from './BookThumbnail';
import Comment from './Comment'

const AdminBookView = () => {

  // FIX THIS LATER
  // fix the ui
  // handle the suspend user and remove comment functions

  const starsList = useRef(null)

  const navigate = useNavigate();

  const location = useLocation();
  const book = location.state || {
    name: "Just for the summer",
    author: " Abby Jimenez",
    rating: 4,
    poster: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1742475239i/195820807.jpg"
  }; // Handle case if no state passed

  if (!book) {
    return <p>No book data found.</p>; // Fallback
  }

  let onStar = "★", offStar = "✰"

  let bookReviews = ["lorem", "asdf", "qwer", "zxcv"]

  useEffect(() => {
    const handleClick = (e) => {
      const children = Array.from(starsList.current.children)
      const index = children.indexOf(e.target)
      console.log("s", index)
      if (index != -1)
        for (let i = 0; i < starsList.current.children.length; i++) {
          const element = starsList.current.children[i];
          if (i <= index) {
            element.innerText = onStar
          } else {
            element.innerText = offStar
          }
        }
    };

    const element = starsList.current;
    if (element) {
      element.addEventListener("click", handleClick);
    }

    // Cleanup to avoid memory leaks
    return () => {
      if (element) {
        element.removeEventListener("click", handleClick);
      }
    };
  }, []);

  function stars(n) {
    return '★★★★★'.slice(0, n) + '✰✰✰✰✰'.slice(n, 5);
  }

  const returnPage = () => {
    navigate('/admin');
  }

  return (
    <div className='BookWrapper'>
      <div className="navgap"></div>


      
      <div className="BookReviewDisplay">
      <button className='returnBtn' onClick={returnPage}>back</button>
      {/* <div className="navgap"></div> */}

        <div className="top-section">
          <BookThumbnail book={book} stopOnclick={true} />
          <div className="description">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo corrupti iure accusamus dolore excepturi dolorum, quibusdam molestiae sunt, omnis fugiat ex delectus tempora unde quasi soluta? Dignissimos autem possimus ullam.
          </div>
        </div>

      <div className="navgap"></div>
        

        <div className="comments">
          {bookReviews.map((s, i) => (
            <div className='commentWrapper' key={"adminComment" + i}>
              <div className="avatar">
                <img src="./pfp.png" alt="" srcSet="" />
                <p>{stars(3)}</p>
                <p>Suspend</p>
              </div>
              <div className="commentWrap">
                <p>{s}</p>
                <i>🚩 </i>
                <p>remvoe</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default AdminBookView