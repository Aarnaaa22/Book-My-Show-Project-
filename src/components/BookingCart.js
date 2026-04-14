// ============================================================
// COMPONENT: BookingCart.js
// CONCEPTS DEMONSTRATED:
//   1. useSelector  - read booking items from Redux store (global state)
//   2. useDispatch  - dispatch remove/update/clear actions
//   3. Conditional Rendering - empty cart, login required, success screen
//   4. Event Handling - remove, increment, decrement, confirm booking
//   5. useContext - check if user is logged in (UserContext)
//   6. State Lifting - receives confirmBooking callback from App.js via props
//   7. useState - local state for success message (not everything needs Redux!)
// ============================================================

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeBooking,
  incrementTicket,
  decrementTicket,
  clearCart,
  saveTotalAmount,
} from "../redux/bookingSlice";
import { useUser } from "../context/AppContext";

const BookingCart = ({ onBookingConfirmed }) => {
  // ---- useSelector: accessing global state ----
  // Read the full list of booked items from Redux store
  const bookings = useSelector((state) => state.bookings.items);

  // ---- useDispatch: updating global state ----
  // Get dispatch function to send actions to Redux
  const dispatch = useDispatch();

  // useContext: get user info from Context (not Redux — showing both concepts!)
  const { user } = useUser();

  // useState: local state for booking success message
  // Small UI-only state like this is fine to keep local (not everything needs Redux)
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // ---- Derived values (computed from Redux state) ----
  // Total tickets across all movies
  const totalTickets = bookings.reduce((sum, item) => sum + item.tickets, 0);
  // Total cost: price × quantity for each movie
  const totalAmount = bookings.reduce(
    (sum, item) => sum + item.price * item.tickets,
    0
  );

  // ---- Event Handling: remove a movie from cart ----
  const handleRemove = (id) => {
    // useDispatch: updating global state — remove booking by id
    dispatch(removeBooking(id));
  };

  // ---- Event Handling: increment tickets in cart ----
  const handleIncrement = (id) => {
    dispatch(incrementTicket(id));
  };

  // ---- Event Handling: decrement tickets in cart ----
  const handleDecrement = (id) => {
    dispatch(decrementTicket(id));
  };

  // ---- Event Handling: confirm/pay for all bookings ----
  const handleConfirmBooking = () => {
    // Conditional check — user must be logged in
    if (!user) {
      alert("🔒 Please login first to confirm your booking!");
      return;
    }

    // State Lifting: notify parent (App.js) how much was spent
    if (onBookingConfirmed) onBookingConfirmed(totalAmount);

    // Also save to Redux for Profile page to use
    dispatch(saveTotalAmount(totalAmount));

    // Clear the cart in Redux
    dispatch(clearCart());

    // Show success screen (local UI state)
    setBookingSuccess(true);
  };

  // ============================================================
  // CONDITIONAL RENDERING (1): Booking Success Screen
  // Shows after user confirms booking — no bookings to display
  // ============================================================
  if (bookingSuccess) {
    return (
      <div className="booking-success">
        <div className="success-icon">🎉</div>
        <h2>Booking Confirmed!</h2>
        <p>Your tickets have been booked successfully.</p>
        <p>Check your email for confirmation.</p>
        {/* Event Handling: reset success state to go back */}
        <button className="btn-book" onClick={() => setBookingSuccess(false)}>
          Book More Movies
        </button>
      </div>
    );
  }

  // ============================================================
  // CONDITIONAL RENDERING (2): Login Required
  // If user is not logged in, show login prompt instead of cart
  // ============================================================
  if (!user) {
    return (
      <div className="cart-container">
        <h2 className="cart-title">🎟️ Your Booking Cart</h2>
        <div className="login-required">
          <span className="lock-icon">🔒</span>
          <h3>Login Required</h3>
          <p>Please login to view and manage your cart.</p>
          <p className="hint">
            👆 Click the <strong>Login</strong> button in the header!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2 className="cart-title">🎟️ Your Booking Cart</h2>

      {/* ============================================================
          CONDITIONAL RENDERING (3): Empty Cart vs. Cart Items
          If bookings array is empty → show empty state message
          Otherwise → render each cart item with ticket controls
          ============================================================ */}
      {bookings.length === 0 ? (
        /* Empty cart state */
        <div className="empty-cart">
          <span className="empty-icon">🎭</span>
          <h3>No tickets booked yet!</h3>
          <p>Go to Home and click [Book Now] on a movie.</p>
          <p>Use [+] and [−] buttons to pick how many tickets you want.</p>
        </div>
      ) : (
        <>
          {/* Cart Items List */}
          <div className="cart-items">
            {/* Render one card per booked movie */}
            {bookings.map((item) => (
              <div key={item.id} className="cart-item">
                <span className="cart-item-poster">{item.poster}</span>

                <div className="cart-item-info">
                  <h4 className="cart-item-title">{item.title}</h4>
                  <p className="cart-item-genre">{item.genre}</p>
                  <p className="cart-item-price">₹{item.price} per ticket</p>
                </div>

                {/* ---- TICKET COUNTER in Cart ---- */}
                <div className="cart-item-controls">
                  {/* Event Handling: decrement ticket count */}
                  <button
                    className="ticket-btn"
                    onClick={() => handleDecrement(item.id)}
                    title="Remove one ticket"
                  >
                    −
                  </button>

                  {/* Conditional Rendering: show ticket count from Redux state */}
                  <span className="ticket-count">{item.tickets}</span>

                  {/* Event Handling: increment ticket count */}
                  <button
                    className="ticket-btn"
                    onClick={() => handleIncrement(item.id)}
                    disabled={item.tickets >= 10}
                    title="Add one ticket"
                  >
                    +
                  </button>
                </div>

                <div className="cart-item-subtotal">
                  {/* Subtotal = price × tickets (quantity) */}
                  <span>₹{item.price * item.tickets}</span>
                  {/* Event Handling: remove entire booking */}
                  <button
                    className="btn-remove"
                    onClick={() => handleRemove(item.id)}
                    title="Remove from cart"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ---- Cart Summary ---- */}
          <div className="cart-summary">
            <div className="summary-row">
              <span>Total Tickets:</span>
              {/* useSelector: accessing global state — totalTickets derived from Redux */}
              <strong>{totalTickets}</strong>
            </div>
            <div className="summary-row total">
              <span>Total Amount:</span>
              {/* Total = sum of (price × quantity) for all movies */}
              <strong>₹{totalAmount}</strong>
            </div>

            {/* Event Handling: confirm booking button */}
            <button className="btn-confirm" onClick={handleConfirmBooking}>
              ✅ Confirm Booking — Pay ₹{totalAmount}
            </button>

            {/* Event Handling: clear all bookings */}
            <button
              className="btn-clear"
              onClick={() => dispatch(clearCart())}
            >
              🗑️ Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BookingCart;
