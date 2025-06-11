import { useNavigate } from "react-router-dom";

const signLanguageGames = [
  {
    name: "Hand Gesture Recognition",
    description: "Use your camera to recognize hand gestures in real time!",
    route: "handtracking",
    image: "🤟", // Sign language gesture emoji
  },
  {
    name: "Finger Spelling Practice",
    description: "Learn and practice spelling words using sign language fingerspelling!",
    route: "spelling",
    image: "🖐️", // Hand emoji for fingerspelling
  },
];

const SignLanguageDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 via-cyan-200 to-white p-8 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center w-full pt-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-3xl mx-auto">
          {signLanguageGames.map((game, index) => (
            <div
              key={index}
              className="relative bg-white shadow-lg rounded-2xl p-5 hover:shadow-2xl transition-transform transform hover:scale-110 cursor-pointer flex flex-col items-center text-center"
              onClick={() => navigate(`/${game.route}`)}
            >
              <div className="flex items-center justify-center mb-4 text-7xl h-24 w-24 bg-blue-100 rounded-full">
                {game.image}
              </div>
              <h2 className="text-xl font-bold text-blue-700 mb-2">{game.name}</h2>
              <p className="text-gray-600 text-sm mb-4">{game.description}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/${game.route}`);
                }}
                className="px-6 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-all"
              >
                Start Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SignLanguageDashboard;