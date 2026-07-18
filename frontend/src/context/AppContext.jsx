import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import axios from "axios";

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

// Configure axios default base URL (Vite proxies /api to http://localhost:3000)
const api = axios.create({
  baseURL: "",
  withCredentials: true, // Send cookies in cross-origin / dev proxy environments
});

export const AppProvider = ({ children }) => {
  // Auth state
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("sportify_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [authLoading, setAuthLoading] = useState(true);

  // Layout & UI State
  const [activeTab, setActiveTab] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");

  // Music & Player State
  const [songs, setSongs] = useState([]);
  const [songsLoading, setSongsLoading] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(-1);
  const [listenHistory, setListenHistory] = useState(() => {
    try {
      const stored = localStorage.getItem("sportify_history");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Audio HTML Element Ref
  const audioRef = useRef(new Audio());

  // Intercept response to check for 401 unauthorised
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error.response &&
          (error.response.status === 401 ||
            error.response.data?.message === "unauthorised")
        ) {
          logoutLocal();
        }
        return Promise.reject(error);
      },
    );
    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  // Sync volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Set up audio listeners
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      playNext();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [queue, queueIndex]);

  // Load user data on startup
  useEffect(() => {
    const initAuth = async () => {
      if (user) {
        // Double check authentication by fetching songs
        try {
          await fetchSongs();
        } catch (err) {
          // If fetch fails, we might be unauthenticated
          console.warn("Initial session check failed:", err);
        }
      }
      setAuthLoading(false);
    };
    initAuth();
  }, []);

  // Fetch all songs from API
  const fetchSongs = async () => {
    setSongsLoading(true);
    try {
      const response = await api.get("/api/music/");
      // Backend returns { musics: [...] }
      const musics = response.data?.musics || [];
      setSongs(musics);
      return musics;
    } catch (err) {
      console.error("Failed to fetch songs:", err);
      throw err;
    } finally {
      setSongsLoading(false);
    }
  };

  // Login handler
  const login = async (usernameOrEmail, password) => {
    try {
      const response = await api.post("/api/auth/login", {
        username: usernameOrEmail,
        email: usernameOrEmail, // Try as both for convenience since backend supports either
        password,
      });
      const userData = response.data?.user;
      if (userData) {
        setUser(userData);
        localStorage.setItem("sportify_user", JSON.stringify(userData));
        await fetchSongs();
        setActiveTab("home");
      }
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Register handler
  const register = async (username, email, password, role) => {
    try {
      const response = await api.post("/api/auth/register", {
        username,
        email,
        password,
        role,
      });
      const userData = response.data?.data;
      if (userData) {
        setUser(userData);
        localStorage.setItem("sportify_user", JSON.stringify(userData));
        await fetchSongs();
        setActiveTab("home");
      }
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (error) {
      console.error("API logout failed:", error);
    } finally {
      logoutLocal();
    }
  };

  const logoutLocal = () => {
    setUser(null);
    localStorage.removeItem("sportify_user");
    localStorage.removeItem("sportify_history");
    setListenHistory([]);
    setCurrentSong(null);
    setIsPlaying(false);
    audioRef.current.pause();
    audioRef.current.src = "";
    setQueue([]);
    setQueueIndex(-1);
    setActiveTab("home");
  };

  // Play music action
  const playSong = (song, customQueue = null) => {
    if (!song) return;

    const targetQueue = customQueue || songs;
    const sIndex = targetQueue.findIndex((s) => s._id === song._id);

    setQueue(targetQueue);
    setQueueIndex(sIndex >= 0 ? sIndex : 0);
    setCurrentSong(song);

    // Save to localStorage history (limit to last 5)
    setListenHistory((prev) => {
      const filtered = prev.filter((s) => s._id !== song._id);
      const updated = [song, ...filtered].slice(0, 5);
      localStorage.setItem("sportify_history", JSON.stringify(updated));
      return updated;
    });

    // Update HTMLAudioElement source
    if (audioRef.current.src !== song.music) {
      audioRef.current.src = song.music;
      audioRef.current.load();
    }

    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => console.error("Audio play failed:", err));
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (!currentSong && songs.length > 0) {
      playSong(songs[0]);
      return;
    }
    if (!currentSong) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error("Audio play failed:", err));
    }
  };

  // Seek song progress
  const seekTo = (seconds) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setProgress(seconds);
    }
  };

  // Play next track
  const playNext = () => {
    if (queue.length === 0) return;
    const nextIndex = (queueIndex + 1) % queue.length;
    playSong(queue[nextIndex], queue);
  };

  // Play previous track
  const playPrev = () => {
    if (queue.length === 0) return;
    const prevIndex = queueIndex - 1 < 0 ? queue.length - 1 : queueIndex - 1;
    playSong(queue[prevIndex], queue);
  };

  // Upload music action
  const uploadMusic = async (formData) => {
    // formData should contain 'title' and 'music' (file)
    try {
      const response = await api.post("/api/music/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchSongs();
      return response.data;
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  };
  // Delete music action
  const deleteSong = async (songId) => {
    try {
      const response = await api.delete(`/api/music/delete/${songId}`);
      // Update global songs state by filtering out the deleted song
      setSongs((prev) => prev.filter((s) => s._id !== songId));
      
      // If currently playing song is the deleted one, stop playback
      if (currentSong && currentSong._id === songId) {
        setCurrentSong(null);
        setIsPlaying(false);
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      return response.data;
    } catch (error) {
      console.error("Delete song failed:", error);
      throw error;
    }
  };
  return (
    <AppContext.Provider
      value={{
        user,
        authLoading,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        songs,
        songsLoading,
        fetchSongs,
        currentSong,
        isPlaying,
        volume,
        setVolume,
        progress,
        duration,
        playSong,
        togglePlay,
        seekTo,
        playNext,
        playPrev,
        login,
        register,
        logout,
        uploadMusic,
        deleteSong,
        api,
        listenHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
