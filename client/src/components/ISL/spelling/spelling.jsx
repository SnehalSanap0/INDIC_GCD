import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// You'll need to install these if you don't have them already:
// npm install axios

const HearingImpairmentAssistant = () => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [signGif, setSignGif] = useState(null);
  const [letterSigns, setLetterSigns] = useState([]);
  const [availableSigns, setAvailableSigns] = useState([]);
  const [recognitionSupported, setRecognitionSupported] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  
  // API base URL - change this to match your Flask server
  const API_BASE_URL = 'http://localhost:4000';
  
  // Fetch available signs when component mounts
  useEffect(() => {
    setLoading(true);
    axios.get(`${API_BASE_URL}/api/signs`)
      .then(response => {
        setAvailableSigns(response.data.signs);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching signs:', error);
        setError('Failed to fetch available signs');
        setLoading(false);
      });
  }, []);
  
  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        const lastResult = event.results[event.results.length - 1];
        const text = lastResult[0].transcript.trim().toLowerCase();
        setTranscript(text);
        
        // Process text with our backend
        processRecognizedText(text);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setListening(false);
        setError(`Speech recognition error: ${event.error}`);
      };
      
      recognitionRef.current.onend = () => {
        if (listening) {
          recognitionRef.current.start();
        }
      };
    } else {
      setRecognitionSupported(false);
      setError('Speech recognition is not supported in your browser');
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [listening]);
  
  // Process recognized text
  const processRecognizedText = async (text) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/test-speech`, { text });
      handleRecognitionResponse(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error processing speech:', error);
      setError('Failed to process speech');
      setLoading(false);
    }
  };
  
  // Handle the response from the speech recognition API
  const handleRecognitionResponse = (data) => {
    if (data.action === 'exit') {
      stopListening();
      setTranscript('Goodbye! Assistant stopped.');
      return;
    }
    
    if (data.type === 'gif') {
      setSignGif(data.gifUrl);
      setLetterSigns([]);
    } else if (data.type === 'letters') {
      setSignGif(null);
      setLetterSigns(data.letterUrls);
    }
  };
  
  // Toggle listening state
  const toggleListening = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  // Start listening for speech
  const startListening = () => {
    setError(null);
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setError('Failed to start speech recognition');
      }
    }
  };
  
  // Stop listening for speech
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setListening(false);
  };
  
  // Clear the display
  const clearDisplay = () => {
    setSignGif(null);
    setLetterSigns([]);
    setTranscript('');
    setError(null);
  };
  
  // Handle manual text input (for testing without microphone)
  const handleManualTextSubmit = (e) => {
    e.preventDefault();
    if (transcript.trim()) {
      processRecognizedText(transcript);
    }
  };
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-purple-300 via-pink-200 to-white p-8 flex justify-center items-center">
      <div className="max-w-2xl w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-center text-blue-600">Hearing Impairment Assistant</h1>
          <p className="text-center text-gray-600">Translates speech to sign language</p>
        </header>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        <div className="flex justify-center mb-6 space-x-2">
          <button 
            onClick={toggleListening}
            disabled={!recognitionSupported || loading}
            className={`px-4 py-2 rounded font-bold ${
              listening 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            } disabled:opacity-50`}
          >
            {listening ? 'Stop Listening' : 'Start Listening'}
          </button>
          
          <button 
            onClick={clearDisplay}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded font-bold"
          >
            Clear
          </button>
        </div>
        
        <div className="mb-6">
          <div className="mb-2 font-medium">Recognized Speech:</div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="flex-grow p-2 border border-gray-300 rounded"
              placeholder="Speak or type text here..."
            />
            <button 
              onClick={handleManualTextSubmit}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded font-bold"
            >
              Process
            </button>
          </div>
        </div>
        
        {loading && (
          <div className="text-center my-4 text-gray-600">
            Processing...
          </div>
        )}
        
        {signGif && (
          <div className="mb-6">
            <div className="mb-2 font-medium">Sign Language:</div>
            <div className="border rounded p-4 flex justify-center bg-gray-50">
              <img 
                src={`${API_BASE_URL}${signGif}`} 
                alt="Sign language visualization" 
                className="max-w-full h-auto"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = 'https://via.placeholder.com/200?text=GIF+Not+Found';
                  setError('Sign language GIF not found');
                }}
              />
            </div>
          </div>
        )}
        
        {letterSigns.length > 0 && (
          <div className="mb-6">
            <div className="mb-2 font-medium">Letter Signs:</div>
            <div className="flex flex-wrap gap-2 justify-center">
              {letterSigns.map((letterUrl, index) => (
                <div key={index} className="border rounded p-2 bg-gray-50">
                  <img 
                    src={`${API_BASE_URL}${letterUrl}`} 
                    alt={`Sign for letter ${letterUrl.split('/').pop()}`}
                    className="w-16 h-16 object-contain"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = 'https://via.placeholder.com/80?text=' + letterUrl.split('/').pop();
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-8 bg-blue-50 p-4 rounded">
          <h3 className="font-medium mb-2">Instructions:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Click "Start Listening" to begin speech recognition</li>
            <li>Speak clearly - recognized speech will be displayed above</li>
            <li>You can also type text and click "Process" to test</li>
            <li>For recognized phrases, a sign language GIF will be shown</li>
            <li>For other words, individual letter signs will be shown</li>
            <li>Say "goodbye" to stop the application</li>
          </ul>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>Available phrases: {availableSigns.length > 0 ? `${availableSigns.length} phrases including "hello", "thank you", etc.` : 'Loading...'}</p>
        </div>
      </div>
    </div>
  );
};

export default HearingImpairmentAssistant;