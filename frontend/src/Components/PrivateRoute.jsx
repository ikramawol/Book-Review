import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ requiredRole }) => {
  const token = localStorage.getItem('accessToken');
  let user = null;

  if (token) {
    try {
      user = jwtDecode(token);
    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  }

  // Check for both token existence and the required role
  if (user && user.role === requiredRole) {
    return <Outlet />; // Render the child component (e.g., <Admin />)
  } else {
    // Redirect to login if not authenticated or not an admin
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;