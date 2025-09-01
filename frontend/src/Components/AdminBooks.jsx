import React, { useState } from 'react';
import '../styles/admin.css';

const AdminBooks = ({ genres = ["horror", "romance"], bookData }) => {
    const [onUpdate, setOnUpdate] = useState(false);
    const [form, setForm] = useState({
        title: 'PlaceHolder',
        author: 'PlaceHolder',
        genre: '',
        date: '2000-01-01',
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1742475239i/195820807.jpg',
        description: '',
    });

    function stars(n) {
        return '★★★★★'.slice(0, n) + '✰✰✰✰✰'.slice(n, 5);
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onUpdate) {
            console.log('Updating book:', form);
            // 🔹 API call to update book
        } else {
            console.log('Adding new book:', form);
            // 🔹 API call to add book
        }
    };

    return (
        <div className="bookManage">
            <div className="bookoption">
                <button className={!onUpdate ? 'active' : ''} onClick={() => setOnUpdate(false)}>ADD</button>
                <button className={onUpdate ? 'active' : ''} onClick={() => setOnUpdate(true)}>UPDATE</button>
            </div>

            {onUpdate && (
                <div className="searchbar">
                    <select name="type" id="searchtype">
                        <option value="title">Title</option>
                        <option value="author">Author</option>
                    </select>
                    <input type="text" placeholder="Search..." />
                    <button>🔍</button>
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
                            {genres.map((g, index) => (
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

                    {/* ✅ Submit button */}
                    <button type="submit" className="submitBtn">
                        {onUpdate ? 'Update Book' : 'Add Book'}
                    </button>
                </div>

                <div className="preview">
                    <div className="bookThumbnail">
                        <img src={form.imageUrl || './pfp.png'} alt="Book" />
                        <p className="thumbnailName">{form.title}</p>
                        <p className="thumbnailAuthor">by {form.author}</p>
                        <p>{stars(4)}</p>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AdminBooks;
