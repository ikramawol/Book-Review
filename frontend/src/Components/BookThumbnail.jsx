import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react'

const BookThumbnail = ({book , stopOnclick, goToAmazon}) => {
    const navigate = useNavigate();

    console.log("😊",book)
    let rating  = book.averageRating || book.rating
    // let sum = 0
    // if(book.reviews){
    //     book.reviews.forEach((review,indx) => {
    //         sum += review.rating
    //     });
    //     rating = sum / book.reviews.length

    // }

    const gotoBook =  () => {
        // alert('s')
        if(!stopOnclick){
            navigate('/viewBook', { state: { book } });
        }else{
            goToAmazon(book.title);
        }
    }

    function stars(n) {
        return '★★★★★'.slice(0, n) + '✰✰✰✰✰'.slice(n, 5);
    }

    return (
    <div className='bookThumbnail' onClick={gotoBook}>
        {/* 18 x 24 , 24 x 36 */}
        <img src={book.image} alt={book.name} />
        <p className='thumbnailName'>{book.title}</p>
        <p className='thumbnailAuthor'>by  {book.author}</p>
        <p>{stars(rating)}</p>
    </div>
  )
}

export default BookThumbnail