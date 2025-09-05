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
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No access token found. Please log in.");
      return;
    }
    
    try {
      const res = await fetch(`/api/category/${genreId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      
      if (res.ok) {
        // Refresh the genre list
        getGenres();
      } else {
        const errorData = await res.json();
        console.error("Failed to delete genre:", errorData);
      }
    } catch (error) {
      console.error("Error deleting genre:", error);
    }
  };

  const addGenre = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No access token found. Please log in.");
      return;
    }
    
    if (!newGenre.trim()) {
      console.error("Genre name is required");
      return;
    }
    
    try {
      const res = await fetch(`/api/category`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newGenre.trim() })
      });
      const data = await res.json();
      if (res.ok) {
        setNewGenre("");
        getGenres(); // Refresh the genre list
      } else {
        alert(data.error || "Failed to add genre");
      }
    } catch (error) {
      alert("Failed to add genre");
    }
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
