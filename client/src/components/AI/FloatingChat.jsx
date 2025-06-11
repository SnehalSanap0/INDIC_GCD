// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { MessageCircle, Send, Loader } from "lucide-react";

// // Custom components to mimic the functionality of shadcn components
// const ChatDialog = ({ children }) => {
//     return <div>{children}</div>;
// };

// const ChatButton = ({ onClick, children, className, disabled }) => {
//     return (
//         <button
//             onClick={onClick}
//             className={`rounded-full p-4 ${className}`}
//             disabled={disabled}
//         >
//             {children}
//         </button>
//     );
// };

// const ChatDialogContent = ({ children, className }) => {
//     return (
//         <div className={`p-4 bg-white shadow-xl rounded-lg ${className}`}>
//             {children}
//         </div>
//     );
// };

// // Mac-optimized configuration
// const API_URL = 'http://127.0.0.1:5000'; // Use IP instead of localhost

// const BOILERPLATE_MESSAGE = `
// Hello from INDIC! 🌟
// I am here to assist you with all your queries, doubts, and questions.
// I can help with anything related to:
// - Your language learning journey.
// - Queries about the syllabus.
// - Fun games that can make learning more exciting!🎮
// - Or any feedback you have for the platform!

// Feel free to ask me anything within these topics, and let's get started on your learning path!
// `;

// // Generate a unique user ID for state tracking
// const generateUserId = () => {
//     return 'user_' + Math.random().toString(36).substr(2, 9);
// };

// const FloatingChat = () => {
//     const [messages, setMessages] = useState([]);
//     const [input, setInput] = useState("");
//     const [isChatOpen, setIsChatOpen] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [connectionIssue, setConnectionIssue] = useState(false);
//     const [userId] = useState(generateUserId()); // Create a user ID for tracking conversation state

//     // Test connection on load
//     useEffect(() => {
//         const testConnection = async () => {
//             try {
//                 await axios.get(`${API_URL}/test`, {
//                     headers: { 'Content-Type': 'application/json' },
//                     withCredentials: false
//                 });
//                 setConnectionIssue(false);
//                 console.log("Backend connection successful!");
//             } catch (error) {
//                 console.error("Backend connection failed:", error);
//                 setConnectionIssue(true);
//             }
//         };
        
//         testConnection();
//     }, []);

//     // Function to fetch the boilerplate message
//     const fetchBoilerplate = async () => {
//         setLoading(true);
//         try {
//             console.log("Fetching boilerplate message");
//             const response = await axios.post(
//                 `${API_URL}/chat`, 
//                 { userMessage: "", userId },
//                 { 
//                     headers: { 
//                         'Content-Type': 'application/json',
//                         'Accept': 'application/json'
//                     },
//                     withCredentials: false
//                 }
//             );
//             console.log("Received boilerplate:", response.data);
//             setMessages([{ text: BOILERPLATE_MESSAGE, sender: "bot" }]);
//             setConnectionIssue(false);
//         } catch (error) {
//             console.error("Error fetching boilerplate:", error);
//             setMessages([{ text: BOILERPLATE_MESSAGE, sender: "bot" }]);
//             setConnectionIssue(true);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Function to send a user message
//     const sendMessage = async () => {
//         if (!input.trim() || loading) return;
        
//         const userMessage = input.trim();
//         const newMessages = [...messages, { text: userMessage, sender: "user" }];
//         setMessages(newMessages);
//         setInput("");
//         setLoading(true);
        
//         try {
//             console.log("Sending message to backend:", userMessage);
//             const response = await axios({
//                 method: 'post',
//                 url: `${API_URL}/chat`,
//                 data: { userMessage, userId }, // Include the userId for state tracking
//                 headers: { 
//                     'Content-Type': 'application/json',
//                     'Accept': 'application/json'
//                 },
//                 withCredentials: false,
//                 timeout: 30000 // Increase timeout to 30 seconds for syllabus generation
//             });
            
//             console.log("Received response:", response.data);
            
//             // Format longer responses like syllabi with proper line breaks
//             const formattedResponse = {
//                 text: response.data.reply,
//                 sender: "bot" 
//             };
            
//             setMessages([...newMessages, formattedResponse]);
//             setConnectionIssue(false);
//         } catch (error) {
//             console.error("Error sending message:", error);
//             setMessages([...newMessages, { 
//                 text: "Sorry, I couldn't connect to the server. Please check that the backend is running correctly.", 
//                 sender: "bot" 
//             }]);
//             setConnectionIssue(true);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Toggle chat window visibility and load boilerplate message when opening
//     const toggleChatWindow = () => {
//         const newState = !isChatOpen;
//         setIsChatOpen(newState);
        
//         // If opening the chat and no messages exist, fetch the boilerplate
//         if (newState && messages.length === 0) {
//             fetchBoilerplate();
//         }
//     };

//     // Handle Enter key press
//     const handleKeyPress = (e) => {
//         if (e.key === "Enter" && !e.shiftKey && input.trim()) {
//             e.preventDefault();
//             sendMessage();
//         }
//     };

//     // Auto-scroll to bottom when new messages arrive
//     useEffect(() => {
//         const chatContainer = document.getElementById('chat-messages');
//         if (chatContainer) {
//             chatContainer.scrollTop = chatContainer.scrollHeight;
//         }
//     }, [messages]);

//     return (
//         <ChatDialog>
//             {/* Floating Button Fixed at Bottom-Right */}
//             <ChatButton 
//                 onClick={toggleChatWindow} 
//                 className="fixed bottom-6 left-6 bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition z-50"
//             >
//                 <MessageCircle size={24} />
//             </ChatButton>

//             {/* Chat Window */}
//             {isChatOpen && (
//                 <ChatDialogContent className="fixed bottom-20 left-6 w-80 h-96 flex flex-col">
//                     {/* Header */}
//                     <div className="border-b pb-2 mb-2 flex justify-between items-center">
//                         <h3 className="font-bold text-lg text-blue-600">
//                             INDIC Assistant
//                             {connectionIssue && (
//                                 <span className="ml-2 text-xs text-red-500">(Connection Issues)</span>
//                             )}
//                         </h3>
//                         <button 
//                             onClick={toggleChatWindow}
//                             className="text-gray-500 hover:text-gray-700"
//                         >
//                             ✕
//                         </button>
//                     </div>
                    
//                     {/* Chat Messages */}
//                     <div 
//                         id="chat-messages"
//                         className="flex-grow overflow-y-auto space-y-2 p-2 custom-scrollbar relative"
//                     >
//                         {/* Watermark */}
//                         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl font-bold text-gray-200 opacity-30 select-none pointer-events-none">
//                             INDIC
//                         </div>

//                         {messages.map((msg, index) => (
//                             <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
//                                 <div 
//                                     className={`p-2 rounded-lg max-w-[90%] ${
//                                         msg.sender === "user" 
//                                             ? "bg-blue-500 text-white rounded-tr-none" 
//                                             : "bg-gray-200 text-gray-800 rounded-tl-none"
//                                     } whitespace-pre-wrap`}
//                                 >
//                                     {msg.text.split('\n').map((line, i) => (
//                                         <React.Fragment key={i}>
//                                             {line}
//                                             {i < msg.text.split('\n').length - 1 && <br />}
//                                         </React.Fragment>
//                                     ))}
//                                 </div>
//                             </div>
//                         ))}

//                         {/* Show loader while bot is responding */}
//                         {loading && (
//                             <div className="flex justify-center py-2">
//                                 <Loader size={24} className="animate-spin text-blue-500" />
//                             </div>
//                         )}
//                     </div>

//                     {/* Input Section */}
//                     <div className="mt-2 flex items-center">
//                         <input
//                             type="text"
//                             className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             placeholder="Type a message..."
//                             value={input}
//                             onChange={(e) => setInput(e.target.value)}
//                             onKeyDown={handleKeyPress}
//                             disabled={loading}
//                         />
//                         <ChatButton 
//                             onClick={sendMessage} 
//                             className={`ml-2 ${loading || !input.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
//                             disabled={loading || !input.trim()}
//                         >
//                             <Send size={16} />
//                         </ChatButton>
//                     </div>
//                 </ChatDialogContent>
//             )}

//             {/* Inline styles for modern scrollbar */}
//             <style jsx>{`
//                 /* Styling the Scrollbar */
//                 .custom-scrollbar::-webkit-scrollbar {
//                     width: 6px;
//                     height: 6px;
//                 }

//                 .custom-scrollbar::-webkit-scrollbar-track {
//                     background-color: transparent;
//                     border-radius: 10px;
//                 }

//                 .custom-scrollbar::-webkit-scrollbar-thumb {
//                     background-color: #c1c1c1;
//                     border-radius: 10px;
//                     transition: background-color 0.3s ease;
//                 }

//                 .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//                     background-color: #a1a1a1;
//                 }

//                 .custom-scrollbar::-webkit-scrollbar-corner {
//                     background-color: transparent;
//                 }
//             `}</style>
//         </ChatDialog>
//     );
// };

// export default FloatingChat;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { MessageCircle, Send, Loader } from "lucide-react";

// Custom components to mimic the functionality of shadcn components
const ChatDialog = ({ children }) => {
    return <div>{children}</div>;
};

const ChatButton = ({ onClick, children, className, disabled }) => {
    return (
        <button
            onClick={onClick}
            className={`rounded-full p-4 ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

const ChatDialogContent = ({ children, className }) => {
    return (
        <div className={`p-4 bg-white shadow-xl rounded-lg ${className}`}>
            {children}
        </div>
    );
};

// Mac-optimized configuration
const API_URL = 'http://127.0.0.1:5500'; // Use IP instead of localhost

const BOILERPLATE_MESSAGE = `
Hello from INDIC! 🌟
I am here to assist you with all your queries, doubts, and questions.
I can help with anything related to:
- Your language learning journey.
- Queries about the syllabus.
- Fun games that can make learning more exciting!🎮
- Or any feedback you have for the platform!

Feel free to ask me anything within these topics, and let's get started on your learning path!
`;

// Generate a unique user ID for state tracking
const generateUserId = () => {
    return 'user_' + Math.random().toString(36).substr(2, 9);
};

const FloatingChat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [connectionIssue, setConnectionIssue] = useState(false);
    const [userId] = useState(generateUserId()); // Create a user ID for tracking conversation state
    const [syllabusInProgress, setSyllabusInProgress] = useState(false); // Track when syllabus is being generated

    // Test connection on load
    useEffect(() => {
        const testConnection = async () => {
            try {
                await axios.get(`${API_URL}/test`, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: false
                });
                setConnectionIssue(false);
                console.log("Backend connection successful!");
            } catch (error) {
                console.error("Backend connection failed:", error);
                setConnectionIssue(true);
            }
        };
        
        testConnection();
    }, []);

    // Function to fetch the boilerplate message
    const fetchBoilerplate = async () => {
        setLoading(true);
        try {
            console.log("Fetching boilerplate message");
            const response = await axios.post(
                `${API_URL}/chat`, 
                { userMessage: "", userId },
                { 
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    withCredentials: false
                }
            );
            console.log("Received boilerplate:", response.data);
            setMessages([{ text: BOILERPLATE_MESSAGE, sender: "bot" }]);
            setConnectionIssue(false);
        } catch (error) {
            console.error("Error fetching boilerplate:", error);
            setMessages([{ text: BOILERPLATE_MESSAGE, sender: "bot" }]);
            setConnectionIssue(true);
        } finally {
            setLoading(false);
        }
    };

    // Function to detect if user is likely requesting a syllabus
    const isSyllabusRequest = (message) => {
        return /\b(create|generate|make|build|design).*\b(syllabus|curriculum)\b/i.test(message);
    };

    // Function to send a user message
    const sendMessage = async () => {
        if (!input.trim() || loading) return;
        
        const userMessage = input.trim();
        const newMessages = [...messages, { text: userMessage, sender: "user" }];
        setMessages(newMessages);
        setInput("");
        setLoading(true);
        
        // Check if this is a potential syllabus request
        const potentiallySyllabus = isSyllabusRequest(userMessage);
        if (potentiallySyllabus) {
            setSyllabusInProgress(true);
            // Add an immediate feedback message
            setMessages([
                ...newMessages, 
                { 
                    text: "I'll help you create a syllabus. This might take a minute or two, please be patient...", 
                    sender: "bot" 
                }
            ]);
        }
        
        try {
            console.log("Sending message to backend:", userMessage);
            
            // Set longer timeout for syllabus generation
            const timeout = potentiallySyllabus || syllabusInProgress ? 120000 : 20000; // 2 mins for syllabus, 20 secs for regular chat
            
            const response = await axios({
                method: 'post',
                url: `${API_URL}/chat`,
                data: { userMessage, userId }, // Include the userId for state tracking
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                withCredentials: false,
                timeout: timeout
            });
            
            console.log("Received response:", response.data);
            
            // If we previously added a "processing" message, replace it
            const messagesToUpdate = potentiallySyllabus ? 
                newMessages : 
                (syllabusInProgress ? [...messages.slice(0, -1), { text: userMessage, sender: "user" }] : newMessages);
            
            // Format the response
            const formattedResponse = {
                text: response.data.reply,
                sender: "bot" 
            };
            
            setMessages([...messagesToUpdate, formattedResponse]);
            
            // Update syllabus progress status based on the response
            // If we get a full syllabus or move out of syllabus flow, reset the flag
            if (response.data.reply.includes("Here's your personalized syllabus") || 
                response.data.reply.includes("No problem! Let me know if")) {
                setSyllabusInProgress(false);
            } else if (
                response.data.reply.includes("Would you like me to create") ||
                response.data.reply.includes("What proficiency level") ||
                response.data.reply.includes("Which language") ||
                response.data.reply.includes("What is your purpose")
            ) {
                setSyllabusInProgress(true);
            }
            
            setConnectionIssue(false);
        } catch (error) {
            console.error("Error sending message:", error);
            
            // Give a more specific error for timeout vs other issues
            const errorMessage = error.code === 'ECONNABORTED' 
                ? "Sorry, generating the syllabus is taking longer than expected. Please try a simpler request or try again later."
                : "Sorry, I couldn't connect to the server. Please check that the backend is running correctly.";
            
            setMessages([...newMessages, { 
                text: errorMessage, 
                sender: "bot" 
            }]);
            
            setSyllabusInProgress(false);
            setConnectionIssue(true);
        } finally {
            setLoading(false);
        }
    };

    // Toggle chat window visibility and load boilerplate message when opening
    const toggleChatWindow = () => {
        const newState = !isChatOpen;
        setIsChatOpen(newState);
        
        // If opening the chat and no messages exist, fetch the boilerplate
        if (newState && messages.length === 0) {
            fetchBoilerplate();
        }
    };

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey && input.trim()) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        const chatContainer = document.getElementById('chat-messages');
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, [messages]);

    return (
        <ChatDialog>
            {/* Floating Button Fixed at Bottom-Right */}
            <ChatButton 
                onClick={toggleChatWindow} 
                className="fixed bottom-6 left-6 bg-blue-600 text-white shadow-lg hover:bg-blue-800 transition-transform transform hover:scale-110"
      
            >
                <MessageCircle size={24} />
            </ChatButton>

            {/* Chat Window */}
            {isChatOpen && (
                <ChatDialogContent className="fixed bottom-20 left-6 w-80 h-96 flex flex-col">
                    {/* Header */}
                    <div className="border-b pb-2 mb-2 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-blue-600">
                            INDIC Assistant
                            {connectionIssue && (
                                <span className="ml-2 text-xs text-red-500">(Connection Issues)</span>
                            )}
                        </h3>
                        <button 
                            onClick={toggleChatWindow}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>
                    
                    {/* Chat Messages */}
                    <div 
                        id="chat-messages"
                        className="flex-grow overflow-y-auto space-y-2 p-2 custom-scrollbar relative"
                    >
                        {/* Watermark */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl font-bold text-gray-200 opacity-30 select-none pointer-events-none">
                            INDIC
                        </div>

                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                <div 
                                    className={`p-2 rounded-lg max-w-[90%] ${
                                        msg.sender === "user" 
                                            ? "bg-blue-500 text-white rounded-tr-none" 
                                            : "bg-gray-200 text-gray-800 rounded-tl-none"
                                    } whitespace-pre-wrap`}
                                >
                                    {msg.text.split('\n').map((line, i) => (
                                        <React.Fragment key={i}>
                                            {line}
                                            {i < msg.text.split('\n').length - 1 && <br />}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Show loader while bot is responding */}
                        {loading && (
                            <div className="flex justify-center py-2">
                                <Loader size={24} className="animate-spin text-blue-500" />
                                {syllabusInProgress && (
                                    <span className="ml-2 text-sm text-blue-600">
                                        Generating syllabus...
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Input Section */}
                    <div className="mt-2 flex items-center">
                        <input
                            type="text"
                            className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={loading && syllabusInProgress ? "Generating syllabus..." : "Type a message..."}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            disabled={loading}
                        />
                        <ChatButton 
                            onClick={sendMessage} 
                            className={`ml-2 ${loading || !input.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                            disabled={loading || !input.trim()}
                        >
                            <Send size={16} />
                        </ChatButton>
                    </div>
                </ChatDialogContent>
            )}

            {/* Inline styles for modern scrollbar */}
            <style jsx>{`
                /* Styling the Scrollbar */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background-color: transparent;
                    border-radius: 10px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #c1c1c1;
                    border-radius: 10px;
                    transition: background-color 0.3s ease;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: #a1a1a1;
                }

                .custom-scrollbar::-webkit-scrollbar-corner {
                    background-color: transparent;
                }
            `}</style>
        </ChatDialog>
    );
};

export default FloatingChat;
