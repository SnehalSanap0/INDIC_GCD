import React, { useEffect } from 'react';

const ThoughtBubble = ({ currentLesson, lessons }) => {
  const currentLessonData = lessons[currentLesson];
  const word = currentLessonData?.expected || '';
  
  // Create a consistent filename from the Hindi word
  const getImageFileName = (hindiWord) => {
    const wordMap = {
      'अनार': 'anaar',
      'आम': 'aam',
      'इमली': 'imli',
      'ईख': 'eekh',
      'उल्लू': 'ullu',
      'ऊन': 'oon',
      'एप्पल': 'apple',
      'ऐनक': 'ainak',
      'ओखली': 'okhli',
      'औरत': 'aurat',
      'अंगूर': 'angoor'
    };
    
    return wordMap[hindiWord] || hindiWord.toLowerCase();
  };

  const imagePath = `/images/${getImageFileName(word)}.png`;

  useEffect(() => {
    if (currentLesson && currentLesson !== 0) {
      console.log('Current lesson:', currentLesson);
      console.log('Current word:', word);
      console.log('Image path:', imagePath);
    }
  }, [currentLesson, word, imagePath]);

  if (!currentLesson || currentLesson === 0) return null;

  return (
    <div className="absolute top-12 right-16 z-40 pointer-events-none">
      <div className="relative">
        <div className="flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg animate-bounce-slow p-2">
          <img 
            src={imagePath}
            alt={word}
            className="max-w-[60px] max-h-[60px] w-auto h-auto object-contain rounded-full"
            onError={(e) => {
              console.error(`Failed to load image: ${imagePath}`);
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = `<div class="text-2xl text-orange-500">${word}</div>`;
            }}
          />
        </div>
      </div>
    </div>
  );
};

// Add custom animation to Tailwind config if not already present
const tailwindConfig = {
  theme: {
    extend: {
      animation: {
        'bounce-slow': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
};

export default ThoughtBubble;