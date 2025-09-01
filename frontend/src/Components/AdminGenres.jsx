import React, { useState } from 'react';
import '../styles/admin.css';

const AdminGenres = () => {
  const [genreList, setGenreList] = useState(["Fiction", "Mystery", "Horror", "Action", "Detective"]);
  const [newGenre, setNewGenre] = useState("");

  const removeGenre = (genre) => {
    setGenreList(genreList.filter(g => g !== genre));
  };

  const addGenre = () => {
    if (newGenre.trim() !== "" && !genreList.includes(newGenre)) {
      setGenreList([...genreList, newGenre]);
      setNewGenre("");
    }
  };

  return (
    <div className="manageGenres">
      <div className="currentGenreList">
        <p className="title">Current Genres</p>
        <div className="list">
          {genreList.map((str, idx) => (
            <div className="genreItem" key={idx}>
              <p>{str}</p>
              <span onClick={() => removeGenre(str)}>❌</span>
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
