import { useNavigate } from 'react-router-dom';
import React from 'react'

const BookThumbnail = ({book , stopOnclick}) => {
    const navigate = useNavigate();

    const gotoBook =  () => {
        // alert('s')
        if(!stopOnclick)
        navigate('/viewBook', { state: { book } });
    }

    function stars(n) {
        return '★★★★★'.slice(0, n) + '✰✰✰✰✰'.slice(n, 5);
    }

    return (
    <div className='bookThumbnail' onClick={gotoBook}>
        {/* 18 x 24 , 24 x 36 */}
        <img src={book.poster} alt={book.name} />
        <p className='thumbnailName'>{book.name}</p>
        <p className='thumbnailAuthor'>by  {book.author}</p>
        <p>{stars(book.rating)}</p>
    </div>
  )
}

export default BookThumbnail