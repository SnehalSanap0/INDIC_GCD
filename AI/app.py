# ----------------------------------------------
# INDIC AI Chat Backend - Flask Application
# Description: Handles AI-powered conversation and syllabus generation

# ----------------------------------------------

from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
import cohere
import re
import json
import os
import random
import string

# Initialize the Flask app
app = Flask(__name__)

# Enable CORS to allow requests from frontend or other domains
# This is crucial for local development where frontend and backend might run on different ports.
CORS(app)

# ----------------------------------------------
# API Keys
# IMPORTANT: In a production environment, these should be loaded from secure environment variables
# or a secrets management service, not hardcoded.
# ----------------------------------------------
GROQ_API_KEY = "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"
COHERE_API_KEY = "c4mOumKst3aQmG9rIpFFvFrtpCDwnCIt8MrcupdG"

# Initialize API clients for Groq and Cohere
groq_client = Groq(api_key=GROQ_API_KEY)
cohere_client = cohere.Client(COHERE_API_KEY)

# ----------------------------------------------
# Boilerplate welcome message
# This message is displayed when a user sends an empty or generic query.
# ----------------------------------------------
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

# Dictionary to store user-specific chat states for multi-turn conversation handling.
# This allows the application to remember the context of a conversation for each user.
chat_states = {}

# ----------------------------------------------
# ROUTE: Health check API
# Endpoint: /test
# Method: GET
# Description: Checks if the backend server is running and accessible.
# ----------------------------------------------
@app.route('/test', methods=['GET'])
def test_connection():
    return jsonify({"status": "success", "message": "Backend is running!"})

# ----------------------------------------------
# ROUTE: Chat handler
# Endpoint: /chat
# Method: POST
# Description: Handles both general AI-powered conversation and a multi-step syllabus generation workflow.
# ----------------------------------------------
@app.route('/chat', methods=['POST'])
def chat():
    try:
        # Get JSON data from the request body
        data = request.get_json()
        user_message = data.get('userMessage', '').strip()
        user_id = data.get('userId', 'default_user')  # Use a default ID if not provided

        # If the user message is empty, return the boilerplate welcome message
        if not user_message:
            return jsonify({"reply": BOILERPLATE_MESSAGE})
        
        # --- Syllabus Generation Workflow ---
        # Check if the user is in an ongoing syllabus generation conversation
        if user_id in chat_states:
            state = chat_states[user_id]
            
            # Step 1: User previously asked to create a syllabus, now expecting confirmation
            if state['expecting'] == 'syllabus_confirm':
                # Check for affirmative responses to proceed with syllabus generation
                if re.search(r'yes|yeah|sure|ok|okay|generate|proceed', user_message.lower()):
                    # Transition to the next step: ask for proficiency level
                    chat_states[user_id] = {'expecting': 'proficiency', 'syllabus_data': {}}
                    return jsonify({"reply": "Great! What proficiency level do you need? (beginner, intermediate, advanced)"})
                else:
                    # User declined, cancel the syllabus flow
                    chat_states.pop(user_id, None) # Remove user's state
                    return jsonify({"reply": "No problem! Let me know if you need anything else."})

            # Step 2: User is expected to provide proficiency level
            elif state['expecting'] == 'proficiency':
                state['syllabus_data']['proficiency'] = user_message.lower()
                state['expecting'] = 'language' # Transition to next step: ask for language
                return jsonify({"reply": "Which language would you like to learn?"})

            # Step 3: User is expected to provide the language
            elif state['expecting'] == 'language':
                state['syllabus_data']['language'] = user_message
                state['expecting'] = 'purpose' # Transition to next step: ask for purpose
                return jsonify({"reply": "What is your purpose for learning this language? (e.g., travel, business, general knowledge)"})

            # Step 4: User is expected to provide the purpose, then generate the syllabus
            elif state['expecting'] == 'purpose':
                state['syllabus_data']['purpose'] = user_message
                syllabus_data = state['syllabus_data']

                # Call the AI function to generate the syllabus based on collected data
                syllabus = generate_syllabus(
                    syllabus_data['proficiency'],
                    syllabus_data['language'],
                    syllabus_data['purpose']
                )

                # Save the generated syllabus to a randomly named JSON file
                file_name = generate_random_filename()
                with open(file_name, 'w', encoding='utf-8') as f:
                    json.dump(syllabus, f, ensure_ascii=False, indent=4)

                # Format the syllabus for a user-friendly chat response
                formatted_syllabus = format_syllabus_for_chat(syllabus)
                chat_states.pop(user_id, None) # Clear user's state after completing the workflow

                return jsonify({"reply": f"Your syllabus has been saved! You can find it in {file_name}.\n\n{formatted_syllabus}"})

        # --- Initial Syllabus Keyword Detection ---
        # If no ongoing conversation, check if the user's message indicates a desire to generate a syllabus
        if re.search(r'(create|generate|make|build|design).*syllabus', user_message.lower()):
            # Initiate the syllabus generation workflow by setting the user's state
            chat_states[user_id] = {'expecting': 'syllabus_confirm'}
            return jsonify({"reply": "Would you like me to create a customized language learning syllabus for you?"})

        # --- General AI Response ---
        # If no specific workflow is triggered, generate a general response using Groq AI
        response = generate_groq_response(user_message)
        return jsonify({"reply": response})

    except Exception as e:
        # Log any errors that occur during processing
        print(f"Error: {e}")
        return jsonify({"reply": "Sorry, something went wrong on the server. Please try again later."}), 500

# ----------------------------------------------
# FUNCTION: Generate a response using Groq AI API
# Parameters:
# - user_message (str): The message from the user to send to the AI.
# Returns:
# - str: The AI-generated response.
# ----------------------------------------------
def generate_groq_response(user_message):
    try:
        # Define the messages for the AI, including a system role for context
        messages = [
            {"role": "system", "content": "You are a helpful assistant for a language learning platform called INDIC."},
            {"role": "user", "content": user_message}
        ]

        # Call the Groq API to get a chat completion
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile", # Specify the AI model to use
            messages=messages,
            temperature=0.7, # Controls the randomness of the response (0.0 for deterministic, 1.0 for more creative)
            max_completion_tokens=150, # Maximum number of tokens (words/parts of words) in the response
            stream=False # Do not stream the response
        )

        # Extract and return the content of the AI's response
        return completion.choices[0].message.content.strip()

    except Exception as e:
        # Log and return a friendly error message if the Groq API call fails
        print(f"Groq API Error: {e}")
        return "Sorry, I couldn't generate a response. Please try again later."

# ----------------------------------------------
# FUNCTION: Generate a random file name and create a directory if it doesn't exist
# Returns:
# - str: The path to the generated JSON file.
# ----------------------------------------------
def generate_random_filename():
    folder_path = "generated_syllabus"
    # Create the directory if it doesn't already exist
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

    # Generate a random string for the filename to ensure uniqueness
    random_str = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
    return os.path.join(folder_path, f"syllabus_{random_str}.json")

# ----------------------------------------------
# FUNCTION: Generate syllabus using Cohere's LLM
# Parameters:
# - proficiency (str): The user's proficiency level (beginner, intermediate, advanced).
# - language (str): The language the user wants to learn.
# - purpose (str): The user's purpose for learning the language.
# Returns:
# - list: A list of dictionaries, each representing a structured exchange in the syllabus.
# ----------------------------------------------
def generate_syllabus(proficiency, language, purpose):
    # Construct a detailed prompt for Cohere's LLM to generate a structured learning script
    input_prompt = (
        f"Generate a structured learning conversation script for learning {language} "
        f"at the {proficiency} level, focusing on {purpose}. The dialogue should be engaging and realistic, mimicking "
        f"a real classroom session where the teacher explains concepts, asks questions, and the student responds. "
        f"Ensure at least 10 structured exchanges. Start each teacher's turn with 'Teacher:' and each student's turn with 'Student:'."
    )

    # Call the Cohere API to generate the text
    response = cohere_client.generate(
        model='command', # Specify the Cohere model
        prompt=input_prompt,
        max_tokens=1024, # Maximum number of tokens in the generated response
        temperature=0.7, # Controls creativity
    )

    output_text = response.generations[0].text.strip()
    structured_syllabus = []
    
    # Split the output text by "Teacher:" to parse individual exchanges
    # The first element might be empty or a pre-amble, so we start processing from the second element.
    exchanges = output_text.split("Teacher:")

    # Process the conversation into a structured JSON-like format
    for exchange in exchanges:
        lines = exchange.strip().split("Student:") # Split each exchange into teacher and student parts
        if len(lines) >= 2: # Ensure both teacher and student parts are present
            teacher_text = lines[0].strip()
            student_expected = lines[1].strip()

            # Append the structured exchange to the list
            structured_syllabus.append({
                "text": teacher_text,
                "expected": student_expected,
                "english": "", # Placeholder for potential future translation
                "animation": "" # Placeholder for potential future animation cues
            })

    return structured_syllabus

# ----------------------------------------------
# FUNCTION: Format syllabus into a chat-readable format
# Parameters:
# - syllabus (list): The structured syllabus generated by the AI.
# Returns:
# - str: A human-readable formatted string of the syllabus.
# ----------------------------------------------
def format_syllabus_for_chat(syllabus):
    formatted_text = "Here's your personalized syllabus:\n\n"
    
    # Iterate through each lesson/exchange in the syllabus
    for i, item in enumerate(syllabus):
        # Only include items that have actual teacher text
        if item.get("text"):
            formatted_text += f"Lesson {i+1}:\n"
            formatted_text += f"Teacher: {item['text']}\n"
            formatted_text += f"Student: {item['expected']}\n\n"

    formatted_text += "You can follow this curriculum to improve your language skills. Would you like to practice any specific lesson?"
    return formatted_text

# ----------------------------------------------
# Start the Flask development server
# This block ensures the server runs only when the script is executed directly.
# host='127.0.0.1': Makes the server accessible only from the local machine.
# port=5500: Specifies the port number.
# debug=True: Enables debug mode, which provides detailed error messages and auto-reloads the server on code changes.
# IMPORTANT: debug=True should NEVER be used in a production environment due to security risks.
# ----------------------------------------------
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5500, debug=True)