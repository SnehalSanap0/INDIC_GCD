import { useNavigate } from "react-router-dom";

const games = [
  {
    name: "Habit 1",
    description: "Doing homework daily helps you learn and grow!",
    route: "habit1",
    image: "📚",
  },
  {
    name: "Habit 2",
    description: "Brushing your teeth keeps them strong and healthy!",
    route: "habit2",
    image: "🪥",
  },
  {
    name: "Habit 3",
    description: "Respecting elders shows kindness and good manners!",
    route: "habit3",
    image: "🙏",
  },
  {
    name: "Habit 4",
    description: "Keeping your surroundings clean makes life better!",
    route: "habit4",
    image: "🧹",
  },
  {
    name: "Habit 5",
    description: "Should you pick your nose? Think wisely!",
    route: "habit5",
    image: "👃",
  },
  {
    name: "Habit 6",
    description: "Skipping a bath daily? Hygiene matters!",
    route: "habit6",
    image: "🚿",
  },
];
  

const LearningDashboard = () => {
  const navigate = useNavigate();

  return (
    // <div className="min-h-screen bg-gradient-to-b from-emerald-400 to-lime-200 p-8 flex items-center justify-center">
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div 
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" 
          aria-hidden="true"
        >
          <div 
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" 
            style={{
              clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
            }}
          />
          <div 
  className="relative left-[calc(50%+11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[-30deg] bg-gradient-to-bl from-[#9089fc] to-[#ff80b5] opacity-30 sm:left-[calc(50%+30rem)] sm:w-[72.1875rem]" 
  style={{
    clipPath: "polygon(74.1% 44.1%, 76.1% 97.7%, 27.6% 76.8%, 17.9% 100%, 0.1% 64.9%, 27.5% 76.7%, 45.2% 34.5%, 47.5% 58.3%, 52.4% 68.1%, 60.2% 62.4%, 72.5% 32.5%, 80.7% 2%, 85.5% 0.1%, 97.5% 26.9%, 100% 61.6%, 74.1% 44.1%)"
  }}
/>
        </div>
      {/* Centered Content */}
      <div className="flex flex-col items-center justify-center w-full pt-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {games.map((game, index) => (
            <div
            key={index}
            className="relative backdrop-blur-md  bg-white/20 border border-white/40 shadow-lg rounded-2xl p-5 hover:shadow-2xl transition-transform transform hover:scale-110 cursor-pointer flex flex-col items-center text-center overflow-hidden"
            onClick={() => navigate(`/${game.route}`)}
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
          
            {/* Genre Badge */}
            <div className="absolute top-4 right-4 z-10">
              {/* <span className="px-3 py-1 text-xs font-semibold bg-blue-100/80 backdrop-blur-sm text-blue-800 rounded-full border border-blue-200/50">
                {game.genre}
              </span> */}
            </div>
            
            <div className="flex items-center justify-center mb-4 text-7xl h-24 w-24 bg-purple-100/40 backdrop-blur-sm rounded-full border border-purple-200/50 z-10">
              {game.image}
            </div>
            
            <h2 className="text-xl font-bold text-blue-800 mb-2 z-10">{game.name}</h2>
            <p className="text-gray-600 text-sm mb-4 z-10">{game.description}</p>
            
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

export default LearningDashboard;