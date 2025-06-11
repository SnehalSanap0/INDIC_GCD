import { useRef, useState, useEffect } from 'react';
import { motion } from "framer-motion";

/**
 * A React component for a free-form drawing canvas.
 * It allows users to draw with different colors and line widths, erase their work,
 * and clear the canvas. It also shows an animated guide of a character on load.
 */
const DrawingCanvas = () => {
  // `useRef` is used to get a direct reference to the <canvas> DOM element.
  // This is necessary for using the Canvas API to draw on it.
  const canvasRef = useRef(null);

  // --- State Management ---

  // `isDrawing`: A boolean to track if the user is actively drawing (i.e., mouse button is pressed).
  const [isDrawing, setIsDrawing] = useState(false);
  
  // `tool`: Stores the currently selected tool, either 'draw' or 'erase'.
  const [tool, setTool] = useState('draw');
  
  // `color`: Stores the current color for the drawing tool.
  const [color, setColor] = useState('#000000');
  
  // `lineWidth`: Stores the current thickness of the drawing/erasing line.
  const [lineWidth, setLineWidth] = useState(5);
  
  // `showAnimation`: Controls the visibility of the introductory animated SVG character.
  const [showAnimation, setShowAnimation] = useState(true);

  // --- Side Effects ---

  /**
   * This `useEffect` hook runs once when the component mounts.
   * It sets up the default properties for the canvas 2D rendering context.
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    // 'round' makes the ends of lines and joins between lines smooth, which feels more natural for drawing.
    context.lineCap = 'round';
    context.lineJoin = 'round';
  }, []); // Empty dependency array means this runs only once on mount.

  // --- Event Handlers for Drawing ---

  /**
   * Called on `onMouseDown`. It begins a new drawing path at the mouse's current position.
   */
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect(); // Gets canvas position on the page.
    // Calculate mouse coordinates relative to the canvas.
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.beginPath(); // Starts a new path.
    context.moveTo(x, y); // Moves the "pen" to the starting point.
    setIsDrawing(true); // Set the drawing state to true.
  };

  /**
   * Called on `onMouseMove`. It draws a line from the previous point to the new mouse position.
   */
  const draw = (e) => {
    // Only draw if the mouse button is held down.
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.lineWidth = lineWidth;
    // If the tool is 'erase', the color is set to white to simulate erasing. Otherwise, use the selected color.
    context.strokeStyle = tool === 'erase' ? '#FFFFFF' : color;
    context.lineTo(x, y); // Adds a new point and creates a line to that point.
    context.stroke(); // Renders the line on the canvas.
  };

  /**
   * Called on `onMouseUp` or `onMouseOut`. It stops the current drawing action.
   */
  const stopDrawing = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.closePath(); // Closes the current path.
    setIsDrawing(false); // Set the drawing state to false.
  };

  /**
   * Clears the entire canvas and brings the introductory animation back.
   */
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Show the animated guide again after clearing.
    setShowAnimation(true);
  };

  // --- JSX Rendering ---

  return (
    <div className="flex justify-center items-start min-h-screen bg-gradient-to-b from-purple-300 via-pink-200 to-white0 p-4">
      <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg mt-15">
        {/* Toolbar for drawing controls */}
        <div className="flex flex-wrap gap-4 mb-4">
          <button onClick={() => setTool('draw')} className={`px-4 py-2 rounded transition-colors ${tool === 'draw' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Draw</button>
          <button onClick={() => setTool('erase')} className={`px-4 py-2 rounded transition-colors ${tool === 'erase' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Eraser</button>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-16 h-10 border rounded cursor-pointer" />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Size:</span>
            <input type="range" min="1" max="20" value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} className="w-32 cursor-pointer" />
          </div>
          <button onClick={clearCanvas} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">Clear All</button>
        </div>
        
        {/* The main drawing area, which is a container for the canvas and the animation */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="bg-white border-2 border-gray-300 rounded cursor-crosshair"
            // Mouse event listeners to handle drawing
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing} // Stops drawing if the mouse leaves the canvas area
          />
          
          {/* Conditionally render the animated SVG guide */}
          {showAnimation && (
            <div 
              className="absolute top-4 left-4"
              // Clicking the animation will hide it, allowing the user to start drawing.
              onClick={() => setShowAnimation(false)} 
            >
              <svg width="75" height="75" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Framer Motion path for a line-drawing animation */}
                <motion.path
                  d="M20.022,3h-5a1,1,0,0,0,0,2h1.5v6H11.57208a4.95124,4.95124,0,0,0,1.02558-3A5,5,0,0,0,3.26758,5.5.99974.99974,0,1,0,4.999,6.5,3.00021,3.00021,0,1,1,7.59766,11a1,1,0,0,0,0,2A3,3,0,1,1,4.999,17.5a.99974.99974,0,0,0-1.73144,1A5,5,0,0,0,12.59766,16a4.95124,4.95124,0,0,0-1.02558-3H16.522v7a1,1,0,0,0,2,0V5h1.5a1,1,0,0,0,0-2Z"
                  stroke="black"
                  strokeWidth="3"
                  fill="none"
                  // Animation properties to draw the SVG path over time
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrawingCanvas;