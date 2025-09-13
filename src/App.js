import React, { useState } from 'react';
import MoodDetector from './components/MoodDetector';
import TextMoodAnalyzer from './components/TextMoodAnalyzer';
import MusicPlaylist from './components/MusicPlaylist';

function App() {
  const [currentMood, setCurrentMood] = useState(null);
  const [detectionMethod, setDetectionMethod] = useState(null);
  const [activeTab, setActiveTab] = useState('detection');

  const handleMoodDetected = (mood, method = 'unknown') => {
    setCurrentMood(mood);
    setDetectionMethod(method);
    setActiveTab('playlist');
  };

  const resetApp = () => {
    setCurrentMood(null);
    setDetectionMethod(null);
    setActiveTab('detection');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">MoodTunes 🎶</h1>
          <p className="text-white/80 text-lg">Discover music that matches your mood</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-2 border border-white/20">
            <button
              onClick={() => setActiveTab('detection')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'detection'
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Mood Detection
            </button>
            <button
              onClick={() => setActiveTab('playlist')}
              disabled={!currentMood}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ml-2 ${
                activeTab === 'playlist'
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              Your Playlist
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'detection' && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Facial Expression Detection */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <MoodDetector 
                  onMoodDetected={(mood) => handleMoodDetected(mood, 'facial expression')} 
                />
              </div>

              {/* Text Mood Analysis */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <TextMoodAnalyzer 
                  onMoodDetected={(mood) => handleMoodDetected(mood, 'text analysis')} 
                />
              </div>
            </div>
          )}

          {activeTab === 'playlist' && currentMood && (
            <div className="flex justify-center">
              <div className="w-full">
                <div className="text-center mb-6">
                  <button
                    onClick={resetApp}
                    className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    ← Try Another Mood
                  </button>
                </div>
                <MusicPlaylist mood={currentMood} detectedBy={detectionMethod} />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-white/60 text-sm">
            Powered by AI mood detection and music recommendation
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
