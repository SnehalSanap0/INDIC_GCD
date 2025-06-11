// This React code renders a "Games Dashboard," showcasing a collection of educational games with their names, descriptions, and corresponding navigation routes.

import { useNavigate } from "react-router-dom";

// Defines the array of game objects, each containing details about a specific game.
const games = [
  {
    name: "Frog Jump",
    description: "Help the frog jump to the correct vowel platform!",
    route: "frog",
    image: "🐸", // Emoji representing the game.
  },
  {
    name: "Fill in the Blanks",
    description: "Complete the sentence by filling in the blanks!",
    route: "fillintheblanks",
    image: "✍️", // Emoji for writing/filling.
  },
  {
    name: "Match the Pairs",
    description: "Find and match the correct pairs of cards!",
    route: "match",
    image: "🃏", // Emoji for cards/matching.
  },
  {
    name: "Sentence Builder",
    description: "Arrange the words to build a meaningful sentence!",
    route: "sentence",
    image: "🔠", // Emoji for letters/words.
  },
  {
    name: "Canvas",
    description: "Draw and create on the virtual canvas!",
    route: "canvas",
    image: "🖼️", // Emoji for artwork/canvas.
  },
  {
    name: "Flipped Card",
    description: "Flip and match the cards!",
    route: "flippedcard",
    image: "🎴", // Emoji for flipped cards.
  },
  {
    name: "Noun Quest",
    description: "Identify and match the correct nouns in this fun game!",
    route: "noun",
    image: "🧩" // Emoji for puzzle/quest.
  },
  {
    name: "Rangoli Colors Quest",
    description: "Complete beautiful Rangoli patterns in this colorful and fun game!",
    route: "rangoli",
    image: "🎨" // Emoji for art/colors.
  },
  {
    name: "Avatar Actions",
    description: "Control the avatar and perform actions!",
    route: "home",
    image: "🕺", // Emoji for actions/movement.
  },
];

const GamesDashboard = () => {
  // `useNavigate` hook from React Router DOM for programmatic navigation.
  const navigate = useNavigate();

  return (
    // Main container for the dashboard, applying background gradient and layout.
    <div className="relative isolate px-6 pt-14 lg:px-8">
      {/* Absolute positioned div for background blur and gradient effects */}
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        {/* First background gradient blob */}
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
          }}
        />
        {/* Second background gradient blob */}
        <div
          className="relative left-[calc(50%+11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[-30deg] bg-gradient-to-bl from-[#9089fc] to-[#ff80b5] opacity-30 sm:left-[calc(50%+30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath: "polygon(74.1% 44.1%, 76.1% 97.7%, 27.6% 76.8%, 17.9% 100%, 0.1% 64.9%, 27.5% 76.7%, 45.2% 34.5%, 47.5% 58.3%, 52.4% 68.1%, 60.2% 62.4%, 72.5% 32.5%, 80.7% 2%, 85.5% 0.1%, 97.5% 26.9%, 100% 61.6%, 74.1% 44.1%)"
          }}
        />
      </div>
      {/* Content wrapper for centering and padding */}
      <div className="flex flex-col items-center justify-center w-full pt-32">
        {/* Grid container for game cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {/* Map through the 'games' array to render each game card */}
          {games.map((game, index) => (
            <div
              key={index} // Unique key for each game card.
              // Styling for the game card, including backdrop blur, transparent background,
              // borders, shadow, hover effects, and layout.
              className="relative backdrop-blur-md bg-white/20 border border-white/40 shadow-lg rounded-2xl p-5 hover:shadow-2xl transition-transform transform hover:scale-110 cursor-pointer flex flex-col items-center text-center overflow-hidden"
              // Navigate to the game's route when the card is clicked.
              onClick={() => navigate(`/${game.route}`)}
            >
              {/* Internal background gradients for each card */}
              <div
                className="absolute inset-0 -z-10 transform-gpu overflow-hidden blur-2xl"
                aria-hidden="true"
              >
                {/* First internal gradient blob */}
                <div
                  className="absolute left-1/2 top-1/2 aspect-[1155/678] w-[200%] -translate-x-1/2 -translate-y-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20"
                  style={{
                    clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
                  }}
                />
                {/* Second internal gradient blob */}
                <div
                  className="absolute left-1/2 top-1/2 aspect-[1155/678] w-[200%] -translate-x-1/2 -translate-y-1/2 rotate-[-10deg] bg-gradient-to-bl from-[#9089fc] to-[#ff80b5] opacity-20"
                  style={{
                    clipPath: "polygon(74.1% 44.1%, 76.1% 97.7%, 27.6% 76.8%, 17.9% 100%, 0.1% 64.9%, 27.5% 76.7%, 45.2% 34.5%, 47.5% 58.3%, 52.4% 68.1%, 60.2% 62.4%, 72.5% 32.5%, 80.7% 2%, 85.5% 0.1%, 97.5% 26.9%, 100% 61.6%, 74.1% 44.1%)"
                  }}
                />
              </div>

              {/* Genre Badge (commented out in original code) */}
              {/* <div className="absolute top-4 right-4 z-10">
                <span className="px-3 py-1 text-xs font-semibold bg-blue-100/80 backdrop-blur-sm text-blue-800 rounded-full border border-blue-200/50">
                  {game.genre}
                </span>
              </div> */}

              {/* Game image/emoji display */}
              <div className="flex items-center justify-center mb-4 text-7xl h-24 w-24 bg-purple-100/40 backdrop-blur-sm rounded-full border border-purple-200/50 z-10">
                {game.image}
              </div>

              {/* Game name */}
              <h2 className="text-xl font-bold text-blue-800 mb-2 z-10">{game.name}</h2>
              {/* Game description */}
              <p className="text-gray-600 text-sm mb-4 z-10">{game.description}</p>

              {/* Play Now button */}
              <button
                // Prevent event propagation so clicking the button doesn't trigger the parent card's onClick.
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/${game.route}`); // Navigate to the game's route.
                }}
                className="px-6 py-2 bg-blue-600/90 backdrop-blur-sm text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-md z-10"
              >
                Play Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamesDashboard;