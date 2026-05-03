import { useState } from "react";
import axios from "../api/axiosConfig.js";
import { useNavigate, Link } from "react-router-dom";
import "../auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotPassword, setForgotPassword] = useState("");
  const [forgotError, setForgotError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem(
        "user",
        JSON.stringify({ email: response.data.email, id: response.data.id })
      );
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotError("");

    try {
      await axiosInstance.post("/auth/forgot-password", {
        email: forgotEmail,
        newPassword: forgotPassword,
      });
      alert("Password reset successfully. You can now login with your new password.");
      setShowForgot(false);
      setForgotEmail("");
      setForgotPassword("");
    } catch (err) {
      setForgotError("User not found or error occurred");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        <h1 className="app-title">LabGo</h1>

        <p className="subtitle">Lab Inventory & Equipment System</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>

        <p className="auth-link">
          <span onClick={() => setShowForgot(!showForgot)} style={{ cursor: 'pointer', color: '#007bff' }}>
            Forgot Password?
          </span>
        </p>

        {showForgot && (
          <div style={{ marginTop: '20px' }}>
            <h3>Reset Password</h3>
            {forgotError && <div className="error">{forgotError}</div>}
            <form onSubmit={handleForgotPassword}>
              <input
                type="email"
                placeholder="Email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={forgotPassword}
                onChange={(e) => setForgotPassword(e.target.value)}
                required
              />
              <button type="submit">Reset Password</button>
            </form>
          </div>
        )}

        <p className="auth-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>

        <div className="footer">
          Made with <span>❤️</span> Shruti
        </div>
      </div>
    </div>
  );
}

export default Login;