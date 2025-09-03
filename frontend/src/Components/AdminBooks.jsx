import React, { useState, useEffect } from 'react';
import '../styles/admin.css';

const AdminBooks = ({ genres = ["horror", "romance"] }) => {


    // FIX THIS LATER
    // make the search button interactive
    // make the suggestion list show as "..." till it finds books
    // fix the ui for the suggestions


    const [onUpdate, setOnUpdate] = useState(false);
    const [form, setForm] = useState({
        id: null,
        title: '',
        author: '',
        genre: '',
        date: '',
        imageUrl: '',
        description: '',
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [genresList, setGenresList] = useState(genres);

    useEffect(() => {
        fetchGenres();
    }, []);

    const fetchGenres = async () => {
        try {
            const res = await fetch('/api/book/categories');
            const data = await res.json();
            if (data.success) {
                setGenresList(data.data.map(g => g.name));
            }
        } catch (error) {
            console.error('Failed to fetch genres:', error);
        }
    };

    const stars = (n) => {
        return '★★★★★'.slice(0, n) + '✰✰✰✰✰'.slice(n, 5);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery) {
            setSearchResults([]);
            return;
        }

        try {
            const res = await fetch(`/api/book/search?q=${searchQuery}`);
            const data = await res.json();
            if (data.success) {
                setSearchResults(data.data);
            }
        } catch (error) {
            console.error('Search failed:', error);
        }
    };

    const handleSelectBook = (book) => {
        setOnUpdate(true);
        setForm({
            id: book.id,
            title: book.title,
            author: book.author,
            genre: book.categories[0]?.name || '',
            date: book.publishedDate.split('T')[0],
            imageUrl: book.image,
            description: book.description,
        });
        setSearchResults([]); // Clear search results after selection
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const bookData = {
            title: form.title,
            author: form.author,
            description: form.description,
            image: form.imageUrl,
            publishedDate: form.date,
        };

        try {
            if (onUpdate) {
                // API call to update book
                const res = await fetch(`/api/book/update?id=${form.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bookData),
                });
                const data = await res.json();
                if (data.success) {
                    console.log('Book updated successfully!');
                    // Reset form
                    setForm({ id: null, title: '', author: '', genre: '', date: '', imageUrl: '', description: '' });
                }
            } else {
                // API call to add book
                const res = await fetch('/api/book/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bookData),
                });
                const data = await res.json();
                if (data.success) {
                    console.log('Book added successfully!');
                    // Reset form
                    setForm({ id: null, title: '', author: '', genre: '', date: '', imageUrl: '', description: '' });
                }
            }
        } catch (error) {
            console.error('Submission failed:', error);
        }
    };

    return (
        <div className="bookManage">
            <div className="bookoption">
                <button className={!onUpdate ? 'active' : ''} onClick={() => { setOnUpdate(false); setForm({ id: null, title: '', author: '', genre: '', date: '', imageUrl: '', description: '' }); }}>ADD</button>
                <button className={onUpdate ? 'active' : ''} onClick={() => { setOnUpdate(true); setForm({ id: null, title: '', author: '', genre: '', date: '', imageUrl: '', description: '' }); }}>UPDATE</button>
            </div>

            {onUpdate && (
                <div className="searchbar">
                    <input
                        type="text"
                        placeholder="Search by title, author, or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button onClick={handleSearch}>🔍</button>
                </div>
            )}

            {onUpdate && searchResults.length > 0 && (
                <div className="searchResults">
                    <h4>Search Results:</h4>
                    <ul className="searchList">
                        {searchResults.map((book) => (
                            <li key={book.id} onClick={() => handleSelectBook(book)}>
                                {book.title} by {book.author}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            <form className="bookForm" onSubmit={handleSubmit}>
                <div className="inputs">
                    <div className="inputrow">
                        <p>Book Title</p>
                        <input type="text" name="title" value={form.title} onChange={handleChange} required />
                    </div>
                    <div className="inputrow">
                        <p>Author</p>
                        <input type="text" name="author" value={form.author} onChange={handleChange} required />
                    </div>
                    <div className="inputrow">
                        <p>Genre</p>
                        <select name="genre" value={form.genre} onChange={handleChange} required>
                            <option value="">Select Genre</option>
                            {genresList.map((g, index) => (
                                <option key={index} value={g}>{g}</option>
                            ))}
                        </select>
                    </div>
                    <div className="inputrow">
                        <p>Date</p>
                        <input type="date" name="date" value={form.date} onChange={handleChange} required />
                    </div>
                    <div className="inputrow">
                        <p>Image URL</p>
                        <input type="text" name="imageUrl" value={form.imageUrl} onChange={handleChange} />
                    </div>
                    <div className="inputrow">
                        <p>Description</p>
                        <textarea name="description" value={form.description} onChange={handleChange}></textarea>
                    </div>

                    <button type="submit" className="submitBtn">
                        {onUpdate ? 'Update Book' : 'Add Book'}
                    </button>
                </div>

                <div className="preview">
                    <div className="bookThumbnail">
                        <img src={form.imageUrl || './pfp.png'} alt="Book" />
                        <p className="thumbnailName">{form.title || 'Book Title'}</p>
                        <p className="thumbnailAuthor">by {form.author || 'Author'}</p>
                        {/* Assuming a default or placeholder star rating */}
                        <p>✰✰✰✰✰</p>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AdminBooks;