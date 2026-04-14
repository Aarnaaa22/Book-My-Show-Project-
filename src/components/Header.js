// ============================================================
// COMPONENT: Header.js
// CONCEPTS DEMONSTRATED:
//   1. useContext (ThemeContext, UserContext) - global theme and login state
//   2. useSelector - read cart count from Redux (badge on Cart link)
//   3. Conditional Rendering - show Login/Logout, cart badge, user name
//   4. Event Handling - toggle theme, login/logout buttons
//   5. React Router NavLink - active link highlighting
// ============================================================

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTheme, useUser } from "../context/AppContext";
// useSelector: accessing global state — get total movies in cart
import { useSelector } from "react-redux";

const Header = () => {
  // useContext: get theme toggle function and current theme
  const { theme, toggleTheme } = useTheme();

  // useContext: get user info and login/logout methods from UserContext
  const { user, logout } = useUser();
  const navigate = useNavigate();

  // useSelector: accessing global state from Redux
  // Count total items in cart for the badge on Cart nav link
  const cartCount = useSelector((state) => state.bookings.items.length);

  // Also get total tickets (not just unique movies)
  const totalTickets = useSelector((state) =>
    state.bookings.items.reduce((sum, item) => sum + item.tickets, 0)
  );

  // Event Handler: toggle between login and logout
  const handleAuth = () => {
    if (user) {
      logout();      // Clear user from Context
      navigate("/"); // Go to homepage
    } else {
      navigate("/auth"); // Redirect to auth page for login
    }
  };

  return (
    <header className={`header ${theme}`}>
      {/* Brand Logo */}
      <div className="header-brand">
        <span className="brand-icon">🎬</span>
        <h1 className="brand-name">
          BookMyShow <span className="brand-tag">Clone</span>
        </h1>
      </div>

      {/* Navigation Links — React Router NavLink gives "active" class automatically */}
      <nav className="header-nav">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          🏠 Home
        </NavLink>

        <NavLink
          to="/cart"
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          🎟️ Cart
          {/* Conditional Rendering: show badge only if cart has movies */}
          {cartCount > 0 && (
            <span className="cart-badge" title={`${totalTickets} total tickets`}>
              {totalTickets}
            </span>
          )}
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          👤 Profile
        </NavLink>
      </nav>

      <div className="header-actions">
        {/* Conditional Rendering: greet user if logged in */}
        {user && <span className="welcome-msg">Hi, {user.name}! 👋</span>}

        {/* Event Handling: login/logout button */}
        <button className="btn-auth" onClick={handleAuth}>
          {/* Conditional Rendering: button text changes based on login state */}
          {user ? "Logout" : "Login"}
        </button>

        {/* Event Handling: theme toggle button */}
        <button className="btn-theme" onClick={toggleTheme} title="Toggle Theme">
          {/* Conditional Rendering: show sun or moon based on current theme */}
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
};

export default Header;
