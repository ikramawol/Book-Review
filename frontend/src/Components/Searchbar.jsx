import React, { useState } from 'react';

const Searchbar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('Book');
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = async () => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`/api/book/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSuggestions(data.results.slice(0, 5));
    } catch (err) {
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchSuggestions();
      onSearch(query);
    }
  };

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
          {suggestions.map((item) => (
            <li key={item.id}>
              <a href={`/books/${item.id}`}>{item.title || item.name}</a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Searchbar;
