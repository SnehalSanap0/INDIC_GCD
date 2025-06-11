# Import necessary libraries
from flask import Flask, Response, jsonify  # For building the web API
from flask_cors import CORS  # To allow cross-origin requests (for frontend-backend communication)
import cv2  # OpenCV for working with camera and image processing
from transformers import DetrImageProcessor, DetrForObjectDetection  # For object detection using pre-trained DETR model
from PIL import Image  # To convert OpenCV image to PIL format
import torch  # PyTorch for handling tensors
from gtts import gTTS  # Google Text-to-Speech for generating audio
from playsound import playsound  # To play audio output
from threading import Thread  # To run tasks in parallel (like audio)
import os  # For interacting with the operating system
import time  # For managing time-based operations
from deep_translator import GoogleTranslator  # To translate text to Hindi

# Initialize translator with auto-detect source language and Hindi as target
translator = GoogleTranslator(source='auto', target='hi')

# Create the Flask app
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# Initialize global variables
camera = None  # This will hold the camera object
is_streaming = False  # Flag to control the stream status
last_detection_time = {}  # Dictionary to remember when an object was last announced

# Load object detection model and processor
print("Loading models... This may take a few moments.")
processor = DetrImageProcessor.from_pretrained("facebook/detr-resnet-50", revision="no_timm")
model = DetrForObjectDetection.from_pretrained("facebook/detr-resnet-50", revision="no_timm")
print("Models loaded successfully!")

# Function to translate text to Hindi
def translate_text(text):
    try:
        translation = translator.translate(text)
        return translation
    except Exception as e:
        print(f"Translation error: {e}")
        return text  # If translation fails, return the original text

# Function to play the translated audio using gTTS
def play_audio(text):
    try:
        tts = gTTS(f"Yaha hai {text}", lang="hi")  # Convert text to Hindi speech
        audio_file = "output.mp3"
        tts.save(audio_file)  # Save the audio
        playsound(audio_file)  # Play the audio
        os.remove(audio_file)  # Delete the audio file after playing
    except Exception as e:
        print(f"Error in audio playback: {e}")

# Function to continuously read frames from the camera and detect objects
def generate_frames():
    global camera, is_streaming, last_detection_time

    while is_streaming:
        success, frame = camera.read()  # Read a frame from the camera
        if not success:
            break  # Stop if frame cannot be read

        try:
            # Convert BGR image (OpenCV format) to RGB (PIL format)
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            image = Image.fromarray(rgb_frame)

            # Prepare image for model
            inputs = processor(images=image, return_tensors="pt")
            outputs = model(**inputs)  # Run object detection

            # Convert model output to readable format with a confidence threshold
            target_sizes = torch.tensor([image.size[::-1]])
            results = processor.post_process_object_detection(outputs, target_sizes=target_sizes, threshold=0.9)[0]

            current_time = time.time()  # Capture current time for cooldown

            # Loop through detected objects
            for score, label, box in zip(results["scores"], results["labels"], results["boxes"]):
                if score > 0.9:  # Only consider high-confidence detections
                    label_name = model.config.id2label[label.item()]  # Get object name

                    # Translate the detected label to Hindi
                    translated_label = translate_text(label_name)

                    # If object is not recently announced, play audio
                    if label_name not in last_detection_time or \
                       (current_time - last_detection_time[label_name]) > 5:  # 5 seconds cooldown
                        Thread(target=play_audio, args=(translated_label,)).start()  # Speak in separate thread
                        last_detection_time[label_name] = current_time  # Update last detection time

                    # Draw bounding box on frame
                    box = [round(i, 2) for i in box.tolist()]
                    x_min, y_min, x_max, y_max = map(int, box)
                    cv2.rectangle(frame, (x_min, y_min), (x_max, y_max), (0, 255, 0), 2)  # Green box
                    cv2.putText(frame, translated_label, (x_min, y_min - 10),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)  # Label above box

            # Convert frame to JPEG format for video streaming
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()

            # Return the frame as part of an HTTP response
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

        except Exception as e:
            print(f"Error processing frame: {e}")
            continue

# Route to start the camera stream
@app.route('/start')
def start_stream():
    global camera, is_streaming

    try:
        if camera is None:
            camera = cv2.VideoCapture(0)  # Open the webcam

        if not camera.isOpened():
            return jsonify({"error": "Could not open camera"}), 500

        is_streaming = True  # Start streaming
        return jsonify({"status": "Stream started successfully"})

    except Exception as e:
        return jsonify({"error": f"Failed to start stream: {str(e)}"}), 500

# Route to stop the camera stream
@app.route('/stop')
def stop_stream():
    global camera, is_streaming

    try:
        is_streaming = False  # Stop the streaming loop
        if camera is not None:
            camera.release()  # Release the camera resource
            camera = None
        return jsonify({"status": "Stream stopped successfully"})

    except Exception as e:
        return jsonify({"error": f"Failed to stop stream: {str(e)}"}), 500

# Route to serve video feed as a live stream
@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

# Route to get status of the camera and stream
@app.route('/status')
def get_status():
    return jsonify({
        "is_streaming": is_streaming,
        "camera_initialized": camera is not None
    })

# Default route to show that server is running
@app.route('/')
def index():
    return "Enhanced Object Detection API with Hindi Translation is running!"

# Main block to run the Flask server
if __name__ == '__main__':
    try:
        port = int(os.environ.get('PORT', 8000))  # Use environment port or default 8000
        app.run(host='0.0.0.0', port=port, debug=True)  # Start Flask app on all interfaces
    except Exception as e:
        print(f"Failed to start server: {e}")
    finally:
        if camera is not None:
            camera.release()  # Ensure camera is released when app stops
