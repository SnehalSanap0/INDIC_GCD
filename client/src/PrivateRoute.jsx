
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from "./utils/AuthContext" 

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  // If user is not authenticated, redirect to login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If user is authenticated, render the child components
  return children;
};

export default PrivateRoute;