import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import HomePage from './Components/HomePage';
import BooksPage from './Components/BooksPage';
import Book from './Components/Book';
import GenrePage from './Components/GenrePage';
import LoginPage from './Components/LoginPage';
import ProfilePage from './Components/ProfilePage';
import AboutPage from './Components/AboutPage';
import Admin from './Components/Admin';
import AdminBookView from './Components/AdminBookView';
import UserSettings from './Components/UserSettings';
import Signup from './Components/Signup';
import PrivateRoute from './Components/PrivateRoute'
import FlagView from './Components/FlagView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/viewBook" element={<Book />} />
        <Route path="/genres" element={<GenrePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/userSettings" element={<UserSettings/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<PrivateRoute requiredRole="ADMIN" />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/reviews" element={<AdminBookView />} />
            {/* <Route path="/admin/flags/:id" element={<FlagView />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
