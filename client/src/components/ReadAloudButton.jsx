import  { useState, useEffect } from "react";
import { Volume2, X } from "lucide-react";

const CollapsibleReadAloudButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [selectedLang, setSelectedLang] = useState("en-US");
    const synth = window.speechSynthesis;

    useEffect(() => {
        return () => {
            synth.cancel();
        };
    }, []);

    const getPageText = () => {
        return document.body.innerText;
    };

    const startReading = () => {
        const text = getPageText();
        if (!text) {
            alert("No text found to read!");
            return;
        }

        if (synth.speaking) {
            synth.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = selectedLang;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (event) => console.error("Speech error:", event);

        synth.speak(utterance);
        setIsSpeaking(true);
        setIsPaused(false);
    };

    const pauseReading = () => {
        if (synth.speaking && !isPaused) {
            synth.pause();
            setIsPaused(true);
        } else if (isPaused) {
            synth.resume();
            setIsPaused(false);
        }
    };

    const stopReading = () => {
        synth.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
    };

    return (
        <div className="fixed bottom-4 right-24 z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-[#2d457e] text-white rounded hover:bg-[#1d2f5c] transition-colors"
            >
                <Volume2 className="w-5 h-5" />
            </button>

            <div
                className={`absolute bottom-full right-0 mb-2 w-64 bg-white rounded shadow-lg border border-gray-200 ${
                    isOpen ? 'block' : 'hidden'
                }`}
            >
                <div className="p-3">
                    <div className="flex justify-between items-center mb-3">
                        <span className="font-medium text-gray-700">Read Aloud</span>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <select
                        className="w-full mb-3 p-2 border border-gray-200 rounded text-gray-700"
                        value={selectedLang}
                        onChange={(e) => setSelectedLang(e.target.value)}
                    >
                        <option value="en-US">English (US)</option>
                        <option value="hi-IN">Hindi</option>
                        <option value="ta-IN">Tamil</option>
                        <option value="te-IN">Telugu</option>
                        <option value="mr-IN">Marathi</option>
                        <option value="bn-IN">Bengali</option>
                        <option value="gu-IN">Gujarati</option>
                        <option value="pa-IN">Punjabi</option>
                        <option value="ml-IN">Malayalam</option>
                        <option value="kn-IN">Kannada</option>
                    </select>

                    <div className="space-y-2">
                        <button
                            onClick={startReading}
                            disabled={isSpeaking}
                            className="w-full px-3 py-2 bg-[#2d457e] text-white rounded hover:bg-[#1d2f5c] transition-colors disabled:opacity-50"
                        >
                            📢 Read Aloud
                        </button>
                        <button
                            onClick={pauseReading}
                            disabled={!isSpeaking}
                            className="w-full px-3 py-2 bg-[#2d457e] text-white rounded hover:bg-[#1d2f5c] transition-colors disabled:opacity-50"
                        >
                            {isPaused ? "▶ Resume" : "⏸ Pause"}
                        </button>
                        <button
                            onClick={stopReading}
                            disabled={!isSpeaking}
                            className="w-full px-3 py-2 bg-[#2d457e] text-white rounded hover:bg-[#1d2f5c] transition-colors disabled:opacity-50"
                        >
                            ⛔ Stop
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollapsibleReadAloudButton;