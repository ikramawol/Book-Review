import React, { useState } from 'react';

const Searchbar = () => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('Book');

  // Example data (replace with API results later)
  const items = [
    'Pride and Prejudice',
    'The Great Gatsby',
    'To Kill a Mockingbird',
    'Moby Dick',
    'The Catcher in the Rye',
    'Great Expectations',
    'The Hobbit',
    'War and Peace'
  ];

  // Filtered list (show max 5)
  const filteredItems = items
    .filter((item) => item.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5);

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
          placeholder="name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="shearchicon"></div>
      </div>

      {/* Suggestions Dropdown */}
      {query && filteredItems.length > 0 && (
        <ul className="suggestions">
          {filteredItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Searchbar;
