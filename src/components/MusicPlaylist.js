import React from "react";
import YouTube from "react-youtube";

const moodSongs = {

    happy: ["2Vv-BfVoq4g", "lY2yjAdbvdQ", "09R8_2nJtjg", "kJQP7kiw5Fk"], 
    sad:   ["RgKAFK5djSk", "JGwWNGJdvx8", "RBumgq5yVrA", "hLQl3WQQoQ0"],
    calm:  ["0yW7w8F2TVA", "ktvTqknDobU", "YVkUvmDQ3HY", "UceaB4D0jpo"],
    angry: ["gCYcHz2k5x0", "YqeW9_5kURI", "3AtDnEC4zak", "hTWKbfoikeg"],
    surprised: ["6Dh-RL__uN4", "pRpeEdMmmQ0", "OPf0YbXqDm0", "uelHwf8o7_U"],
  };
  

function MusicPlaylist({ mood, detectedBy }) {
  const videos = moodSongs[mood] || [];
  const opts = { width: "100%", height: "250" };
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-4">Playlist 🎶</h2>
      <p className="text-white/80 mb-6">
        Mood: {mood} (detected via {detectedBy})}
      </p>
      {videos.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {videos.map((videoId, idx) => (
            <YouTube key={idx} videoId={videoId} opts={opts} />
          ))}
        </div>
      ) : (
        <p className="text-white">No songs found for this mood.</p>
      )}
    </div>
  );
}

export default MusicPlaylist;
