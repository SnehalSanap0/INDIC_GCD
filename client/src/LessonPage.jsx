// Core Imports
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Components
import Avatar from './Avatar';
import ThoughtBubble from './ThoughtBubble';
import { useSpeechState } from './Avatar';

// Icons
import { ArrowLeft, Play, Mic, GamepadIcon } from 'lucide-react';

function LessonPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Fallback in case route state is missing
  const { levelFile, userId } = location.state || { levelFile: 'swar.json', userId: 'guest' };

  // Global speech context
  const { isTeaching, setIsTeaching, setIsClapping, setBowing } = useSpeechState();

  // State management
  const [highlightedWord, setHighlightedWord] = useState('');
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [lessonText, setLessonText] = useState('');
  const [englishText, setEnglishText] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [speechResult, setSpeechResult] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 🔄 Load lessons and progress
  useEffect(() => {
    const loadLessons = async () => {
      try {
        if (!userId) return console.error("❌ No username found!");

        setIsLoading(true);

        const response = await fetch(`/syllabus/${levelFile}`);
        if (!response.ok) throw new Error("Failed to load lesson data");

        const data = await response.json();
        setLessons(data);

        const progressResponse = await fetch(`http://localhost:3000/api/progress/${userId}/${levelFile}`);
        if (!progressResponse.ok) throw new Error("Failed to fetch progress");

        const progressData = await progressResponse.json();
        const lastLesson = progressData.lastLesson || 0;

        setCurrentLesson(lastLesson);
        setLessonText(data[lastLesson]?.text || "");
        setEnglishText(data[lastLesson]?.english || "");

        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    loadLessons();
  }, [levelFile, userId]);

  // ✅ Save progress
  const saveProgress = async (lessonIndex) => {
    try {
      const progressData = { userId, levelFile, lastLesson: lessonIndex };

      await fetch("http://localhost:3000/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(progressData),
      });

      setCurrentLesson(lessonIndex);
      setLessonText(lessons[lessonIndex]?.text || '');
      setEnglishText(lessons[lessonIndex]?.english || '');
    } catch (error) {
      console.error('Error saving progress:', error);
      setCurrentLesson(lessonIndex);
      setLessonText(lessons[lessonIndex]?.text || '');
      setEnglishText(lessons[lessonIndex]?.english || '');
    }
  };

  // 🎤 Setup speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.lang = "hi-IN";
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      setRecognition(recognitionInstance);
    }
  }, []);

  // 🔇 Cancel speech on unmount
  useEffect(() => {
    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  // 🔊 Play text as audio
  const playAudio = useCallback(async (text, callback) => {
    speechSynthesis.cancel();

    return new Promise((resolve) => {
      if (isSpeaking) return resolve();

      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = "hi-IN";
      speech.rate = 0.9;
      speech.pitch = 1.1;
      speech.volume = 1.0;

      setIsTeaching(true);
      setIsSpeaking(true);

      // 🎯 Highlight target word
      const targetWord = text.split('।')[0].split('से ')[1]?.split(' ')[0];
      if (targetWord) setHighlightedWord(targetWord);

      if (text === lessons[0]?.text) {
        setBowing(true);
        setTimeout(() => setBowing(false), 2000);
      }

      speech.onend = () => {
        setIsTeaching(false);
        setHighlightedWord('');
        setIsSpeaking(false);
        if (callback) callback();
        resolve();
      };

      speech.onerror = (e) => {
        console.error('Speech synthesis error:', e);
        setIsTeaching(false);
        setIsSpeaking(false);
        setHighlightedWord('');
        resolve();
      };

      speechSynthesis.speak(speech);
    });
  }, [isSpeaking, lessons, setIsTeaching, setBowing]);

  // 🎙️ Start speech recognition
  const startSpeechRecognition = useCallback((expectedText) => {
    if (!recognition || isListening || isSpeaking) return;

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const resultText = event.results[0][0].transcript.trim();
      setSpeechResult(resultText);
      setIsListening(false);

      if (resultText === expectedText) {
        setIsClapping(true);
        playAudio("बहुत बढ़िया! चलिए आगे बढ़ते हैं।").then(() => {
          setIsClapping(false);
          if (currentLesson + 1 < lessons.length) {
            saveProgress(currentLesson + 1);
          }
        });
      } else {
        playAudio("फिर से कोशिश कीजिए।");
      }
    };

    recognition.onerror = (e) => {
      console.error('Speech recognition error:', e);
      setIsListening(false);
      playAudio("फिर से कोशिश कीजिए।");
    };

    recognition.onend = () => setIsListening(false);
  }, [recognition, isListening, isSpeaking, playAudio, currentLesson, lessons, setIsClapping]);

  // 🧑‍🏫 Teach current lesson
  const teachLesson = useCallback(async () => {
    if (currentLesson < lessons.length && !isSpeaking) {
      const lesson = lessons[currentLesson];

      if (currentLesson === 0) {
        await playAudio(lesson.text);
        if (lessons.length > 1) saveProgress(1);
      } else {
        await playAudio(lesson.text);
        await playAudio("मेरे बाद दोहराएँ");
        setTimeout(() => {
          startSpeechRecognition(lesson.expected);
        }, 500);
      }
    }
  }, [currentLesson, lessons, playAudio, isSpeaking, startSpeechRecognition]);

  // 🕐 Auto start lesson 0 after load
  useEffect(() => {
    if (!isLoading && lessons.length && currentLesson === 0 && !isSpeaking) {
      const timer = setTimeout(() => {
        teachLesson();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, lessons, currentLesson, isSpeaking, teachLesson]);

  // 🧠 Highlight word
  const renderHighlightedText = (text) => {
    if (!highlightedWord) return text;

    const parts = text.split(highlightedWord);
    return (
      <>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index < parts.length - 1 && (
              <span className="text-orange-500 font-bold">{highlightedWord}</span>
            )}
          </React.Fragment>
        ))}
      </>
    );
  };

  // ⏳ Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        <p className="mt-4 text-gray-800">Loading lesson...</p>
      </div>
    );
  }

  // ❌ Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Error Loading Lesson</h2>
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => navigate('/')}
          className="rounded-full bg-white p-4 shadow-md hover:shadow-lg transition-transform hover:-translate-y-1"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>
    );
  }

  // ✅ Main Lesson Page
  return (
    <div className="bg-white min-h-screen">
      <div className="relative isolate px-6 pt-14 lg:px-8">

        {/* 💠 Gradient Background Design */}
        {/* ... [Unchanged background gradient code] ... */}

        <div className="flex min-h-screen items-start justify-center pt-24">
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center">

            {/* 👤 Avatar with Thought Bubble */}
            <div className="relative w-[400px] h-[400px] rounded-full overflow-hidden bg-gray-100 shadow-lg mb-8">
              <div className="absolute inset-0">
                <Avatar
                  cameraPosition={[0, 2, 8]}
                  targetPosition={[0, 0, 0]}
                  fov={45}
                  enableZoom={false}
                  minZoom={2}
                  maxZoom={10}
                  initialScale={4.5}
                />
              </div>
              {isTeaching && (
                <ThoughtBubble currentLesson={currentLesson} lessons={lessons} />
              )}
            </div>

            {/* 🔘 Controls */}
            <div className="flex justify-center gap-6 mb-8">
              <button
                onClick={teachLesson}
                className="bg-orange-500 text-white p-4 rounded-full hover:bg-orange-600 transition-colors"
                disabled={isSpeaking}
              >
                <Play className="w-6 h-6" />
              </button>
              <button
                onClick={() => startSpeechRecognition(lessons[currentLesson]?.expected)}
                className="bg-blue-500 text-white p-4 rounded-full hover:bg-blue-600 transition-colors"
                disabled={isListening || isSpeaking}
              >
                <Mic className="w-6 h-6" />
              </button>
              <button
                onClick={() => navigate('/frog')}
                className="bg-purple-500 text-white p-4 rounded-full hover:bg-purple-600 transition-colors"
              >
                <GamepadIcon className="w-6 h-6" />
              </button>
            </div>

            {/* 📊 Progress Bar + Text */}
            <div className="w-full">
              <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
                <div
                  className="bg-orange-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(currentLesson / lessons.length) * 100}%` }}
                />
              </div>

              <div className="text-center space-y-4">
                <p className="text-2xl font-semibold text-gray-900">
                  {renderHighlightedText(lessonText)}
                </p>
                <p className="text-lg text-gray-600">{englishText}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default LessonPage;