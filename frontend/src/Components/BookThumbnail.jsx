import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react'

const BookThumbnail = ({book , stopOnclick, goToAmazon}) => {
    const navigate = useNavigate();

    let rating  = book.averageRating || book.rating

    // console.log(book)

    const gotoBook =  () => {
        // alert('s')
        if(!stopOnclick){
            navigate('/viewBook', { state: { book } });
        }else{
            if(book.name)
                goToAmazon(book.name);
            else
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
        <p className='thumbnailName'>{book.name || book.title}</p>
        <p className='thumbnailAuthor'>by  {book.author}</p>
        <p>{stars(rating)}</p>
    </div>
  )
}

export default BookThumbnail