// ============================================================
// PAGE: Cart.js (pages/Cart.js)
// CONCEPTS USED:
//   - React Router page component
//   - State Lifting: passes onBookingConfirmed up to App.js
// ============================================================

import React from "react";
import BookingCart from "../components/BookingCart";

const Cart = ({ onBookingConfirmed }) => {
  return (
    <main className="page-cart">
      {/* BookingCart receives onBookingConfirmed as prop — State Lifting */}
      <BookingCart onBookingConfirmed={onBookingConfirmed} />
    </main>
  );
};

export default Cart;
