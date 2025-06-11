import { useState } from 'react';

/**
 * A React component that creates a "Connect the Dots" game to draw the Devanagari character "अ".
 * It manages the state of the drawing, validates the user's connections against a predefined
 * sequence, and renders the dots and lines using SVG.
 */
const DrawingCanvas = () => {
  // --- Static Data ---

  // An array of dot objects, each with a unique ID and x/y coordinates for positioning.
  const dots = [
    { id: 1, x: 100, y: 50 },
    { id: 2, x: 130, y: 75 },
    { id: 3, x: 100, y: 100 },
    { id: 4, x: 130, y: 125 },
    { id: 5, x: 100, y: 150 },
    { id: 6, x: 175, y: 100 },
    { id: 7, x: 175, y: 40 },
    { id: 8, x: 175, y: 160 },
    { id: 9, x: 140, y: 40 },
    { id: 10, x: 205, y: 40 }
  ];

  // The required sequence of dot connections to correctly draw the character.
  // This includes backtracking (e.g., 5 -> 4 -> 3) which is essential for the shape.
  const correctSequence = [1, 2, 3, 4, 5, 4, 3, 6, 8, 6, 7, 9, 10];
  
  // --- State Management ---

  // `selectedDot`: Stores the first dot clicked when drawing a line. `null` if no dot is selected.
  const [selectedDot, setSelectedDot] = useState(null);
  
  // `lines`: An array of connection objects that the user has successfully drawn.
  const [lines, setLines] = useState([]);
  
  // `error`: A string for displaying feedback (errors or success messages) to the user.
  const [error, setError] = useState('');
  
  // `currentStep`: An index to track the user's progress through the `correctSequence` array.
  const [currentStep, setCurrentStep] = useState(0);

  // --- Helper Functions ---

  /**
   * Determines if a connection should be a curve and calculates the control point for it.
   * This is used to create the rounded parts of the character "अ".
   * @param {object} start - The starting dot object ({ id, x, y }).
   * @param {object} end - The ending dot object ({ id, x, y }).
   * @returns {object|null} An object with x, y coordinates for the curve's control point, or null if it's a straight line.
   */
  const getCurveControlPoint = (start, end) => {
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    
    // Defines the segments that should be drawn as curves.
    // First curve for the top part of "अ"
    if ((start.id === 1 && end.id === 2) || (start.id === 2 && end.id === 3)) {
      return { x: midX + 30, y: midY };
    }
    // Second curve for the bottom part of "अ", including the backtracking path.
    if ((start.id === 3 && end.id === 4) || 
        (start.id === 4 && end.id === 5) ||
        (start.id === 5 && end.id === 4) ||
        (start.id === 4 && end.id === 3)) {
      return { x: midX + 30, y: midY };
    }
    // If the connection is not in the list above, it will be a straight line.
    return null;
  };

  /**
   * Validates if the connection being attempted is the correct next step in the sequence.
   * @param {object} start - The previously selected dot.
   * @param {object} end - The dot the user is trying to connect to.
   * @returns {boolean} True if the connection is correct, otherwise false.
   */
  const isValidConnection = (start, end) => {
    const expectedStartId = correctSequence[currentStep];
    const expectedEndId = correctSequence[currentStep + 1];
    
    return start.id === expectedStartId && end.id === expectedEndId;
  };

  // --- Event Handlers ---

  /**
   * Handles the logic when a user clicks on any dot.
   * @param {object} dot - The dot object that was clicked.
   */
  const handleDotClick = (dot) => {
    setError(''); // Clear any previous error message on a new click.
    
    // Case 1: No dot is currently selected. This will be the starting point of a new line.
    if (!selectedDot) {
      // Special check: If this is the very first move, it must start at dot 1.
      if (lines.length === 0 && dot.id !== 1) {
        setError('Start with dot 1');
        return;
      }
      // General check: The clicked dot must be the next expected dot in the sequence.
      if (dot.id !== correctSequence[currentStep]) {
        setError(`Connect dot ${correctSequence[currentStep]} next`);
        return;
      }
      // If valid, set this dot as the selected starting point.
      setSelectedDot(dot);
    } else {
      // Case 2: A dot is already selected. This click will attempt to complete the line.
      if (!isValidConnection(selectedDot, dot)) {
        setError(`Connect dot ${correctSequence[currentStep]} to dot ${correctSequence[currentStep + 1]}`);
        setSelectedDot(null); // Deselect the dot if the connection is wrong.
        return;
      }

      // If the connection is valid, create a new line object.
      const newConnection = {
        // A unique key is needed for React's list rendering. Appending `currentStep` handles backtracking over the same dots.
        id: `${selectedDot.id}-${dot.id}-${currentStep}`,
        start: selectedDot,
        end: dot,
        controlPoint: getCurveControlPoint(selectedDot, dot)
      };

      // Add the new line to the state, advance the sequence step, and reset the selection.
      setLines([...lines, newConnection]);
      setCurrentStep(currentStep + 1);
      setSelectedDot(null);

      // Check if the user has completed the entire sequence.
      // We check against `length - 2` because `currentStep` is incremented after the last line is drawn.
      if (currentStep === correctSequence.length - 2) {
        setError('Success! You completed the sequence correctly!');
      }
    }
  };

  /**
   * Generates the SVG path data ('d' attribute) for a given connection.
   * @param {object} connection - The line object.
   * @returns {string} The SVG path data string.
   */
  const getPathData = (connection) => {
    // If a control point exists, create a quadratic Bézier curve (Q).
    if (connection.controlPoint) {
      return `M ${connection.start.x} ${connection.start.y} Q ${connection.controlPoint.x} ${connection.controlPoint.y} ${connection.end.x} ${connection.end.y}`;
    } else {
      // Otherwise, create a straight line (L).
      return `M ${connection.start.x} ${connection.start.y} L ${connection.end.x} ${connection.end.y}`;
    }
  };

  /**
   * Resets the game to its initial state.
   */
  const handleReset = () => {
    setLines([]);
    setSelectedDot(null);
    setError('');
    setCurrentStep(0);
  };

  // --- JSX Rendering ---

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-bold">Connect the Dots: अ</h2>
      <div className="relative w-96 h-64 border border-gray-300 rounded-lg">
        {/* The SVG canvas where dots and lines are drawn. `viewBox` is set to focus on the drawing area. */}
        <svg className="w-full h-full" viewBox="50 0 200 200">
          {/* Render all the successfully drawn lines */}
          {lines.map((connection) => (
            <path
              key={connection.id}
              d={getPathData(connection)}
              stroke="black"
              strokeWidth="2"
              fill="none"
            />
          ))}
          {/* Render all the dots */}
          {dots.map((dot) => (
            <g key={dot.id}>
              <circle
                cx={dot.x}
                cy={dot.y}
                r="6"
                // The selected dot is highlighted in red.
                fill={selectedDot?.id === dot.id ? 'red' : 'blue'}
                onClick={() => handleDotClick(dot)}
                className="cursor-pointer"
              />
              {/* Display the ID number above each dot */}
              <text
                x={dot.x}
                y={dot.y - 10}
                textAnchor="middle"
                className="text-xs fill-black select-none" // `select-none` prevents text selection on click
              >
                {dot.id}
              </text>
            </g>
          ))}
        </svg>
      </div>
      {/* Controls and feedback section */}
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reset
        </button>
        {/* Display error or success messages. The color changes based on the message content. */}
        <p className={`text-sm ${error.includes('Success') ? 'text-green-500' : 'text-red-500'} font-medium`}>
          {error}
        </p>
        {/* A static guide for the user showing the correct sequence. */}
        <p className="text-sm text-gray-600">
          Connect dots in sequence: 1 → 2 → 3 → 4 → 5 → 4 → 3 → 6 → 8 → 6 → 7 → 9 → 10
        </p>
      </div>
    </div>
  );
};

export default DrawingCanvas;