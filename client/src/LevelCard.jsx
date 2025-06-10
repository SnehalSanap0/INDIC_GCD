// import React from "react";

// const LevelCard = ({ level, onSelect }) => {
//   return (
//     <div 
//       className="bg-gradient-to-tr from-[#9089fc] to-[#f1f2b5] rounded-lg p-4 h-80 w-80 shadow-lg cursor-pointer hover:scale-105 transform transition-all flex flex-col justify-center items-center "
//       onClick={() => onSelect(level)}
//     >
//       <div className="bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-2">
//         Lesson {level.id}
//       </div>
//       <h3 className="text-lg font-semibold text-gray-800">{level.name}</h3>
//     </div>
//   );
// };

// export default LevelCard;
import React, { useState, useEffect } from "react";

const LevelCard = ({ level, onSelect, progress }) => {
  const [lessonCount, setLessonCount] = useState(0);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    // Load the total number of lessons for this level
    const fetchLessonCount = async () => {
      try {
        const response = await fetch(`/syllabus/${level.file}`);
        if (response.ok) {
          const data = await response.json();
          setLessonCount(data.length);
          
          // Calculate completion percentage if progress data is available
          if (progress && progress.lastLesson !== undefined) {
            const percentage = Math.round((progress.lastLesson / data.length) * 100);
            setCompletionPercentage(percentage);
          }
        }
      } catch (error) {
        console.error(`❌ Error fetching lesson count for ${level.file}:`, error);
      }
    };

    fetchLessonCount();
  }, [level.file, progress]);

  // Calculate circle properties for the progress indicator
  const circleSize = 40; // Smaller size (was 50)
  const strokeWidth = 3; // Slightly thinner stroke (was 4)
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  // Function to determine progress color based on percentage
  const getProgressColor = (percentage) => {
    if (percentage < 30) return "#ef4444"; // red-500 (starting color)
    if (percentage < 60) return "#f59e0b"; // amber-500 (midway color)
    return "#22c55e"; // green-500 (completion color)
  };

  const progressColor = getProgressColor(completionPercentage);

  return (
    <div 
      className="backdrop-blur-md  bg-white/30 border border-gray-400/50 rounded-lg p-4 h-80 w-80 shadow-lg cursor-pointer hover:scale-105 transform transition-all flex flex-col justify-center items-center relative overflow-hidden"
      onClick={() => onSelect(level)}
    >
      {/* Background Gradients */}
      <div 
        className="absolute inset-0 -z-10 transform-gpu overflow-hidden blur-2xl" 
        aria-hidden="true"
      >
        <div 
          className="absolute left-1/2 top-1/2 aspect-[1155/678] w-[200%] -translate-x-1/2 -translate-y-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20"
          style={{
            clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
          }}
        />
        <div 
          className="absolute left-1/2 top-1/2 aspect-[1155/678] w-[200%] -translate-x-1/2 -translate-y-1/2 rotate-[-10deg] bg-gradient-to-bl from-[#9089fc] to-[#ff80b5] opacity-20"
          style={{
            clipPath: "polygon(74.1% 44.1%, 76.1% 97.7%, 27.6% 76.8%, 17.9% 100%, 0.1% 64.9%, 27.5% 76.7%, 45.2% 34.5%, 47.5% 58.3%, 52.4% 68.1%, 60.2% 62.4%, 72.5% 32.5%, 80.7% 2%, 85.5% 0.1%, 97.5% 26.9%, 100% 61.6%, 74.1% 44.1%)"
          }}
        />
      </div>
  
      {/* Smaller circular progress indicator in top right corner */}
      
  
      <div className="bg-gradient-to-r from-[#9089fc]/90 to-[#ff80b5]/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold mb-2 z-10 shadow-md border border-[#ff80b5]/50">
  Lesson {level.id}
</div>
      <h3 className="text-lg font-semibold text-gray-800 z-10">{level.name}</h3>
    </div>
  );
};

export default LevelCard;