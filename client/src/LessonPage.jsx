
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Avatar from './Avatar';
import ThoughtBubble from './ThoughtBubble';
import { useSpeechState } from './Avatar';
import { ArrowLeft, Play, Mic, GamepadIcon } from 'lucide-react';

function LessonPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { levelFile, userId } = location.state || { levelFile: 'swar.json', userId: 'guest' };
  
  const { isTeaching, setIsTeaching, setIsClapping, setBowing } = useSpeechState();
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

  useEffect(() => {
    const loadLessons = async () => {
      try {
        if (!userId) {
          console.error("❌ No username found, cannot load progress!");
          return;
        }

        setIsLoading(true);

        // ✅ Fetch lesson content
        const response = await fetch(`/syllabus/${levelFile}`);
        if (!response.ok) throw new Error("Failed to load lesson data");
        const data = await response.json();
        setLessons(data);

        // ✅ Fetch user progress from backend using `username`
        const progressResponse = await fetch(`http://localhost:3000/api/progress/${userId}/${levelFile}`);
        if (!progressResponse.ok) throw new Error("Failed to fetch progress");
        const progressData = await progressResponse.json();

        console.log(`🔥 Progress for ${userId}:`, progressData);
        const lastLesson = progressData.lastLesson || 0;

        // ✅ Start from last saved lesson
        setCurrentLesson(lastLesson);
        setLessonText(data[lastLesson]?.text || "");
        setEnglishText(data[lastLesson]?.english || "");

        setIsLoading(false);
      } catch (error) {
        console.error("❌ Error loading lessons:", error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    loadLessons();
  }, [levelFile, userId]);


  // ✅ Function to save progress to backend
  const saveProgress = async (lessonIndex) => {
    try {
      const progressData = { userId, levelFile, lastLesson: lessonIndex };
      
      await fetch("http://localhost:3000/api/progress", {  // Changed from 5000 to 3000
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(progressData),
      });
      
      setCurrentLesson(lessonIndex);
      setLessonText(lessons[lessonIndex]?.text || '');
      setEnglishText(lessons[lessonIndex]?.english || '');
    } catch (error) {
      console.error('Error saving progress:', error);
      // Continue with local state update even if save fails
      setCurrentLesson(lessonIndex);
      setLessonText(lessons[lessonIndex]?.text || '');
      setEnglishText(lessons[lessonIndex]?.english || '');
    }
  };

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

  useEffect(() => {
    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  const playAudio = useCallback(async (text, callback) => {
    speechSynthesis.cancel();
    
    return new Promise((resolve) => {
      if (isSpeaking) {
        resolve();
        return;
      }

      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = "hi-IN";
      speech.rate = 0.9;
      speech.pitch = 1.1;
      speech.volume = 1.0;

      setIsTeaching(true);
      setIsSpeaking(true);

      if (text === lessons[0]?.text) {
        setBowing(true);
        setTimeout(() => setBowing(false), 2000);
      }

      const targetWord = text.split('।')[0].split('से ')[1]?.split(' ')[0];
      if (targetWord) {
        setHighlightedWord(targetWord);
      }

      speech.onstart = () => {
        setIsTeaching(true);
      };

      speech.onend = () => {
        setIsTeaching(false);
        setHighlightedWord('');
        setIsSpeaking(false);
        if (callback) {
          callback();
        }
        resolve();
      };

      speech.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsTeaching(false);
        setHighlightedWord('');
        setIsSpeaking(false);
        resolve();
      };

      speechSynthesis.speak(speech);
    });
  }, [setIsTeaching, setBowing, lessons, isSpeaking]);

  const startSpeechRecognition = useCallback((expectedText) => {
    if (!recognition || isListening || isSpeaking) return;

    setIsListening(true);
    recognition.start();
    
    recognition.onresult = function(event) {
      const speechResultText = event.results[0][0].transcript.trim();
      setSpeechResult(speechResultText);
      setIsListening(false);

      if (speechResultText === expectedText) {
        setIsClapping(true);
        
        playAudio("बहुत बढ़िया! चलिए आगे बढ़ते हैं।").then(() => {
          setIsClapping(false);
          const nextLessonIndex = currentLesson + 1;
          if (nextLessonIndex < lessons.length) {
            saveProgress(nextLessonIndex); // 🔥 Save progress to backend
          }
        });
      } else {
        playAudio("फिर से कोशिश कीजिए।");
      }
    };

    recognition.onerror = function(event) {
      console.error('Speech recognition error:', event);
      setIsListening(false);
      playAudio("फिर से कोशिश कीजिए।");
    };

    recognition.onend = function() {
      setIsListening(false);
    };
  }, [recognition, playAudio, currentLesson, lessons, setIsClapping, isListening, isSpeaking]);

  const teachLesson = useCallback(async () => {
    if (currentLesson < lessons.length && !isSpeaking) {
      const lesson = lessons[currentLesson];
      
      if (currentLesson === 0) {
        await playAudio(lesson.text);
        const nextLessonIndex = currentLesson + 1;
        if (nextLessonIndex < lessons.length) {
          saveProgress(nextLessonIndex); // 🔥 Save progress to backend
        }
      } else {
        await playAudio(lesson.text);
        await new Promise(resolve => setTimeout(resolve, 500));
        await playAudio("मेरे बाद दोहराएँ");
        setTimeout(() => {
          startSpeechRecognition(lesson.expected);
        }, 500);
      }
    }
  }, [currentLesson, lessons, playAudio, startSpeechRecognition, isSpeaking]);

  useEffect(() => {
    let mounted = true;
    
    if (!isLoading && lessons.length > 0 && currentLesson === 0 && !isSpeaking) {
      const timer = setTimeout(() => {
        if (mounted) {
          teachLesson();
        }
      }, 1000);
      
      return () => {
        mounted = false;
        clearTimeout(timer);
      };
    }
  }, [isLoading, lessons, currentLesson, teachLesson, isSpeaking]);

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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        <p className="mt-4 text-gray-800">Loading lesson...</p>
      </div>
    );
  }

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

  return (
    <div className="bg-white min-h-screen">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
          <div
              className="relative right-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] translate-x-1/2 rotate-[-30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:right-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(25.9% 44.1%, 0% 61.6%, 2.5% 26.9%, 14.5% 0.1%, 19.3% 2%, 27.5% 32.5%, 39.8% 62.4%, 47.6% 68.1%, 52.5% 58.3%, 54.8% 34.5%, 72.5% 76.7%, 99.9% 64.9%, 82.1% 100%, 72.4% 76.8%, 23.9% 97.7%, 25.9% 44.1%)",
              }}
          ></div>
        </div>

        <div className="flex min-h-screen items-start justify-center pt-24">
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
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
                onClick={() => {navigate('/frog')}}
                className="bg-purple-500 text-white p-4 rounded-full hover:bg-purple-600 transition-colors"
              >
                <GamepadIcon className="w-6 h-6" />
              </button>
            </div>

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
                <p className="text-lg text-gray-600">
                  {englishText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LessonPage;