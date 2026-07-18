import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Player from "./components/Player";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import { Flame } from "lucide-react";

function AppContent() {
  const { user, authLoading, activeTab, currentSong } = useApp();

  if (authLoading) {
    return (
      <div className="full-screen-loader">
        <div className="loader-logo-container">
          <Flame size={48} className="loader-logo spin-music" />
        </div>
        <h3>Entering the Arena...</h3>
        <p>Loading your sports beats</p>
      </div>
    );
  }

  // Render auth screens if no user session is active
  if (!user) {
    return <Auth />;
  }

  // Render active tab in the dashboard layout
  const renderActivePage = () => {
    switch (activeTab) {
      case "home":
        return <Home />;
      case "search":
        return <Search />;
      case "upload":
        return <Upload />;
      case "profile":
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <div className={`app-container ${!currentSong ? "no-player" : ""}`}>
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main dashboard content area */}
      <div className="main-viewport">
        <Navbar />

        {/* Scrollable scroll panel */}
        <main className="viewport-scrollable">{renderActivePage()}</main>
      </div>

      {/* Persistent Audio Player Bar */}
      <Player />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
