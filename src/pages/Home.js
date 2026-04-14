// ============================================================
// PAGE: Home.js
// CONCEPTS DEMONSTRATED:
//   1. State Lifting   - totalSaved prop received FROM App.js (parent)
//   2. Conditional Rendering - savings banner shown only when totalSaved > 0
//   3. useSelector     - read total tickets from Redux (alternative to prop)
// ============================================================

import React from "react";
import MovieList from "../components/MovieList";
import { useSelector } from "react-redux";

const Home = ({ totalSaved }) => {
  // useSelector: accessing global state
  // Read total item count from Redux store (for the header hint)
  const cartItemCount = useSelector((state) => state.bookings.items.length);
  const totalTickets = useSelector((state) =>
    state.bookings.items.reduce((sum, item) => sum + item.tickets, 0)
  );

  return (
    <main className="page-home">
      {/* Hero Banner */}
      <div className="hero-banner">
        <h2 className="hero-title">
          Book Your <span className="highlight">Movie Experience</span>
        </h2>
        <p className="hero-sub">
          Discover the latest blockbusters. Book tickets in seconds.
        </p>

        {/* Conditional Rendering: show cart hint if user has items in cart */}
        {cartItemCount > 0 && (
          <div className="savings-badge">
            🎟️ You have {totalTickets} ticket{totalTickets > 1 ? "s" : ""} for{" "}
            {cartItemCount} movie{cartItemCount > 1 ? "s" : ""} in your cart!
          </div>
        )}

        {/* State Lifting + Conditional Rendering:
            totalSaved is passed DOWN from App.js parent
            Only shown when the user has confirmed at least one booking */}
        {totalSaved > 0 && (
          <div className="savings-badge" style={{ background: "#16a34a" }}>
            🎉 You've spent ₹{totalSaved} on bookings today!
          </div>
        )}
      </div>

      {/* MovieList renders all movie cards — each with its own ticket counter */}
      <MovieList />
    </main>
  );
};

export default Home;
