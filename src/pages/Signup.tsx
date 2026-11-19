import React, { useState } from "react";
import { User, Store, Check, Eye } from "lucide-react";
import "./Signup.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_URL=import.meta.env.VITE_API_URL;
export default function Signup() {
     const [showWelcome, setShowWelcome] = useState(false);
const navigate = useNavigate();

    const [formData,SetFormData] =  useState({
        name:"",
        email:"",
        password:"",
        uType:"client" 
    })

 
const addUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Signup button clicked");

    try {
        const response = await axios.post(
            `${API_URL}/signupApi/signup`,
            {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                utype: formData.uType
            }
        );

        console.log("User added successfully", response.data);

        if (response.status === 201) {
            setShowWelcome(true);

            setTimeout(() => {
                 setShowWelcome(false);
        navigate("/citizen/dashboard");
    }, 5174);
        }

    } catch (error) {
        console.error("Signup error:", error);
    }
};

  return (
    <div className="fsu-page">
      {/* ── Left Hero Panel ── */}
    {showWelcome && (
        <div className="festora-toast">
            <span className="toast-icon">🎀</span>

            <div>
                <strong>Welcome to Festora!</strong>
                <p>Your celebration starts here ✨</p>
            </div>
        </div>
    )}

      <div className="fsu-hero" aria-hidden="true">
        <div className="fsu-hero-overlay" />

        {/* Decorative elements */}
        <div className="fsu-deco fsu-deco-ring" />
        <div className="fsu-deco fsu-deco-dot fsu-deco-dot-a" />
        <div className="fsu-deco fsu-deco-dot fsu-deco-dot-b" />
        <div className="fsu-deco fsu-deco-dot fsu-deco-dot-c" />

        <div className="fsu-hero-content">
          <div className="fsu-logo">
            <span className="fsu-logo-mark">🌸</span>
            <span className="fsu-logo-text">
              Fest<span>ora</span>
            </span>
          </div>

          <div>
            <h1 className="fsu-hero-title">
              Start your <em>journey with us.</em>
            </h1>
            <p className="fsu-hero-text">
              Join thousands of event planners, vendors, and hosts creating
              magical celebrations together with seamless tools.
            </p>

            <div className="fsu-chips">
              <span>🎉 10,000+ Events Planned</span>
              <span>⭐ 4.9/5 Vendor Rating</span>
              <span>🔒 100% Secure & Verified</span>
              <span>🚀 Zero Commission Setup</span>
            </div>
          </div>

          <div style={{ fontSize: "0.82rem", opacity: 0.75, letterSpacing: "0.01em" }}>
            © {new Date().getFullYear()} Festora Events. All rights reserved.
          </div>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="fsu-panel">
        <div className="fsu-card">
          {/* Mobile brand header */}
          <div className="fsu-mobile-logo fsu-logo">
            <span className="fsu-logo-mark">🌸</span>
            <span className="fsu-logo-text">
              Fest<span>ora</span>
            </span>
          </div>

          <h2 className="fsu-title">
            Create an <em>account</em>
          </h2>
          <p className="fsu-subtitle">
            Sign up in less than 2 minutes and start exploring
          </p>

          <form className="fsu-form"  onSubmit={addUser}>
            {/* Account Type Selection */}
            
<fieldset className="fsu-types">
    <legend>I want to join as</legend>

    <div className="fsu-type-grid">

        {/* Client */}
        <label className={`fsu-type ${formData.uType === "client" ? "fsu-type-selected" : ""}`}>
            <input
                type="radio"
                name="uType"
                value="client"
                checked={formData.uType === "client"}
                onChange={() =>
                    SetFormData({
                        ...formData,
                        uType: "client"
                    })
                }
            />

            <div className="fsu-type-icon">
                <User size={20} />
            </div>

            <span className="fsu-type-title">Client / Host</span>

            <span className="fsu-type-text">
                Find and book trusted vendors for your events
            </span>

            <div className="fsu-type-check">
                <Check size={13} strokeWidth={3} />
            </div>
        </label>

        {/* Business */}
        <label className={`fsu-type ${formData.uType === "business" ? "fsu-type-selected" : ""}`}>
            <input
                type="radio"
                name="uType"
                value="business"
                checked={formData.uType === "business"}
                onChange={() =>
                    SetFormData({
                        ...formData,
                        uType: "business"
                    })
                }
            />

            <div className="fsu-type-icon">
                <Store size={20} />
            </div>

            <span className="fsu-type-title">Business</span>

            <span className="fsu-type-text">
                List your event business and reach new clients
            </span>

            <div className="fsu-type-check">
                <Check size={13} strokeWidth={3} />
            </div>
        </label>

    </div>
</fieldset>


            {/* Full Name */}
            <div className="fsu-field">
              <label htmlFor="fsu-name">Full name</label>
              <input
                id="fsu-name"
                type="text"
                autoComplete="name"
                placeholder="e.g. Alex Morgan"
                className="fsu-input"
                value ={formData.name}
                onChange={(e) => 
                    SetFormData({
                        ...formData, name: e.target.value
                    })
                }
              />
            </div>

            {/* Email Address */}
            <div className="fsu-field">
              <label htmlFor="fsu-email">Email address</label>
              <input
                id="fsu-email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                className="fsu-input"
                value={formData.email}
    onChange={(e) =>
        SetFormData({
            ...formData,
            email: e.target.value
        })
    }
              />
            </div>

            {/* Password */}
            <div className="fsu-field">
              <label htmlFor="fsu-password">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  id="fsu-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  style={{ paddingRight: "48px" }}
                  className="fsu-input"
                   value={formData.password}
    onChange={(e) =>
        SetFormData({
            ...formData,
            password: e.target.value
        })
    }
                />
                <button
                  type="button"
                  aria-label="Toggle password visibility"
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "grid",
                    placeItems: "center",
                    width: "32px",
                    height: "32px",
                    border: "none",
                    background: "transparent",
                    color: "var(--fsu-muted)",
                    cursor: "pointer",
                    borderRadius: "8px",
                  }}
                >
                  <Eye size={18} />
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div>
              <label className="fsu-check">
                <input type="checkbox" />
                <span>
                  I agree to the <a href="#terms">Terms of Service</a> and{" "}
                  <a href="#privacy">Privacy Policy</a>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button type="submit" className="fsu-btn fsu-btn-primary">
              Create Account
            </button>

            <div className="fsu-divider">or sign up with</div>

        

         <p className="fsu-switch">
  Already have an account?{" "}
  <a href="/login">Log in</a>
</p>
          </form>
        </div>
      </div>
    </div>
  );
}
