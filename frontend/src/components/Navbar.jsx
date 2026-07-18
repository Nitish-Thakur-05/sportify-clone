import React from "react";
import { useApp } from "../context/AppContext";
import { Shield, Sparkles, Flame, User } from "lucide-react";

export default function Navbar() {
  const { user, activeTab, setActiveTab } = useApp();

  if (!user) return null;

  const getPageTitle = () => {
    switch (activeTab) {
      case "home":
        return "Home Arena";
      case "search":
        return "Search Tracks";
      case "upload":
        return "Artist Publisher";
      case "profile":
        return "User Profile";
      default:
        return "Sportify";
    }
  };

  return (
    <header className="top-navbar glass-panel">
      <div className="navbar-left">
        <h2 className="navbar-title">{getPageTitle()}</h2>
        <span className="navbar-accent-dot" />
      </div>

      <div className="navbar-right">
        {user.role === "artist" && (
          <div className="artist-status-badge">
            <Sparkles size={14} className="accent-icon" />
            <span>PRO ARTIST</span>
          </div>
        )}

        <button
          className="profile-btn-badge"
          onClick={() => setActiveTab("profile")}
        >
          <div className="badge-avatar">{user.username[0].toUpperCase()}</div>
          <span className="badge-username">{user.username}</span>
        </button>
      </div>
    </header>
  );
}
