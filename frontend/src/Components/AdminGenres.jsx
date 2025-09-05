import React, { useEffect, useState } from 'react';
import '../styles/admin.css';

const AdminGenres = () => {

  // FIX THIS LATER
  // clean up the ui a bit


  const [genreList, setGenreList] = useState([
    {name: "Fiction",id: 83}, 
    {name: "Mystery",id: 81}, 
    {name: "Horror",id: 84}, 
    {name: "Action",id: 85}, 
    {name: "Detective",id: 87}, 
  ]);
  const [newGenre, setNewGenre] = useState("");


  const getGenres = async  () => {
    try {
      // const response = await fetch(`http://localhost:3000/api/book/categories`)
      const response = await fetch(`/api/book/categories`)
      response.json().then(data=>{
        console.log(data.data)
        setGenreList(data.data)
      })
    } catch (error) {
      
    }
  }
  
  useEffect(() => {
    getGenres();
  }, []);

  const removeGenre = async (genreId) => {
    res = await fetch(`/api/book/catagory?${genreId}`, {
      method: 'DELETE',
      headers: {
          'Authorization': `Bearer ${token}`
      },
    });
  };

  const addGenre =  async () => {
    res = await fetch(`/api/book/catagory`, {
      method: 'POST',
      headers: {
          'Authorization': `Bearer ${token}`
      },
      body: {
        name: newGenre,
        id: genreList.length * 2
      }
    });
  };

  return (
    <div className="manageGenres">
      <div className="currentGenreList">
        <p className="title">Current Genres</p>
        <div className="list">
          {genreList.map((str, idx) => (
            <div className="genreItem" key={idx}>
              <p>{str.name}</p>
              <span onClick={() => removeGenre(str.id)}>❌</span>
            </div>
          ))}
        </div>
      </div>

      <div className="addGenre">
        <p className="title">Add Genres</p>
        <input
          type="text"
          placeholder="Enter genre"
          value={newGenre}
          onChange={(e) => setNewGenre(e.target.value)}
        />
        <button onClick={addGenre}>ADD</button>
      </div>
    </div>
  );
};

export default AdminGenres;
