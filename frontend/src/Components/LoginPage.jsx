import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../styles/login.css";
import { API_BASE_URL } from '../config';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [loginMethod, setLoginMethod] = useState("custom"); // "custom" or "oauth"
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Clear any existing sessions before login
  const clearExistingSessions = () => {
    // Clear localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    
    // Clear any OAuth cookies by calling logout
    fetch(`${API_BASE_URL}/api/auth/signout`, { method: "POST" }).catch(() => {});
  };

  // --- Custom JWT login ---
  const handleCustomLogin = async (e) => {
    e.preventDefault();
    
    // Clear any existing sessions first
    clearExistingSessions();
    
    try {
      // const response = await fetch(`http://localhost:3000/api/auth/login`, {

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, hash: password }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Login failed: ${response.status} ${errorBody}`);
      }

      const result = await response.json();
      console.log("Custom login success", result);

      try {
        const decodedToken = jwtDecode(result?.data?.accessToken);

        // Store custom login session
        localStorage.setItem("accessToken", result?.data?.accessToken || "");
        localStorage.setItem("user", JSON.stringify(result?.data?.user || {}));
        localStorage.setItem("loginMethod", "custom");
        setUser(result?.data?.user);

        if (decodedToken.role === "USER") {
          navigate("/");
        } else if (decodedToken.role === "ADMIN") {
          navigate("/admin");
        }
      } catch (err) {
        console.error("Token decode error:", err);
      }
    } catch (err) {
      console.error("Custom login error:", err);
    }
  };

  // --- OAuth login ---
  const handleOAuthLogin = async (provider = "google") => {
    // Clear any existing sessions first
    clearExistingSessions();
    
    // Store that we're using OAuth
    localStorage.setItem("loginMethod", "oauth");
    
    // Redirect to OAuth provider
    window.location.href = `${API_BASE_URL}/api/auth/signin/google`;
  };

  // --- Check for existing OAuth session on page load ---
  useEffect(() => {
    const checkExistingSession = async () => {
      const loginMethod = localStorage.getItem("loginMethod");
      
      // Only check OAuth session if we're supposed to be using OAuth
      if (loginMethod === "oauth") {
        try {
          const res = await fetch(`${API_BASE_URL}/api/auth/session`);
          if (!res.ok) return; 
          const session = await res.json();

          if (session?.user) {
            setUser(session.user);
            localStorage.setItem("user", JSON.stringify(session.user));
            navigate("/"); 
          }
        } catch (err) {
          console.error("Failed to fetch OAuth session", err);
          // If OAuth session fails, clear the login method
          localStorage.removeItem("loginMethod");
        }
      }
    };
    
    checkExistingSession();
  }, [navigate]);

  return (
    <div className="loginPage">
      <div className="loginWrapper">
        <h1 className="loginTitle">Welcome back</h1>
        <p className="loginSubtitle">
          Sign in to continue exploring and reviewing books.
        </p>

        <form className="loginCard" onSubmit={handleCustomLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="input-group" style={{ position: "relative" }}>
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{
                width: "100%",
                paddingRight: "40px", // space for icon
                boxSizing: "border-box"
              }}
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: "absolute",
                right: "18px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#C9AA71",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "24px",
                width: "24px",
                zIndex: 2
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit" className="update-btn">
            Login
          </button>
        </form>

        <div className="loginDivider">
          <span>OR</span>
        </div>

        <div className="oauth-buttons">
          <button 
            type="button" 
            className="google-btn" 
            onClick={() => handleOAuthLogin("google")}
          >
            <span className="google-icon" aria-hidden>
              G
            </span>
            <span>Continue with Google</span>
          </button>
        </div>

        <p className="authSwitch">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
