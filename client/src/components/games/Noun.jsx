// This React code creates a "Guess The Emoji" game where players identify emojis and their English meanings by selecting the correct Hindi translation from multiple-choice options.

import { useState, useEffect } from 'react';

const GuessTheEmoji = () => {
  // Array of question objects, each containing an emoji, its English meaning,
  // the correct Hindi translation, and a list of options.
  const questions = [
    { emoji: "🏡", english: "House", correct: "घर", options: ["विद्यालय", "बाजार", "घर"] },
    { emoji: "🏫", english: "School", correct: "विद्यालय", options: ["घर", "विद्यालय", "लड़का"] },
    { emoji: "🛍", english: "Market", correct: "बाजार", options: ["शिक्षक", "बाजार", "पुस्तक"] },
    { emoji: "🍏", english: "Apple", correct: "सेब", options: ["सेब", "लड़की", "कुर्सी"] },
    { emoji: "📚", english: "Book", correct: "पुस्तक", options: ["पुस्तक", "घर", "विद्यालय"] },
    { emoji: "🪑", english: "Chair", correct: "कुर्सी", options: ["लड़का", "कुर्सी", "शिक्षक"] },
    { emoji: "👦", english: "Boy", correct: "लड़का", options: ["लड़का", "बाजार", "विद्यालय"] },
    { emoji: "👩", english: "Girl", correct: "लड़की", options: ["घर", "लड़की", "कुर्सी"] },
    { emoji: "👨‍🏫", english: "Teacher", correct: "शिक्षक", options: ["शिक्षक", "बाजार", "सेब"] },
    { emoji: "🚗", english: "Car", correct: "गाड़ी", options: ["गाड़ी", "घर", "विद्यालय"] }
  ];

  // State to keep track of the current question being displayed.
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // State to store the player's score.
  const [score, setScore] = useState(0);
  // State to display feedback to the user (e.g., "Correct!", "Wrong!").
  const [result, setResult] = useState('');
  // State to indicate if the game has ended.
  const [gameOver, setGameOver] = useState(false);
  // State to control if the user can currently click an answer option (prevents multiple clicks).
  const [canAnswer, setCanAnswer] = useState(true);

  // Function to play the pronunciation of a given word using Web Speech API.
  const playSound = (word) => {
    // Check if the Web Speech API is supported by the browser.
    if ('speechSynthesis' in window) {
      // Cancel any speech that is currently in progress to avoid overlapping.
      window.speechSynthesis.cancel();

      // Create a new SpeechSynthesisUtterance object with the word to be spoken.
      const msg = new SpeechSynthesisUtterance(word);
      // Set the language to Hindi (India).
      msg.lang = "hi-IN";

      // Get all available voices and try to find a Hindi voice.
      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(voice => voice.lang.includes('hi-IN'));
      // If a Hindi voice is found, assign it to the utterance.
      if (hindiVoice) {
        msg.voice = hindiVoice;
      }

      // Speak the utterance.
      window.speechSynthesis.speak(msg);
    }
  };

  // Function to check the selected answer against the correct answer.
  const checkAnswer = (selected) => {
    // Prevent answering if not allowed or if the game is over.
    if (!canAnswer || gameOver) return;

    // Disable answering temporarily to prevent rapid multiple clicks.
    setCanAnswer(false);
    // Get the current question object.
    const question = questions[currentQuestionIndex];

    // Check if the selected option is the correct answer.
    if (selected === question.correct) {
      setResult("सही उत्तर! 🎉"); // Set success message.
      setScore(prevScore => prevScore + 1); // Increment score.
      playSound(question.correct); // Play the correct Hindi word.
    } else {
      setResult("गलत उत्तर! ❌"); // Set wrong answer message.
      playSound(question.correct); // Still play the correct word for learning purposes.
    }

    // Set a timeout to proceed to the next question or end the game.
    setTimeout(() => {
      // If there are more questions, move to the next one.
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1); // Move to next question.
        setResult(''); // Clear the result message.
        setCanAnswer(true); // Re-enable answering.
      } else {
        // If all questions are answered, end the game.
        setGameOver(true);
        // Display final score. Note: The score is updated *after* the current question's check.
        setResult(`खेल समाप्त! 🎉 आपका स्कोर: ${score + (selected === question.correct ? 1 : 0)}/${questions.length}`);
      }
    }, 1500); // Wait for 1.5 seconds before moving on.
  };

  // Function to reset the game to its initial state.
  const restartGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setResult('');
    setGameOver(false);
    setCanAnswer(true);
  };

  // useEffect hook to load speech synthesis voices when the component mounts.
  // This is important because voices might not be immediately available.
  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices(); // Populate the voices list.
    };
    loadVoices(); // Call initially.
    // Listen for the 'voiceschanged' event, which fires when voices become available or change.
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []); // Empty dependency array ensures this runs only once on mount.

  // Get the current question object based on the currentQuestionIndex state.
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-purple-800 mb-8">Emoji पहचानो</h1>

      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full text-center">
        {/* Display the current emoji with an animation */}
        <div className="text-8xl mb-6 animate-bounce">{currentQuestion.emoji}</div>

        {/* Display the English meaning and a button to play the Hindi pronunciation */}
        <div className="text-xl font-medium mb-6 flex items-center justify-center gap-2">
          {currentQuestion.english}
          <button
            onClick={() => playSound(currentQuestion.correct)}
            className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
            aria-label="Play sound"
          >
            🔊
          </button>
        </div>

        {/* Grid for answer options */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => checkAnswer(option)}
              disabled={!canAnswer || gameOver} // Disable if not allowed to answer or game is over.
              className={`px-6 py-3 text-lg font-medium text-white
                ${!canAnswer && option === currentQuestion.correct
                  ? 'bg-green-500' // Highlight correct answer in green after selection
                  : 'bg-blue-500 hover:bg-blue-600'}
                rounded-lg transition-all focus:outline-none
                disabled:opacity-75 disabled:cursor-not-allowed`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Display feedback message (correct/wrong/game over) */}
        {result && (
          <p className={`text-xl font-bold mb-4 ${
            result.includes('सही') ? 'text-green-500' :
            result.includes('गलत') ? 'text-red-500' :
            'text-purple-600'
          }`}>
            {result}
          </p>
        )}

        {/* Display current score */}
        <p className="text-xl font-bold text-gray-700">
          स्कोर: {score}/{questions.length}
        </p>

        {/* Restart game button, shown only when game is over */}
        {gameOver && (
          <button
            onClick={restartGame}
            className="mt-6 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            फिर से खेलें
          </button>
        )}
      </div>
    </div>
  );
};

export default GuessTheEmoji;