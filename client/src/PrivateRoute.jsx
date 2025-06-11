import React, { useContext } from 'react'; // Imports React and the useContext hook from the 'react' library.
import { Navigate } from 'react-router-dom'; // Imports the Navigate component from 'react-router-dom' for declarative navigation.
import { AuthContext } from "./utils/AuthContext"; // Imports the AuthContext from a local utility file. This context is used to access authentication status.

// PrivateRoute component definition. It takes 'children' as a prop, which represents the components it's protecting.
const PrivateRoute = ({ children }) => {
  // Uses the useContext hook to access the 'user' object from AuthContext.
  // The 'user' object typically holds information about the currently authenticated user, or null if not authenticated.
  const { user } = useContext(AuthContext);

  // Conditional rendering:
  // If 'user' is falsy (meaning no user is authenticated),
  if (!user) {
    // Redirects the user to the '/login' page using the Navigate component.
    return <Navigate to="/login" />;
  }

  // If 'user' is truthy (meaning a user is authenticated),
  // Renders the 'children' components, allowing access to the protected route.
  return children;
};

export default PrivateRoute; // Exports the PrivateRoute component for use in other parts of the application.