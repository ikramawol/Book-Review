import React, { useState, useEffect, useRef } from 'react';
import '../styles/admin.css';
import { API_BASE_URL } from '../config';

const AdminBooks = ({ genres = ["horror", "romance"] }) => {

    const [onUpdate, setOnUpdate] = useState(false);
    const [form, setForm] = useState({
        id: null,
        title: '',
        author: '',
        genres: [], // Changed from single genre to array of genres
        date: '',
        image: null, // Changed from imageUrl to image, initialized to null
        description: '',
    });
    const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [genresList, setGenresList] = useState(genres);
    const genreDropdownRef = useRef(null);

    useEffect(() => {
        fetchGenres();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (genreDropdownRef.current && !genreDropdownRef.current.contains(event.target)) {
                setIsGenreDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const fetchGenres = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/book/categories`);
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

    const handleFileChange = (e) => {
        setForm({ ...form, image: e.target.files[0] });
    };

    const handleGenreToggle = (genre) => {
        setForm(prev => ({
            ...prev,
            genres: prev.genres.includes(genre)
                ? prev.genres.filter(g => g !== genre)
                : [...prev.genres, genre]
        }));
    };

    const getSelectedGenresText = () => {
        if (form.genres.length === 0) return 'Select Genres';
        if (form.genres.length === 1) return form.genres[0];
        if (form.genres.length <= 3) return form.genres.join(', ');
        return `${form.genres.length} genres selected`;
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery) {
            setSearchResults([]);
            return;
        }

        try {
            
            let encodedQuery = encodeURIComponent(searchQuery)
            let uri = `${API_BASE_URL}/api/book/search?q=${encodedQuery}`
            console.log(uri)
            const res = await fetch(uri);
            const data = await res.json();
            if (data.success) {
                console.log("🗑️",data)
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
            genres: book.categories?.map(cat => cat.name) || [], // Map all categories to genres array
            date: book.publishedDate ? book.publishedDate.split('T')[0] : '',
            image: book.image, // The selected book will have a URL here, not a File object
            description: book.description,
        });
        setSearchResults([]); // Clear search results after selection
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Use FormData to handle the file upload
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('author', form.author);
        formData.append('description', form.description);
        formData.append('publishedDate', form.date);
        
        // Append categories - backend expects 'category' not 'genres'
        // Send as array of strings
        form.genres.forEach(genre => {
            formData.append('category', genre);
        });
        
        // Append the image file if it exists
        if (form.image instanceof File) {
            formData.append('image', form.image);
        } else if (typeof form.image === 'string') {
            // If it's a string, it's an existing URL for an update,
            // so we send it as a separate field or not at all depending on the backend API
            // For this example, we'll assume the backend handles both cases
            formData.append('imageUrl', form.image);
        }

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                console.error('No access token found. Please log in.');
                return;
            }
            
            let res;
            if (onUpdate) {
                res = await fetch(`${API_BASE_URL}/api/book/${form.id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                        // Note: No Content-Type header for FormData - browser sets it automatically
                    },
                    body: formData,
                });
            } else {
                res = await fetch(`${API_BASE_URL}/api/book`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                        // Note: No Content-Type header for FormData - browser sets it automatically
                    },
                    body: formData,
                });
            }
            
            const data = await res.json();
            
            if (data.success) {
                console.log('Book submitted successfully!');
                setForm({ id: null, title: '', author: '', genres: [], date: '', image: null, description: '' });
            } else {
                console.error('Book submission failed:', data);
            }
        } catch (error) {
            console.error('Submission failed:', error);
        }
    };

    // Helper function to create a preview URL for the selected file
    const getPreviewUrl = () => {
        if (form.image instanceof File) {
            return URL.createObjectURL(form.image);
        } else if (typeof form.image === 'string') {
            return form.image;
        }
        return './pfp.png';
    };

    return (
        <div className="bookManage">
            <div className="bookoption">
                <button className={!onUpdate ? 'active' : ''} onClick={() => { setOnUpdate(false); setForm({ id: null, title: '', author: '', genres: [], date: '', image: null, description: '' }); }}>ADD</button>
                <button className={onUpdate ? 'active' : ''} onClick={() => { setOnUpdate(true); setForm({ id: null, title: '', author: '', genres: [], date: '', image: null, description: '' }); }}>UPDATE</button>
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
                        <p>Genres</p>
                        <div className="genreDropdown" ref={genreDropdownRef}>
                            <div 
                                className="genreDropdownTrigger" 
                                onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
                            >
                                <span>{getSelectedGenresText()}</span>
                                <span className="dropdownArrow">{isGenreDropdownOpen ? '▲' : '▼'}</span>
                            </div>
                            {isGenreDropdownOpen && (
                                <div className="genreDropdownContent">
                                    {genresList.map((genre, index) => (
                                        <label key={index} className="genreOption">
                                            <input
                                                type="checkbox"
                                                checked={form.genres.includes(genre)}
                                                onChange={() => handleGenreToggle(genre)}
                                            />
                                            <span>{genre}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="inputrow">
                        <p>Date</p>
                        <input type="date" name="date" value={form.date} onChange={handleChange} required />
                    </div>
                    <div className="inputrow">
                        <p>Image</p>
                        <input type="file" name="image" onChange={handleFileChange} />
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
                        <img src={getPreviewUrl()} alt="Book" />
                        <p className="thumbnailName">{form.title || 'Book Title'}</p>
                        <p className="thumbnailAuthor">by {form.author || 'Author'}</p>
                        <p>✰✰✰✰✰</p>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AdminBooks;