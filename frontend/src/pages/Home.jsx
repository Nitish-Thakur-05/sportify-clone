import React, { useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  Play,
  Pause,
  Flame,
  RefreshCw,
  Trophy,
  Activity,
  Dumbbell,
} from "lucide-react";

export default function Home() {
  const {
    user,
    songs,
    songsLoading,
    fetchSongs,
    currentSong,
    isPlaying,
    playSong,
    togglePlay,
    setActiveTab,
  } = useApp();

  useEffect(() => {
    fetchSongs();
  }, []);

  const handlePlayClick = (song) => {
    if (currentSong && currentSong._id === song._id) {
      togglePlay();
    } else {
      playSong(song, songs);
    }
  };

  const getTimeGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return "Good morning";
    if (hrs < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="page-content animate-fade-in">
      {/* Top Banner */}
      <header className="home-hero-banner">
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-badge">
            <Flame size={16} fill="currentColor" />
            <span>Summer High Tempo</span>
          </div>
          <h1>Power Up Your Performance</h1>
          <p>
            Stream high-energy beats crafted specifically to elevate your
            workouts and push your limits.
          </p>
          <div className="hero-actions">
            {songs.length > 0 && (
              <button
                className="btn-primary glow-active"
                onClick={() => handlePlayClick(songs[0])}
              >
                {currentSong && isPlaying ? (
                  <Pause size={18} fill="currentColor" />
                ) : (
                  <Play size={18} fill="currentColor" />
                )}
                <span>
                  {currentSong && isPlaying ? "Pause Session" : "Quick Start"}
                </span>
              </button>
            )}
            <button
              className="btn-secondary"
              onClick={() => setActiveTab("search")}
            >
              Explore Beats
            </button>
          </div>
        </div>
      </header>

      {/* Greeting & Quick Stats */}
      <section className="section-container">
        <div className="section-header">
          <h2>
            {getTimeGreeting()}, {user?.username}!
          </h2>
          <button
            className="refresh-btn"
            onClick={fetchSongs}
            title="Refresh Tracks"
            disabled={songsLoading}
          >
            <RefreshCw size={16} className={songsLoading ? "spin-music" : ""} />
          </button>
        </div>

        <div className="stats-row">
          <div className="stat-card glass-panel">
            <div className="stat-icon-wrapper orange">
              <Trophy size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Tracks Available</span>
              <span className="stat-value">{songs.length}</span>
            </div>
          </div>
          <div className="stat-card glass-panel">
            <div className="stat-icon-wrapper green">
              <Activity size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Energy Level</span>
              <span className="stat-value">High Tempo</span>
            </div>
          </div>
          <div className="stat-card glass-panel">
            <div className="stat-icon-wrapper purple">
              <Dumbbell size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Workout Mode</span>
              <span className="stat-value">Cardio Beats</span>
            </div>
          </div>
        </div>
      </section>

      {/* Song Grid */}
      <section className="section-container">
        <div className="section-header">
          <h3>Trending Beats</h3>
        </div>

        {songsLoading ? (
          <div className="loading-container">
            <span className="spinner" />
            <p>Loading tracks from the arena...</p>
          </div>
        ) : songs.length === 0 ? (
          <div className="empty-state glass-panel">
            <Dumbbell size={48} className="empty-icon" />
            <h3>No Tracks Loaded Yet</h3>
            <p>
              The workout arena is silent.{" "}
              {user?.role === "artist"
                ? "Upload your first track to kick off the beat!"
                : "Waiting for artists to drop some fire music."}
            </p>
            {user?.role === "artist" ? (
              <button
                className="btn-primary"
                onClick={() => setActiveTab("upload")}
              >
                Upload Music
              </button>
            ) : (
              <button className="btn-secondary" onClick={fetchSongs}>
                Refresh Arena
              </button>
            )}
          </div>
        ) : (
          <div className="music-grid">
            {songs.map((song) => {
              const isCurrent = currentSong?._id === song._id;
              const isCurrentPlaying = isCurrent && isPlaying;
              const artistName =
                typeof song.artist === "object"
                  ? song.artist.username
                  : "Unknown Artist";

              return (
                <div
                  key={song._id}
                  className={`music-card glass-panel ${isCurrent ? "active-track" : ""}`}
                >
                  <div className="card-artwork-wrapper">
                    <div className="card-artwork">
                      <Flame size={40} className="card-artwork-icon" />
                      {isCurrentPlaying && (
                        <div className="wave-container card-waves">
                          <div className="wave-bar" />
                          <div className="wave-bar" />
                          <div className="wave-bar" />
                          <div className="wave-bar" />
                        </div>
                      )}
                    </div>
                    <button
                      className="card-play-overlay"
                      onClick={() => handlePlayClick(song)}
                    >
                      {isCurrentPlaying ? (
                        <Pause size={24} fill="currentColor" />
                      ) : (
                        <Play
                          size={24}
                          fill="currentColor"
                          style={{ marginLeft: "4px" }}
                        />
                      )}
                    </button>
                  </div>
                  <div className="card-info">
                    <h4 className="card-title" title={song.title}>
                      {song.title}
                    </h4>
                    <p className="card-artist" title={artistName}>
                      {artistName}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
