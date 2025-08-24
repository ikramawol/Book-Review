import React from 'react'

const GenreThumbnail = ({genre}) => {

    return (
    <div className='genreThumbnail'>
        {/* 18 x 24 , 24 x 36 */}
        <div className="imgGrid">
            {genre.posters.map((img)=>(
                <img src={img} />
            ))}
        </div>
        <p className='genreName'>{genre.name}</p>
    </div>
  )
}

export default GenreThumbnail