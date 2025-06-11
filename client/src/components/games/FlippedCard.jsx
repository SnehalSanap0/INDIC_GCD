// This React component creates a "Flipped Card" memory game where players match pairs of Hindi words and their corresponding animal emojis.

import React, { useState, useEffect } from "react";

// Defines the initial set of cards for the game.
// Each card has an ID, a value (either Hindi text or an emoji),
// a 'match' property indicating its pair, and a 'type' to distinguish text from emoji.
const initialCards = [
  { id: 1, value: "कुत्ता", match: "🐶", type: "text" },
  { id: 2, value: "बिल्ली", match: "🐱", type: "text" },
  { id: 3, value: "हाथी", match: "🐘", type: "text" },
  { id: 7, value: "शेर", match: "🦁", type: "text" },
  { id: 9, value: "गाय", match: "🐮", type: "text" },
  { id: 12, value: "घोड़ा", match: "🐴", type: "text" },
  { id: 4, value: "🐶", match: "कुत्ता", type: "emoji" },
  { id: 5, value: "🐱", match: "बिल्ली", type: "emoji" },
  { id: 6, value: "🐘", match: "हाथी", type: "emoji" },
  { id: 8, value: "🦁", match: "शेर", type: "emoji" },
  { id: 10, value: "🐮", match: "गाय", type: "emoji" },
  { id: 11, value: "🐔", match: "मुर्गा", type: "emoji" }, // This card's match "मुर्गा" is not in the text cards
];

function FlippedCard() {
  // State to hold the current arrangement and status (matched, flipped) of all cards.
  const [cards, setCards] = useState([]);
  // State to store the cards that are currently flipped by the user (max 2 at a time).
  const [flippedCards, setFlippedCards] = useState([]);
  // State to disable further card clicks while a pair is being checked.
  const [disabled, setDisabled] = useState(false);
  // State to temporarily highlight a pair of cards that were incorrectly matched.
  const [wrongPair, setWrongPair] = useState([]);

  // useEffect hook to initialize and shuffle cards when the component mounts.
  useEffect(() => {
    const shuffledCards = initialCards
      // Shuffle the cards randomly.
      .sort(() => Math.random() - 0.5)
      // Assign a new unique ID to each card to help React's reconciliation,
      // especially important if cards are re-rendered after shuffling.
      .map((card) => ({ ...card, id: Math.random() }));
    setCards(shuffledCards); // Update the cards state.
  }, []); // Empty dependency array ensures this runs only once on mount.

  // Handler function for when a card is clicked (flipped).
  const handleFlip = (card) => {
    // If cards are disabled (meaning two cards are already flipped and being checked), do nothing.
    if (disabled) return;

    // Add the clicked card to the `flippedCards` array.
    setFlippedCards((prev) => [...prev, card]);

    // If this is the second card being flipped in a turn.
    if (flippedCards.length === 1) {
      setDisabled(true); // Disable further clicks immediately.

      const firstCard = flippedCards[0]; // Get the first flipped card.
      const secondCard = card;           // The current card is the second.

      // Check if the two flipped cards form a match.
      // A match occurs if the value of the first card matches the 'match' property of the second card,
      // OR if the 'match' property of the first card matches the value of the second card.
      if (
        firstCard.value === secondCard.match ||
        firstCard.match === secondCard.value
      ) {
        // If it's a match, update the 'matched' property for both cards in the `cards` state.
        setCards((prev) =>
          prev.map((c) =>
            // Check if the current card's value matches either of the flipped cards' values.
            // This assumes values are unique and directly link to their pairs.
            c.value === firstCard.value || c.value === secondCard.value
              ? { ...c, matched: true } // Mark as matched.
              : c // Otherwise, keep the card as is.
          )
        );
        resetTurn(); // Reset the turn (clear flipped cards, enable clicks).
      } else {
        // If it's not a match.
        setWrongPair([firstCard, secondCard]); // Highlight the incorrect pair.
        // After a short delay (1 second), hide the wrong pair and reset the turn.
        setTimeout(() => {
          setWrongPair([]); // Clear the wrong pair highlight.
          resetTurn();      // Reset the turn.
        }, 1000);
      }
    }
  };

  // Function to reset the state for the next turn.
  const resetTurn = () => {
    setFlippedCards([]); // Clear the list of flipped cards.
    setDisabled(false);   // Re-enable card clicks.
  };

  // Helper function to check if a card is part of the currently highlighted wrong pair.
  const isCardWrong = (card) => {
    return wrongPair.includes(card);
  };

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center p-5">
      <div className="grid grid-cols-4 gap-4 max-w-lg w-full">
        {/* Map through the cards state to render each card component */}
        {cards.map((card) => (
          <div
            key={card.id} // Use the unique ID for React's key prop.
            className={`relative w-full aspect-[4/5] perspective cursor-pointer`}
            // Click handler for the card:
            // Only allow flipping if the card is not already flipped and not yet matched.
            onClick={() =>
              !flippedCards.includes(card) && !card.matched && handleFlip(card)
            }
          >
            {/* The inner div represents the card's face that flips */}
            <div
              className={`absolute w-full h-full rounded-lg shadow-md flex justify-center items-center transition-transform duration-500 transform
                ${flippedCards.includes(card) || card.matched ? "rotate-y-0 bg-white" : "rotate-y-180 bg-blue-500"}
                ${card.matched ? "border-4 border-green-500" : ""}
                ${isCardWrong(card) ? "border-4 border-red-500" : ""}`}
              // CSS `rotate-y-0` shows the front, `rotate-y-180` shows the back.
              // `bg-white` for front, `bg-blue-500` for back.
              // Add green border if matched, red border if part of a wrong pair.
            >
              {/* Span to display the card's value (text or emoji) */}
              <span
                className={`${
                  // Show content only if card is flipped or matched.
                  flippedCards.includes(card) || card.matched
                    ? card.type === "emoji"
                      ? "text-5xl" // Larger text for emojis.
                      : "text-lg"  // Standard text size for Hindi words.
                    : "hidden"     // Hide content if card is face down.
                }`}
              >
                {card.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FlippedCard;