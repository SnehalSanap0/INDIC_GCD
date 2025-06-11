// This React component, `Cleanliness`, displays a video titled "स्वच्छता की मिसाल: बच्चों का कमाल"
// (An Example of Cleanliness: The Children's Feat) within a responsive and styled container.

// import { useState } from "react"; // useState is not used in this component, so it can be removed.

export const Cleanliness = () => {
  return (
    // Main container for the component, setting minimum height,
    // background gradient, padding, and centering its children.
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-300 to-blue-100 p-5 pt-18">
      {/* Inner container for the video and title, with responsive width,
          shadow, rounded corners, and overflow handling. */}
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Padding and text alignment for the content inside the card. */}
        <div className="p-4 text-center">
          {/* Title of the video/story in Hindi. */}
          <h1 className="text-2xl font-bold text-gray-800 mb-4">स्वच्छता की मिसाल: बच्चों का कमाल</h1>
          {/* Video element:
              - `src`: Specifies the path to the video file.
              - `controls`: Adds default video controls (play/pause, volume, etc.).
              - `className`: Applies Tailwind CSS classes for full width,
                auto height adjustment, rounded corners, and bottom margin. */}
          <video
            src="story/videos/clean.mp4"
            controls
            className="w-full h-auto rounded-lg mb-4"
          />
        </div>
      </div>
    </div>
  );
};

export default Cleanliness;