import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Home, Hand, Book, Info, Plus, Map } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";

/**
 * FloatingActionButton component provides an animated, expandable button that reveals navigation options.
 */

const FloatingActionButton = () => {
  // State to manage the open/closed state of the floating action button menu.
  const [isOpen, setIsOpen] = useState(false);
  // Hook to programmatically navigate to different routes.
  const navigate = useNavigate();

  /**
   * Handles navigation to a specified path and closes the FAB menu.
   * @param {string} path - The route path to navigate to.
   */
  const handleNavigation = (path) => {
    navigate(path); // Navigates to the given path.
    setIsOpen(false); // Closes the menu after navigation.
  };

  return (
    // Fixed container for the FAB and its sub-buttons, positioned at the bottom-left of the viewport.
    <div className="fixed bottom-24 left-6 flex flex-col items-end">
      {/* AnimatePresence enables exit animations for components that are removed from the DOM. */}
      <AnimatePresence>
        {/* Renders the action buttons only when the menu is open (isOpen is true). */}
        {isOpen && (
          <motion.div
            className="flex flex-col items-end space-y-2 mb-2" // Styling for the column of action buttons.
            initial={{ opacity: 0, y: 20 }} // Initial animation state (starts invisible and slightly below final position).
            animate={{ opacity: 1, y: 0 }} // Animation state when component is present (fades in and moves to final position).
            exit={{ opacity: 0, y: 20 }} // Animation state when component is removed (fades out and moves down).
            transition={{ duration: 0.3 }} // Animation duration.
          >
            {/* Home Button */}
            <motion.button
              onClick={() => handleNavigation("/home")} // Navigates to '/home' on click.
              className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110" // Styling for the button.
              whileHover={{ scale: 1.1 }} // Scales up on hover.
              whileTap={{ scale: 0.9 }} // Scales down on tap/click.
            >
              <Home size={20} /> {/* Home icon */}
            </motion.button>

            {/* Roadmap Button */}
            <motion.button
              onClick={() => handleNavigation("/roadmap")} // Navigates to '/roadmap' on click.
              className="w-12 h-12 flex items-center justify-center bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-transform transform hover:scale-110" // Styling for the button.
              whileHover={{ scale: 1.1 }} // Scales up on hover.
              whileTap={{ scale: 0.9 }} // Scales down on tap/click.
            >
              <Map size={20} /> {/* Map icon */}
            </motion.button>

            {/* Sign Dashboard Button */}
            <motion.button
              onClick={() => handleNavigation("/signdashboard")} // Navigates to '/signdashboard' on click.
              className="w-12 h-12 flex items-center justify-center bg-yellow-600 text-white rounded-full shadow-lg hover:bg-yellow-700 transition-transform transform hover:scale-110" // Styling for the button.
              whileHover={{ scale: 1.1 }} // Scales up on hover.
              whileTap={{ scale: 0.9 }} // Scales down on tap/click.
            >
              <Hand size={20} /> {/* Hand icon */}
            </motion.button>

            {/* PDF Button */}
            <motion.button
              onClick={() => handleNavigation("/pdf")} // Navigates to '/pdf' on click.
              className="w-12 h-12 flex items-center justify-center bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-transform transform hover:scale-110" // Styling for the button.
              whileHover={{ scale: 1.1 }} // Scales up on hover.
              whileTap={{ scale: 0.9 }} // Scales down on tap/click.
            >
              <Book size={20} /> {/* Book icon */}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)} // Toggles the isOpen state, opening/closing the menu.
        className="w-14 h-14 flex items-center justify-center bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-transform transform" // Styling for the main FAB.
        whileTap={{ scale: 0.9, rotate: 90 }} // Scales down and rotates 90 degrees on tap/click.
      >
        <Plus size={24} /> {/* Plus icon */}
      </motion.button>
    </div>
  );
};

export default FloatingActionButton; // Exports the component for use in other parts of the application.