import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music, Heart } from 'lucide-react';

export default function Player() {
  const {
    currentSong,
    isPlaying,
    volume,
    setVolume,
    progress,
    duration,
    togglePlay,
    seekTo,
    playNext,
    playPrev,
    user
  } = useApp();

  const [prevVolume, setPrevVolume] = useState(0.8);
  const [isLiked, setIsLiked] = useState(false);

  if (!user || !currentSong) return null;

  // Format seconds to MM:SS
  const formatTime = (secs) => {
    if (isNaN(secs)) return '0:00';
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
  };

  const toggleMute = () => {
    if (volume > 0) {
      setPrevVolume(volume);
      setVolume(0);
    } else {
      setVolume(prevVolume || 0.8);
    }
  };

  const handleProgressChange = (e) => {
    seekTo(parseFloat(e.target.value));
  };

  // Get artist name safely
  const artistName = typeof currentSong.artist === 'object'
    ? currentSong.artist.username
    : 'Unknown Artist';

  return (
    <div className="player-bar glass-panel">
      {/* Track Info */}
      <div className="player-track-info">
        <div className={`player-album-art spin-music ${isPlaying ? '' : 'paused'}`}>
          <div className="album-art-center">
            <Music size={14} className="music-icon" />
          </div>
        </div>
        <div className="track-details">
          <h4 className="track-title">{currentSong.title}</h4>
          <p className="track-artist">{artistName}</p>
        </div>
        <button 
          className={`like-btn ${isLiked ? 'liked' : ''}`}
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart size={18} fill={isLiked ? '#10b981' : 'none'} />
        </button>
      </div>

      {/* Playback Controls & Progress */}
      <div className="player-controls-container">
        <div className="playback-controls">
          <button onClick={playPrev} className="control-btn" title="Previous">
            <SkipBack size={20} />
          </button>
          <button onClick={togglePlay} className="play-pause-btn glow-active" title={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" style={{ marginLeft: '3px' }} />}
          </button>
          <button onClick={playNext} className="control-btn" title="Next">
            <SkipForward size={20} />
          </button>
        </div>

        <div className="progress-bar-container">
          <span className="time-display">{formatTime(progress)}</span>
          <div className="slider-wrapper">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={progress}
              onChange={handleProgressChange}
              className="progress-slider"
            />
            <div 
              className="slider-fill" 
              style={{ width: `${(progress / (duration || 100)) * 100}%` }}
            />
          </div>
          <span className="time-display">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume & Extra Controls */}
      <div className="player-extra-controls">
        <div className="volume-controls">
          <button onClick={toggleMute} className="volume-btn">
            {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <div className="slider-wrapper volume-slider-wrapper">
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
            <div 
              className="slider-fill" 
              style={{ width: `${volume * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
