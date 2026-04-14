// ============================================================
// COMPONENT: MovieCard.js
// CONCEPTS DEMONSTRATED:
//   1. useDispatch  - dispatch actions to Redux store
//   2. useSelector  - read ticket count for THIS movie from Redux
//   3. Event Handling - Book Now, +, - buttons; image error fallback
//   4. Conditional Rendering - counter vs button; image vs emoji fallback
//   5. Props - movie data (including image URL) passed from MovieList
//   6. useState - local imgError state for fallback if image fails to load
// ============================================================

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addBooking,
  incrementTicket,
  decrementTicket,
} from "../redux/bookingSlice";

const MovieCard = ({ movie }) => {
  // useDispatch: updating global state — send actions to Redux store
  const dispatch = useDispatch();

  // useSelector: accessing global state
  // Find this specific movie in the Redux cart (returns undefined if not in cart)
  const cartItem = useSelector((state) =>
    state.bookings.items.find((item) => item.id === movie.id)
  );
  const ticketCount = cartItem ? cartItem.tickets : 0;

  // useState: local state to track if poster image failed to load
  // If it fails, we fall back to the emoji poster
  const [imgError, setImgError] = useState(false);

  // Event Handling: add movie to cart for the first time
  const handleBookNow = () => {
    dispatch(
      addBooking({
        id: movie.id,
        title: movie.title,
        price: movie.price,
        poster: movie.poster,
        genre: movie.genre,
      })
    );
  };

  // Event Handling: +1 ticket
  const handleIncrement = () => {
    dispatch(incrementTicket(movie.id));
  };

  // Event Handling: -1 ticket (removes from cart if reaches 0)
  const handleDecrement = () => {
    dispatch(decrementTicket(movie.id));
  };

  return (
    <div className="movie-card">
      {/* ---- POSTER SECTION ----
          Conditional Rendering:
          - If movie.image exists AND no load error → show real poster image
          - Otherwise → show emoji as fallback                          */}
      <div className="movie-poster">
        {movie.image && !imgError ? (
          <img
            src={movie.image}
            alt={`${movie.title} poster`}
            className="poster-img"
            // Event Handling: if image URL fails, switch to emoji fallback
            onError={() => setImgError(true)}
          />
        ) : (
          // Fallback: emoji shown when image is missing or broken
          <span className="poster-emoji">{movie.poster}</span>
        )}
        {/* Genre badge overlaid on poster */}
        <span className="movie-genre-badge">{movie.genre}</span>
      </div>

      {/* ---- MOVIE INFO ---- */}
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-language">
          {movie.language} • {movie.duration}
        </p>
        <div className="movie-meta">
          <span className="movie-rating">⭐ {movie.rating}</span>
          <span className="movie-price">₹{movie.price}</span>
        </div>
        <p className="movie-desc">{movie.description}</p>

        {/* ---- CONDITIONAL RENDERING ----
            ticketCount === 0 → show "Book Now" button
            ticketCount > 0  → show [−] count [+] counter               */}
        {ticketCount === 0 ? (
          // Event Handling: first booking click
          <button className="btn-book" onClick={handleBookNow}>
            🎟️ Book Now
          </button>
        ) : (
          <div className="ticket-counter-wrapper">
            <div className="ticket-counter">
              {/* Event Handling: minus button */}
              <button
                className="counter-btn counter-btn--minus"
                onClick={handleDecrement}
                title="Remove one ticket"
              >
                −
              </button>

              {/* Display current count from Redux global state */}
              <span className="counter-display">
                <span className="counter-number">{ticketCount}</span>
                <span className="counter-label">
                  ticket{ticketCount > 1 ? "s" : ""}
                </span>
              </span>

              {/* Event Handling: plus button — max 10 tickets */}
              <button
                className="counter-btn counter-btn--plus"
                onClick={handleIncrement}
                disabled={ticketCount >= 10}
                title="Add one ticket"
              >
                +
              </button>
            </div>

            {/* Subtotal derived from Redux state */}
            <p className="ticket-subtotal">
              Subtotal:{" "}
              <strong>₹{movie.price * ticketCount}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;