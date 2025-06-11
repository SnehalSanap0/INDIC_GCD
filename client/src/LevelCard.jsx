import React, { useState, useEffect } from "react";

const LevelCard = ({ level, onSelect, progress }) => {
  // State to store the total number of lessons for the current level
  const [lessonCount, setLessonCount] = useState(0);
  // State to store the completion percentage of the current level
  const [completionPercentage, setCompletionPercentage] = useState(0);

  // useEffect hook to fetch lesson count when the component mounts or level.file/progress changes
  useEffect(() => {
    // Asynchronous function to fetch the total number of lessons for this level
    const fetchLessonCount = async () => {
      try {
        // Fetch data from the specified syllabus file
        const response = await fetch(`/syllabus/${level.file}`);
        if (response.ok) {
          const data = await response.json();
          // Set the total lesson count
          setLessonCount(data.length);
          
          // Calculate completion percentage if progress data is available and valid
          if (progress && progress.lastLesson !== undefined) {
            const percentage = Math.round((progress.lastLesson / data.length) * 100);
            setCompletionPercentage(percentage);
          }
        }
      } catch (error) {
        // Log any errors during the fetch operation
        console.error(`❌ Error fetching lesson count for ${level.file}:`, error);
      }
    };

    fetchLessonCount(); // Call the fetch function
  }, [level.file, progress]); // Dependencies for the useEffect hook

  // Define properties for the circular progress indicator
  const circleSize = 40; // Diameter of the SVG circle
  const strokeWidth = 3; // Thickness of the progress stroke
  const radius = (circleSize - strokeWidth) / 2; // Radius of the circle
  const circumference = 2 * Math.PI * radius; // Total circumference of the circle
  // Calculate the stroke-dashoffset to represent the completion percentage
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  // Function to determine the color of the progress indicator based on percentage
  const getProgressColor = (percentage) => {
    if (percentage < 30) return "#ef4444"; // Red for less than 30%
    if (percentage < 60) return "#f59e0b"; // Amber for less than 60%
    return "#22c55e"; // Green for 60% or more (approaching completion)
  };

  const progressColor = getProgressColor(completionPercentage); // Get the dynamic color

  return (
    <div 
      // Main container div for the LevelCard, with styling for appearance and hover effects
      className="backdrop-blur-md  bg-white/30 border border-gray-400/50 rounded-lg p-4 h-80 w-80 shadow-lg cursor-pointer hover:scale-105 transform transition-all flex flex-col justify-center items-center relative overflow-hidden"
      onClick={() => onSelect(level)} // Handler for card click
    >
      {/* Background Gradients for visual flair */}
      <div 
        className="absolute inset-0 -z-10 transform-gpu overflow-hidden blur-2xl" 
        aria-hidden="true"
      >
        {/* First gradient blob */}
        <div 
          className="absolute left-1/2 top-1/2 aspect-[1155/678] w-[200%] -translate-x-1/2 -translate-y-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20"
          style={{
            clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
          }}
        />
        {/* Second gradient blob */}
        <div 
          className="absolute left-1/2 top-1/2 aspect-[1155/678] w-[200%] -translate-x-1/2 -translate-y-1/2 rotate-[-10deg] bg-gradient-to-bl from-[#9089fc] to-[#ff80b5] opacity-20"
          style={{
            clipPath: "polygon(74.1% 44.1%, 76.1% 97.7%, 27.6% 76.8%, 17.9% 100%, 0.1% 64.9%, 27.5% 76.7%, 45.2% 34.5%, 47.5% 58.3%, 52.4% 68.1%, 60.2% 62.4%, 72.5% 32.5%, 80.7% 2%, 85.5% 0.1%, 97.5% 26.9%, 100% 61.6%, 74.1% 44.1%)"
          }}
        />
      </div>
  
      {/* Circular progress indicator, conditionally rendered if lessonCount is available */}
      {lessonCount > 0 && (
        <div className="absolute top-3 right-3 z-10">
          <svg width={circleSize} height={circleSize}>
            {/* Background circle for the progress bar */}
            <circle
              className="text-gray-300"
              strokeWidth={strokeWidth}
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx={circleSize / 2}
              cy={circleSize / 2}
            />
            {/* Foreground circle for the progress bar, dynamically colored and filled */}
            <circle
              className="transition-all duration-500 ease-in-out" // Smooth transition for progress changes
              strokeWidth={strokeWidth}
              strokeDasharray={circumference} // Total length of the stroke
              strokeDashoffset={strokeDashoffset} // Amount of stroke to hide (controls progress)
              strokeLinecap="round" // Rounded ends for the stroke
              stroke={progressColor} // Dynamic color based on completion percentage
              fill="transparent"
              r={radius}
              cx={circleSize / 2}
              cy={circleSize / 2}
              transform={`rotate(-90 ${circleSize / 2} ${circleSize / 2})`} // Rotate to start from the top
            />
            {/* Text displaying the completion percentage */}
            <text
              x="50%"
              y="50%"
              dy=".3em" // Adjust vertical alignment of text
              textAnchor="middle" // Center the text horizontally
              className="text-xs font-bold"
              fill={progressColor} // Text color matches the progress bar color
            >
              {completionPercentage}%
            </text>
          </svg>
        </div>
      )}
  
      {/* Lesson ID and Name displayed on the card */}
      <div className="bg-gradient-to-r from-[#9089fc]/90 to-[#ff80b5]/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold mb-2 z-10 shadow-md border border-[#ff80b5]/50">
        Lesson {level.id}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 z-10">{level.name}</h3>
    </div>
  );
};

export default LevelCard;