// This React code creates a "Sentence Building Game" where players construct the English translation of a given Hindi sentence by dragging and dropping (or clicking) word blocks.

import { useState, useEffect, useCallback } from "react";

// Defines the array of sentences for the game.
// Each object includes the Hindi sentence, its English translation, romanized version,
// an array of correct English words, and an array of extra, misleading words.
const sentences = [
  {
    hindi: "आज का मौसम अच्छा है।",
    english: "The weather is nice today.",
    romanized: "Aaj ka mausam accha hai.",
    words: ["The", "weather", "is", "nice", "today"],
    extraWords: ["beautiful", "cold", "was", "will", "morning"]
  },
  {
    hindi: "मुझे यात्रा करना पसंद है।",
    english: "I like to travel.",
    romanized: "Mujhe yatra karna pasand hai.",
    words: ["I", "like", "to", "travel"],
    extraWords: ["want", "love", "hate", "going", "we"]
  },
  {
    hindi: "वह बहुत समझदार है।",
    english: "He/She is very wise.",
    romanized: "Woh bahut samajhdar hai.",
    words: ["He/She", "is", "very", "wise"],
    extraWords: ["they", "are", "was", "smart", "good"]
  },
  {
    hindi: "मेरे पास एक किताब है।",
    english: "I have a book.",
    romanized: "Mere paas ek kitaab hai.",
    words: ["I", "have", "a", "book"],
    extraWords: ["the", "had", "pen", "many", "will"]
  },
  {
    hindi: "हम शाम को पार्क में जाएंगे।",
    english: "We will go to the park in the evening.",
    romanized: "Hum shaam ko park mein jaayenge.",
    words: ["We", "will", "go", "to", "the", "park", "in", "the", "evening"],
    extraWords: ["morning", "today", "tomorrow", "they", "walk"]
  }
];

const Sentence = () => {
  // State to track the index of the current sentence in the `sentences` array.
  const [currentQuestion, setCurrentQuestion] = useState(0);
  // State to store words selected by the user to form their sentence.
  const [selectedWords, setSelectedWords] = useState([]);
  // State to store words available for selection (shuffled correct words + extra words).
  const [availableWords, setAvailableWords] = useState([]);
  // State to control visibility of the correct English translation.
  const [showTranslation, setShowTranslation] = useState(false);
  // State to indicate if the user's last answer was incorrect.
  const [isError, setIsError] = useState(false);
  // State to hold a feedback message for the user (e.g., "Correct!", "Wrong!").
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  // State to highlight the correct answer visually when a correct answer is given.
  const [highlightCorrect, setHighlightCorrect] = useState(false);

  // Memoized callback function to shuffle an array.
  // It creates a shallow copy to avoid mutating the original array.
  const shuffleArray = useCallback((array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }, []); // No dependencies, so it's created once.

  // Memoized callback function to initialize available words for the current question.
  // It combines correct words and extra words, then shuffles them.
  const initializeWords = useCallback(() => {
    const currentSentence = sentences[currentQuestion];
    const allWords = [...currentSentence.words, ...currentSentence.extraWords];
    setSelectedWords([]); // Clear any previously selected words for the new question.
    setAvailableWords(shuffleArray(allWords)); // Set shuffled words as available.
  }, [currentQuestion, shuffleArray]); // Re-initialize when currentQuestion or shuffleArray changes.

  // Memoized callback function to speak the current Hindi sentence using Web Speech API.
  const speakSentence = useCallback(() => {
    // Create a new SpeechSynthesisUtterance with the Hindi text.
    const utterance = new SpeechSynthesisUtterance(sentences[currentQuestion].hindi);
    utterance.lang = "hi-IN"; // Set language to Hindi.
    utterance.rate = 0.8;    // Set speech rate.
    window.speechSynthesis.speak(utterance); // Speak the sentence.
  }, [currentQuestion]); // Re-speak when currentQuestion changes.

  // useEffect hook to initialize words and speak the sentence when the component mounts
  // or when `currentQuestion` changes.
  useEffect(() => {
    initializeWords(); // Set up words for the current question.
    speakSentence();   // Speak the Hindi sentence.
  }, [initializeWords, speakSentence]); // Dependencies ensure this runs when initial words or speech changes.

  // Handler for when a word from the available words pool is selected.
  const handleWordSelect = (word) => {
    // Only add the word if it's not already in selectedWords.
    if (!selectedWords.includes(word)) {
      setSelectedWords([...selectedWords, word]); // Add word to selected list.
      setAvailableWords(availableWords.filter((w) => w !== word)); // Remove word from available list.
      setIsError(false); // Clear any previous error state.
    }
  };

  // Handler for when a word from the selected words area is removed.
  const handleWordRemove = (word, index) => {
    const newSelected = [...selectedWords];
    newSelected.splice(index, 1); // Remove word at the specified index.
    setSelectedWords(newSelected); // Update selected words.
    setAvailableWords([...availableWords, word]); // Add word back to available words.
    setIsError(false); // Clear any previous error state.
  };

  // Handler to check the user's constructed sentence against the correct answer.
  const checkAnswer = () => {
    // Join the correct words to form the complete correct sentence string.
    const correctSentence = sentences[currentQuestion].words.join(" ");
    // Join the user's selected words to form their sentence string.
    const userSentence = selectedWords.join(" ");

    // Compare the user's sentence with the correct sentence.
    if (correctSentence === userSentence) {
      setShowTranslation(true);     // Show the correct English translation.
      setIsError(false);           // Clear error state.
      setHighlightCorrect(true);   // Highlight the Hindi sentence area green.
      setFeedbackMessage("Correct Answer! 🎉"); // Set success message.

      // After a short delay, move to the next question or end the game.
      setTimeout(() => {
        setFeedbackMessage(null);     // Clear feedback message.
        if (currentQuestion < sentences.length - 1) {
          setCurrentQuestion(currentQuestion + 1); // Move to next question.
          setSelectedWords([]);         // Clear selected words for the next question.
          setShowTranslation(false);    // Hide translation.
          setHighlightCorrect(false);   // Remove highlighting.
        } else {
          // If all questions are answered, show a completion alert.
          alert("आप सभी सवालों को हल कर चुके हैं! (You have solved all questions!)");
          // Optionally, you could reset the game here or navigate elsewhere.
        }
      }, 2000); // 2-second delay for feedback.
    } else {
      setIsError(true); // Set error state.
      setFeedbackMessage("Wrong Answer! Try again. ❌"); // Set error message.

      // After a short delay, reset for another attempt.
      setTimeout(() => {
        setFeedbackMessage(null); // Clear feedback message.
        // Combine all words (selected and available) and re-shuffle them.
        const allWords = [...selectedWords, ...availableWords];
        setSelectedWords([]); // Clear selected words.
        setAvailableWords(shuffleArray(allWords)); // Reset available words by shuffling.
        setIsError(false); // Clear error state.
      }, 1500); // 1.5-second delay for feedback.
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-purple-300 via-pink-200 to-white flex items-center justify-center">
      <div className="max-w-3xl w-full mx-auto p-5 font-sans">
        <h1 className="text-2xl text-center font-bold text-purple-700 mb-6">Translate this sentence</h1>

        <div className="mb-8 flex items-center justify-center">
          {/* Button to play the Hindi sentence aloud */}
          <button
            onClick={speakSentence}
            className="text-2xl bg-none border-none cursor-pointer focus:outline-none mr-4"
          >
            🔊
          </button>
          {/* Display area for the Hindi sentence */}
          <div
            className={`px-6 py-4 rounded-lg shadow-lg text-lg ${
              highlightCorrect ? "bg-green-100 border-2 border-green-500" : // Green border for correct answer
              isError ? "bg-red-100 border-2 border-red-500" :             // Red border for wrong answer
              "bg-white border"                                           // Default white background
            }`}
          >
            {sentences[currentQuestion].hindi}
          </div>
        </div>

        {/* Display the correct English translation (shown after correct answer) */}
        {showTranslation && (
          <div className="bg-gray-100 px-4 py-3 rounded-md shadow-md text-center mb-4">
            <p className="text-base text-gray-600">{sentences[currentQuestion].english}</p>
          </div>
        )}

        {/* Feedback message display */}
        {feedbackMessage && (
          <div className={`px-4 py-2 rounded-md text-center mb-4 font-semibold ${
            highlightCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}>{feedbackMessage}</div>
        )}

        {/* Area where selected words are displayed (user's sentence) */}
        <div className="flex flex-wrap gap-3 p-3 bg-purple-100 border-2 border-purple-300 rounded-lg min-h-[80px] mb-5">
          {selectedWords.map((word, index) => (
            <button
              key={index} // Index as key is okay here since words are unique per state update and order matters.
              className="px-4 py-2 bg-purple-200 text-purple-800 rounded-lg shadow-md focus:outline-none"
              onClick={() => handleWordRemove(word, index)} // Click to remove word.
            >
              {word}
            </button>
          ))}
        </div>

        {/* Area for available words to choose from */}
        <div className="flex flex-wrap gap-3 p-3 bg-gray-100 border-2 border-gray-300 rounded-lg min-h-[80px] mb-6">
          {availableWords.map((word, index) => (
            <button
              key={index} // Index as key is okay here since words are unique per state update and order matters.
              className="px-4 py-2 bg-white text-gray-800 rounded-lg shadow-md hover:bg-gray-200 focus:outline-none"
              onClick={() => handleWordSelect(word)} // Click to select word.
            >
              {word}
            </button>
          ))}
        </div>

        {/* Check Answer button */}
        <button
          className={`w-full px-6 py-3 rounded-lg text-white font-bold transition-all ${
            selectedWords.length > 0
              ? "bg-purple-600 hover:bg-purple-700" // Enabled state styling.
              : "bg-gray-300 cursor-not-allowed"   // Disabled state styling.
          } ${isError ? "bg-red-500" : ""}`}      // Apply red background if there's an error.
          onClick={checkAnswer}
          disabled={selectedWords.length === 0} // Disable if no words are selected.
        >
          CHECK
        </button>
      </div>
    </div>
  );
};

export default Sentence;