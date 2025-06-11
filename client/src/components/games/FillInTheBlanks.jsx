import { useState, useEffect } from "react";

// An array of objects, where each object represents a single "fill in the blank" question.
const sentences = [
  {
    text: "यह बिल्ली है।", // The full correct sentence in Hindi.
    english: "This is a cat.", // The English translation to show after answering.
    missing: "बिल्ली", // The word that is hidden from the user.
    options: ["कुत्ता", "बिल्ली", "गाय"], // The multiple-choice options for the user.
  },
  {
    text: "यह घर है।",
    english: "This is a house.",
    missing: "घर",
    options: ["गाड़ी", "घर", "पानी"],
  },
  {
    text: "यह जल है।",
    english: "This is water.",
    missing: "जल",
    options: ["जल", "हवा", "आग"],
  },
];

/**
 * A React component that creates a "Fill in the Blanks" game for learning Hindi.
 * It presents a sentence with a missing word and asks the user to choose the correct option.
 * It also features text-to-speech to read the sentences aloud.
 */
const FillInTheBlanks = () => {
  // --- State Management ---

  // `currentQuestion`: Tracks the index of the question currently being displayed from the `sentences` array.
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  // `selectedAnswer`: Stores the option the user has clicked. `null` if no answer is selected yet.
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  
  // `showNextButton`: A boolean flag to control the visibility of the "Next" button. It appears only after a correct answer.
  const [showNextButton, setShowNextButton] = useState(false);
  
  // `showTranslation`: A boolean flag to reveal the full sentence and its English translation after a correct answer.
  const [showTranslation, setShowTranslation] = useState(false);

  // --- Helper Functions ---

  /**
   * Replaces the missing word in a sentence with a blank line ("___").
   * @param {string} sentence - The original sentence.
   * @param {string} missingWord - The word to be replaced.
   * @returns {string} The sentence with the blank.
   */
  const generateSentence = (sentence, missingWord) => {
    return sentence.replace(missingWord, "___");
  };

  /**
   * Uses the browser's Web Speech API to read a sentence aloud in Hindi.
   * @param {string} sentence - The text to be spoken.
   */
  const speakSentence = (sentence) => {
    // Create a new speech synthesis object.
    const utterance = new SpeechSynthesisUtterance(sentence);
    // Set the language to Hindi (India).
    utterance.lang = "hi-IN";
    // Set a slightly slower speech rate for clarity.
    utterance.rate = 0.8;
    // Speak the text.
    window.speechSynthesis.speak(utterance);
  };

  // --- Side Effects ---

  /**
   * This `useEffect` hook runs automatically whenever the `currentQuestion` state changes.
   * Its purpose is to read the new question's sentence aloud as soon as it appears.
   */
  useEffect(() => {
    const sentence = sentences[currentQuestion].text;
    speakSentence(sentence);
  }, [currentQuestion]); // The dependency array ensures this effect only runs when `currentQuestion` changes.

  // --- Event Handlers ---

  /**
   * Handles the logic when a user clicks on one of the answer options.
   * @param {string} option - The answer option that was clicked.
   */
  const handleAnswer = (option) => {
    setSelectedAnswer(option);
    // Check if the selected option is the correct one.
    if (option === sentences[currentQuestion].missing) {
      // If correct, show the "Next" button and reveal the full sentence/translation.
      setShowNextButton(true);
      setShowTranslation(true);
    }
    // Note: Incorrect answers are implicitly handled by not showing the "Next" button.
  };

  /**
   * Handles the logic for the "Next" button click.
   */
  const handleNext = () => {
    // Check if there are more questions left.
    if (currentQuestion < sentences.length - 1) {
      // If so, move to the next question.
      setCurrentQuestion(currentQuestion + 1);
      // Reset the state for the new question.
      setSelectedAnswer(null);
      setShowNextButton(false);
      setShowTranslation(false);
    } else {
      // If it's the last question, show a completion alert.
      alert("शाबाश! आपने सब सवाल हल कर लिए।"); // "Well done! You have solved all the questions."
    }
  };

  // --- JSX Rendering ---

  return (
    <div className="bg-gradient-to-b from-purple-300 via-pink-200 to-white min-h-screen flex flex-col items-center">
      <div className="w-full max-w-3xl mx-auto p-6 flex flex-col items-center mt-60">
        <h1 className="text-2xl font-bold text-green-600 mb-6 text-center">खाली जगह भरो</h1> {/* Title: "Fill in the blanks" */}

        <div className="mb-8 text-center">
          {/* Conditionally render the question or the answer. */}
          {!showTranslation ? (
            // Before answering correctly, show the sentence with a blank.
            <p className="text-xl mb-4">
              {generateSentence(
                sentences[currentQuestion].text,
                sentences[currentQuestion].missing
              )}
            </p>
          ) : (
            // After answering correctly, show the full sentence and translation.
            <div className="animate-fadeIn">
              <p className="text-xl font-semibold text-green-600 mb-2">
                {sentences[currentQuestion].text}
              </p>
              <p className="text-lg text-gray-600">
                {sentences[currentQuestion].english}
              </p>
            </div>
          )}

          {/* Speaker button to allow the user to hear the sentence again. */}
          <button
            className="text-2xl bg-none border-none cursor-pointer transform hover:scale-110 mt-4"
            onClick={() => speakSentence(sentences[currentQuestion].text)}
          >
            🔊
          </button>
        </div>

        {/* Container for the multiple-choice options. */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {sentences[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              // Disable buttons after the correct answer has been chosen.
              disabled={showNextButton}
              // Dynamically apply styles based on the selection state.
              className={`px-6 py-3 text-lg rounded-md transition-all 
                ${
                  // If this option was selected AND it was the correct answer, make it green.
                  selectedAnswer === option && option === sentences[currentQuestion].missing
                    ? "bg-green-500 text-white"
                    // Otherwise, use default styling.
                    : "bg-gray-100 hover:bg-gray-200"
                }
              `}
            >
              {option}
            </button>
          ))}
        </div>

        {/* The "Next" button is only rendered if `showNextButton` is true. */}
        {showNextButton && (
          <button
            onClick={handleNext}
            className="px-6 py-3 text-lg rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-all"
          >
            {/* The button text changes on the last question. */}
            {currentQuestion < sentences.length - 1 ? "अगला सवाल" : "समाप्त"} {/* "Next Question" or "Finish" */}
          </button>
        )}
      </div>
    </div>
  );
};

export default FillInTheBlanks;