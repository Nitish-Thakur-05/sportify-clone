import React, { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import {
  UploadCloud,
  CheckCircle,
  AlertTriangle,
  FileAudio,
  ArrowRight,
  Play,
} from "lucide-react";

export default function Upload() {
  const { user, uploadMusic, setActiveTab } = useApp();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  if (!user || user.role !== "artist") {
    return (
      <div className="page-content animate-fade-in">
        <div className="unauthorized-card glass-panel text-center">
          <AlertTriangle size={48} className="warning-icon" />
          <h3>Artist Status Required</h3>
          <p>Only verified artists can upload high-tempo tracks to Sportify.</p>
          <button
            className="btn-primary"
            onClick={() => setActiveTab("profile")}
          >
            Upgrade Account
          </button>
        </div>
      </div>
    );
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("audio/")) {
      setFile(droppedFile);
      setError("");
    } else {
      setError("Please drop a valid audio file (e.g. MP3, WAV)");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith("audio/")) {
        setFile(selectedFile);
        setError("");
      } else {
        setError("Please select a valid audio file (e.g. MP3, WAV)");
      }
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please provide a track title.");
      return;
    }
    if (!file) {
      setError("Please select an audio track.");
      return;
    }

    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("music", file);

    try {
      await uploadMusic(formData);
      setSuccess(true);
      setTitle("");
      setFile(null);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.reason ||
          "Failed to upload track. Verify the file size and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content animate-fade-in">
      <div className="upload-container">
        {success ? (
          <div className="upload-success-card glass-panel text-center animate-slide-up">
            <div className="success-icon-wrapper">
              <CheckCircle size={48} className="success-icon" />
            </div>
            <h2>Track Live In The Arena!</h2>
            <p>
              Your high-energy track has been successfully uploaded and is ready
              for work-outs.
            </p>
            <div className="success-actions">
              <button
                className="btn-primary"
                onClick={() => {
                  setSuccess(false);
                  setActiveTab("home");
                }}
              >
                <span>Go to Home</span>
                <ArrowRight size={16} />
              </button>
              <button
                className="btn-secondary"
                onClick={() => setSuccess(false)}
              >
                Upload Another
              </button>
            </div>
          </div>
        ) : (
          <div className="upload-card glass-panel animate-slide-up">
            <div className="upload-card-header">
              <h2>Release New Beats</h2>
              <p>
                Upload audio files (MP3/WAV/AAC) and share your power tracks
                with athletes.
              </p>
            </div>

            {error && (
              <div className="upload-error-alert animate-fade-in">
                <AlertTriangle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="upload-form">
              <div className="form-group">
                <label htmlFor="track-title">Track Title</label>
                <input
                  id="track-title"
                  type="text"
                  placeholder="e.g. Cardio Blast - 140 BPM"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-group">
                <label>Audio Track</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="audio/*"
                  style={{ display: "none" }}
                />

                <div
                  className={`drag-drop-zone ${dragging ? "drag-active" : ""} ${file ? "file-selected" : ""}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileSelect}
                >
                  {file ? (
                    <div className="file-info-box">
                      <FileAudio size={40} className="file-icon" />
                      <div className="file-meta">
                        <span className="file-name">{file.name}</span>
                        <span className="file-size">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                      <span className="file-change-badge">Change file</span>
                    </div>
                  ) : (
                    <div className="drag-content">
                      <UploadCloud size={48} className="upload-icon" />
                      <h4>Drag & Drop your audio file here</h4>
                      <p>or click to browse your files (MP3, WAV, AAC)</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="upload-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner" />
                    <span>Processing Track...</span>
                  </>
                ) : (
                  <>
                    <span>Publish Track</span>
                    <Play size={16} fill="currentColor" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
