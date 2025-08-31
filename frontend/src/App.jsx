import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import HomePage from './Components/HomePage';
import BooksPage from './Components/BooksPage';
import Book from './Components/Book';
import GenrePage from './Components/GenrePage';
import LoginPage from './Components/LoginPage';
import ProfilePage from './Components/ProfilePage';
import AboutPage from './Components/AboutPage';

function App() {
  return (
    <Router>
      {/* <nav className="navbar">
      <li><Link to="/">Home</Link></li>
        <ul>
          <li><Link to="/books">Books</Link></li>
          <li><Link to="/genres">Genres</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </nav> */}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/viewBook" element={<Book />} />
        <Route path="/genres" element={<GenrePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
