import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Searchbar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('Book');
  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate()

  const fetchSuggestions = async () => {
    if (query.length < 3) {
      setSuggestions([{
        name: 'searching ...'
      }]);
      return;
    }
    try {
      const res = await fetch(`/api/book/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSuggestions(data.data.slice(0, 5));
      let shortResult = []
      console.log(data)
    } catch (err) {
      console.log(err)
      setSuggestions([{title: "hell",name: "there"}]);
    }
  };

  const handleKeyDown = (e) => {
    fetchSuggestions();
    if (e.key === 'Enter') {
      // onSearch(query);
    }
  };
  const gotobook = (book) => {
    // console.log(book)
    navigate('/viewBook', { state: { book } });
  }

  return (
    <section className="lookup">
      <h3>Look up</h3>
      <div className="searchBar">
        <select
          name="searchType"
          id="searchType"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="Book">Book</option>
          <option value="Author">Author</option>
        </select>
        <input
          type="text"
          placeholder="name, author, or description"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="shearchicon"></div>
      </div>

      {query && suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((item,ind,arr) => (
            <li key={item.id} onClick={()=> gotobook(item)}>
              <p>{item.title || item.name}</p>
              {
                arr.length === 1 
                ? <p></p>
                : <p>- by {item.author}</p>
              }
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Searchbar;
