import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('userToken'); // Or check cookies

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
