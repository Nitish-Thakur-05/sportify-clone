import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Flame, Lock, Mail, User, Eye, EyeOff, Sparkles } from "lucide-react";

export default function Auth() {
  const { login, register } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // Log in: can use email or username
        const identifier = email || username;
        if (!identifier || !password) {
          throw new Error("Please fill in all fields");
        }
        await login(identifier, password);
      } else {
        // Sign up
        if (!username || !email || !password) {
          throw new Error("All fields are required");
        }
        if (username.length < 3) {
          throw new Error("Username must be at least 3 characters");
        }
        await register(username, email, password, role);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.reason ||
          err.message ||
          "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      {/* Background Decor */}
      <div className="auth-mesh-glow orange" />
      <div className="auth-mesh-glow green" />

      <div className="auth-card glass-panel animate-slide-up">
        <div className="auth-header">
          <div className="auth-logo-badge">
            <Flame size={32} className="auth-logo-icon" />
          </div>
          <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p>
            {isLogin
              ? "Ignite your workout playlist"
              : "Join the elite Sportify community"}
          </p>
        </div>

        {error && (
          <div className="auth-error-alert animate-fade-in">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <>
              <div className="form-group animate-fade-in">
                <label>Register As</label>
                <div className="role-selector">
                  <button
                    type="button"
                    className={`role-btn user ${role === "user" ? "active" : ""}`}
                    onClick={() => setRole("user")}
                  >
                    🎧 User
                  </button>
                  <button
                    type="button"
                    className={`role-btn artist ${role === "artist" ? "active" : ""}`}
                    onClick={() => setRole("artist")}
                  >
                    ⚡ Artist
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="username">Username</label>
                <div className="input-wrapper">
                  <User size={18} className="input-icon" />
                  <input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="email">
              {isLogin ? "Username or Email" : "Email Address"}
            </label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                id="email"
                type="text"
                placeholder={isLogin ? "Username or email" : "Enter your email"}
                value={isLogin ? username : email}
                onChange={(e) =>
                  isLogin
                    ? setUsername(e.target.value)
                    : setEmail(e.target.value)
                }
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              <span className="spinner" />
            ) : (
              <>
                <span>{isLogin ? "Sign In" : "Sign Up"}</span>
                <Sparkles size={16} />
              </>
            )}
          </button>
        </form>

        <div className="auth-toggle-link">
          <span>
            {isLogin ? "New to Sportify?" : "Already have an account?"}
          </span>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
          >
            {isLogin ? "Create one now" : "Sign in instead"}
          </button>
        </div>
      </div>
    </div>
  );
}
