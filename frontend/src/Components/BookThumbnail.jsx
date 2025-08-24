import React from 'react'

const BookThumbnail = ({book}) => {
    function stars(n) {
        return '★★★★★'.slice(0, n) + '✰✰✰✰✰'.slice(n, 5);
    }

    return (
    <div className='bookThumbnail'>
        {/* 18 x 24 , 24 x 36 */}
        <img src={book.poster} alt={book.name} />
        <p>{book.name}</p>
        <p>by  {book.author}</p>
        <p>{stars(book.rating)}</p>
    </div>
  )
}

export default BookThumbnail