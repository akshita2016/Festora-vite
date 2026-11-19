import React from "react";
import { Eye } from "lucide-react";
import "./Login.css";
import  { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
const navigate = useNavigate();

 const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/loginApi/login`, {
            email,
            password
        });
       console.log("Backend response:", res.data);
        if (res.data.found === 1) {
              alert("Login successful!");
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("username", res.data.user.name);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            const utype = res.data.user?.utype;
           localStorage.setItem("accountType", res.data.user.accountType);

if (utype === "client") {
  navigate("/client/dashboard");
} 
else if (utype  === "business") {
  navigate("/business/settings");
}
            
       
        } else {
            setMessage(res.data.found === 0 ? "User not found" : "Wrong password");
        }

    } catch (error) {
        setMessage("Login failed");
    }
};
  return (
    <div className="fli-page">
      {/* ── Left Hero Panel ── */}
      <div className="fli-hero" aria-hidden="true">
        <div className="fli-hero-overlay" />

        {/* Floating background decorative rings & dots */}
        <div className="fli-deco fli-deco-ring" />
        <div className="fli-deco fli-deco-dot fli-deco-dot-a" />
        <div className="fli-deco fli-deco-dot fli-deco-dot-b" />
        <div className="fli-deco fli-deco-dot fli-deco-dot-c" />

        <div className="fli-hero-content">
          <div className="fli-logo">
            <span className="fli-logo-mark">🌸</span>
            <span className="fli-logo-text">
              Fest<span>ora</span>
            </span>
          </div>

          <div>
            <h1 className="fli-hero-title">
              Celebrate <em>every milestone.</em>
            </h1>
            <p className="fli-hero-text">
              Discover top-tier event vendors, manage bookings seamlessly, and create
              unforgettable celebrations with complete confidence.
            </p>

            <div className="fli-chips">
              <span>✨ Curated Vendors</span>
              <span>⚡ Instant Booking</span>
              <span>🛡️ Verified Reviews</span>
              <span>💫 Seamless Planning</span>
            </div>
          </div>

          <div style={{ fontSize: "0.82rem", opacity: 0.75, letterSpacing: "0.01em" }}>
            © {new Date().getFullYear()} Festora Events. All rights reserved.
          </div>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="fli-panel">
        <div className="fli-card">
          {/* Mobile brand header */}
          <div className="fli-mobile-logo fli-logo">
            <span className="fli-logo-mark">🌸</span>
            <span className="fli-logo-text">
              Fest<span>ora</span>
            </span>
          </div>

          <h2 className="fli-title">
            Welcome <em>back</em>
          </h2>
          <p className="fli-subtitle">Enter your credentials to access your account</p>

          <form className="fli-form"  onSubmit={handleLogin}>
            <div className="fli-field">
              <label htmlFor="fli-email">Email address</label>
              <input
                id="fli-email"
    type="email"
    name="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    autoComplete="email"
    placeholder="name@example.com"
    className="fli-input"
    required
              />
            </div>

            <div className="fli-field">
              <label htmlFor="fli-password">Password</label>
              <div className="fli-password-wrap">
                <input
                   id="fli-password"
    type="password"
    name="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    autoComplete="current-password"
    placeholder="Enter your password"
    className="fli-input"
    required
                />
                <button
                  type="button"
                  className="fli-toggle"
                  aria-label="Toggle password visibility"
                >
                  <Eye size={18} />
                </button>
              </div>
            </div>

            <div className="fli-row">
              <label className="fli-check">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>

              <a href="#forgot-password" className="fli-link">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="fli-btn fli-btn-primary">
              Sign In
            </button>

           
           <p className="fli-switch">
  Don't have an account?{" "}
  <a href="/signup">Create an account</a>
</p>
          </form>
        </div>
      </div>
    </div>
  );
}
