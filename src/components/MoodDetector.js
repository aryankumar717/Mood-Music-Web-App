import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";

const MoodDetector = ({ onMoodDetected }) => {
  const webcamRef = useRef(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [currentMood, setCurrentMood] = useState(null);
  const [modelLoaded, setModelLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceExpressionNet.loadFromUri("/models");
        setModelLoaded(true);
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };
    loadModels();
  }, []);

  const detectMood = async () => {
    if (!webcamRef.current) return;

    const video = webcamRef.current.video;
    if (!video) return;

    try {
      const detections = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections && detections.expressions) {
        const expressions = detections.expressions;
        const topExpression = expressions.asSortedArray()[0];

        // Map face-api.js emotions to our moods
        const moodMapping = {
          happy: "happy",
          sad: "sad",
          angry: "angry",
          surprised: "surprised",
          neutral: "calm", // treat neutral as calm
          fearful: "sad", // map fearful → sad
          disgusted: "angry", // map disgust → angry
        };

        let mappedMood = "calm";

        // Apply confidence threshold (0.6 = 60%)
        if (topExpression.probability >= 0.6) {
          mappedMood = moodMapping[topExpression.expression] || "calm";
        }

        setCurrentMood(mappedMood);
        onMoodDetected(mappedMood);
      } else {
        console.log("No face detected.");
      }
    } catch (error) {
      console.error("Error detecting mood:", error);
    }
  };

  const startDetection = () => {
    setIsDetecting(true);
    setTimeout(async () => {
      await detectMood();
      setIsDetecting(false);
    }, 3000);
  };

  const getMoodEmoji = (mood) => {
    const moodEmojis = {
      happy: "😊",
      sad: "😢",
      angry: "😠",
      surprised: "😲",
      neutral: "😐",
      calm: "😌",
    };
    return moodEmojis[mood] || "😐";
  };

  const getMoodColor = (mood) => {
    const moodColors = {
      happy: "text-yellow-500",
      sad: "text-blue-500",
      angry: "text-red-500",
      surprised: "text-purple-500",
      neutral: "text-gray-500",
      calm: "text-green-500",
    };
    return moodColors[mood] || "text-gray-500";
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4 text-white">Mood Detection</h2>

      <div className="relative mb-4">
        <Webcam
          ref={webcamRef}
          audio={false}
          width={320}
          height={240}
          className="rounded-lg border-2 border-white/30"
        />
        {isDetecting && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
            <div className="text-white text-lg font-bold">Detecting mood...</div>
          </div>
        )}
      </div>

      {currentMood && (
        <div className="mb-4">
          <div className={`text-4xl ${getMoodColor(currentMood)}`}>
            {getMoodEmoji(currentMood)}
          </div>
          <p className={`text-lg font-semibold ${getMoodColor(currentMood)}`}>
            {currentMood.charAt(0).toUpperCase() + currentMood.slice(1)}
          </p>
        </div>
      )}

      <button
        onClick={startDetection}
        disabled={!modelLoaded || isDetecting}
        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition-colors"
      >
        {!modelLoaded ? "Loading..." : isDetecting ? "Detecting..." : "Detect My Mood"}
      </button>

      <p className="text-white/60 text-sm mt-2">
        {!modelLoaded ? "Loading AI model..." : "Click to detect your mood from facial expression"}
      </p>
    </div>
  );
};

export default MoodDetector;
