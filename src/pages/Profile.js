// ============================================================
// PAGE: Profile.js (pages/Profile.js)
// CONCEPTS USED:
//   - useContext (UserContext): display user info
//   - Conditional Rendering: show login prompt vs profile
//   - useSelector: show booking history count from Redux
// ============================================================

import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/AppContext";
import { useSelector } from "react-redux";

const Profile = () => {
  // useContext: get current user
  const { user, logout } = useUser();
  const navigate = useNavigate();

  // useSelector: count current cart items (acts as "booking history")
  const cartCount = useSelector((state) => state.bookings.items.length);

  // Event Handler: redirect to auth
  const handleLogin = () => navigate("/auth");

  // Conditional Rendering: Not logged in
  if (!user) {
    return (
      <main className="page-profile">
        <div className="profile-container">
          <div className="profile-hero">
            <span className="profile-avatar">🎭</span>
            <h2>Welcome, Guest!</h2>
            <p>Login to see your profile and booking history.</p>
            <button className="btn-book" onClick={handleLogin}>
              🔓 Navigate to Login
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Conditional Rendering: Logged in
  return (
    <main className="page-profile">
      <div className="profile-container">
        <div className="profile-hero">
          <span className="profile-avatar">😎</span>
          <h2>Hello, {user.name}!</h2>
          <p className="profile-email">moviefan@bookmyshow.com</p>
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <span className="stat-number">{cartCount}</span>
            <span className="stat-label">Movies in Cart</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">12</span>
            <span className="stat-label">Movies Watched</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">Gold</span>
            <span className="stat-label">Member Status</span>
          </div>
        </div>

        <div className="profile-info">
          <h3>Account Details</h3>
          <div className="info-row">
            <span>Name:</span>
            <strong>{user.name}</strong>
          </div>
          <div className="info-row">
            <span>Member Since:</span>
            <strong>Jan 2024</strong>
          </div>
          <div className="info-row">
            <span>Favorite Genre:</span>
            <strong>Action</strong>
          </div>
        </div>

        {/* Event Handling: logout button */}
        <button className="btn-clear" onClick={logout}>
          🚪 Logout
        </button>
      </div>
    </main>
  );
};

export default Profile;
