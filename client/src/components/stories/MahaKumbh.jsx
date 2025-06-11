// This React component, `MahaKumbh`, displays a video titled "प्रतापपुर के नन्हे खोजी और महाकुंभ का रहस्य!"
// (The Little Explorers of Pratapur and the Secret of the Mahakumbh!) within a well-styled and responsive container.

// `useState` is commented out as it's not used in this particular component.
// import { useState } from "react"; 

export const MahaKumbh = () => {
  return (
    // The main container for the component, setting up a full-height,
    // centered layout with a blue gradient background and some padding.
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-300 to-blue-100 p-5 pt-18">
      {/* This inner div acts as a card, containing the video and its title.
          It has a maximum width, white background, shadow, and rounded corners. */}
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Padding and text alignment for the content within the card. */}
        <div className="p-4 text-center">
          {/* The title of the story/video in Hindi. */}
          <h1 className="text-2xl font-bold text-gray-800 mb-4">प्रतापपुर के नन्हे खोजी और महाकुंभ का रहस्य!</h1>
          {/* The video element:
              - `src`: Points to the video file.
              - `controls`: Enables the browser's native video playback controls (play, pause, volume, etc.).
              - `className`: Applies Tailwind CSS classes to make the video responsive (full width, auto height),
                give it rounded corners, and add some bottom margin. */}
          <video
            src="story/videos/mahakumbh.mp4" // The path to the video file.
            controls
            className="w-full h-auto rounded-lg mb-4" // Responsive and styled video element.
          />
        </div>
      </div>
    </div>
  );
};

export default MahaKumbh;