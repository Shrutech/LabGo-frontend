import { useState } from "react";
import axios from "../api/axiosConfig.js";
import { useNavigate, Link } from "react-router-dom";
import "../auth.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axiosInstance.post("/auth/register", {
        name,
        email,
        password,
      });

      navigate("/login");
    } catch {
      setError("Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        <h1 className="app-title">LabGo</h1>

        <p className="subtitle">Lab Inventory & Equipment System</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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

          <button type="submit">Register</button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>

        <div className="footer">
          Made with <span>❤️</span> Shruti
        </div>
      </div>
    </div>
  );
}

export default Register;