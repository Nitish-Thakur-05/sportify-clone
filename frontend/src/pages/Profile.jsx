import React from "react";
import { useApp } from "../context/AppContext";
import {
  User,
  Mail,
  Shield,
  LogOut,
  Sparkles,
  Trash2,
} from "lucide-react";

export default function Profile() {
  const { user, logout, songs, currentSong, playSong, listenHistory, deleteSong } = useApp();

  if (!user) return null;

  // Find user's uploaded songs if any
  const mySongs = songs.filter((song) => {
    const artistId =
      typeof song.artist === "object" ? song.artist._id : song.artist;
    return artistId === user._id;
  });

  return (
    <div className="page-content animate-fade-in">
      <div className="profile-wrapper">
        {/* Profile Card */}
        <div className="profile-card glass-panel animate-slide-up">
          <div className="profile-header-glow" />
          <div className="profile-avatar-large">
            {user.username[0].toUpperCase()}
          </div>

          <div className="profile-info-section">
            <h2>{user.username}</h2>
            <div className="badge-row">
              <span
                className={`role-badge ${user.role === "artist" ? "artist" : "user"}`}
              >
                <Shield size={14} />
                <span>{user.role.toUpperCase()}</span>
              </span>
            </div>

            <div className="details-list">
              <div className="detail-item">
                <Mail size={18} className="detail-icon" />
                <div className="detail-text">
                  <span className="label">Email Address</span>
                  <span className="value">{user.email}</span>
                </div>
              </div>
              <div className="detail-item">
                <User size={18} className="detail-icon" />
                <div className="detail-text">
                  <span className="label">User ID</span>
                  <span className="value-small">{user._id}</span>
                </div>
              </div>
            </div>

            <button onClick={logout} className="profile-logout-btn">
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Stats Column */}
        <div className="profile-details-column">
          <div className="stats-grid-profile">
            <div className="profile-stat-box glass-panel">
              <span className="stat-num">{songs.length}</span>
              <span className="stat-label">Total Arena Tracks</span>
            </div>
            <div className="profile-stat-box glass-panel">
              <span className="stat-num">{mySongs.length}</span>
              <span className="stat-label">Tracks Uploaded By You</span>
            </div>
          </div>

          {user.role === 'artist' ? (
            <div className="helper-guide-card glass-panel" style={{ padding: '24px' }}>
              <div className="guide-header" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-primary)' }}>
                <Sparkles size={20} />
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>My Uploaded Tracks</h3>
              </div>

              {mySongs.length === 0 ? (
                <div className="empty-state">
                  <p style={{ color: 'var(--text-muted)' }}>You haven't uploaded any tracks yet.</p>
                </div>
              ) : (
                <div className="search-results-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {mySongs.map((song, index) => {
                     const isCurrent = currentSong && currentSong._id === song._id;
                     return (
                       <div
                         key={song._id}
                         className={`search-result-row glass-panel ${isCurrent ? 'active-row' : ''}`}
                         onClick={() => playSong(song, mySongs)}
                         style={{ borderRadius: '10px', marginBottom: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', padding: '10px 16px', cursor: 'pointer' }}
                       >
                         <div className="row-prefix" style={{ marginRight: '16px' }}>
                           <span className="row-number" style={{ color: 'var(--text-muted)' }}>{index + 1}</span>
                         </div>
                         <div className="row-cover" style={{ marginRight: '12px' }}>
                           🎧
                         </div>
                         <div className="row-details" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                           <span className="row-title" style={{ fontWeight: 600, color: 'var(--text-main)' }}>{song.title}</span>
                           <span className="row-artist" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>You</span>
                         </div>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                           {isCurrent && (
                             <span className="tag-hiit" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>Playing</span>
                           )}
                           <button
                             onClick={(e) => {
                               e.stopPropagation();
                               if (window.confirm(`Are you sure you want to delete "${song.title}"?`)) {
                                 deleteSong(song._id);
                               }
                             }}
                             style={{
                               background: 'transparent',
                               border: 'none',
                               color: '#ef4444',
                               display: 'flex',
                               alignItems: 'center',
                               justifyContent: 'center',
                               padding: '6px',
                               borderRadius: '6px',
                               cursor: 'pointer',
                               transition: 'all 0.2s ease',
                             }}
                             title="Delete Track"
                             onMouseEnter={(e) => {
                               e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                             }}
                             onMouseLeave={(e) => {
                               e.currentTarget.style.background = 'transparent';
                             }}
                           >
                             <Trash2 size={16} />
                           </button>
                         </div>
                       </div>
                     );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="helper-guide-card glass-panel" style={{ padding: '24px' }}>
              <div className="guide-header" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-primary)' }}>
                <Sparkles size={20} />
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Recently Listened (Last 5)</h3>
              </div>

              {!listenHistory || listenHistory.length === 0 ? (
                <div className="empty-state">
                  <p style={{ color: 'var(--text-muted)' }}>No history found. Start playing some arena beats!</p>
                </div>
              ) : (
                <div className="search-results-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {listenHistory.map((song, index) => {
                     const isCurrent = currentSong && currentSong._id === song._id;
                     const artistName = song.artist?.username || 'Unknown Artist';
                     return (
                       <div
                         key={`${song._id}-${index}`}
                         className={`search-result-row glass-panel ${isCurrent ? 'active-row' : ''}`}
                         onClick={() => playSong(song, listenHistory)}
                         style={{ borderRadius: '10px', marginBottom: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', padding: '10px 16px', cursor: 'pointer' }}
                       >
                         <div className="row-prefix" style={{ marginRight: '16px' }}>
                           <span className="row-number" style={{ color: 'var(--text-muted)' }}>{index + 1}</span>
                         </div>
                         <div className="row-cover" style={{ marginRight: '12px' }}>
                           🔥
                         </div>
                         <div className="row-details" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                           <span className="row-title" style={{ fontWeight: 600, color: 'var(--text-main)' }}>{song.title}</span>
                           <span className="row-artist" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{artistName}</span>
                         </div>
                         {isCurrent && (
                           <span className="tag-hiit" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>Playing</span>
                         )}
                       </div>
                     );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
