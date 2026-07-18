import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search as SearchIcon, Play, Pause, X, Music, Dumbbell, Compass, Flame } from 'lucide-react';

export default function Search() {
  const {
    songs,
    currentSong,
    isPlaying,
    playSong,
    togglePlay,
  } = useApp();

  const [query, setQuery] = useState('');

  const categories = [
    { name: 'Cardio Beats', color: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)', tag: 'cardio' },
    { name: 'HIIT Workout', color: 'linear-gradient(135deg, #a3e635 0%, #10b981 100%)', tag: 'hiit' },
    { name: 'Heavy Lifting', color: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)', tag: 'lifting' },
    { name: 'Running Tempo', color: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', tag: 'run' },
    { name: 'Warm Down', color: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)', tag: 'warm' },
    { name: 'Yoga & Flow', color: 'linear-gradient(135deg, #f59e0b 0%, #eab308 100%)', tag: 'yoga' },
  ];

  const handlePlayClick = (song) => {
    if (currentSong && currentSong._id === song._id) {
      togglePlay();
    } else {
      playSong(song, filteredSongs);
    }
  };

  const handleCategoryClick = (categoryName) => {
    // Just simulate a search for this category or filter
    setQuery(categoryName);
  };

  // Filter songs based on search query (title or artist username)
  const filteredSongs = songs.filter((song) => {
    const titleMatch = song.title.toLowerCase().includes(query.toLowerCase());
    const artistName = typeof song.artist === 'object' ? song.artist.username : '';
    const artistMatch = artistName.toLowerCase().includes(query.toLowerCase());
    return titleMatch || artistMatch;
  });

  return (
    <div className="page-content animate-fade-in">
      {/* Search Header */}
      <div className="search-bar-wrapper glass-panel">
        <SearchIcon size={20} className="search-icon-input" />
        <input
          type="text"
          placeholder="What do you want to play? (Search tracks, artists...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
          autoFocus
        />
        {query && (
          <button className="clear-btn" onClick={() => setQuery('')}>
            <X size={20} />
          </button>
        )}
      </div>

      {/* Main Area */}
      {!query ? (
        <section className="section-container">
          <div className="section-header">
            <h3>Browse Workout Categories</h3>
          </div>
          <div className="category-grid">
            {categories.map((cat, i) => (
              <div
                key={i}
                className="category-card"
                style={{ background: cat.color }}
                onClick={() => handleCategoryClick(cat.name)}
              >
                <div className="category-card-overlay" />
                <span className="category-name">{cat.name}</span>
                <Compass className="category-icon" size={40} />
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="section-container">
          <div className="section-header">
            <h3>Search Results for "{query}"</h3>
            <span className="results-count">{filteredSongs.length} tracks found</span>
          </div>

          {filteredSongs.length === 0 ? (
            <div className="empty-state glass-panel">
              <Music size={48} className="empty-icon" />
              <h3>No Matches Found</h3>
              <p>Try searching for a different song title or artist name.</p>
              <button className="btn-secondary" onClick={() => setQuery('')}>
                Clear Search
              </button>
            </div>
          ) : (
            <div className="search-results-list">
              {filteredSongs.map((song, index) => {
                const isCurrent = currentSong?._id === song._id;
                const isCurrentPlaying = isCurrent && isPlaying;
                const artistName = typeof song.artist === 'object' ? song.artist.username : 'Unknown Artist';

                return (
                  <div
                    key={song._id}
                    className={`search-result-row glass-panel ${isCurrent ? 'active-row' : ''}`}
                    onClick={() => handlePlayClick(song)}
                  >
                    <div className="row-prefix">
                      {isCurrentPlaying ? (
                        <div className="wave-container mini-waves">
                          <div className="wave-bar" />
                          <div className="wave-bar" />
                          <div className="wave-bar" />
                        </div>
                      ) : (
                        <span className="row-number">{index + 1}</span>
                      )}
                      <button className="row-play-btn">
                        {isCurrentPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                      </button>
                    </div>

                    <div className="row-cover">
                      <Flame size={18} className="row-cover-icon" />
                    </div>

                    <div className="row-details">
                      <span className="row-title">{song.title}</span>
                      <span className="row-artist">{artistName}</span>
                    </div>

                    <div className="row-actions">
                      <span className="tag-hiit">High-Energy</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
