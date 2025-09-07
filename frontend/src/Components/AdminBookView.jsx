import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react'
import '../styles/book.css'
import Navbar from './Navbar';
import BookThumbnail from './BookThumbnail';
import Comment from './Comment'
import { API_BASE_URL } from '../config';

const AdminBookView = () => {

  // FIX THIS LATER
  // fix the ui
  // handle the suspend user and remove comment functions
  const [reviews, setReviews] = useState([])

  const starsList = useRef(null)

  const navigate = useNavigate();

  const location = useLocation();
  const { book } = location.state || {
    name: "Just for the summer",
    author: " Abby Jimenez",
    rating: 4,
    poster: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1742475239i/195820807.jpg"
  }; // Handle case if no state passed

  if (!book) {
    return <p>No book data found.</p>; // Fallback
  } else {
    // console.log(book)
  }



  let onStar = "★", offStar = "✰"

  let bookReviews = ["lorem", "asdf", "qwer", "zxcv"]

  useEffect(() => {

    getReivews()

    // const handleClick = (e) => {
    //   const children = Array.from(starsList.current.children)
    //   const index = children.indexOf(e.target)
    //   console.log("s", index)
    //   if (index != -1)
    //     for (let i = 0; i < starsList.current.children.length; i++) {
    //       const element = starsList.current.children[i];
    //       if (i <= index) {
    //         element.innerText = onStar
    //       } else {
    //         element.innerText = offStar
    //       }
    //     }
    // };

    // const element = starsList.current;
    // if (element) {
    //   element.addEventListener("click", handleClick);
    // }

    // // Cleanup to avoid memory leaks
    // return () => {
    //   if (element) {
    //     element.removeEventListener("click", handleClick);
    //   }
    // };
  }, []);

  const getReivews = async () => {
    try {
      const reviewR = await fetch(`${API_BASE_URL}/api/review?bookId=${book.id}`)
      const data = await reviewR.json()

      if (data.success) {
        console.log(data.data)
        setReviews(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    }
  }

  const suspendUser = async (user) => {

  }

  const removeComment = async (review) => {
    try {
      console.log(review)
      const token = localStorage.getItem('accessToken')
      if (!token) {
        console.error('No access token found. Please log in.')
        return
      }

      const reviewR = await fetch(`${API_BASE_URL}/api/review/${review.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (!reviewR.ok) {
        const errorData = await reviewR.json()
        console.error('Review submission failed:', errorData)
        return
      }

    } catch (error) {
      console.log(error)
    }
  }


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
          {reviews.length > 0 && reviews.map((s, i) => (
            <div className='commentWrapper' key={"adminComment" + i}>
              <div className="avatar">
                <img src="/pfp.png" alt="" srcSet="" />
                <p>{stars(s.rating || s.averageRating)}</p>
                <p>{s.user.name}</p>

              </div>
              <div className="commentWrap">
                <p>{s.content}</p>
                <i>🚩 </i>
                <div className="adminReviewControls">
                  {/* <p onClick={() => suspendUser(s.user)}>Suspend user!</p> */}
                  <p onClick={() => removeComment(s)}>remove</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default AdminBookView