import React from 'react'
import { useNavigate } from 'react-router-dom';

const GenreThumbnail = ({genre}) => {

    const navigate = useNavigate();
    const gotoBooks =  () => {
        navigate('/Books', { genreSelected: { genre } });
    }

    return (
    <div className='genreThumbnail' onClick={gotoBooks}>
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