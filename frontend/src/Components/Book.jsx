import { useLocation } from 'react-router-dom';
import React, { useEffect, useRef } from 'react'
import '../styles/book.css'
import Navbar from './Navbar';
import BookThumbnail from './BookThumbnail';
import Comment from './Comment'

const Book = () => {

    const starsList = useRef(null)

    const location = useLocation();
    const { book } = location.state || {}; // Handle case if no state passed

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

    return (
        <div className='BookWrapper'>
            <Navbar />
            <div className="navgap"></div>
            <div className="navgap"></div>

            <div className="BookReviewDisplay">

                <div className="top-section">
                    <BookThumbnail book={book} stopOnclick={true} />
                    <div className="description">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo corrupti iure accusamus dolore excepturi dolorum, quibusdam molestiae sunt, omnis fugiat ex delectus tempora unde quasi soluta? Dignissimos autem possimus ullam.
                    </div>
                </div>

                <div className="leaveComment">
                    <p>Leave a Review</p>
                    <div className="commentInput">
                        <div className="starsRating" ref={starsList}>
                            <p>✰</p>
                            <p>✰</p>
                            <p>✰</p>
                            <p>✰</p>
                            <p>✰</p>
                        </div>
                        <textarea></textarea>
                        <button>submit</button>
                    </div>
                </div>

                <div className="comments">
                    {bookReviews.map((s) => (
                        <Comment key={s.id} review={s} />
                    ))}
                </div>
            </div>

        </div>
    )
}

export default Book