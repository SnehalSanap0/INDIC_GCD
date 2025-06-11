// This React component creates a Story Dashboard that displays a collection of interactive stories.
// Each story is presented as a card with a title, description, image, genre, and a "Play Now" button
// that navigates to the story's dedicated route.

import { useNavigate } from "react-router-dom";

// Defines an array of story objects, each containing metadata for a story.
const games = [
  {
    name: "Whispering Fort",
    description: "Whispering Fort: A place where ancient secrets echo through time.",
    route: "golconda", // Route for this story.
    image: "🏰",       // Emoji representing the story.
    genre: "Historical" // Categorization of the story.
  },
  {
    name: "Clean Brilliance",
    description: "A fun and interactive way to learn about cleanliness and hygiene.",
    route: "cleanliness",
    image: "🧹",
    genre: "Awareness"
  },
  {
    name: "The Kumbh Quest of Pratappur",
    description: "Embark on a journey to discover the ancient mysteries of the Mahakumbh!",
    route: "mahakumbh",
    image: "⚔️",
    genre: "Cultural"
  },
  {
    name: "Charminar",
    description: "Charminar the glimpse of Hyderabad!",
    route: "charminar",
    image: "🕌",
    genre: "Historical"
  },
  {
    name: "The Lost Temple of Hampi",
    description: "A hidden temple a lost legend!",
    route: "cleanliness", // Note: This routes to "cleanliness", potentially a typo if it should be a unique route.
    image: "🏛️",
    genre: "Mythological"
  },
  {
    name: "Sunset Over Konark",
    description: "A chariot frozen in time!",
    route: "mahakumbh", // Note: This routes to "mahakumbh", potentially a typo if it should be a unique route.
    image: "🌅",
    genre: "Archaeological"
  },
];

const StoryDashboard = () => {
  // `useNavigate` hook for programmatically navigating to different routes.
  const navigate = useNavigate();

  return (
    // Main container for the dashboard, applying overall styling for background and positioning.
    <div className="relative isolate px-6 pt-14 lg:px-8">
      {/* Background gradients and blur effects for visual flair.
          These are absolutely positioned and z-indexed to be behind the content. */}
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        {/* First gradient blob */}
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
          }}
        />
        {/* Second gradient blob */}
        <div
          className="relative left-[calc(50%+11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[-30deg] bg-gradient-to-bl from-[#9089fc] to-[#ff80b5] opacity-30 sm:left-[calc(50%+30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath: "polygon(74.1% 44.1%, 76.1% 97.7%, 27.6% 76.8%, 17.9% 100%, 0.1% 64.9%, 27.5% 76.7%, 45.2% 34.5%, 47.5% 58.3%, 52.4% 68.1%, 60.2% 62.4%, 72.5% 32.5%, 80.7% 2%, 85.5% 0.1%, 97.5% 26.9%, 100% 61.6%, 74.1% 44.1%)"
          }}
        />
      </div>

      {/* Content wrapper for centering the grid of story cards. */}
      <div className="flex flex-col items-center justify-center w-full pt-32">
        {/* Grid layout for story cards, adapting to different screen sizes. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {/* Map through the `games` array to render each story card. */}
          {games.map((game, index) => (
            <div
              key={index} // Unique key for each iterated component.
              // Styling for each individual story card, including hover effects for interactivity.
              className="relative backdrop-blur-md bg-white/20 border border-white/40 shadow-lg rounded-2xl p-5 hover:shadow-2xl transition-transform transform hover:scale-110 cursor-pointer flex flex-col items-center text-center overflow-hidden"
              // When the card is clicked, navigate to its associated route.
              onClick={() => navigate(`/${game.route}`)}
            >
              {/* Internal background gradients for each card, adding a subtle visual effect. */}
              <div
                className="absolute inset-0 -z-10 transform-gpu overflow-hidden blur-2xl"
                aria-hidden="true"
              >
                {/* First internal gradient */}
                <div
                  className="absolute left-1/2 top-1/2 aspect-[1155/678] w-[200%] -translate-x-1/2 -translate-y-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20"
                  style={{
                    clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
                  }}
                />
                {/* Second internal gradient */}
                <div
                  className="absolute left-1/2 top-1/2 aspect-[1155/678] w-[200%] -translate-x-1/2 -translate-y-1/2 rotate-[-10deg] bg-gradient-to-bl from-[#9089fc] to-[#ff80b5] opacity-20"
                  style={{
                    clipPath: "polygon(74.1% 44.1%, 76.1% 97.7%, 27.6% 76.8%, 17.9% 100%, 0.1% 64.9%, 27.5% 76.7%, 45.2% 34.5%, 47.5% 58.3%, 52.4% 68.1%, 60.2% 62.4%, 72.5% 32.5%, 80.7% 2%, 85.5% 0.1%, 97.5% 26.9%, 100% 61.6%, 74.1% 44.1%)"
                  }}
                />
              </div>

              {/* Genre badge, positioned at the top right of the card. */}
              <div className="absolute top-4 right-4 z-10">
                <span className="px-3 py-1 text-xs font-semibold bg-blue-100/80 backdrop-blur-sm text-blue-800 rounded-full border border-blue-200/50">
                  {game.genre}
                </span>
              </div>

              {/* Story image/emoji, styled for size and background. */}
              <div className="flex items-center justify-center mb-4 text-7xl h-24 w-24 bg-purple-100/40 backdrop-blur-sm rounded-full border border-purple-200/50 z-10">
                {game.image}
              </div>

              {/* Story title */}
              <h2 className="text-xl font-bold text-blue-800 mb-2 z-10">{game.name}</h2>
              {/* Story description */}
              <p className="text-gray-600 text-sm mb-4 z-10">{game.description}</p>

              {/* "Play Now" button.
                  `e.stopPropagation()` prevents the card's `onClick` from firing when the button is clicked. */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/${game.route}`);
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

export default StoryDashboard;