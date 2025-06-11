from flask import Flask, request, jsonify 
from flask_cors import CORS 
from groq import Groq  
import cohere  
import re  
import threading  
import time  

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# API Keys for Groq and Cohere (replace with your actual keys)
GROQ_API_KEY = "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"
COHERE_API_KEY = "c4mOumKst3aQmG9rIpFFvFrtpCDwnCIt8MrcupdG"

# Initialize clients for Groq and Cohere
groq_client = Groq(api_key=GROQ_API_KEY)
cohere_client = cohere.Client(COHERE_API_KEY)

# Default response for empty messages
BOILERPLATE_MESSAGE = """
Hello from INDIC!
I am here to assist you with all your queries, doubts, and questions.
I can help with anything related to:
- Your language learning journey.
- Queries about the syllabus.
- Fun games that can make learning more exciting!
- Or any feedback you have for the platform!

Feel free to ask me anything within these topics, and let's get started on your learning path!
"""

# Dictionary to store conversation states per user
chat_states = {}

# Dictionary to store cached syllabi to avoid regenerating them
syllabus_cache = {}

# Route to test backend connection
@app.route('/test', methods=['GET'])
def test_connection():
    return jsonify({"status": "success", "message": "Backend is running!"})

# Main chat endpoint to handle messages
@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('userMessage', '').strip()
        user_id = data.get('userId', 'default_user')  # Use user ID to track state

        # If message is empty, send boilerplate message
        if not user_message:
            return jsonify({"reply": BOILERPLATE_MESSAGE})
        
        # If user has ongoing conversation state
        if user_id in chat_states:
            state = chat_states[user_id]
            
            # Handle confirmation for syllabus generation
            if state['expecting'] == 'syllabus_confirm':
                if re.search(r'yes|yeah|sure|ok|okay|generate|proceed', user_message.lower()):
                    chat_states[user_id] = {'expecting': 'proficiency', 'syllabus_data': {}}
                    return jsonify({"reply": "Great! What proficiency level do you need? (beginner, intermediate, advanced)"})
                else:
                    chat_states.pop(user_id, None)
                    return jsonify({"reply": "No problem! Let me know if you need anything else."})
            
            # Handle user input for proficiency
            elif state['expecting'] == 'proficiency':
                state['syllabus_data']['proficiency'] = user_message.lower()
                state['expecting'] = 'language'
                return jsonify({"reply": "Which language would you like to learn?"})
            
            # Handle user input for language
            elif state['expecting'] == 'language':
                state['syllabus_data']['language'] = user_message
                state['expecting'] = 'purpose'
                return jsonify({"reply": "What is your purpose for learning this language? (e.g., travel, business, general knowledge)"})
            
            # Handle user input for purpose and generate syllabus
            elif state['expecting'] == 'purpose':
                state['syllabus_data']['purpose'] = user_message
                syllabus_data = state['syllabus_data']

                # Create a cache key for this combination
                cache_key = f"{syllabus_data['proficiency']}_{syllabus_data['language']}_{syllabus_data['purpose']}"

                # If syllabus already exists in cache, return it
                if cache_key in syllabus_cache:
                    formatted_syllabus = syllabus_cache[cache_key]
                    chat_states.pop(user_id, None)
                    return jsonify({"reply": formatted_syllabus})
                
                try:
                    # Generate a new syllabus if not cached
                    syllabus = generate_syllabus_shorter(
                        syllabus_data['proficiency'],
                        syllabus_data['language'],
                        syllabus_data['purpose']
                    )

                    # Format and cache the syllabus
                    formatted_syllabus = format_syllabus_for_chat(syllabus)
                    syllabus_cache[cache_key] = formatted_syllabus
                    chat_states.pop(user_id, None)

                    return jsonify({"reply": formatted_syllabus})
                except Exception as e:
                    chat_states.pop(user_id, None)
                    return jsonify({"reply": f"Sorry, I couldn't generate the syllabus: {str(e)}"})

        # If user asks to create a syllabus
        if re.search(r'(create|generate|make|build|design).*syllabus', user_message.lower()):
            chat_states[user_id] = {'expecting': 'syllabus_confirm'}
            return jsonify({"reply": "Would you like me to create a customized language learning syllabus for you?"})
        
        # Default behavior: use Groq API for general responses
        response = generate_groq_response(user_message)
        return jsonify({"reply": response})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"reply": "Sorry, something went wrong on the server. Please try again later."}), 500

# Function to get AI-generated reply using Groq API
def generate_groq_response(user_message):
    try:
        messages = [
            {"role": "system", "content": "You are a helpful assistant for a language learning platform called INDIC."},
            {"role": "user", "content": user_message}
        ]

        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.7,
            max_completion_tokens=150,
            stream=False
        )

        return completion.choices[0].message.content.strip()

    except Exception as e:
        print(f"Groq API Error: {e}")
        return "Sorry, I couldn't generate a response. Please try again later."

# Shorter version of syllabus generation using Cohere (for quick testing)
def generate_syllabus_shorter(proficiency, language, purpose):
    input_prompt = (
        f"Generate a brief learning conversation script (5 exchanges) for learning {language} "
        f"at the {proficiency} level, focusing on {purpose}. Use this format:\n\n"
        f"Teacher: [Dialogue]\n"
        f"Student: [Response]\n\n"
    )

    response = cohere_client.generate(
        model='command',
        prompt=input_prompt,
        max_tokens=500,
        temperature=0.9
    )

    output_text = response.generations[0].text.strip()
    structured_syllabus = []

    exchanges = output_text.split("Teacher:")
    for exchange in exchanges:
        lines = exchange.strip().split("\n")
        if len(lines) >= 2:
            teacher_dialogue = lines[0].strip()
            student_response = lines[1].replace("Student:", "").strip()

            structured_syllabus.append({
                "text": teacher_dialogue,
                "expected": student_response,
                "english": "",
                "animation": ""
            })

    return structured_syllabus

# Full version of syllabus generation using Cohere (recommended for production)
def generate_syllabus(proficiency, language, purpose):
    input_prompt = (
        f"Generate a structured learning conversation script for learning {language} "
        f"at the {proficiency} level, focusing on {purpose}. The dialogue should be engaging and realistic, mimicking "
        f"a real classroom session where the teacher explains concepts, asks questions, and the student responds. "
        f"Format each exchange as follows:\n\n"
        f"Teacher: [Dialogue explaining a concept and prompting the student on what to say].\n"
        f"Student: [Expected Response]\n\n"
        f"Ensure at least 10 structured exchanges, with clear interactions."
    )

    response = cohere_client.generate(
        model='command',
        prompt=input_prompt,
        max_tokens=1024,
        temperature=0.7
    )

    output_text = response.generations[0].text.strip()
    structured_syllabus = []

    exchanges = output_text.split("Teacher:")
    for exchange in exchanges:
        lines = exchange.strip().split("\n")
        if len(lines) >= 2:
            teacher_dialogue = lines[0].strip()
            student_response = lines[1].replace("Student:", "").strip()

            structured_syllabus.append({
                "text": teacher_dialogue,
                "expected": student_response,
                "english": "",
                "animation": ""
            })

    return structured_syllabus

# Convert syllabus structure into a readable chat format
def format_syllabus_for_chat(syllabus):
    formatted_text = "Here's your personalized syllabus:\n\n"

    for i, item in enumerate(syllabus):
        if item["text"]:
            formatted_text += f"Lesson {i+1}:\n"
            formatted_text += f"Teacher: {item['text']}\n"
            formatted_text += f"Student: {item['expected']}\n\n"

    formatted_text += "You can follow this curriculum to improve your language skills. Would you like to practice any specific lesson?"
    return formatted_text

# Entry point to run the Flask app
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
