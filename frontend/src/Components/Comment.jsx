import React from 'react'

const Comment = (review) => {
    
    function stars(n) {
        return '★★★★★'.slice(0, n) + '✰✰✰✰✰'.slice(n, 5);
    }

    return (
    <div className='commentWrapper'>
        <div className="avatar">
            <img src="./pfp.png" alt="" srcset="" />
            <p>{stars(3)}</p>
        </div>
        <div className="commentWrap">
            <p>{review.review}</p>
            <i>🚩</i>
        </div>
    </div>
  )
}

export default Comment