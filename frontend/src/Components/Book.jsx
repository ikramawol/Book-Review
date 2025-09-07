import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react'
import '../styles/book.css'
import Navbar from './Navbar';
import BookThumbnail from './BookThumbnail';
import Comment from './Comment'
import { API_BASE_URL } from '../config';

const Book = () => {


    const [reviews,setReviews] = useState([])
    const [message,setMessage] = useState("")
    const [myrating,setMyrating] = useState(1)

    const starsList = useRef(null)

    const navigate = useNavigate()

    const location = useLocation();
    const { book } = location.state || {}; // Handle case if no state passed

    // console.log(book)

    if (!book) {
        return <p>No book data found.</p>; // Fallback
    }

    let onStar = "★", offStar = "✰"

    // let bookReviews = ["lorem", "asdf", "qwer", "zxcv"]

    // FIX THIS LATER
    // get list of reviews from backend
    // make the review submit work
    // make the review flag work
    // add a confirmation for the review flag

    useEffect(() => {
        getReivews()
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

    const goToAmazon = (title) => {
        let urltitle = encodeURIComponent(title)
        let url = `https://www.amazon.com/s?k=${urltitle}&i=stripbooks`
        window.open(url,'_blank','noopener=yes,noreferrer=yes')
    }

    const getReivews = async () => {
        try {
            const reviewR = await fetch(`${API_BASE_URL}/api/review?bookId=${book.id}`)
            const data = await reviewR.json()
            console.log(data)
            if (data.success) {
                console.log(data.data)
                setReviews(data.data)
            }
        } catch (error) {
            console.error('Failed to fetch reviews:', error)
        }
    }


    const sendReview = async () => {
        try {
            const token = localStorage.getItem('accessToken')
            if (!token) {
                console.error('No access token found. Please log in.')
                navigate('/login')
                return
            }

            const reviewR = await fetch(`${API_BASE_URL}/api/review?bookId=${book.id}`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    content: message,
                    rating: myrating
                })
            })
            
            if (!reviewR.ok) {
                const errorData = await reviewR.json()
                console.error('Review submission failed:', errorData)
                return
            }
            
            const data = await reviewR.json()
            console.log('Review submitted successfully:', data)
            
            // Clear the form and refresh reviews
            setMessage("")
            setMyrating(1)
            getReivews() // Refresh the reviews list
            
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='BookWrapper'>
            <Navbar />
            <div className="navgap"></div>
            <div className="navgap"></div>

            <div className="BookReviewDisplay">

                <div className="top-section">
                    <BookThumbnail book={book} stopOnclick={true} goToAmazon={goToAmazon}/>
                    <div className="description">
                        {book.description || "description not found"}
                    </div>
                </div>

                <div className="leaveComment">
                    <p>Leave a Review</p>
                    <div className="commentInput">
                        <div className="starsRating" ref={starsList}>
                            <p onClick={()=>{setMyrating(1)}}>✰</p>
                            <p onClick={()=>{setMyrating(2)}}>✰</p>
                            <p onClick={()=>{setMyrating(3)}}>✰</p>
                            <p onClick={()=>{setMyrating(4)}}>✰</p>
                            <p onClick={()=>{setMyrating(5)}}>✰</p>
                        </div>
                        <textarea onChange={(e)=>{setMessage(e.target.value)}} value={message}></textarea>
                        <button onClick={sendReview}>submit</button>
                    </div>
                </div>

                <div className="comments">
                    {reviews.map((s,idx) => (
                        <Comment key={idx} review={s} />
                    ))}
                </div>
            </div>

        </div>
    )
}

export default Book