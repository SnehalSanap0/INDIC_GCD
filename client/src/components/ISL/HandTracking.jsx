import { useEffect, useRef, useState } from "react";
import * as cam from "@mediapipe/camera_utils";
import * as hands from "@mediapipe/hands";

const HandTracking = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null); // To store camera instance
  const [gesture, setGesture] = useState("Press Start to detect gestures");
  const [isCameraOn, setIsCameraOn] = useState(false);

  useEffect(() => {
    const handLandmarker = new hands.Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    handLandmarker.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    handLandmarker.onResults((results) => {
      const canvasCtx = canvasRef.current.getContext("2d");
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      if (results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0]; // Get first detected hand
        drawHand(landmarks, canvasCtx);
        const detectedGesture = detectGesture(landmarks);
        setGesture(detectedGesture);
      } else {
        setGesture("No hand detected");
      }
    });

    if (isCameraOn && videoRef.current) {
      cameraRef.current = new cam.Camera(videoRef.current, {
        onFrame: async () => {
          await handLandmarker.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });
      cameraRef.current.start();
    }

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
    };
  }, [isCameraOn]); // Run only when camera state changes

  // Draw keypoints on canvas
  const drawHand = (landmarks, canvasCtx) => {
    landmarks.forEach((point) => {
      canvasCtx.beginPath();
      canvasCtx.arc(point.x * canvasRef.current.width, point.y * canvasRef.current.height, 5, 0, 2 * Math.PI);
      canvasCtx.fillStyle = "red";
      canvasCtx.fill();
    });
  };

  // Detect Gesture based on finger positions
  const detectGesture = (landmarks) => {
    const [thumb, index, middle, ring, pinky] = landmarks;

    if (index.y < middle.y && middle.y < ring.y && ring.y < pinky.y) return "अ";
    if (thumb.x < index.x && thumb.y < index.y) return "आ";
    if (thumb.x > pinky.x) return "म";

    return "Unknown Gesture";
  };

  // Start and Stop Camera Handlers
  const handleStart = () => {
    setIsCameraOn(true);
  };

  const handleStop = () => {
    setIsCameraOn(false);
    setGesture("Press Start to detect gestures");
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-b from-blue-400 via-cyan-200 to-white p-4">
      {/* <h2 className="text-2xl font-semibold mb-4">ISL Gesture Recognition</h2> */}
      <div className="h-25"></div>

      <div className="relative">
        <video ref={videoRef} className="hidden" />
        <canvas ref={canvasRef} width="640" height="480" className="border-2 border-gray-300 rounded-lg shadow-md" />
      </div>

      <p className="mt-4 text-lg font-bold text-blue-600">{gesture}</p>

      <div className="mt-4 space-x-4">
        <button
          onClick={handleStart}
          disabled={isCameraOn}
          className={`px-6 py-2 rounded-lg text-white font-semibold transition ${
            isCameraOn ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          Start
        </button>
        <button
          onClick={handleStop}
          disabled={!isCameraOn}
          className={`px-6 py-2 rounded-lg text-white font-semibold transition ${
            !isCameraOn ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
          }`}
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default HandTracking;