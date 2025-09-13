import React, { useState } from 'react';

const TextMoodAnalyzer = ({ onMoodDetected }) => {
  const [text, setText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const analyzeTextMood = (inputText) => {
    const words = inputText.toLowerCase().split(/\s+/);
    
    // Simple keyword-based mood analysis
    const moodKeywords = {
      happy: ['happy', 'joy', 'excited', 'great', 'amazing', 'wonderful', 'fantastic', 'love', 'loved', 'awesome', 'brilliant', 'excellent', 'perfect', 'smile', 'laugh', 'cheerful', 'delighted', 'thrilled', 'ecstatic', 'blissful'],
      sad: ['sad', 'depressed', 'down', 'upset', 'crying', 'tears', 'hurt', 'pain', 'grief', 'sorrow', 'melancholy', 'gloomy', 'blue', 'miserable', 'unhappy', 'disappointed', 'heartbroken', 'devastated', 'hopeless', 'lonely'],
      angry: ['angry', 'mad', 'furious', 'rage', 'irritated', 'annoyed', 'frustrated', 'hate', 'hated', 'disgusted', 'outraged', 'livid', 'enraged', 'fuming', 'aggressive', 'hostile', 'bitter', 'resentful', 'indignant', 'wrathful'],
      anxious: ['anxious', 'worried', 'nervous', 'stressed', 'tense', 'uneasy', 'restless', 'fearful', 'scared', 'afraid', 'panic', 'overwhelmed', 'pressured', 'strained', 'jittery', 'apprehensive', 'concerned', 'troubled', 'distressed', 'agitated'],
      calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'content', 'satisfied', 'comfortable', 'at ease', 'composed', 'collected', 'balanced', 'centered', 'grounded', 'stable', 'steady', 'quiet', 'still', 'gentle', 'mellow']
    };

    const moodScores = {};
    
    // Calculate scores for each mood
    Object.keys(moodKeywords).forEach(mood => {
      moodScores[mood] = moodKeywords[mood].reduce((score, keyword) => {
        return score + words.filter(word => word.includes(keyword)).length;
      }, 0);
    });

    // Find the mood with the highest score
    const detectedMood = Object.keys(moodScores).reduce((a, b) => 
      moodScores[a] > moodScores[b] ? a : b
    );

    // If no keywords match, try to detect sentiment from overall text
    if (moodScores[detectedMood] === 0) {
      return analyzeSentiment(inputText);
    }

    return detectedMood;
  };

  const analyzeSentiment = (inputText) => {
    // Simple sentiment analysis based on punctuation and common patterns
    const positivePatterns = /[!]{2,}|[?]{2,}|[.]{3,}|(amazing|wow|yes|yeah|yay)/gi;
    const negativePatterns = /(no|not|never|nothing|nobody|nowhere|none)/gi;
    
    const positiveMatches = (inputText.match(positivePatterns) || []).length;
    const negativeMatches = (inputText.match(negativePatterns) || []).length;
    
    if (positiveMatches > negativeMatches) return 'happy';
    if (negativeMatches > positiveMatches) return 'sad';
    return 'neutral';
  };

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    setAnalyzing(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const mood = analyzeTextMood(text);
      onMoodDetected(mood);
      setAnalyzing(false);
    }, 1000);
  };


  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4 text-white">Text Mood Analysis</h2>
      
      <div className="mb-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="How are you feeling today? Tell me about your day..."
          className="w-full p-4 border border-white/30 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/10 text-white placeholder-white/60"
          rows={4}
        />
      </div>

      <button
        onClick={handleAnalyze}
        disabled={!text.trim() || analyzing}
        className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition-colors"
      >
        {analyzing ? 'Analyzing...' : 'Analyze My Mood'}
      </button>
      
      <p className="text-white/60 text-sm mt-2">
        Type about your day and I'll analyze your mood
      </p>
    </div>
  );
};

export default TextMoodAnalyzer;
