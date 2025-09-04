import React from 'react'

const Comment = ({review}) => {
    console.log("reviwe",review)
    function stars(n) {
        return '★★★★★'.slice(0, n) + '✰✰✰✰✰'.slice(n, 5);
    }

    return (
    <div className='commentWrapper'>
        <div className="avatar">
            <img src="./pfp.png" alt="" srcset="" />
            <p>{stars(review.rating)}</p>
        </div>
        <div className="commentWrap">
            <p>{review.content}</p>
            <i>🚩</i>
        </div>
    </div>
  )
}

export default Comment