import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Hand, Book, Info, Plus, Map } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false); // Close the menu after navigation
  };

  return (
    <div className="fixed bottom-24 left-6 flex flex-col items-end">
      {/* Animated action buttons */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="flex flex-col items-end space-y-2 mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              onClick={() => handleNavigation("/home")}
              className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Home size={20} />
            </motion.button>

            <motion.button
              onClick={() => handleNavigation("/roadmap")}
              className="w-12 h-12 flex items-center justify-center bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-transform transform hover:scale-110"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Map size={20} />
            </motion.button>

            <motion.button
              onClick={() => handleNavigation("/signdashboard")}
              className="w-12 h-12 flex items-center justify-center bg-yellow-600 text-white rounded-full shadow-lg hover:bg-yellow-700 transition-transform transform hover:scale-110"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Hand size={20} />
            </motion.button>

            <motion.button
              onClick={() => handleNavigation("/pdf")}
              className="w-12 h-12 flex items-center justify-center bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-transform transform hover:scale-110"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Book size={20} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 flex items-center justify-center bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-transform transform"
        whileTap={{ scale: 0.9, rotate: 90 }}
      >
        <Plus size={24} />
      </motion.button>
    </div>
  );
};

export default FloatingActionButton;