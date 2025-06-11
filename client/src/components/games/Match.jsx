// This React code creates a "Fruit Matching Game" where players match fruit images with their corresponding Hindi names.

import { useEffect, useState } from 'react';
import grapesImage from "../../assets/grapes.png";
import bananaImage from "../../assets/banana.png";
import mangoImage from "../../assets/mango.png";
import watermelonImage from "../../assets/watermelon.png";
import orangeImage from "../../assets/orange.png";

// This array holds the initial, correctly paired fruit data (image and Hindi name).
const preMatchedData = [
  { fruit: <img src={grapesImage} alt="Grapes" className="w-10 h-10 object-cover rounded-lg" />, fruitHindi: "अंगूर" },
  { fruit: <img src={bananaImage} alt="Banana" className="w-10 h-10 object-cover rounded-lg" />, fruitHindi: "केला" },
  { fruit: <img src={mangoImage} alt="Mango" className="w-10 h-10 object-cover rounded-lg" />, fruitHindi: "आम" },
  { fruit: <img src={watermelonImage} alt="Watermelon" className="w-10 h-10 object-cover rounded-lg" />, fruitHindi: "तरबूज" },
  { fruit: <img src={orangeImage} alt="Orange" className="w-10 h-10 object-cover rounded-lg" />, fruitHindi: "संतरा" },
];

// Helper function to shuffle an array. It creates a shallow copy and sorts it randomly.
const shuffledArray = (matchingData) => {
  return matchingData.slice().sort(() => Math.random() - 0.5);
};

export default function Game() {
  // State to hold the shuffled version of the preMatchedData for the Hindi fruit names.
  const [shuffledMatchedData, setShuffledMatchedData] = useState([]);
  // State to store the pairs that have been correctly matched by the user.
  const [pairedData, setPairedData] = useState([]);
  // State to keep track of the currently selected fruit image (from the left column).
  const [selectedMatch, setSelectedMatch] = useState(null);

  // useEffect hook to shuffle the Hindi fruit names once when the component mounts.
  useEffect(() => {
    setShuffledMatchedData(shuffledArray(preMatchedData));
  }, []); // The empty dependency array ensures this runs only once.

  // Handler for when a Hindi fruit name (capital) is clicked.
  const handleCapitalClick = (match) => {
    // Check if a fruit image is already selected and if the clicked Hindi name matches it.
    if (selectedMatch && match.fruitHindi === selectedMatch.fruitHindi) {
      // If it's a match, add the matched pair to the pairedData state.
      const newPairedMatch = [...pairedData, { fruit: selectedMatch.fruit, fruitHindi: match.fruitHindi }];
      setPairedData(newPairedMatch);
    }
    // Reset the selected fruit image after each attempt (whether correct or incorrect).
    setSelectedMatch(null);
  };

  // Helper function to check if a given match item has already been successfully paired.
  const isMatched = (match) => {
    return pairedData.some((pairedMatch) => pairedMatch.fruitHindi === match.fruitHindi);
  };

  // This commented-out line would determine if the game is won (all pairs matched).
  // const win = pairedData.length === preMatchedData.length;

  return (
    <div className="w-full h-screen fixed top-0 left-0 bg-gradient-to-b from-purple-300 via-pink-200 to-white overflow-auto flex items-center justify-center">
      <div className="relative w-full flex flex-col items-center">
        {/*
          This commented-out block would display a "You Win!" message when the game is completed.
          {win && (
            <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-green-500 text-white px-8 py-2.5 rounded-lg shadow-lg shadow-green-500/20 z-50">
              <h2 className="text-2xl m-0">You Win!</h2>
            </div>
          )}
        */}
        <div className="flex gap-5 justify-center p-5">
          {/* Left column: Displays fruit images */}
          <div className="flex flex-col gap-4">
            {preMatchedData.map((match, index) => (
              <button
                key={index}
                onClick={() => setSelectedMatch(match)} // Sets the clicked fruit as the selected match.
                className={`
                  w-52 h-20 flex justify-center items-center
                  bg-white border border-black/10 rounded-2xl
                  text-lg text-gray-700 cursor-pointer
                  transition-all duration-200 outline-none
                  hover:translate-y-[-2px] hover:shadow-lg
                  ${isMatched(match) ? 'bg-green-500 text-black border-green-500' : ''} // Styles matched items.
                  ${selectedMatch === match ? 'bg-gray-600 text-white border-gray-600' : ''} // Styles the currently selected item.
                  ${isMatched(match) ? '' : 'hover:shadow-black/10'} // Adds hover shadow unless already matched.
                `}
              >
                {match.fruit} {/* Renders the fruit image */}
              </button>
            ))}
          </div>

          {/* Right column: Displays shuffled Hindi fruit names */}
          <div className="flex flex-col gap-4">
            {shuffledMatchedData.map((match, index) => (
              <button
                key={index}
                onClick={() => handleCapitalClick(match)} // Handles click on Hindi name to check for match.
                disabled={selectedMatch === null} // Disables button if no fruit image is selected.
                className={`
                  w-52 h-20 flex justify-center items-center
                  bg-white border border-black/10 rounded-2xl
                  text-lg text-gray-700
                  transition-all duration-200 outline-none
                  ${isMatched(match) ? 'bg-green-500 text-black border-green-500' : ''} // Styles matched items.
                  ${selectedMatch === null ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:translate-y-[-2px] hover:shadow-lg hover:shadow-black/10'} // Styles based on selection state.
                `}
              >
                {match.fruitHindi} {/* Displays the Hindi fruit name */}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}