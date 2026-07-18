import React from "react";
import { useApp } from "../context/AppContext";
import {
  Home,
  Search,
  PlusCircle,
  User,
  LogOut,
  Flame,
  Headphones,
} from "lucide-react";

export default function Sidebar() {
  const { activeTab, setActiveTab, user, logout } = useApp();

  if (!user) return null;

  const isArtist = user.role === "artist";

  const menuItems = [
    { id: "home", name: "Home", icon: Home },
    { id: "search", name: "Search", icon: Search },
    ...(isArtist
      ? [{ id: "upload", name: "Upload Track", icon: PlusCircle }]
      : []),
    { id: "profile", name: "Profile", icon: User },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="desktop-sidebar glass-panel">
        <div className="sidebar-logo">
          <Flame size={28} className="logo-icon" />
          <span className="logo-text">Sportify</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Explore</div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`sidebar-link ${isActive ? "active" : ""}`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
                {isActive && <div className="active-indicator" />}
              </button>
            );
          })}
        </nav>

        {/* Promo Card for Regular Users to showcase Premium feel */}
        {!isArtist && (
          <div className="sidebar-promo">
            <Headphones size={24} className="promo-icon" />
            <h4>Become an Artist</h4>
            <p>
              Upload your own high-tempo tracks and inspire workouts worldwide.
            </p>
            <button
              className="promo-btn"
              onClick={() => setActiveTab("profile")}
            >
              Learn More
            </button>
          </div>
        )}

        <div className="sidebar-footer">
          <div className="user-badge">
            <div className="user-avatar">{user.username[0].toUpperCase()}</div>
            <div className="user-info">
              <span className="username">{user.username}</span>
              <span className="user-role">{user.role}</span>
            </div>
          </div>
          <button onClick={logout} className="logout-btn" title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav glass-panel">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`mobile-link ${isActive ? "active" : ""}`}
            >
              <Icon size={22} />
              <span>{item.name}</span>
            </button>
          );
        })}
        <button onClick={logout} className="mobile-link logout">
          <LogOut size={22} />
          <span>Logout</span>
        </button>
      </nav>
    </>
  );
}
