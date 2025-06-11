// This React code creates a "House Rangoli" game where players color different sections of a house-shaped SVG pattern by selecting the correct color from a palette.

import { useState } from 'react';

// Define the initial rangoli pattern with color names for a house design using squares, triangles, and circles.
// Each object represents a section of the SVG, including its unique ID, intended color name,
// current fill color (initially white), and SVG path data.
const initialPattern = [
  // Square Base (House body)
  {
    id: 1,
    name: 'Yellow', // Correct color for this section
    fill: 'white',   // Initial fill color
    path: 'M150,150 h100 v100 h-100 Z' // SVG path for a square
  },
  // Roof (Triangle)
  {
    id: 2,
    name: 'Red',
    fill: 'white',
    path: 'M150,150 L200,100 L250,150 Z' // SVG path for a triangle
  },
  // Roof (Triangle - other side)
  {
    id: 3,
    name: 'Purple',
    fill: 'white',
    path: 'M150,150 L100,100 L50,150 Z' // SVG path for another triangle
  },
  // Circle at the top left
  {
    id: 4,
    name: 'Blue',
    fill: 'white',
    path: 'M50,150 m0,-30 a30,30 0 1,0 60,0 a30,30 0 1,0 -60,0' // SVG path for a circle
  },
  // Circle at the top right
  {
    id: 5,
    name: 'Green',
    fill: 'white',
    path: 'M250,150 m0,-30 a30,30 0 1,0 60,0 a30,30 0 1,0 -60,0' // SVG path for another circle
  },
  // Decorative elements (optional)
  {
    id: 6,
    name: 'Orange',
    fill: 'white',
    path: 'M150,150 m-20,-20 l-20,-20 a10,10 0 1,1 20,-20 l20,20'
  },
  {
    id: 7,
    name: 'Pink',
    fill: 'white',
    path: 'M150,150 m20,-20 l20,-20 a10,10 0 1,0 20,20 l-20,20'
  },
  {
    id: 8,
    name: 'Purple', // Note: This uses 'Purple' again, consider if this is intentional for the game logic
    fill: 'white',
    path: 'M150,150 m20,20 l20,20 a10,10 0 1,1 -20,20 l-20,-20'
  }
];

// Array of available colors for the user to choose from.
const availableColors = [
  { name: 'Yellow', value: '#FFD700' },
  { name: 'Red', value: '#FF4444' },
  { name: 'Purple', value: '#8844FF' },
  { name: 'Blue', value: '#4444FF' },
  { name: 'Green', value: '#44FF44' },
  { name: 'Orange', value: '#FFA500' },
  { name: 'Pink', value: '#FF69B4' }
];

const RangoliGame = () => {
  // State to manage the current pattern, which changes as sections are colored.
  const [pattern, setPattern] = useState(initialPattern);
  // State to store the color currently selected by the user from the palette.
  const [selectedColor, setSelectedColor] = useState(null);
  // State to keep track of the player's score (number of correctly colored sections).
  const [score, setScore] = useState(0);
  // State to display feedback messages to the user (e.g., "Correct color!").
  const [message, setMessage] = useState('');

  // Handler for when a color from the palette is selected.
  const handleColorSelect = (color) => {
    setSelectedColor(color); // Set the selected color.
    setMessage(''); // Clear any previous messages.
  };

  // Handler for when a section of the Rangoli pattern is clicked.
  const handlePatternClick = (section) => {
    // If no color is selected, prompt the user to select one.
    if (!selectedColor) {
      setMessage('Please select a color first!');
      return;
    }

    // Create a new pattern array by mapping over the existing one.
    const newPattern = pattern.map((item) => {
      // If the clicked item's ID matches the current section's ID.
      if (item.id === section.id) {
        // Check if the selected color's name matches the section's intended color name.
        const isCorrect = selectedColor.name === item.name;
        // If the color is correct AND the section hasn't been colored yet (is still white).
        if (isCorrect && item.fill === 'white') {
          setScore(score + 1); // Increment the score.
          setMessage('Correct color!'); // Set a success message.
        } else if (!isCorrect) {
          // If the selected color is incorrect.
          setMessage('Try a different color!'); // Set a retry message.
        }
        // Return a new object for this section, updating its fill color to the selected color's value.
        return {
          ...item,
          fill: selectedColor.value
        };
      }
      // For all other sections, return them unchanged.
      return item;
    });

    setPattern(newPattern); // Update the pattern state with the new colors.
  };

  // Function to reset the game to its initial state.
  const resetGame = () => {
    setPattern(initialPattern); // Reset the pattern to its original (all white) state.
    setScore(0);               // Reset the score to zero.
    setSelectedColor(null);    // Clear any selected color.
    setMessage('');            // Clear any messages.
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-yellow-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-orange-800 mb-4">House Rangoli</h1>
      <p className="text-lg text-orange-600 mb-8">Fill in the pattern with correct colors</p>

      {/* Main game area: SVG Rangoli pattern */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8 relative">
        {/* SVG container for the Rangoli pattern */}
        <svg width="400" height="400" viewBox="50,50 200,200" className="mb-4">
          {/* Map over the pattern state to render each SVG path */}
          {pattern.map((section) => (
            <g key={section.id}>
              <path
                d={section.path}    // SVG path data for the shape
                fill={section.fill} // Current fill color of the shape
                stroke="black"      // Border color
                strokeWidth="1"     // Border width
                onClick={() => handlePatternClick(section)} // Click handler for coloring
                className="cursor-pointer hover:opacity-80 transition-opacity" // Tailwind classes for styling and hover effect
              />
              {/* Title for accessibility, showing the correct color name on hover */}
              <title>{section.name}</title>
            </g>
          ))}
        </svg>
      </div>

      {/* Color palette for selection */}
      <div className="flex flex-wrap justify-center gap-4 mb-8 max-w-md">
        {availableColors.map((color) => (
          <button
            key={color.name}
            onClick={() => handleColorSelect(color)}
            className={`w-16 h-16 rounded-full shadow-md transition-transform ${
              // Apply ring and scale effect if this color is currently selected
              selectedColor?.name === color.name ? 'scale-110 ring-4 ring-black' : 'hover:scale-105'
            }`}
            style={{ backgroundColor: color.value }} // Set background color from its value
          >
            <span className="sr-only">{color.name}</span> {/* Screen reader text */}
          </button>
        ))}
      </div>

      {/* Message display for feedback */}
      {message && (
        <div className={`text-lg font-semibold mb-4 ${
          // Dynamic styling for message based on content
          message.includes('Correct') ? 'text-green-600' : 'text-orange-600'
        }`}>
          {message}
        </div>
      )}

      {/* Score display and Reset Game button */}
      <div className="flex gap-4">
        <div className="bg-white rounded-lg px-6 py-3 shadow-md">
          <span className="text-xl font-semibold">Score: {score}/{initialPattern.length}</span>
        </div>
        <button
          onClick={resetGame}
          className="px-6 py-3 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 transition-colors"
        >
          Reset Game
        </button>
      </div>
    </div>
  );
};

export default RangoliGame;