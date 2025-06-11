import { useState } from "react";

export const HabitGame6 = () => {
  const [correct, setCorrect] = useState(false);

  const handleAnswer = (answer) => {
    const yesButton = document.getElementById("yesButton1");
    const noButton = document.getElementById("noButton1");

    if (answer === "No") {
      noButton.style.backgroundColor = "green";
      yesButton.style.backgroundColor = "#d1d5db"; // Reset Yes button color
      setCorrect(true);
      setTimeout(() => setCorrect(false), 1500); // Hide after 1.5s
    } else if (answer === "Yes") {
      yesButton.style.backgroundColor = "red";
      noButton.style.backgroundColor = "#d1d5db"; // Reset No button color
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-emerald-400 to-lime-200">
      <div className="w-[400px] h-[480px] bg-white rounded-2xl shadow-2xl flex flex-col justify-between p-6 relative">
        <div className="text-center flex flex-col items-center">
          <div className="text-xl font-bold mb-3">Should not bath daily?</div>
          <img
            src="/images/team/learnings/habit6.png"
            alt="Habit Image"
            className="w-[75%] h-auto mb-3"
          />
        </div>

        {/* Success Message */}
        {correct && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md text-lg font-bold animate-pulse">
            Correct! ✅
          </div>
        )}

        <div className="flex flex-col items-center gap-2 pb-3">
          <button
            id="yesButton1"
            className="bg-gray-100 text-black text-lg px-4 py-2 rounded-lg shadow-md w-3/4 hover:bg-white transition duration-200"
            onClick={() => handleAnswer("Yes")}
          >
            Yes
          </button>
          <button
            id="noButton1"
            className="bg-gray-100 text-black text-lg px-4 py-2 rounded-lg shadow-md w-3/4 hover:bg-white transition duration-200"
            onClick={() => handleAnswer("No")}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default HabitGame6;