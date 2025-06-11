from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import speech_recognition as sr
import os
import string
import tempfile
import base64
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Store the ISL GIF phrases list
isl_gif = ['any questions', 'are you angry', 'are you busy', 'are you hungry', 'are you sick', 'be careful',
    'can we meet tomorrow', 'did you book tickets', 'did you finish homework', 'do you go to office', 'do you have money',
    'do you want something to drink', 'do you want tea or coffee', 'do you watch TV', 'dont worry', 'flower is beautiful',
    'good afternoon', 'good evening', 'good morning', 'good night', 'good question', 'had your lunch', 'happy journey',
    'hello what is your name', 'how many people are there in your family', 'i am a clerk', 'i am bore doing nothing',
    'i am fine', 'i am sorry', 'i am thinking', 'i am tired', 'i dont understand anything', 'i go to a theatre', 'i love to shop',
    'i had to say something but i forgot', 'i have headache', 'i like pink colour', 'i live in nagpur', 'lets go for lunch', 'my mother is a homemaker',
    'my name is john', 'nice to meet you', 'no smoking please', 'open the door', 'please call me later',
    'please clean the room', 'please give me your pen', 'please use dustbin dont throw garbage', 'please wait for sometime', 'shall I help you',
    'shall we go together tommorow', 'sign language interpreter', 'sit down', 'stand up', 'take care', 'there was traffic jam', 'wait I am thinking',
    'what are you doing', 'what is the problem', 'what is todays date', 'what is your father do', 'what is your job',
    'what is your mobile number', 'what is your name', 'whats up', 'when is your interview', 'when we will go', 'where do you stay',
    'where is the bathroom', 'where is the police station', 'you are wrong', 'address', 'agra', 'ahemdabad', 'all', 'april', 'assam', 'august', 'australia', 'badoda', 'banana', 'banaras', 'banglore',
    'bihar', 'bridge', 'cat', 'chandigarh', 'chennai', 'christmas', 'church', 'clinic', 'coconut', 'crocodile', 'dasara',
    'deaf', 'december', 'deer', 'delhi', 'dollar', 'duck', 'febuary', 'friday', 'fruits', 'glass', 'grapes', 'gujrat', 'hello',
    'hindu', 'hyderabad', 'india', 'january', 'jesus', 'job', 'july', 'karnataka', 'kerala', 'krishna', 'litre', 'mango',
    'may', 'mile', 'monday', 'mumbai', 'museum', 'muslim', 'nagpur', 'october', 'orange', 'pakistan', 'pass', 'police station',
    'post office', 'pune', 'punjab', 'rajasthan', 'ram', 'restaurant', 'saturday', 'september', 'shop', 'sleep', 'southafrica',
    'story', 'sunday', 'tamil nadu', 'temperature', 'temple', 'thursday', 'toilet', 'tomato', 'town', 'tuesday', 'usa', 'village',
    'voice', 'wednesday', 'weight', 'please wait for sometime', 'what is your mobile number', 'what are you doing', 'are you busy']

# Configure paths for the static files
ISL_GIF_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ISL_Gifs')
LETTERS_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'letters')

# Ensure the folders exist
os.makedirs(ISL_GIF_FOLDER, exist_ok=True)
os.makedirs(LETTERS_FOLDER, exist_ok=True)

# Alphabet array
alphabet = list(string.ascii_lowercase)

@app.route('/api/signs', methods=['GET'])
def get_available_signs():
    """Return the list of available sign phrases"""
    return jsonify({
        "signs": isl_gif,
        "alphabet": alphabet
    })

@app.route('/api/recognize', methods=['POST'])
def recognize_speech():
    """Process speech audio and return recognized text and corresponding signs"""
    try:
        # Check if audio data is provided
        if 'audio' not in request.files:
            # If no file, try to use WebSpeech API results from the request
            data = request.json
            if data and 'text' in data:
                return process_recognized_text(data['text'])
            else:
                return jsonify({"error": "No audio file or text provided"}), 400
        
        # Process the audio file
        audio_file = request.files['audio']
        
        # Save audio to a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_audio:
            audio_file.save(temp_audio.name)
            temp_filename = temp_audio.name
        
        # Perform speech recognition
        r = sr.Recognizer()
        with sr.AudioFile(temp_filename) as source:
            audio_data = r.record(source)
            text = r.recognize_google(audio_data).lower()
            
        # Clean up the temporary file
        os.unlink(temp_filename)
        
        # Process the recognized text
        return process_recognized_text(text)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def process_recognized_text(text):
    """Process the recognized text and return appropriate sign data"""
    # Remove punctuation
    for c in string.punctuation:
        text = text.replace(c, "")
    
    text = text.lower().strip()
    
    # Check for exit command
    if text in ['goodbye', 'good bye', 'bye']:
        return jsonify({
            "text": text,
            "action": "exit"
        })
    
    # Check if text is in the isl_gif list
    if text in isl_gif:
        return jsonify({
            "text": text,
            "type": "gif",
            "gifUrl": f"/api/gif/{text}"
        })
    else:
        # Return individual letters
        letters = [char for char in text if char in alphabet]
        return jsonify({
            "text": text,
            "type": "letters",
            "letters": letters,
            "letterUrls": [f"/api/letter/{letter}" for letter in letters]
        })

@app.route('/api/gif/<filename>', methods=['GET'])
def get_gif(filename):
    """Serve the sign language GIF for a specific phrase"""
    # In a real app, you would check if the file exists and return accordingly
    # For this example, we'll just try to serve from the GIF folder
    return send_from_directory(ISL_GIF_FOLDER, f"{filename}.gif")

@app.route('/api/letter/<letter>', methods=['GET'])
def get_letter(letter):
    """Serve the sign language image for a specific letter"""
    # Check if the letter is valid
    if letter.lower() in alphabet:
        return send_from_directory(LETTERS_FOLDER, f"{letter.lower()}.jpg")
    else:
        return jsonify({"error": "Invalid letter requested"}), 400

@app.route('/api/test-speech', methods=['POST'])
def test_speech():
    """Test endpoint for direct text processing without audio"""
    data = request.json
    if not data or 'text' not in data:
        return jsonify({"error": "No text provided"}), 400
    
    return process_recognized_text(data['text'])

# Serve static files from the frontend build directory if it exists
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    """Serve the React frontend"""
    static_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'frontend/build')
    if path != "" and os.path.exists(os.path.join(static_folder, path)):
        return send_from_directory(static_folder, path)
    else:
        return send_from_directory(static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True, port=4000)