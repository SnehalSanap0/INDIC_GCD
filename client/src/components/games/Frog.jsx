// This React code creates a "Frog Jump" game where players help a frog jump to the correct Hindi vowel displayed as a target.

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

export default function Frog() {
  // Memoize the array of Hindi vowels to prevent unnecessary re-renders.
  // This array represents the targets the frog needs to jump to.
  const hindi_vowels = useMemo(() => [
    'अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ',
    'ए', 'ऐ', 'ओ', 'औ', 'अं', 'अः'
  ], []);

  // State to hold the current Hindi vowel the frog needs to jump to.
  const [currentTarget, setCurrentTarget] = useState('');
  // State to keep track of the player's score.
  const [score, setScore] = useState(0);
  // State to control if the frog can currently make a jump.
  const [canJump, setCanJump] = useState(true);
  // State to manage the frog's position on the screen.
  const [frogPosition, setFrogPosition] = useState({ x: 0, y: 0 });
  // State to indicate if the frog is currently in the middle of a jump animation.
  const [isJumping, setIsJumping] = useState(false);

  // Ref to directly access the DOM element of the frog character.
  const characterRef = useRef(null);
  // Ref to directly access the DOM element containing all the vowel platforms.
  const platformsContainerRef = useRef(null);

  // Ref to store Audio objects for correct and wrong sounds.
  // This prevents recreating Audio objects on every render.
  const soundsRef = useRef({
    correct: new Audio('data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjIwLjEwMAAAAAAAAAAAAAAA//tUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAAFWgDMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjM1AAAAAAAAAAAAAAAAJAAAAAAAAAAAAQVa+I2kXwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sUZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU='),
    wrong: new Audio('data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjIwLjEwMAAAAAAAAAAAAAAA//tUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAAFWgDMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjM1AAAAAAAAAAAAAAAAJAAAAAAAAAAAAQVa+I2kXwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sUZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=')
  });

  // Callback to set a new random target vowel.
  // It only sets a new target if there isn't one already (for initial load).
  const setNewTarget = useCallback(() => {
    setCurrentTarget(prevTarget => {
      if (!prevTarget) {
        return hindi_vowels[Math.floor(Math.random() * hindi_vowels.length)];
      }
      return prevTarget;
    });
  }, [hindi_vowels]); // Dependency on hindi_vowels ensures this updates if the list changes.

  // Callback function to handle the frog's jump animation to a specified platform.
  const jumpToPlatform = useCallback((platform) => {
    // Prevent jumping if not allowed.
    if (!canJump) return;

    // Disable further jumps and set jumping state to true.
    setCanJump(false);
    setIsJumping(true);

    // Get the bounding rectangles for the platform and the container to calculate target position.
    const platformRect = platform.getBoundingClientRect();
    const containerRect = platformsContainerRef.current.getBoundingClientRect();

    // Calculate the target X and Y coordinates for the frog.
    // X is relative to the container's left edge.
    // Y is calculated from the bottom of the container, adjusting for platform height.
    const targetX = platformRect.left - containerRect.left;
    const targetY = containerRect.height - (platformRect.bottom - containerRect.top);

    let startTime = null; // To track the start time of the animation.
    const duration = 600; // Duration of the jump animation in milliseconds.
    const jumpHeight = 150; // Maximum height of the jump arc.

    // Animation loop using requestAnimationFrame for smooth movement.
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp; // Initialize startTime on the first frame.
      const progress = (timestamp - startTime) / duration; // Calculate animation progress (0 to 1).

      if (progress < 1) {
        // Calculate interpolated X position.
        const x = frogPosition.x + (targetX - frogPosition.x) * progress;
        // Calculate Y position with a sine wave for an arc effect.
        const y = targetY + Math.sin(progress * Math.PI) * jumpHeight;

        // Update frog's position.
        setFrogPosition({ x, y });
        // Continue the animation.
        requestAnimationFrame(animate);
      } else {
        // When animation is complete, set final position.
        setFrogPosition({ x: targetX, y: targetY });
        setIsJumping(false); // End jumping state.
        soundsRef.current.correct.play(); // Play correct sound.
        setScore(prev => prev + 1); // Increment score.

        // After a short delay, set a new target vowel and enable jumping again.
        setTimeout(() => {
          setCurrentTarget(hindi_vowels[Math.floor(Math.random() * hindi_vowels.length)]);
          setCanJump(true);
        }, 500);
      }
    };

    // Start the animation.
    requestAnimationFrame(animate);
  }, [canJump, frogPosition, hindi_vowels]); // Dependencies for useCallback.

  // Callback function to handle a click or keyboard jump action.
  const handleJump = useCallback((platform) => {
    if (!canJump) return; // Prevent jump if not allowed.

    const vowel = platform.dataset.vowel; // Get the vowel associated with the clicked platform.

    if (vowel === currentTarget) {
      // If the correct vowel is jumped to, initiate the jump animation.
      jumpToPlatform(platform);
    } else {
      // If it's a wrong jump, play wrong sound and add a shake animation.
      soundsRef.current.wrong.play();
      platform.classList.add('animate-shake'); // Tailwind CSS class for shaking.
      setTimeout(() => platform.classList.remove('animate-shake'), 500); // Remove shake after 500ms.
    }
  }, [canJump, currentTarget, jumpToPlatform]); // Dependencies for useCallback.

  // Callback function to handle keyboard input for jumping.
  const handleKeyDown = useCallback((e) => {
    // Map keyboard keys '1' through '0', then 'q', 'w', 'e' to platform indices.
    const index = '1234567890qwe'.indexOf(e.key);
    // Check if the pressed key corresponds to a valid platform index.
    if (index >= 0 && index < hindi_vowels.length) {
      // Get the corresponding platform DOM element.
      const platform = platformsContainerRef.current?.children[index];
      if (platform) handleJump(platform); // If platform exists, trigger handleJump.
    }
  }, [hindi_vowels, handleJump]); // Dependencies for useCallback.

  // Effect hook to set up the initial target and event listeners.
  useEffect(() => {
    setNewTarget(); // Set the first target vowel when the component mounts.
    document.addEventListener('keydown', handleKeyDown); // Add keyboard event listener.
    // Cleanup function to remove the event listener when the component unmounts.
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setNewTarget, handleKeyDown]); // Dependencies ensure effect re-runs if these change.

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-white flex flex-col items-center justify-center py-5">
      {/* Score and current target display */}
      <div className="flex gap-4 mb-5">
        <div className="bg-white/90 px-8 py-3 rounded-lg shadow-lg text-2xl w-48">
          Score: <span className="text-sky-600">{score}</span>
        </div>
        <div className="bg-white/90 px-8 py-3 rounded-lg shadow-lg text-2xl w-48">
          Jump to: <span className="text-sky-800">{currentTarget}</span>
        </div>
      </div>

      {/* Game area container */}
      <div className="relative w-[90%] max-w-4xl h-[70vh] bg-gradient-to-b from-sky-400 to-sky-600 rounded-2xl overflow-hidden shadow-xl">
        {/* Frog character */}
        <div
          ref={characterRef}
          style={{
            // Apply transform for position and rotation during jump.
            transform: `translate(${frogPosition.x}px, ${-frogPosition.y}px) ${isJumping ? 'rotate(180deg)' : 'rotate(0deg)'}`,
            bottom: 0, // Initial bottom position for the frog.
            left: 0,   // Initial left position for the frog.
            position: 'absolute'
          }}
          className="w-16 h-16 text-5xl transition-transform duration-100" // Basic styling and transition for frog.
        >
          🐸
        </div>
        {/* Platforms container */}
        <div
          ref={platformsContainerRef}
          className="absolute bottom-10 grid grid-cols-5 gap-6 p-6 w-full"
          style={{ top: '20px' }} // Adjusting the position to move platforms down from the top.
        >
          {/* Render each Hindi vowel as a clickable platform */}
          {hindi_vowels.map((vowel, index) => (
            <div
              key={index}
              data-vowel={vowel} // Store the vowel data on the element.
              onClick={(e) => handleJump(e.currentTarget)} // Attach click handler.
              className="aspect-square cursor-pointer group" // Styling for platform wrapper.
            >
              <div className="w-full h-full bg-pink-200 rounded-full flex items-center justify-center text-2xl font-bold shadow-md transition-transform duration-300 group-hover:-translate-y-1">
                {vowel} {/* Display the Hindi vowel */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}