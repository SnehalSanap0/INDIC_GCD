import { StrictMode } from 'react'; // Imports the StrictMode component from React for highlighting potential problems in an application.
import { createRoot } from 'react-dom/client'; // Imports createRoot from react-dom/client to enable concurrent mode features and create a root for your React tree.
import './index.css'; // Imports the main CSS file for global styles.
import App from './App.jsx'; // Imports the main App component of the application.

// Creates a root for the React application, attaching it to the HTML element with the ID 'root'.
createRoot(document.getElementById('root')).render(
  // Renders the App component wrapped in StrictMode.
  // StrictMode activates additional checks and warnings for its descendants during development.
  <StrictMode>
    <App /> {/* The main component of the application */}
  </StrictMode>,
);