from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
import cohere
import re
import json
import os
import random
import string

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for frontend-backend communication

# API Keys for Groq and Cohere
GROQ_API_KEY = "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"
COHERE_API_KEY = "c4mOumKst3aQmG9rIpFFvFrtpCDwnCIt8MrcupdG"

# Initialize API clients
groq_client = Groq(api_key=GROQ_API_KEY)
cohere_client = cohere.Client(COHERE_API_KEY)

# Default welcome message
BOILERPLATE_MESSAGE = """
Hello from INDIC! 
I am here to assist you with all your queries, doubts, and questions.
I can help with anything related to:
- Your language learning journey.
- Queries about the syllabus.
- Fun games that can make learning more exciting!🎮
- Or any feedback you have for the platform!

Feel free to ask me anything within these topics, and let's get started on your learning path!
"""

# In-memory dictionary to track conversation states for users
chat_states = {}

# Test route to check if backend is up and running
@app.route('/test', methods=['GET'])
def test_connection():
    return jsonify({"status": "success", "message": "Backend is running!"})

# Main chat endpoint
@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('userMessage', '').strip()
        user_id = data.get('userId', 'default_user')  # Unique user ID to maintain state
        
        # If message is empty, return boilerplate response
        if not user_message:
            return jsonify({"reply": BOILERPLATE_MESSAGE})
        
        # Handle multi-turn syllabus generation flow
        if user_id in chat_states:
            state = chat_states[user_id]

            # Confirm syllabus generation
            if state['expecting'] == 'syllabus_confirm':
                if re.search(r'yes|yeah|sure|ok|okay|generate|proceed', user_message.lower()):
                    chat_states[user_id] = {'expecting': 'proficiency', 'syllabus_data': {}}
                    return jsonify({"reply": "Great! What proficiency level do you need? (beginner, intermediate, advanced)"})
                else:
                    chat_states.pop(user_id, None)
                    return jsonify({"reply": "No problem! Let me know if you need anything else."})
            
            # Ask for language proficiency
            elif state['expecting'] == 'proficiency':
                state['syllabus_data']['proficiency'] = user_message.lower()
                state['expecting'] = 'language'
                return jsonify({"reply": "Which language would you like to learn?"})
            
            # Ask for language to learn
            elif state['expecting'] == 'language':
                state['syllabus_data']['language'] = user_message
                state['expecting'] = 'purpose'
                return jsonify({"reply": "What is your purpose for learning this language? (e.g., travel, business, general knowledge)"})
            
            # Ask for learning purpose and generate syllabus
            elif state['expecting'] == 'purpose':
                state['syllabus_data']['purpose'] = user_message
                syllabus_data = state['syllabus_data']

                # Generate syllabus based on user input
                syllabus = generate_syllabus(
                    syllabus_data['proficiency'],
                    syllabus_data['language'],
                    syllabus_data['purpose']
                )

                # Save syllabus to JSON file
                file_name = generate_random_filename()
                with open(file_name, 'w', encoding='utf-8') as f:
                    json.dump(syllabus, f, ensure_ascii=False, indent=4)

                # Format syllabus and clear state
                formatted_syllabus = format_syllabus_for_chat(syllabus)
                chat_states.pop(user_id, None)

                return jsonify({"reply": f"Your syllabus has been saved! You can find it in {file_name}.\n\n{formatted_syllabus}"})
        
        # Detect syllabus-related query and begin flow
        if re.search(r'(create|generate|make|build|design).*syllabus', user_message.lower()):
            chat_states[user_id] = {'expecting': 'syllabus_confirm'}
            return jsonify({"reply": "Would you like me to create a customized language learning syllabus for you?"})
        
        # For all other messages, generate generic AI response
        response = generate_groq_response(user_message)
        return jsonify({"reply": response})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"reply": "Sorry, something went wrong on the server. Please try again later."}), 500

# Generate a reply using Groq LLaMA-3.3 70B model
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

# Generate a unique filename for saving syllabus
def generate_random_filename():
    folder_path = "generated_syllabus"
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
    
    random_str = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
    return os.path.join(folder_path, f"syllabus_{random_str}.json")

# Generate syllabus using Cohere API
def generate_syllabus(proficiency, language, purpose):
    input_prompt = (
        f"Generate a structured learning conversation script for learning {language} "
        f"at the {proficiency} level, focusing on {purpose}. The dialogue should be engaging and realistic, mimicking "
        f"a real classroom session where the teacher explains concepts, asks questions, and the student responds. "
        f"Ensure at least 10 structured exchanges."
    )

    response = cohere_client.generate(
        model='command',
        prompt=input_prompt,
        max_tokens=1024,
        temperature=0.7,
    )

    output_text = response.generations[0].text.strip()
    structured_syllabus = []
    exchanges = output_text.split("Teacher:")

    for exchange in exchanges:
        lines = exchange.strip().split("\n")
        if len(lines) >= 2:
            structured_syllabus.append({
                "text": lines[0].strip(),
                "expected": lines[1].replace("Student:", "").strip(),
                "english": "",
                "animation": ""
            })
    
    return structured_syllabus

# Format syllabus for display in chat
def format_syllabus_for_chat(syllabus):
    formatted_text = "Here's your personalized syllabus:\n\n"
    
    for i, item in enumerate(syllabus):
        if item["text"]:
            formatted_text += f"Lesson {i+1}:\n"
            formatted_text += f"Teacher: {item['text']}\n"
            formatted_text += f"Student: {item['expected']}\n\n"
    
    formatted_text += "You can follow this curriculum to improve your language skills. Would you like to practice any specific lesson?"
    
    return formatted_text

# Run the Flask app on localhost
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
